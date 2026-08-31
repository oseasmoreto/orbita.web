<script setup lang="ts">
/**
 * Tier 11 do catálogo (`docs/design/catalogo-componentes.md`) —
 * **revisado em 2026-08-28, pixel-perfect contra captura real do
 * usuário** cobrindo as 4 variantes do frame "Date Picker" do Figma
 * ("Date Picker", "Date Picker with time", e as 2 de intervalo, que
 * viraram `DateRangePicker.vue` — ver seção própria em design-system.md).
 * Primitivo Reka UI (`Popover` + `Calendar`, standalone — não a família
 * composta `DatePicker*`, que embute um campo segmentado dia/mês/ano que
 * não temos caso de uso pra hoje) + tokens do design system.
 *
 * Painel do popover ganhou 3 elementos novos que a v1 (sem grounding)
 * não tinha: **preview** (data — e hora, se `show-time` — formatada,
 * atualiza ao vivo conforme o usuário navega/seleciona), **atalhos**
 * ("Hoje"/"Última seleção") e **cabeçalho de mês abreviado** ("Fev", não
 * "fevereiro de 2026" do `CalendarHeading` padrão). Grid de dias não
 * mudou — já batia com a captura desde a v1.
 */
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, parseDate, today } from '@internationalized/date'
import dayjs from 'dayjs'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
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
    /** Label dentro da mesma caixa do trigger — variante "Input-B" do Figma. */
    label?: string
    /** Mostra a linha de hora no preview do popover — variante "Date Picker with time" da captura. */
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

/**
 * Model público é uma data ISO (`YYYY-MM-DD`), nunca o `DateValue` do
 * `@internationalized/date` que a Reka UI usa por baixo — mesmo raciocínio
 * de `Select.vue` expor `string`, não o tipo interno da lib.
 */
const model = defineModel<string>({ default: '' })

/** Hora em "HH:mm" 24h, só relevante quando `show-time`. */
const timeModel = defineModel<string>('time', { default: '' })

const triggerId = useId()
const open = ref(false)

const calendarValue = computed<DateValue | undefined>({
  get: () => (model.value ? parseDate(model.value) : undefined),
  set: (value) => {
    model.value = value ? value.toString() : ''
    // Sem hora pra ajustar, escolher o dia já basta — fecha igual à v1.
    // Com hora, fica aberto pro usuário ajustar o relógio antes de sair
    // (fecha via clique fora/Esc, sem botão de confirmar — não visto na
    // captura).
    if (!props.showTime) {
      open.value = false
    }
  },
})

/**
 * Snapshot tirado toda vez que o popover abre — "Última seleção" volta
 * pra esse valor, não pro último confirmado historicamente (não haveria
 * como saber "confirmado" sem um botão de Apply, que a captura não tem).
 */
const lastSelection = ref({ date: '', time: '' })

watch(open, (isOpen) => {
  if (isOpen) {
    lastSelection.value = { date: model.value, time: timeModel.value }
  }
})

function selectToday(): void {
  calendarValue.value = today(getLocalTimeZone())
}

function selectLastSelection(): void {
  model.value = lastSelection.value.date
  timeModel.value = lastSelection.value.time
}

const displayValue = computed(() => (model.value ? dayjs(model.value).format('DD/MM/YYYY') : ''))

/** Preview do popover — mesmo formato "DD / MM / YYYY" da captura (com espaços), sempre com um valor (hoje quando nada foi escolhido ainda). */
const previewDate = computed(() => dayjs(model.value || undefined).format('DD / MM / YYYY'))

function monthLabel(date: DateValue): string {
  const formatted = dayjs(date.toString()).format('MMM')
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

// Hora sempre com um valor pro preview (hora atual quando nada foi
// ajustado ainda) — só grava no model quando o usuário mexe de verdade.
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
        'ui-date-picker-wrapper',
        { 'ui-date-picker-wrapper--labeled': label, 'ui-date-picker-wrapper--invalid': invalid },
      ]"
    >
      <label v-if="label" :for="triggerId" class="ui-date-picker-label">{{ label }}</label>
      <PopoverTrigger :id="label ? triggerId : undefined" class="ui-date-picker-trigger" :disabled="disabled">
        <Icon class="ui-date-picker-leading-icon" :icon="CalendarBlank" :size="16" />
        <span :class="['ui-date-picker-value', { 'ui-date-picker-value--placeholder': !model }]">
          {{ displayValue || placeholder }}
        </span>
        <Icon :icon="CaretUpDown" :size="16" />
      </PopoverTrigger>
    </div>

    <PopoverPortal>
      <PopoverContent class="ui-date-picker-content" :side-offset="4" align="start">
        <div class="ui-date-picker-preview">
          <span class="ui-date-picker-preview-date">{{ previewDate }}</span>
          <div v-if="showTime" class="ui-date-picker-preview-time">
            <input
              class="ui-date-picker-time-input"
              maxlength="2"
              :value="String(hour12).padStart(2, '0')"
              @change="handleHourInput"
            />
            <span>:</span>
            <input
              class="ui-date-picker-time-input"
              maxlength="2"
              :value="String(minute).padStart(2, '0')"
              @change="handleMinuteInput"
            />
            <button class="ui-date-picker-meridiem" type="button" @click="toggleMeridiem">
              {{ meridiem }}
            </button>
          </div>
        </div>

        <CalendarRoot
          v-slot="{ weekDays, grid, date }"
          v-model="calendarValue"
          locale="pt-BR"
          class="ui-date-picker-calendar"
        >
          <div class="ui-date-picker-shortcuts">
            <button class="ui-date-picker-shortcut" type="button" @click="selectToday">Hoje</button>
            <button class="ui-date-picker-shortcut" type="button" @click="selectLastSelection">
              Última seleção
            </button>
            <div class="ui-date-picker-nav">
              <CalendarPrev class="ui-date-picker-calendar-nav">
                <Icon :icon="CaretLeft" :size="14" />
              </CalendarPrev>
              <span class="ui-date-picker-month-label">{{ monthLabel(date) }}</span>
              <CalendarNext class="ui-date-picker-calendar-nav">
                <Icon :icon="CaretRight" :size="14" />
              </CalendarNext>
            </div>
          </div>

          <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="ui-date-picker-calendar-grid">
            <CalendarGridHead>
              <CalendarGridRow class="ui-date-picker-calendar-row">
                <CalendarHeadCell v-for="day in weekDays" :key="day" class="ui-date-picker-calendar-head-cell">
                  {{ day }}
                </CalendarHeadCell>
              </CalendarGridRow>
            </CalendarGridHead>
            <CalendarGridBody>
              <CalendarGridRow
                v-for="(week, weekIndex) in month.rows"
                :key="`week-${weekIndex}`"
                class="ui-date-picker-calendar-row"
              >
                <CalendarCell
                  v-for="weekDate in week"
                  :key="weekDate.toString()"
                  :date="weekDate"
                  class="ui-date-picker-calendar-cell"
                >
                  <CalendarCellTrigger :day="weekDate" :month="month.value" class="ui-date-picker-calendar-cell-trigger" />
                </CalendarCell>
              </CalendarGridRow>
            </CalendarGridBody>
          </CalendarGrid>
        </CalendarRoot>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

// Mesmo tratamento visual de Input-A/B / Select — o trigger é um campo de
// formulário como qualquer outro do frame "Form", só que abre um popover
// em vez de digitar/escolher inline.
.ui-date-picker-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-date-picker-trigger[data-state='open']) {
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

.ui-date-picker-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.ui-date-picker-trigger {
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

// Ícone à esquerda é só um marcador semântico ("isto é um campo de
// data"), fica sempre apagado (`ink-40`) — diferente do chevron à
// direita, que reflete o mesmo estado "clicável" do `CaretUpDown` do
// `Select.vue` e por isso herda `$color-ink` (não tem override próprio).
.ui-date-picker-leading-icon {
  flex-shrink: 0;
  color: $color-ink-40;
}

// `flex: 1` no texto empurra o chevron pro fim do trigger — mesmo efeito
// de um `justify-content: space-between`, mas sem distribuir espaço
// também entre o ícone à esquerda e o texto (que precisam ficar colados,
// só um `gap` pequeno entre eles, ver captura do Figma).
.ui-date-picker-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &--placeholder {
    color: $color-ink-40;
  }
}

// `PopoverPortal` teletransporta esse conteúdo pro fim do `<body>`, mesmo
// achado já documentado pro Select/Tooltip/DropdownMenu/Modal — sempre
// seletor "plano" dentro do `:global(...)`, nunca `&` aninhado (é o bug
// real já corrigido no Select, ver design-system.md).
//
// `z-index: 200`, não 50 — achado real, 2026-08-31: usar este componente
// DENTRO de um `Modal.vue` (`z-index: 101`) fazia o popover renderizar
// atrás do conteúdo do modal, interceptando clique nos dias/atalhos
// (confirmado com Playwright: "element intercepts pointer events"). O
// mesmo bug existe em Select/Tooltip/DropdownMenu/DateRangePicker — os 5
// portais floating do design system usavam 50, sempre menor que
// Modal/Drawer (100/101), então nenhum funcionava de verdade aninhado
// dentro de um Modal/Drawer. Corrigido nos 5 pro mesmo valor.
:global(.ui-date-picker-content) {
  z-index: 200;
  width: 280px;
  padding: $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-12;
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
}

// Preview — grounded na captura: "DD / MM / YYYY" fixo à esquerda, hora
// (quando `show-time`) empurrada pro fim da mesma linha, borda inferior
// separando do resto do painel.
:global(.ui-date-picker-preview) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: $spacing-12;
  margin-bottom: $spacing-12;
  font-size: $font-size-md;
  color: $color-ink;
  border-bottom: 1px solid $color-ink-10;
}

:global(.ui-date-picker-preview-time) {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  font-size: $font-size-sm;
  color: $color-ink;
}

// Inputs de hora/minuto sem aparência de campo (sem borda/fundo) de
// propósito — a captura mostra só texto puro ("04 : 08"), a edição é uma
// affordance nossa (não visível na captura, que não mostra estado de
// foco/hover), não um campo desenhado.
:global(.ui-date-picker-time-input) {
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

:global(.ui-date-picker-meridiem) {
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

// Atalhos ("Hoje"/"Última seleção") — pill apagada, mesmo tratamento
// visual de fundo já usado no Badge "gray"/chip do TagsInput
// ({colors.ink-4}), só maior (padding de botão pequeno, não de chip).
:global(.ui-date-picker-shortcuts) {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  margin-bottom: $spacing-12;
}

:global(.ui-date-picker-shortcut) {
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

:global(.ui-date-picker-nav) {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-4;
}

:global(.ui-date-picker-month-label) {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

:global(.ui-date-picker-calendar-nav) {
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

:global(.ui-date-picker-calendar-nav:hover) {
  color: $color-ink;
  background-color: $color-ink-4;
}

:global(.ui-date-picker-calendar-nav[data-disabled]) {
  cursor: not-allowed;
  opacity: 0.4;
}

:global(.ui-date-picker-calendar-row) {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

:global(.ui-date-picker-calendar-head-cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size-32;
  height: $size-32;
  font-size: $font-size-2xs;
  color: $color-ink-40;
  text-transform: uppercase;
}

:global(.ui-date-picker-calendar-cell) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
}

:global(.ui-date-picker-calendar-cell-trigger) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size-28;
  height: $size-28;
  font-size: $font-size-sm;
  color: $color-ink;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: $radius-8;
}

:global(.ui-date-picker-calendar-cell-trigger:hover) {
  background-color: $color-ink-4;
}

:global(.ui-date-picker-calendar-cell-trigger[data-today]) {
  font-weight: $font-weight-semibold;
  box-shadow: inset 0 0 0 1px $color-ink-20;
}

:global(.ui-date-picker-calendar-cell-trigger[data-outside-view]) {
  color: $color-ink-20;
}

:global(.ui-date-picker-calendar-cell-trigger[data-disabled]) {
  color: $color-ink-20;
  cursor: not-allowed;
}

// Seletor "plano" (não `&[data-selected]` aninhado dentro do `:global()`)
// — mesma regra da nota de bug do Select, aplicada aqui desde a primeira
// versão em vez de descoberta por tentativa e erro de novo.
:global(.ui-date-picker-calendar-cell-trigger[data-selected]) {
  font-weight: $font-weight-semibold;
  color: $color-paper;
  background-color: $color-accent-indigo;
}
</style>
