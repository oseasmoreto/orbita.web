<script setup lang="ts">
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxPortal,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxViewport,
} from 'reka-ui'
import { useId } from 'vue'
import { Check } from '@/shared/components/icons/regular.generated'
import { CaretUpDown } from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'
import type { SelectOption } from './types/select.type'

/**
 * Variante buscável de `Select.vue` — pedida direto pelo usuário em
 * 2026-09-01 pra filtro com muitas opções (ex: escolher 1 usuário entre
 * uma centena, digitando "joao" pra filtrar em vez de rolar a lista
 * inteira). Mesma família de primitivo já prevista desde a Tier 0
 * (`docs/infra/convencoes-frontend-infra.md` seção 3.1: "componente com
 * comportamento complexo... é sempre construído em cima do primitivo
 * headless equivalente da Reka UI" — `Combobox` já citado ali nominalmente,
 * nunca implementado até agora por falta de caso de uso real).
 *
 * `Select.vue` continua sendo a escolha padrão pra lista curta/enumerada
 * (status, role, ciclo de cobrança...) — este componente é só pra quando a
 * lista de opções é grande/dinâmica o bastante pra rolar não ser viável
 * (picker de usuário/plano vindo de `useAdminUserOptions`/
 * `useAdminPlanOptions`). Mesmo shape de `SelectOption`/mesmos tokens
 * visuais do `Select.vue` — o trigger vira um campo de texto (digitável)
 * em vez de um botão, mas a caixa/borda/raio são idênticos.
 */
withDefaults(
  defineProps<{
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    /** Label dentro da mesma caixa do trigger — mesma variante "boxed" do Select. */
    label?: string
    emptyText?: string
  }>(),
  {
    disabled: false,
    emptyText: 'Nenhum resultado encontrado.',
    invalid: false,
    label: undefined,
    placeholder: undefined,
  },
)

const model = defineModel<string>({ default: '' })

defineOptions({
  inheritAttrs: false,
})

function displayValueFor(options: SelectOption[]) {
  return (value: unknown) => options.find((option) => option.value === value)?.label ?? ''
}

const inputId = useId()
</script>

<template>
  <ComboboxRoot v-model="model" :disabled="disabled" open-on-click reset-search-term-on-blur>
    <div
      :class="[
        'ui-combobox-wrapper',
        { 'ui-combobox-wrapper--labeled': label, 'ui-combobox-wrapper--invalid': invalid },
      ]"
    >
      <label v-if="label" :for="inputId" class="ui-combobox-label">{{ label }}</label>
      <ComboboxAnchor class="ui-combobox-anchor">
        <ComboboxInput
          :id="inputId"
          class="ui-combobox-input"
          :display-value="displayValueFor(options)"
          :placeholder="placeholder"
        />
        <ComboboxTrigger class="ui-combobox-trigger">
          <Icon :icon="CaretUpDown" :size="16" />
        </ComboboxTrigger>
      </ComboboxAnchor>
    </div>

    <ComboboxPortal>
      <ComboboxContent class="ui-combobox-content" position="popper" :side-offset="4">
        <ComboboxViewport class="ui-combobox-viewport">
          <ComboboxEmpty class="ui-combobox-empty">{{ emptyText }}</ComboboxEmpty>
          <ComboboxItem
            v-for="option in options"
            :key="option.value"
            class="ui-combobox-item"
            :value="option.value"
          >
            {{ option.label }}
            <ComboboxItemIndicator class="ui-combobox-item-indicator">
              <Icon :icon="Check" :size="16" />
            </ComboboxItemIndicator>
          </ComboboxItem>
        </ComboboxViewport>
      </ComboboxContent>
    </ComboboxPortal>
  </ComboboxRoot>
</template>

<style scoped lang="scss">

// Mesmo tratamento visual de `Select.vue` — mesma caixa/borda/raio, só o
// conteúdo interno troca de botão pra campo de texto digitável.
.ui-combobox-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-combobox-input:focus-visible) {
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

.ui-combobox-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.ui-combobox-anchor {
  display: flex;
  flex: 1;
  align-items: center;
  gap: $spacing-8;
}

.ui-combobox-input {
  flex: 1;
  min-width: 0;
  padding: 0;
  font-family: inherit;
  font-size: $font-size-md;
  color: $color-ink;
  background: none;
  border: none;
  outline: none;

  &::placeholder {
    color: $color-ink-40;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.ui-combobox-trigger {
  all: unset;
  display: inline-flex;
  align-items: center;
  color: $color-ink;
  cursor: pointer;
}

// `:global()` — mesmo achado já documentado em `Select.vue`: `ComboboxPortal`
// teletransporta o conteúdo pra fora da árvore do componente, o atributo de
// escopo do Vue nunca chega lá. `z-index: 200`, mesmo motivo do `Select.vue`
// (precisa ficar acima de `Modal.vue`/`Drawer.vue`, 100/101).
:global(.ui-combobox-content) {
  z-index: 200;
  overflow: hidden;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;
}

:global(.ui-combobox-viewport) {
  max-height: 240px;
  padding: $spacing-4;
  overflow-y: auto;
}

:global(.ui-combobox-empty) {
  padding: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink-40;
  text-align: center;
}

// Seletores "planos" (não `&[attr]` aninhado dentro do `:global()`) —
// mesma lição já registrada em `Select.vue`: o `&` do Sass some do CSS
// compilado dentro de um bloco `:global()`.
:global(.ui-combobox-item) {
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

:global(.ui-combobox-item:focus-visible),
:global(.ui-combobox-item[data-highlighted]) {
  outline: none;
  background-color: $color-ink-4;
}

:global(.ui-combobox-item[data-disabled]) {
  cursor: not-allowed;
  color: $color-ink-40;
}

:global(.ui-combobox-item-indicator) {
  display: inline-flex;
}
</style>
