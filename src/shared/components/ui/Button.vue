<script setup lang="ts">
import type { Component } from 'vue'
import { computed, useSlots } from 'vue'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'medium' | 'large'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    iconBefore?: Component
    iconAfter?: Component
  }>(),
  {
    disabled: false,
    iconAfter: undefined,
    iconBefore: undefined,
    size: 'medium',
    type: 'button',
    variant: 'primary',
  },
)

const slots = useSlots()

// Sem texto no slot padrão + pelo menos 1 ícone == variante "Icon Only" do
// Figma — padding vira uniforme (quadrado), em vez do padding assimétrico
// de texto.
const isIconOnly = computed(() => !slots.default && (props.iconBefore ?? props.iconAfter))

// Tamanho do ícone dentro do botão, medido direto no componente Figma
// (padding + tamanho do ícone == altura desenhada: medium 4+20+4=28,
// large 8+28+8=44) — não é o mesmo valor usado em ícone de apoio tipo
// seta de Select/Date (esses são 16px, ver design-system.md).
const iconSize = computed(() => (props.size === 'large' ? 28 : 20))
</script>

<template>
  <button
    :class="[
      'ui-button',
      `ui-button--${variant}`,
      `ui-button--${size}`,
      { 'ui-button--icon-only': isIconOnly },
    ]"
    :disabled="disabled"
    :type="type"
  >
    <Icon v-if="iconBefore" :icon="iconBefore" :size="iconSize" />
    <slot />
    <Icon v-if="iconAfter" :icon="iconAfter" :size="iconSize" />
  </button>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.ui-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-8;
  white-space: nowrap;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;

  &:focus-visible {
    @include focus-ring;
  }

  &:disabled {
    cursor: not-allowed;
  }

  &--medium {
    gap: $spacing-4;
    padding: $spacing-4 $spacing-8;
    font-size: $font-size-md;
    font-weight: $font-weight-regular;

    &.ui-button--icon-only {
      padding: $spacing-4;
    }
  }

  &--large {
    // Gap não confirmado no Figma pra essa variante (só "Text Only" foi
    // medido, sem ícone) — inferido por proporção com o padding.
    gap: $spacing-8;
    padding: $spacing-8 $spacing-16;
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;

    &.ui-button--icon-only {
      padding: $spacing-8;
    }
  }

  &--primary {
    color: $color-paper;
    background-color: $color-primary;

    &:not(:disabled):hover {
      background-color: $color-primary-hover;
    }

    // Disabled troca o fundo pro mesmo cinza quase-branco do Secondary
    // padrão (medido no Figma) — texto claro ficaria ilegível, por isso
    // também troca pra ink-40.
    &:disabled {
      color: $color-ink-40;
      background-color: $color-ink-4;
    }
  }

  &--secondary {
    color: $color-ink;
    background-color: $color-ink-4;

    &:not(:disabled):hover {
      background-color: $color-ink-10;
    }

    &:disabled {
      color: $color-ink-40;
    }
  }

  &--outline {
    color: $color-ink;
    background-color: transparent;
    border: 1px solid $color-ink-10;

    &:not(:disabled):hover {
      background-color: $color-ink-4;
    }

    &:disabled {
      color: $color-ink-40;
    }
  }

  &--ghost {
    color: $color-ink;
    background-color: transparent;

    &:not(:disabled):hover {
      background-color: $color-ink-4;
    }

    &:disabled {
      color: $color-ink-40;
    }
  }
}
</style>
