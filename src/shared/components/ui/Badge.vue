<script setup lang="ts">
import type { Component } from 'vue'
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    variant?: 'ghost' | 'gray'
    size?: 'sm' | 'md'
    iconBefore?: Component
    iconAfter?: Component
  }>(),
  {
    iconAfter: undefined,
    iconBefore: undefined,
    size: 'md',
    variant: 'ghost',
  },
)
</script>

<template>
  <span :class="['ui-badge', `ui-badge--${variant}`, `ui-badge--${size}`]">
    <Icon v-if="iconBefore" :icon="iconBefore" :size="12" />
    <slot />
    <Icon v-if="iconAfter" :icon="iconAfter" :size="12" />
  </span>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ui-badge {
  display: inline-flex;
  align-items: center;
  gap: $spacing-4;
  padding: 1px $spacing-4;
  color: $color-ink;
  border-radius: $radius-4;

  &--sm {
    font-size: $font-size-sm;
  }

  &--md {
    font-size: $font-size-md;
  }

  &--gray {
    background-color: $color-ink-4;
  }
}
</style>
