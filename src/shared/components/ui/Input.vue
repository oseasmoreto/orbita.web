<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
  }>(),
  {
    disabled: false,
    invalid: false,
    placeholder: undefined,
    type: 'text',
  },
)

const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    :class="['ui-input', { 'ui-input--invalid': invalid }]"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
  />
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.ui-input {
  width: 100%;
  padding: $spacing-8 $spacing-16;
  font-size: $font-size-md;
  color: $color-ink;
  background-color: $color-bg-2;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--invalid {
    border-color: $color-accent-red;
  }
}
</style>
