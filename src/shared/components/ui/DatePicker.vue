<script setup lang="ts">
/**
 * Tier 11 do catálogo (`docs/design/catalogo-componentes.md`) — sem
 * grounding pixel-a-pixel no Figma: a API do Figma estava sob rate limit
 * (retry-after de dias, achado já registrado na Tier 0) e nenhuma tela do
 * plano atual ainda exige filtro de data, então não valia esperar. Mesmo
 * caminho já usado pro `Modal`/`Drawer` (sem frame de origem): primitivo
 * Reka UI (`Popover` + `Calendar`, standalone — não a família composta
 * `DatePicker*`, que embute um campo segmentado dia/mês/ano que não temos
 * caso de uso pra hoje) + tokens do design system, aproximando o mesmo
 * tratamento visual de `Input.vue`/`Select.vue` (Input-A/B) pro trigger.
 */
import type { DateValue } from '@internationalized/date'
import { parseDate } from '@internationalized/date'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarHeading,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { computed, ref, useId } from 'vue'
import dayjs from 'dayjs'
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  XCircles,
} from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    /** Label dentro da mesma caixa do trigger — variante "Input-B" do Figma. */
    label?: string
  }>(),
  {
    disabled: false,
    invalid: false,
    label: undefined,
    placeholder: undefined,
  },
)

/**
 * Model público é uma data ISO (`YYYY-MM-DD`), nunca o `DateValue` do
 * `@internationalized/date` que a Reka UI usa por baixo — mesmo raciocínio
 * de `Select.vue` expor `string`, não o tipo interno da lib. Serializa
 * direto num `FormRequest date`/schema Zod do módulo consumidor, sem
 * ninguém além deste componente precisar conhecer `@internationalized/date`.
 * `CalendarDate.toString()` já devolve ISO 8601 puro, então a conversão de
 * volta pro model não precisa de formatação manual.
 */
const model = defineModel<string>({ default: '' })

const triggerId = useId()

// Fecha o popover ao escolher um dia — mesmo comportamento de
// `Select.vue` (escolher uma opção fecha o dropdown), diferente do
// `closeOnSelect` da família composta `DatePickerRoot` (não usada aqui,
// ver comentário acima) que resolveria isso sozinho.
const open = ref(false)

const calendarValue = computed<DateValue | undefined>({
  get: () => (model.value ? parseDate(model.value) : undefined),
  set: (value) => {
    model.value = value ? value.toString() : ''
    open.value = false
  },
})

const displayValue = computed(() => (model.value ? dayjs(model.value).format('DD/MM/YYYY') : ''))

function clear(): void {
  model.value = ''
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
        <span :class="['ui-date-picker-value', { 'ui-date-picker-value--placeholder': !model }]">
          {{ displayValue || placeholder }}
        </span>
        <button
          v-if="model"
          type="button"
          class="ui-date-picker-clear"
          aria-label="Limpar data"
          @click.stop="clear"
        >
          <Icon :icon="XCircles" :size="16" />
        </button>
        <Icon v-else :icon="CalendarBlank" :size="16" />
      </PopoverTrigger>
    </div>

    <PopoverPortal>
      <PopoverContent class="ui-date-picker-content" :side-offset="4" align="start">
        <CalendarRoot v-slot="{ weekDays, grid }" v-model="calendarValue" locale="pt-BR" class="ui-date-picker-calendar">
          <CalendarHeader class="ui-date-picker-calendar-header">
            <CalendarPrev class="ui-date-picker-calendar-nav">
              <Icon :icon="CaretLeft" :size="16" />
            </CalendarPrev>
            <CalendarHeading class="ui-date-picker-calendar-heading" />
            <CalendarNext class="ui-date-picker-calendar-nav">
              <Icon :icon="CaretRight" :size="16" />
            </CalendarNext>
          </CalendarHeader>

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
  justify-content: space-between;
  gap: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.ui-date-picker-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &--placeholder {
    color: $color-ink-40;
  }
}

.ui-date-picker-clear {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: $color-ink-40;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: $color-ink;
  }
}

// `PopoverPortal` teletransporta esse conteúdo pro fim do `<body>`, mesmo
// achado já documentado pro Select/Tooltip/DropdownMenu/Modal — sempre
// seletor "plano" dentro do `:global(...)`, nunca `&` aninhado (é o bug
// real já corrigido no Select, ver design-system.md).
:global(.ui-date-picker-content) {
  z-index: 50;
  padding: $spacing-8;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;
}

:global(.ui-date-picker-calendar-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-4 $spacing-4 $spacing-8;
}

:global(.ui-date-picker-calendar-heading) {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

:global(.ui-date-picker-calendar-nav) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: $size-24;
  height: $size-24;
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
  background-color: $color-primary;
}
</style>
