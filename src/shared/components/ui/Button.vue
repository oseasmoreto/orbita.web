<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    disabled: false,
    size: 'md',
    type: 'button',
    variant: 'primary',
  },
)
</script>

<template>
  <button
    :class="['ui-button', `ui-button--${variant}`, `ui-button--${size}`]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-4;
  border-radius: $radius-8;
  font-weight: $font-weight-semibold;
  transition: filter 0.15s ease;

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--sm {
    padding: $spacing-4 $spacing-8;
    font-size: $font-size-sm;
  }

  &--md {
    padding: $spacing-8 $spacing-16;
    font-size: $font-size-md;
  }

  &--lg {
    padding: $spacing-8 $spacing-24;
    font-size: $font-size-lg;
  }

  &--primary {
    color: $color-paper;
    background-color: $color-primary;

    &:not(:disabled):hover {
      filter: brightness(92%);
    }
  }

  &--secondary {
    color: $color-ink;
    background-color: $color-bg-2;
    border: 1px solid $color-ink-10;
  }

  &--ghost {
    color: $color-ink;
    background-color: transparent;

    &:not(:disabled):hover {
      background-color: $color-bg-2;
    }
  }

  &--danger {
    color: $color-paper;
    background-color: $color-accent-red;
  }
}
</style>
