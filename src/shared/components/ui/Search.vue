<script setup lang="ts">
import { MagnifyingGlass, XCircles } from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    placeholder?: string
    /** Atalho de teclado exibido quando o campo está vazio, ex.: "⌘/". */
    shortcut?: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
    placeholder: undefined,
    shortcut: undefined,
  },
)

const model = defineModel<string>({ default: '' })

function clear(): void {
  model.value = ''
}
</script>

<template>
  <div :class="['ui-search', { 'ui-search--disabled': disabled }]">
    <Icon class="ui-search__icon" :icon="MagnifyingGlass" :size="16" />
    <input
      v-model="model"
      class="ui-search__input"
      :disabled="disabled"
      :placeholder="placeholder"
      type="search"
    />
    <span v-if="shortcut && !model" class="ui-search__shortcut">{{ shortcut }}</span>
    <button
      v-if="model"
      aria-label="Limpar busca"
      class="ui-search__clear"
      type="button"
      @click="clear"
    >
      <Icon :icon="XCircles" :size="16" />
    </button>
  </div>
</template>

<style scoped lang="scss">

// Os 3 "Type=Grey/White/Typing" do Figma são só aparência por interação
// (idle → hover → foco), não props/variantes escolhidas pelo consumidor —
// resolvidos com :hover/:focus-within puro. Borda transparente no idle
// (em vez de "sem borda") evita o layout pular 1px quando a borda de
// verdade some do estado de hover/foco.
.ui-search {
  display: inline-flex;
  align-items: center;
  // Padding real medido no Figma ("4px 6px") — o 6px horizontal não bate
  // com nenhum degrau da escala de spacing (0/4/8/12/16...), mesmo caso já
  // registrado no padding vertical de 1px do Badge: valor legítimo do
  // componente de origem, não arredondado pra escala geral.
  gap: $spacing-4;
  padding: $spacing-4 6px;
  background-color: $color-ink-4;
  border: 1px solid transparent;
  border-radius: $radius-8;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;

  &:hover:not(:focus-within) {
    background-color: $color-paper-80;
    border-color: $color-ink-10;
  }

  &:focus-within {
    background-color: $color-paper;
    border-color: $color-ink-20;
    @include focus-ring;
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.ui-search__icon {
  flex-shrink: 0;
  color: $color-ink-20;
}

.ui-search__input {
  flex: 1;
  min-width: 0;
  font-size: $font-size-md;
  color: $color-ink;
  background-color: transparent;
  border: none;

  &::placeholder {
    color: $color-ink-20;
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
  }

  // Chrome/Safari desenham um "x" nativo pra type="search" — nosso botão
  // de limpar (.ui-search__clear) já cobre isso, então o nativo some pra
  // não duplicar.
  &::-webkit-search-cancel-button {
    display: none;
  }
}

.ui-search__shortcut {
  flex-shrink: 0;
  font-size: $font-size-sm;
  color: $color-ink-20;
}

.ui-search__clear {
  display: inline-flex;
  flex-shrink: 0;
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

  &:focus-visible {
    @include focus-ring;
  }
}
</style>
