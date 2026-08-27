<script setup lang="ts">
import {
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from 'reka-ui'

withDefaults(
  defineProps<{
    text: string
    /** Dica de atalho de teclado, ex.: "⌘C" — espelha "Show Shortcut" do Figma. */
    shortcut?: string
  }>(),
  {
    shortcut: undefined,
  },
)
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent class="ui-tooltip" :side-offset="4">
          <span>{{ text }}</span>
          <span v-if="shortcut" class="ui-tooltip__shortcut">{{ shortcut }}</span>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

// `:global()`: `TooltipPortal` teletransporta pro <body>, mesmo achado
// real do Select/Drawer (ver design-system.md, seção Components).
:global(.ui-tooltip) {
  z-index: 50;
  display: flex;
  align-items: center;
  gap: $spacing-4;
  padding: $spacing-4 $spacing-8;
  font-size: $font-size-sm;
  color: $color-paper;
  background-color: $color-ink-80;
  // Figma usa um efeito "BG blur 40" atrás do tooltip — não existe token
  // de blur na escala, valor abaixo é aproximado (glassmorphism sutil),
  // não uma medida exata do componente de origem.
  backdrop-filter: blur(8px);
  border-radius: $radius-8;
}

:global(.ui-tooltip__shortcut) {
  color: $color-paper-40;
}
</style>
