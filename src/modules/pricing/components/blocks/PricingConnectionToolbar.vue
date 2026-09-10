<script setup lang="ts">
/**
 * Busca por nome + alternância barra/tabela da tela de precificação por
 * conexão. Extraído de `ProductMarketplacePricingView.vue` em
 * 2026-09-11 (componentização pedida direto pelo usuário — arquivo
 * único tinha passado de 1000 linhas). Ver
 * `docs/design/screens/pricing-dashboard-and-help.md`, seção
 * `ProductMarketplacePricingView`, pro histórico completo de decisão.
 */
import { ChartBar, Table as TableIcon } from '@/shared/components/icons/regular.generated'
import Button from '@/shared/components/ui/Button.vue'
import Search from '@/shared/components/ui/Search.vue'
import type { PricingViewMode } from '../../types/productMarketplacePricing.type'

defineProps<{
  viewMode: PricingViewMode
}>()

const search = defineModel<string>('search', { required: true })

const emit = defineEmits<{
  'update:viewMode': [mode: PricingViewMode]
}>()
</script>

<template>
  <div class="pricing-connection-toolbar">
    <Search
      v-model="search"
      class="pricing-connection-toolbar__search"
      :placeholder="$t('pricing.productMarketplacePricing.searchPlaceholder')"
    />

    <div
      :aria-label="$t('pricing.productMarketplacePricing.viewToggleLabel')"
      class="pricing-connection-toolbar__view-toggle"
      role="group"
    >
      <Button
        :aria-label="$t('pricing.productMarketplacePricing.viewModes.bar')"
        :icon-before="ChartBar"
        :variant="viewMode === 'bar' ? 'secondary' : 'ghost'"
        @click="emit('update:viewMode', 'bar')"
      />
      <Button
        :aria-label="$t('pricing.productMarketplacePricing.viewModes.table')"
        :icon-before="TableIcon"
        :variant="viewMode === 'table' ? 'secondary' : 'ghost'"
        @click="emit('update:viewMode', 'table')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">

.pricing-connection-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-16;
  margin-top: $spacing-16;
}

.pricing-connection-toolbar__search {
  width: 100%;
  max-width: 320px;
}

.pricing-connection-toolbar__view-toggle {
  display: flex;
  flex-shrink: 0;
  gap: $spacing-4;
  padding: $spacing-4;
  background-color: $color-ink-4;
  border-radius: $radius-8;
}
</style>
