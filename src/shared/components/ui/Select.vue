<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { useId } from 'vue'
import { Check } from '@/shared/components/icons/regular.generated'
// "ArrowLineUpDown" é o nome do ícone real do Figma pra esse indicador —
// não existe em docs/icons-regular/ (gap do export), `CaretUpDown` é o
// mais próximo disponível com o mesmo propósito.
import { CaretUpDown } from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'
import type { SelectOption } from './types/select.type'

withDefaults(
  defineProps<{
    options: SelectOption[]
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

const model = defineModel<string>({ default: '' })

const triggerId = useId()
</script>

<template>
  <SelectRoot v-model="model" :disabled="disabled">
    <div
      :class="[
        'ui-select-wrapper',
        { 'ui-select-wrapper--labeled': label, 'ui-select-wrapper--invalid': invalid },
      ]"
    >
      <label v-if="label" :for="triggerId" class="ui-select-label">{{ label }}</label>
      <SelectTrigger :id="label ? triggerId : undefined" class="ui-select-trigger">
        <SelectValue class="ui-select-value" :placeholder="placeholder" />
        <SelectIcon as-child>
          <Icon :icon="CaretUpDown" :size="16" />
        </SelectIcon>
      </SelectTrigger>
    </div>

    <SelectPortal>
      <SelectContent class="ui-select-content" position="popper" :side-offset="4">
        <SelectScrollUpButton class="ui-select-scroll" />
        <SelectViewport class="ui-select-viewport">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="ui-select-item"
            :value="option.value"
          >
            <SelectItemText>{{ option.label }}</SelectItemText>
            <SelectItemIndicator class="ui-select-item-indicator">
              <Icon :icon="Check" :size="16" />
            </SelectItemIndicator>
          </SelectItem>
        </SelectViewport>
        <SelectScrollDownButton class="ui-select-scroll" />
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<style scoped lang="scss">

// Mesmo tratamento visual do Input.vue (Input-A/B) — o Select do Figma
// compartilha padding/borda/fundo com os outros campos do frame "Form".
.ui-select-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-select-trigger[data-state='open']) {
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

.ui-select-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.ui-select-trigger {
  all: unset;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink;
  cursor: pointer;

  &[data-placeholder] .ui-select-value {
    color: $color-ink-40;
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

// `:global()` a partir daqui: `SelectPortal` teletransporta esse conteúdo
// pra fora da árvore do componente (direto pro final do `<body>`), então o
// atributo de escopo do Vue (`data-v-xxx`) nunca chega nesses elementos —
// sem `:global()` essas regras não casam com nada e o dropdown renderiza
// sem estilo nenhum (achado real, confirmado inspecionando o DOM).
// `z-index: 200`, não 50 — achado real, 2026-08-31: precisa ficar acima
// de `Modal.vue`/`Drawer.vue` (100/101) pra funcionar corretamente
// aninhado dentro de um dos dois; ver `DatePicker.vue` pro relato
// completo (mesmo bug corrigido nos 5 portais floating do design system).
:global(.ui-select-content) {
  z-index: 200;
  overflow: hidden;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;
}

:global(.ui-select-viewport) {
  padding: $spacing-4;
}

:global(.ui-select-scroll) {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-4;
  color: $color-ink-40;
}

// Acompanhado por baixo com regras "planas" (`:global(.foo[attr])`), não
// aninhadas (`&[attr]` dentro do bloco `:global(...)`) — achado real: o
// `&` do Sass dentro de um `:global()` do Vue perde o seletor-pai no CSS
// compilado, viram `.ui-select-item` sozinho (sem o atributo), então TODA
// opção herdava o estilo de disabled/highlighted, mesmo a habilitada.
// Confirmado inspecionando `document.styleSheets` — a regra compilada
// aparecia como `.ui-select-item { color: ... }`, sem `[data-disabled]`
// nenhum. Selector "plano" evita o `&` por completo.
:global(.ui-select-item) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-8;
  padding: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink;
  cursor: pointer;
  border-radius: $radius-4;
}

:global(.ui-select-item:focus-visible),
:global(.ui-select-item[data-highlighted]) {
  outline: none;
  background-color: $color-ink-4;
}

:global(.ui-select-item[data-disabled]) {
  cursor: not-allowed;
  color: $color-ink-40;
}

:global(.ui-select-item-indicator) {
  display: inline-flex;
}
</style>
