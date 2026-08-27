<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    label?: string
  }>(),
  {
    disabled: false,
    label: undefined,
  },
)

const model = defineModel<boolean>({ default: false })

function handleLabelClick(): void {
  if (props.disabled) return
  model.value = !model.value
}
</script>

<template>
  <div :class="['ui-toggle', { 'ui-toggle--disabled': disabled }]">
    <SwitchRoot v-model="model" class="ui-toggle__root" :disabled="disabled">
      <SwitchThumb class="ui-toggle__thumb" />
    </SwitchRoot>
    <span v-if="label" class="ui-toggle__label" @click="handleLabelClick">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

// Dimensões não confirmadas no Figma (rate limit da API bateu antes de
// medir esse componente) — proporção comum de toggle (trilho 2:1, thumb
// com folga de 2px em cada lado), construído sobre a escala de tamanho
// já existente ($size-40/$size-20/$size-16), não valores inventados fora
// dela. Revisar quando o Figma voltar a responder.
.ui-toggle {
  display: inline-flex;
  align-items: center;
  gap: $spacing-8;

  &--disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}

.ui-toggle__root {
  all: unset;
  position: relative;
  display: inline-flex;
  align-items: center;
  width: $size-40;
  height: $size-20;
  cursor: pointer;
  background-color: $color-ink-20;
  border-radius: $radius-80;
  transition: background-color 0.15s ease;

  &:focus-visible {
    @include focus-ring;
  }

  &[data-state='checked'] {
    background-color: $color-primary;
  }

  &[data-disabled] {
    cursor: not-allowed;
  }
}

.ui-toggle__thumb {
  display: block;
  width: $size-16;
  height: $size-16;
  background-color: $color-paper;
  border-radius: $radius-80;
  transition: transform 0.15s ease;
  transform: translateX(2px);

  &[data-state='checked'] {
    transform: translateX(22px);
  }
}

.ui-toggle__label {
  font-size: $font-size-md;
  color: $color-ink;
  cursor: pointer;

  .ui-toggle--disabled & {
    cursor: not-allowed;
  }
}
</style>
