<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    /** Texto clicável ao lado do switch (ex.: "Allowed") — mesmo papel do `label` de `Checkbox.vue`. */
    label?: string
    /**
     * Legenda acima, dentro da mesma caixa com borda — variante "boxed" do
     * switch, mesmo padrão do Input-B/Select-B/DatePicker rotulado. Nome
     * diferente de `label` de propósito: `label` já é o texto ao lado do
     * switch (papel equivalente ao `Checkbox.vue`), então reaproveitar o
     * mesmo nome pra dois conceitos diferentes no mesmo componente
     * confundiria os dois. Combinável com `label` (ex.: "Title" em cima,
     * "Allowed" ao lado do switch, ambos na mesma caixa).
     */
    title?: string
  }>(),
  {
    disabled: false,
    label: undefined,
    title: undefined,
  },
)

const model = defineModel<boolean>({ default: false })

function handleLabelClick(): void {
  if (props.disabled) return
  model.value = !model.value
}
</script>

<template>
  <div :class="['ui-toggle-wrapper', { 'ui-toggle-wrapper--boxed': title }]">
    <span v-if="title" class="ui-toggle-label">{{ title }}</span>
    <div :class="['ui-toggle', { 'ui-toggle--disabled': disabled }]">
      <SwitchRoot v-model="model" class="ui-toggle__root" :disabled="disabled">
        <SwitchThumb class="ui-toggle__thumb" />
      </SwitchRoot>
      <span v-if="label" class="ui-toggle__label" @click="handleLabelClick">{{ label }}</span>
    </div>
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
// Sem `title`, o wrapper é transparente (sem padding/borda) — visualmente
// idêntico ao switch solto de antes. Mesmo padrão de "boxed" do
// Input-B/Select-B/DatePicker rotulado (`bg-1` + borda `ink-10` + padding
// `16/20`), só que aplicado em cima do switch em vez de um campo de texto.
.ui-toggle-wrapper {
  display: inline-flex;

  &--boxed {
    flex-direction: column;
    gap: $spacing-4;
    width: 100%;
    padding: $spacing-16 $spacing-20;
    background-color: $color-bg-1;
    border: 1px solid $color-ink-10;
    border-radius: $radius-8;
  }
}

.ui-toggle-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

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
