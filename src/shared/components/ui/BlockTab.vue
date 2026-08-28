<script setup lang="ts">
/**
 * Grounded no padrão "BlockTab" do frame "Tabs" do Figma — rótulos
 * clicáveis (ex.: "Total Users"/"Total Projects") sem sublinhado nem
 * painel de conteúdo trocando via `role=tab`, diferente do `TabBar.vue`
 * (que cobre o padrão "TopTab", navegação real). Descartado como "fora
 * de escopo" na Tier 8 por não ter caso de uso real — só que o próprio
 * `ChartCard.vue` já usava exatamente esse padrão pro seletor de métrica
 * do cabeçalho (`metrics`), com markup/CSS duplicado ali dentro. Extraído
 * daqui pra `shared/` a pedido do usuário em 2026-08-28, com
 * `ChartCard.vue` migrado pra consumir o átomo em vez do próprio markup.
 *
 * Não é `TabsRoot` da Reka UI de propósito — não existe painel de
 * conteúdo real alternando via ARIA `role=tab`/`aria-selected`, é só
 * "qual opção está ativa agora" (ex.: qual métrica alimenta o mesmo
 * gráfico). Usar o primitivo de tabs aqui seria simular semântica de
 * navegação que não existe.
 */
import type { BlockTabOption } from './types/blockTab.type'

defineProps<{
  options: BlockTabOption[]
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="ui-block-tab">
    <button
      v-for="option in options"
      :key="option.key"
      :class="['ui-block-tab__item', { 'ui-block-tab__item--active': option.key === model }]"
      type="button"
      @click="model = option.key"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.ui-block-tab {
  display: flex;
  align-items: center;
  gap: $spacing-16;
}

.ui-block-tab__item {
  padding: 0;
  font-size: $font-size-md;
  color: $color-ink-40;
  cursor: pointer;
  background: none;
  border: none;

  &:focus-visible {
    @include focus-ring;
  }
}

.ui-block-tab__item--active {
  font-weight: $font-weight-semibold;
  color: $color-ink;
}
</style>
