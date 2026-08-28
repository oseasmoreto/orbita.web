<script setup lang="ts">
/**
 * Grounded na captura real do usuário do frame "Form → Type=Tags" do
 * Figma — nunca tinha sido implementado (gap real do catálogo original:
 * `docs/design/design-system.md`/`convencoes-frontend-infra.md` já citavam
 * "Select, Date, Switch, Tags" como irmãos do mesmo frame desde a Tier 1,
 * mas "Tags" nunca ganhou uma linha própria em
 * `docs/design/catalogo-componentes.md`). Construído sobre a família
 * `TagsInput*` da Reka UI (`TagsInputRoot`/`TagsInputItem`/
 * `TagsInputItemText`/`TagsInputItemDelete`/`TagsInputInput`) — mesmo
 * caminho de "não reinventar primitivo acessível do zero" já usado em
 * todo o resto do design system (Select/Checkbox/Toggle/DatePicker).
 */
import {
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
  TagsInputRoot,
} from 'reka-ui'
import { useId } from 'vue'
import { CaretUpDown, X } from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    /** Legenda acima, dentro da mesma caixa — variante "Tags-B" do Figma. */
    label?: string
  }>(),
  {
    disabled: false,
    invalid: false,
    label: undefined,
    placeholder: undefined,
  },
)

const model = defineModel<string[]>({ default: () => [] })

const fieldId = useId()
</script>

<template>
  <div
    :class="[
      'ui-tags-input-wrapper',
      { 'ui-tags-input-wrapper--labeled': label, 'ui-tags-input-wrapper--invalid': invalid },
    ]"
  >
    <label v-if="label" :for="fieldId" class="ui-tags-input-label">{{ label }}</label>
    <div class="ui-tags-input-row">
      <TagsInputRoot :id="fieldId" v-model="model" class="ui-tags-input-root" :disabled="disabled">
        <TagsInputItem v-for="tag in model" :key="tag" class="ui-tags-input-item" :value="tag">
          <TagsInputItemText class="ui-tags-input-item-text" />
          <TagsInputItemDelete class="ui-tags-input-item-delete">
            <Icon :icon="X" :size="12" />
          </TagsInputItemDelete>
        </TagsInputItem>
        <TagsInputInput class="ui-tags-input-input" :placeholder="placeholder" />
      </TagsInputRoot>
      <!--
        Decorativo, pra manter a mesma linguagem visual dos outros campos
        "boxed" do frame Form (Select/Date) — sem comportamento próprio,
        este campo não abre popover nenhum, é digitação + chip direto.
      -->
      <Icon :icon="CaretUpDown" :size="16" class="ui-tags-input-caret" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

// Mesmo tratamento visual de Input-A/B / Select / DatePicker — variante
// "boxed" só entra com `label` (padding maior, coluna com legenda em
// cima), igual ao resto da família "Form".
.ui-tags-input-wrapper {
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-tags-input-root:focus-within) {
    @include focus-ring;
  }

  &--labeled {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    padding: $spacing-16 $spacing-20;
  }

  &--invalid {
    border-color: $color-accent-red;
  }
}

.ui-tags-input-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.ui-tags-input-row {
  display: flex;
  align-items: center;
  gap: $spacing-8;
}

.ui-tags-input-root {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-4;

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.ui-tags-input-item {
  display: inline-flex;
  align-items: center;
  gap: $spacing-4;
  padding: 1px $spacing-4;
  font-size: $font-size-sm;
  color: $color-ink;
  background-color: $color-ink-4;
  border-radius: $radius-4;

  &[data-state='active'] {
    @include focus-ring;
  }
}

.ui-tags-input-item-text {
  white-space: nowrap;
}

.ui-tags-input-item-delete {
  display: inline-flex;
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

.ui-tags-input-input {
  flex: 1;
  min-width: 60px;
  font-size: $font-size-md;
  color: $color-ink;
  background-color: transparent;
  border: none;

  &::placeholder {
    color: $color-ink-40;
  }

  &:focus-visible {
    outline: none;
  }
}

.ui-tags-input-caret {
  flex-shrink: 0;
  color: $color-ink;
}
</style>
