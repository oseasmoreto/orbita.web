<script setup lang="ts">
/**
 * Grounded no componente "Breadcrumb" do Figma (`#4113:41858`) — item
 * ancestral é um link apagado (`{colors.ink-40}`), o último item (página
 * atual) é texto cheio (`{colors.ink}`) sem link, separados por "/" em
 * `{colors.ink-20}`. Não reaproveita `Button.vue`: o botão do Figma
 * (`padding: 4px 8px`) bate com o `variant="ghost"` medium, mas a cor de
 * texto varia por item (apagado vs cheio) — não é uma variante genérica
 * de Button, é semântica de posição no breadcrumb, então o item é
 * marcado aqui mesmo.
 */
import type { BreadcrumbItem } from './types/breadcrumb.type'

defineProps<{
  items: BreadcrumbItem[]
}>()
</script>

<template>
  <nav aria-label="Breadcrumb" class="ui-breadcrumb">
    <template v-for="(item, index) in items" :key="item.label">
      <span v-if="index > 0" class="ui-breadcrumb__separator" role="presentation">/</span>
      <RouterLink v-if="item.to" class="ui-breadcrumb__link" :to="item.to">
        {{ item.label }}
      </RouterLink>
      <span v-else aria-current="page" class="ui-breadcrumb__current">{{ item.label }}</span>
    </template>
  </nav>
</template>

<style scoped lang="scss">

.ui-breadcrumb {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  font-size: $font-size-md;
}

.ui-breadcrumb__separator {
  color: $color-ink-20;
}

.ui-breadcrumb__link {
  padding: $spacing-4 $spacing-8;
  color: $color-ink-40;
  text-decoration: none;
  border-radius: $radius-8;

  &:hover {
    color: $color-ink;
    background-color: $color-ink-4;
  }
}

.ui-breadcrumb__current {
  padding: $spacing-4 $spacing-8;
  color: $color-ink;
}
</style>
