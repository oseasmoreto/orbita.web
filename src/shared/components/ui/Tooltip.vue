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
      <TooltipTrigger as-child class="ui-tooltip-trigger">
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

// `:global()`: `TooltipPortal` teletransporta pro <body>, mesmo achado
// real do Select/Drawer (ver design-system.md, seção Components).
// `z-index: 200`, não 50 — acima de `Modal.vue`/`Drawer.vue` (100/101),
// mesmo achado real do `DatePicker.vue` (2026-08-31).
:global(.ui-tooltip) {
  z-index: 200;
  display: flex;
  align-items: center;
  gap: $spacing-4;
  max-width: 260px;
  padding: $spacing-4 $spacing-8;
  font-size: $font-size-sm;
  color: $color-paper;
  background-color: $color-ink-80;
  // `pre-line`: quebra em blocos quando o texto trouxer `\n\n` (parágrafos),
  // mas ainda deixa o texto normal (uma linha só) fazer wrap sozinho —
  // achado real, 2026-09-03: sem isso, um texto explicativo longo (ex.
  // `campaignPriceTooltip`) nunca quebrava linha, o `<span>` crescia até
  // ocupar quase a largura inteira da viewport, e o cálculo de colisão do
  // Reka UI (que reposiciona o tooltip pra não estourar a tela) jogava a
  // caixa gigante pra um canto bem longe do próprio ícone que a abriu —
  // lido pelo usuário como "o tooltip apareceu na linha errada".
  white-space: pre-line;
  // Figma usa um efeito "BG blur 40" atrás do tooltip — não existe token
  // de blur na escala, valor abaixo é aproximado (glassmorphism sutil),
  // não uma medida exata do componente de origem.
  backdrop-filter: blur(8px);
  border-radius: $radius-8;
}

:global(.ui-tooltip__shortcut) {
  color: $color-paper-40;
}

// Pedido direto do usuário, 2026-09-03: cursor vira "?" (help) em cima de
// QUALQUER trigger de tooltip — `class` no `TooltipTrigger as-child` é
// mesclada no elemento real que o slot renderiza (padrão "as-child" do
// Reka UI, mesmo mecanismo que já mescla attrs/listeners), então isso
// cobre um `<span>` solto (ícone `Info`) e também um `Button`/qualquer
// outro componente usado como trigger, sem precisar de CSS por
// consumidor. `:global()` pelo mesmo motivo de sempre nesse arquivo —
// a classe pode acabar num elemento fora da árvore com escopo deste SFC.
:global(.ui-tooltip-trigger) {
  cursor: help;
}
</style>
