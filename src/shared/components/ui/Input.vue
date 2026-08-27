<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    /**
     * Label renderizada dentro da própria caixa do campo — variante
     * "Input-B" do Figma (padding maior, altura por conteúdo). Sem
     * `label`, é a variante "Input-A" (campo isolado, altura fixa).
     */
    label?: string
  }>(),
  {
    disabled: false,
    invalid: false,
    label: undefined,
    placeholder: undefined,
    type: 'text',
  },
)

const model = defineModel<string>({ default: '' })

const inputId = useId()
</script>

<template>
  <div :class="['ui-input-wrapper', { 'ui-input-wrapper--labeled': label }]">
    <label v-if="label" :for="inputId" class="ui-input-label">{{ label }}</label>
    <input
      :id="label ? inputId : undefined"
      v-model="model"
      :class="['ui-input', { 'ui-input--invalid': invalid }]"
      :disabled="disabled"
      :placeholder="placeholder"
      :type="type"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.ui-input-wrapper {
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-input:focus-visible) {
    @include focus-ring;
  }

  &:has(.ui-input:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--labeled {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    padding: $spacing-16 $spacing-20;
  }
}

.ui-input-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.ui-input {
  width: 100%;
  font-size: $font-size-md;
  color: $color-ink;
  background-color: transparent;
  border: none;

  &:focus-visible {
    outline: none;
  }
}

.ui-input-wrapper:has(.ui-input--invalid) {
  border-color: $color-accent-red;
}
</style>
