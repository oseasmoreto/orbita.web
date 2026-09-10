<script setup lang="ts">
/** Extraído de `ProductMarketplacePricingView.vue`, ver `docs/design/screens/pricing-dashboard-and-help.md`. */
import { Info, Storefront } from '@/shared/components/icons/regular.generated'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import { formatPercent } from '@/shared/services/formatNumber'

defineProps<{
  averageMargin: string
}>()

const emit = defineEmits<{
  editConnection: []
}>()
</script>

<template>
  <div class="pricing-margin-kpi-row">
    <div class="pricing-margin-kpi-row__kpis">
      <div class="pricing-margin-kpi-row__kpi">
        <p class="pricing-margin-kpi-row__kpi-label">
          {{ $t('pricing.productMarketplacePricing.kpis.averageMargin') }}
          <Tooltip :text="$t('pricing.productMarketplacePricing.kpis.averageMarginTooltip')">
            <span tabindex="0">
              <Icon :icon="Info" :size="12" style="color: var(--color-ink-40)" />
            </span>
          </Tooltip>
        </p>
        <p class="pricing-margin-kpi-row__kpi-value">
          {{ formatPercent(averageMargin, 1) }}
        </p>
      </div>
    </div>

    <Button :icon-before="Storefront" variant="outline" @click="emit('editConnection')">
      {{ $t('pricing.productMarketplacePricing.editConnectionButton') }}
    </Button>
  </div>
</template>

<style scoped lang="scss">

.pricing-margin-kpi-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-16;
  margin-top: $spacing-24;
}

.pricing-margin-kpi-row__kpis {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-40;
}

.pricing-margin-kpi-row__kpi-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
  white-space: nowrap;
}

// Achado real (`ProductMarketplacePricingView.vue`, antes desta extração):
// um ícone de tooltip dentro de um `<span tabindex="0">` no MEIO de uma
// linha de texto vira, sozinho, uma caixa de bloco (reset global
// `svg { display: block }`) — bloco dentro de inline força quebra ANTES
// dele, o ícone cairia órfão embaixo do label sem este `:deep()`.
.pricing-margin-kpi-row__kpi-label :deep(svg) {
  display: inline-block;
  vertical-align: middle;
}

.pricing-margin-kpi-row__kpi-value {
  margin-top: $spacing-4;
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}
</style>
