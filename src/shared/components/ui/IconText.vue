<script setup lang="ts">
/**
 * Extraído de `HomeView.vue` (`.showcase__cell-marketplace`) — layout
 * "elemento à esquerda + texto" repetido em 6 slots de célula diferentes
 * do `DataTable` (marketplace/assignedTo/textIcon/user/date/activity),
 * cobrindo 3 dos tipos nomeados do `COMPONENT_SET "Table Components"`
 * do Figma (User, Text-Icon/Date, Activity) — reuso real, não
 * antecipado, mesmo critério de promoção pra `shared/` já usado no
 * `IconTile.vue`/`AvatarGroup.vue`. O elemento à esquerda (`Avatar`,
 * `Icon`, `IconTile`...) vem pelo slot default — este átomo não sabe
 * qual é, só organiza o layout.
 */
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: undefined,
  },
)
</script>

<template>
  <div class="ui-icon-text">
    <slot />
    <span v-if="text">{{ text }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ui-icon-text {
  display: inline-flex;
  align-items: center;
  gap: $spacing-8;
}
</style>
