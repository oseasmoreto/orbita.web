<script setup lang="ts">
/**
 * Resolve o gap "Featured Icon" do catálogo
 * (`docs/design/catalogo-componentes.md`, seção 2) — planejado desde a
 * Tier 3 como "IconTile.vue (nome a definir)", nunca extraído porque só
 * tinha 1 consumidor até agora (`NotificationItem.vue`, inline). A célula
 * "Activity" do `COMPONENT_SET "Table Components"` do Figma é o segundo
 * consumidor real — cruza o critério de promoção pra `shared/` já
 * documentado ("só sobe quando um SEGUNDO consumidor precisar de
 * verdade", seção 2 de `docs/infra/convencoes-frontend-infra.md`).
 * `NotificationItem.vue` foi refatorado pra usar este átomo em vez da
 * `<div>`/classes próprias que tinha antes — mesmo tile, mesmos tokens
 * (`{size.24}`, `{radius.8}`, `{colors.tint-1}`/`{colors.tint-2}`),
 * zero mudança visual.
 */
import type { Component } from 'vue'
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    icon: Component
    tint?: 'blue' | 'purple'
    size?: number
    iconSize?: number
  }>(),
  {
    iconSize: 16,
    size: 24,
    tint: 'blue',
  },
)
</script>

<template>
  <div
    :class="['ui-icon-tile', `ui-icon-tile--${tint}`]"
    :style="{ height: `${size}px`, width: `${size}px` }"
  >
    <Icon :icon="icon" :size="iconSize" />
  </div>
</template>

<style scoped lang="scss">

.ui-icon-tile {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  // $color-ink-fixed, não $color-ink: o fundo (tint-1/tint-2) não tem
  // variante escura, e $color-ink vira branco no tema escuro — ícone
  // branco sobre fundo claro fixo ficaria invisível (mesmo achado do
  // StatCard.vue, mesmo dia).
  color: $color-ink-fixed;
  border-radius: $radius-8;
}

// Tons "reservados sem papel definido" do design system (ver
// design-system.md, seção Known Gaps) — aproximação dos 2 tons claros do
// Figma ("Primary/Blue" #E3F5FF, "Primary/Purple" #E5ECF6), mesmo
// critério já usado no tile original do `NotificationItem`.
.ui-icon-tile--blue {
  background-color: $color-tint-1;
}

.ui-icon-tile--purple {
  background-color: $color-tint-2;
}
</style>
