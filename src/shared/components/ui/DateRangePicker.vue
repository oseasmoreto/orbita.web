<script setup lang="ts">
/**
 * Variantes "Date Picker with date range" da captura real do usuário
 * (2026-08-28, mesma captura do `DatePicker.vue`) — trigger com 2 datas
 * (início/fim) numa caixa só, popover com o mesmo painel (preview +
 * atalhos + grid) do `DatePicker.vue`, mas sobre `RangeCalendarRoot`/
 * `RangeCalendarCellTrigger` da Reka UI em vez de `CalendarRoot`
 * (intervalo de verdade, não 2 datas soltas). Estilos não compartilhados
 * com `DatePicker.vue` via `:global()` comum de propósito — os dois
 * arquivos são unidades de compilação Sass separadas, então
 * `@use`/`:global()` não atravessam componentes; duplicar as classes
 * aqui é aceitável (mesmo critério de "2-3 linhas parecidas" do doc de
 * convenções, aplicado a um bloco de estilo coeso, não lógica de
 * decisão).
 *
 * A captura mostra os 2 exemplos com início=fim (10/02/2025 pros dois
 * lados) — não há grounding pixel-a-pixel de como um intervalo de
 * VERDADE (dias diferentes) deveria se conectar visualmente na grade.
 * Extrapolação razoável, documentada: início/fim com o mesmo
 * arredondamento cheio do `DatePicker.vue` (`data-selection-start`/
 * `data-selection-end`), dias do meio (`data-highlighted`) com um tom
 * mais claro do mesmo indigo (`color-mix`), sem arredondar — efeito de
 * "barra conectada" comum em seletores de intervalo, revisável se uma
 * captura futura mostrar o padrão real.
 */
import type { DateRange, DateValue } from 'reka-ui'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
} from 'reka-ui'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import dayjs from 'dayjs'
import { computed, ref, useId, watch } from 'vue'
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  CaretUpDown,
} from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    label?: string
    showTime?: boolean
  }>(),
  {
    disabled: false,
    invalid: false,
    label: undefined,
    placeholder: undefined,
    showTime: false,
  },
)

/** Início/fim do intervalo, cada um ISO (`YYYY-MM-DD`) — mesmo raciocínio do `DatePicker.vue`, nunca `DateValue`. */
const startModel = defineModel<string>('start', { default: '' })
const endModel = defineModel<string>('end', { default: '' })
/** Hora em "HH:mm" 24h, compartilhada pelos 2 lados — só relevante quando `show-time` (mesmo formato do `DatePicker.vue`). */
const timeModel = defineModel<string>('time', { default: '' })

const triggerId = useId()
const open = ref(false)

const rangeValue = computed<DateRange>({
  get: () => ({
    end: endModel.value ? parseDate(endModel.value) : undefined,
    start: startModel.value ? parseDate(startModel.value) : undefined,
  }),
  set: (value) => {
    startModel.value = value.start ? value.start.toString() : ''
    endModel.value = value.end ? value.end.toString() : ''
    // Só fecha quando o intervalo está completo (início E fim) — clicar
    // uma vez só marca o início, fechar aí devolveria um intervalo pela
    // metade. Com hora, fica aberto igual ao `DatePicker.vue`.
    if (!props.showTime && value.start && value.end) {
      open.value = false
    }
  },
})

const lastSelection = ref({ end: '', start: '', time: '' })

watch(open, (isOpen) => {
  if (isOpen) {
    lastSelection.value = { end: endModel.value, start: startModel.value, time: timeModel.value }
  }
})

function selectToday(): void {
  const todayValue = today(getLocalTimeZone())
  rangeValue.value = { end: todayValue, start: todayValue }
}

function selectLastSelection(): void {
  startModel.value = lastSelection.value.start
  endModel.value = lastSelection.value.end
  timeModel.value = lastSelection.value.time
}

function formatDisplay(value: string): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : ''
}

const startDisplay = computed(() => formatDisplay(startModel.value))
const endDisplay = computed(() => formatDisplay(endModel.value))

const startPreview = computed(() => dayjs(startModel.value || undefined).format('DD / MM / YYYY'))

// Fim só cai pra "hoje" quando não há seleção nenhuma em andamento (igual
// ao início) — com um início já escolhido e fim ainda pendente (usuário
// no meio de marcar o intervalo), mostrar "hoje" pareceria um valor real
// já definido, não um placeholder.
const endPreview = computed(() => {
  if (endModel.value) {
    return dayjs(endModel.value).format('DD / MM / YYYY')
  }
  return startModel.value ? '–– / –– / ––––' : dayjs().format('DD / MM / YYYY')
})

/**
 * Achado real: `data-highlighted` da Reka UI só marca a barra conectada
 * durante o hover EM ANDAMENTO (entre escolher o início e passar o mouse
 * antes do segundo clique) — o próprio pacote zera `highlightedRange`
 * assim que início E fim já estão definidos (`useRangeCalendar.js`:
 * "if (start && end && !fixedDate) return null"). Reabrir o popover com
 * um intervalo já completo não teria nenhuma barra conectada sem isso —
 * calculado aqui em cima do `rangeValue` de verdade (não o hover), pra
 * persistir a mesma barra depois de fechar/reabrir. Comparação de string
 * ISO funciona direto (`YYYY-MM-DD` ordena igual à data real).
 */
function isInRange(date: DateValue): boolean {
  const { start, end } = rangeValue.value
  if (!start || !end) {
    return false
  }
  const iso = date.toString()
  return iso > start.toString() && iso < end.toString()
}

function monthLabel(date: DateValue): string {
  const formatted = dayjs(date.toString()).format('MMM')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

const effectiveTime = computed(() => timeModel.value || dayjs().format('HH:mm'))
const hour24 = computed(() => Number(effectiveTime.value.split(':')[0]))
const minute = computed(() => Number(effectiveTime.value.split(':')[1]))
const meridiem = computed<'AM' | 'PM'>(() => (hour24.value >= 12 ? 'PM' : 'AM'))
const hour12 = computed(() => {
  const remainder = hour24.value % 12
  return remainder === 0 ? 12 : remainder
})

function setTime(nextHour12: number, nextMinute: number, nextMeridiem: 'AM' | 'PM'): void {
  const clampedHour = Math.min(Math.max(nextHour12, 1), 12) % 12
  const hour = nextMeridiem === 'PM' ? clampedHour + 12 : clampedHour
  const clampedMinute = Math.min(Math.max(nextMinute, 0), 59)
  timeModel.value = `${String(hour).padStart(2, '0')}:${String(clampedMinute).padStart(2, '0')}`
}

function handleHourInput(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value)
  setTime(Number.isNaN(value) ? hour12.value : value, minute.value, meridiem.value)
}

function handleMinuteInput(event: Event): void {
  const value = Number((event.target as HTMLInputElement).value)
  setTime(hour12.value, Number.isNaN(value) ? minute.value : value, meridiem.value)
}

function toggleMeridiem(): void {
  setTime(hour12.value, minute.value, meridiem.value === 'AM' ? 'PM' : 'AM')
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <div
      :class="[
        'ui-date-range-picker-wrapper',
        { 'ui-date-range-picker-wrapper--labeled': label, 'ui-date-range-picker-wrapper--invalid': invalid },
      ]"
    >
      <label v-if="label" :for="triggerId" class="ui-date-range-picker-label">{{ label }}</label>
      <PopoverTrigger :id="label ? triggerId : undefined" class="ui-date-range-picker-trigger" :disabled="disabled">
        <Icon class="ui-date-range-picker-leading-icon" :icon="CalendarBlank" :size="16" />
        <span :class="['ui-date-range-picker-value', { 'ui-date-range-picker-value--placeholder': !startModel }]">
          {{ startDisplay || placeholder }}
        </span>
        <span class="ui-date-range-picker-separator" />
        <span
          :class="[
            'ui-date-range-picker-value',
            'ui-date-range-picker-value--end',
            { 'ui-date-range-picker-value--placeholder': !endModel },
          ]"
        >
          {{ endDisplay || placeholder }}
        </span>
        <Icon :icon="CaretUpDown" :size="16" />
      </PopoverTrigger>
    </div>

    <PopoverPortal>
      <PopoverContent class="ui-date-range-picker-content" :side-offset="4" align="start">
        <div class="ui-date-range-picker-preview">
          <span class="ui-date-range-picker-preview-date">{{ startPreview }}</span>
          <span class="ui-date-range-picker-preview-dash">–</span>
          <span class="ui-date-range-picker-preview-date">{{ endPreview }}</span>
          <div v-if="showTime" class="ui-date-range-picker-preview-time">
            <input
              class="ui-date-range-picker-time-input"
              maxlength="2"
              :value="String(hour12).padStart(2, '0')"
              @change="handleHourInput"
            />
            <span>:</span>
            <input
              class="ui-date-range-picker-time-input"
              maxlength="2"
              :value="String(minute).padStart(2, '0')"
              @change="handleMinuteInput"
            />
            <button class="ui-date-range-picker-meridiem" type="button" @click="toggleMeridiem">
              {{ meridiem }}
            </button>
          </div>
        </div>

        <RangeCalendarRoot
          v-slot="{ weekDays, grid, date }"
          v-model="rangeValue"
          locale="pt-BR"
          class="ui-date-range-picker-calendar"
        >
          <div class="ui-date-range-picker-shortcuts">
            <button class="ui-date-range-picker-shortcut" type="button" @click="selectToday">Hoje</button>
            <button class="ui-date-range-picker-shortcut" type="button" @click="selectLastSelection">
              Última seleção
            </button>
            <div class="ui-date-range-picker-nav">
              <RangeCalendarPrev class="ui-date-range-picker-calendar-nav">
                <Icon :icon="CaretLeft" :size="14" />
              </RangeCalendarPrev>
              <span class="ui-date-range-picker-month-label">{{ monthLabel(date) }}</span>
              <RangeCalendarNext class="ui-date-range-picker-calendar-nav">
                <Icon :icon="CaretRight" :size="14" />
              </RangeCalendarNext>
            </div>
          </div>

          <RangeCalendarGrid
            v-for="month in grid"
            :key="month.value.toString()"
            class="ui-date-range-picker-calendar-grid"
          >
            <RangeCalendarGridHead>
              <RangeCalendarGridRow class="ui-date-range-picker-calendar-row">
                <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="ui-date-range-picker-calendar-head-cell">
                  {{ day }}
                </RangeCalendarHeadCell>
              </RangeCalendarGridRow>
            </RangeCalendarGridHead>
            <RangeCalendarGridBody>
              <RangeCalendarGridRow
                v-for="(week, weekIndex) in month.rows"
                :key="`week-${weekIndex}`"
                class="ui-date-range-picker-calendar-row"
              >
                <RangeCalendarCell
                  v-for="weekDate in week"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="ui-date-range-picker-calendar-cell"
                >
                  <RangeCalendarCellTrigger
                    :class="[
                      'ui-date-range-picker-calendar-cell-trigger',
                      { 'ui-date-range-picker-calendar-cell-trigger--in-range': isInRange(weekDate) },
                    ]"
                    :day="weekDate"
                    :month="month.value"
                  />
                </RangeCalendarCell>
              </RangeCalendarGridRow>
            </RangeCalendarGridBody>
          </RangeCalendarGrid>
        </RangeCalendarRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style scoped lang="scss">

.ui-date-range-picker-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-date-range-picker-trigger[data-state='open']) {
    @include focus-ring;
  }

  &--labeled {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-4;
    padding: $spacing-16 $spacing-20;
  }

  &--invalid {
    border-color: $color-accent-red;
  }
}

.ui-date-range-picker-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.ui-date-range-picker-trigger {
  all: unset;
  display: flex;
  flex: 1;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.ui-date-range-picker-leading-icon {
  flex-shrink: 0;
  color: $color-ink-40;
}

.ui-date-range-picker-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  // Só o valor de FIM cresce (`flex: 1`) — mesmo truque do
  // `DatePicker.vue` (`.ui-date-picker-value`), aqui só no último span
  // pra não empurrar também o separador/início pra longe do texto de
  // início: início-separador-fim ficam colados, só o ícone final é que
  // precisa ir pro fim do trigger. Achado real, reportado pelo usuário:
  // sem isso, o ícone ficava colado nas datas em vez de alinhado à
  // direita (nenhum item da linha tinha `flex: 1` pra empurrá-lo).
  &--end {
    flex: 1;
    min-width: 0;
  }

  &--placeholder {
    color: $color-ink-40;
  }
}

.ui-date-range-picker-separator {
  flex-shrink: 0;
  width: $spacing-12;
  height: 1px;
  background-color: $color-ink-20;
}

// `z-index: 200`, não 50 — acima de `Modal.vue`/`Drawer.vue` (100/101),
// mesmo achado real do `DatePicker.vue` (2026-08-31).
:global(.ui-date-range-picker-content) {
  z-index: 200;
  width: 280px;
  padding: $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-12;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
}

:global(.ui-date-range-picker-preview) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-4;
  padding-bottom: $spacing-12;
  margin-bottom: $spacing-12;
  font-size: $font-size-md;
  color: $color-ink;
  border-bottom: 1px solid $color-ink-10;
}

:global(.ui-date-range-picker-preview-dash) {
  color: $color-ink-20;
}

:global(.ui-date-range-picker-preview-time) {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  margin-left: auto;
  font-size: $font-size-sm;
  color: $color-ink;
}

:global(.ui-date-range-picker-time-input) {
  width: 20px;
  padding: 0;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  text-align: center;
  background: none;
  border: none;
  border-radius: $radius-4;

  &:focus-visible {
    @include focus-ring;
  }
}

:global(.ui-date-range-picker-meridiem) {
  padding: 0;
  margin-left: $spacing-4;
  font-family: inherit;
  font-size: inherit;
  font-weight: $font-weight-semibold;
  color: $color-ink-40;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: $color-ink;
  }
}

:global(.ui-date-range-picker-shortcuts) {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  margin-bottom: $spacing-12;
}

:global(.ui-date-range-picker-shortcut) {
  padding: $spacing-4 $spacing-8;
  font-family: inherit;
  font-size: $font-size-sm;
  color: $color-ink;
  cursor: pointer;
  background-color: $color-ink-4;
  border: none;
  border-radius: $radius-4;

  &:hover {
    background-color: $color-ink-10;
  }
}

:global(.ui-date-range-picker-nav) {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-4;
}

:global(.ui-date-range-picker-month-label) {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

:global(.ui-date-range-picker-calendar-nav) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: $size-20;
  height: $size-20;
  color: $color-ink-40;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: $radius-4;
}

:global(.ui-date-range-picker-calendar-nav:hover) {
  color: $color-ink;
  background-color: $color-ink-4;
}

:global(.ui-date-range-picker-calendar-nav[data-disabled]) {
  cursor: not-allowed;
  opacity: 0.4;
}

:global(.ui-date-range-picker-calendar-row) {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

:global(.ui-date-range-picker-calendar-head-cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size-32;
  height: $size-32;
  font-size: $font-size-2xs;
  color: $color-ink-40;
  text-transform: uppercase;
}

:global(.ui-date-range-picker-calendar-cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

:global(.ui-date-range-picker-calendar-cell-trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size-32;
  height: $size-28;
  margin: 2px 0;
  font-size: $font-size-sm;
  color: $color-ink;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: $radius-8;
}

:global(.ui-date-range-picker-calendar-cell-trigger:hover) {
  background-color: $color-ink-4;
}

:global(.ui-date-range-picker-calendar-cell-trigger[data-today]) {
  font-weight: $font-weight-semibold;
  box-shadow: inset 0 0 0 1px $color-ink-20;
}

:global(.ui-date-range-picker-calendar-cell-trigger[data-outside-view]) {
  color: $color-ink-20;
}

:global(.ui-date-range-picker-calendar-cell-trigger[data-disabled]) {
  color: $color-ink-20;
  cursor: not-allowed;
}

// Dias "no meio" do intervalo — tom claro do mesmo indigo do
// início/fim (`color-mix`, mesma técnica já usada no `StatusDot`
// variante `pill`), sem arredondar (efeito de barra conectada).
// `data-highlighted` cobre o hover em andamento (entre escolher o início
// e passar o mouse antes do 2º clique); `--in-range` (classe nossa,
// calculada em cima do `rangeValue` real) cobre o intervalo já
// persistido, que continua visível ao reabrir o popover — ver comentário
// de `isInRange` no `<script>`.
:global(.ui-date-range-picker-calendar-cell-trigger[data-highlighted]),
:global(.ui-date-range-picker-calendar-cell-trigger.ui-date-range-picker-calendar-cell-trigger--in-range) {
  background-color: color-mix(in srgb, $color-accent-indigo 20%, transparent);
  border-radius: 0;
}

:global(.ui-date-range-picker-calendar-cell-trigger[data-selection-start]),
:global(.ui-date-range-picker-calendar-cell-trigger[data-selection-end]) {
  font-weight: $font-weight-semibold;
  color: $color-paper;
  background-color: $color-accent-indigo;
  border-radius: $radius-8;
}
</style>
