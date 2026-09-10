<script setup lang="ts">
/**
 * Visão em barra empilhada da tela de precificação — legenda + 1 barra
 * segmentada por produto. Extraído de `ProductMarketplacePricingView.vue`
 * em 2026-09-11, ver `docs/design/screens/pricing-dashboard-and-help.md`
 * (seção `ProductMarketplacePricingView` traz o histórico completo dos
 * 11 segmentos/cores — não duplicado aqui).
 */
import { useI18n } from 'vue-i18n'
import { Info, PencilSimpleLine, Storefront } from '@/shared/components/icons/regular.generated'
import Badge from '@/shared/components/ui/Badge.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import CopyablePrice from '../CopyablePrice.vue'
import { hasCampaignMarkup, outcomeTone, SEGMENT_KEYS } from '../../services/pricingBreakdown'
import {
  productMarketplaceStatusColor,
  productMarketplaceStatusLabelKey,
} from '../../types/productMarketplace.type'
import type { SegmentKey } from '../../services/pricingBreakdown'
import type { PricingDisplayRow } from '../../types/productMarketplacePricing.type'

defineProps<{
  rows: PricingDisplayRow[]
  showEmpty: boolean
}>()

const emit = defineEmits<{
  editPrice: [row: PricingDisplayRow['row']]
  editProduct: [productId: string]
  viewMarketplaces: [productId: string]
}>()

const { t } = useI18n()

function segmentLabel(key: SegmentKey): string {
  return t(`pricing.productMarketplacePricing.segments.${key}`)
}

function marginToneClass(profit: string, meetsTargetMargin?: boolean | null): string {
  return `pricing-bar-breakdown__product-margin--${outcomeTone(profit, meetsTargetMargin)}`
}
</script>

<template>
  <div>
    <div class="pricing-bar-breakdown__legend">
      <span v-for="key in SEGMENT_KEYS" :key="key" class="pricing-bar-breakdown__legend-item">
        <span
          class="pricing-bar-breakdown__legend-swatch"
          :class="`pricing-bar-breakdown__legend-swatch--${key}`"
        />
        {{ segmentLabel(key) }}
      </span>
    </div>

    <div class="pricing-bar-breakdown__products">
      <div
        v-for="{ active, row, segments } in rows"
        :key="row.id"
        class="pricing-bar-breakdown__product"
      >
        <div class="pricing-bar-breakdown__product-header">
          <div class="pricing-bar-breakdown__product-title">
            <Button
              :aria-label="$t('catalog.products.form.editTitle')"
              :icon-before="PencilSimpleLine"
              variant="ghost"
              @click="emit('editProduct', row.productId)"
            />
            <p class="pricing-bar-breakdown__product-name">{{ row.productName }}</p>
            <StatusDot :color="productMarketplaceStatusColor(row.status)">
              {{ $t(productMarketplaceStatusLabelKey(row.status)) }}
            </StatusDot>
          </div>

          <div class="pricing-bar-breakdown__product-meta">
            <div class="pricing-bar-breakdown__prices">
              <p class="pricing-bar-breakdown__product-price">
                <CopyablePrice v-if="!active.isPracticed" :value="active.price" />
                <template v-else>{{ formatMoney(active.price) }}</template>
                <span
                  :class="[
                    'pricing-bar-breakdown__product-margin',
                    marginToneClass(
                      active.profit,
                      active.isPracticed ? row.pricing.meetsTargetMargin : null,
                    ),
                  ]"
                >
                  ({{ formatPercent(active.marginPercent, 0) }})
                </span>
                <Badge size="sm" variant="gray">
                  {{
                    active.isPracticed
                      ? $t('pricing.productMarketplacePricing.practicedBadge')
                      : $t('pricing.productMarketplacePricing.suggestedBadge')
                  }}
                </Badge>
              </p>
              <p v-if="active.isPracticed" class="pricing-bar-breakdown__suggested-hint">
                {{ $t('pricing.productMarketplacePricing.suggestedPriceLabel') }}:
                <CopyablePrice :value="row.pricing.suggestedPrice" />
                <Tooltip
                  v-if="row.pricing.isApproximated"
                  :text="$t('pricing.productMarketplacePricing.isApproximatedTooltip')"
                >
                  <span tabindex="0">
                    <Icon :icon="Info" :size="12" style="color: var(--color-accent-yellow)" />
                  </span>
                </Tooltip>
              </p>
              <p
                v-if="hasCampaignMarkup(active.campaignPrice, active.price)"
                class="pricing-bar-breakdown__suggested-hint"
              >
                {{ $t('pricing.productMarketplacePricing.campaignPriceLabel') }}:
                <CopyablePrice :value="active.campaignPrice" />
                <Tooltip :text="$t('pricing.productMarketplacePricing.campaignPriceTooltip')">
                  <span tabindex="0">
                    <Icon :icon="Info" :size="12" style="color: var(--color-accent-yellow)" />
                  </span>
                </Tooltip>
              </p>
            </div>

            <Button
              :aria-label="$t('pricing.productMarketplacePricing.editPriceButton')"
              :icon-before="PencilSimpleLine"
              variant="ghost"
              @click="emit('editPrice', row)"
            />
            <Button
              :aria-label="$t('catalog.products.marketplacesButton')"
              :icon-before="Storefront"
              variant="ghost"
              @click="emit('viewMarketplaces', row.productId)"
            />
          </div>
        </div>

        <div class="pricing-bar-breakdown__bar">
          <Tooltip
            v-for="segment in segments"
            :key="segment.key"
            :text="`${segmentLabel(segment.key)}: ${formatMoney(segment.value)}`"
          >
            <span
              class="pricing-bar-breakdown__segment"
              :class="`pricing-bar-breakdown__segment--${segment.key}`"
              :style="{ flexBasis: `${segment.widthPercent}%` }"
              tabindex="0"
            >
              <span class="pricing-bar-breakdown__segment-percent">
                {{ formatPercent(segment.percent, 0) }}
              </span>
            </span>
          </Tooltip>
        </div>
      </div>

      <p v-if="showEmpty" class="pricing-bar-breakdown__empty">
        {{ $t('pricing.productMarketplacePricing.empty') }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">

.pricing-bar-breakdown__legend {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-16;
  margin-top: $spacing-24;
}

.pricing-bar-breakdown__legend-item {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.pricing-bar-breakdown__legend-swatch {
  display: inline-block;
  width: $size-12;
  height: $size-12;
  border-radius: $radius-4;
}

.pricing-bar-breakdown__empty {
  padding: $spacing-24;
  color: $color-ink-40;
  text-align: center;
}

.pricing-bar-breakdown__products {
  display: flex;
  flex-direction: column;
  gap: $spacing-12;
  margin-top: $spacing-16;
}

.pricing-bar-breakdown__product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-16;
  margin-bottom: $spacing-4;
}

.pricing-bar-breakdown__product-title {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.pricing-bar-breakdown__product-name {
  margin-bottom: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.pricing-bar-breakdown__product-meta {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.pricing-bar-breakdown__prices {
  text-align: right;
}

.pricing-bar-breakdown__product-price {
  margin-bottom: 0;
  font-size: $font-size-sm;
  color: $color-ink;
}

.pricing-bar-breakdown__product-margin--positive {
  color: $color-accent-green;
}

.pricing-bar-breakdown__product-margin--neutral {
  color: $color-accent-yellow;
}

.pricing-bar-breakdown__product-margin--negative {
  color: $color-accent-red;
}

.pricing-bar-breakdown__suggested-hint {
  margin-bottom: 0;
  font-size: $font-size-sm;
  color: $color-ink-40;
  white-space: nowrap;
}

.pricing-bar-breakdown__suggested-hint :deep(svg) {
  display: inline-block;
  vertical-align: middle;
}

.pricing-bar-breakdown__bar {
  display: flex;
  overflow: hidden;
  height: $size-16;
  border-radius: $radius-8;
}

.pricing-bar-breakdown__segment {
  position: relative;
  display: block;
  flex-shrink: 0;
  height: 100%;

  &:focus-visible {
    @include focus-ring;
  }
}

.pricing-bar-breakdown__segment-percent {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 0 $spacing-4;
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
  color: $color-paper-fixed;
  white-space: nowrap;
  background-color: color-mix(in srgb, $color-ink-fixed 55%, transparent);
  border-radius: $radius-4;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.pricing-bar-breakdown__segment--costPrice {
  background-color: color-mix(in srgb, $color-accent-orange 30%, $color-bg-2);
}

.pricing-bar-breakdown__segment--commission {
  background-color: color-mix(in srgb, $color-accent-orange 60%, $color-bg-2);
}

.pricing-bar-breakdown__segment--fixedFee {
  background-color: $color-accent-orange;
}

.pricing-bar-breakdown__segment--shippingCost {
  background-color: color-mix(in srgb, $color-accent-orange 70%, $color-accent-red);
}

.pricing-bar-breakdown__segment--operationalCost {
  background-color: color-mix(in srgb, $color-accent-orange 10%, $color-accent-red);
}

.pricing-bar-breakdown__segment--tax {
  background-color: color-mix(in srgb, $color-accent-red 70%, $color-ink);
}

.pricing-bar-breakdown__segment--ads {
  background-color: color-mix(in srgb, $color-accent-red 45%, $color-ink);
}

.pricing-bar-breakdown__segment--affiliate {
  background-color: $color-accent-purple;
}

.pricing-bar-breakdown__segment--coupon {
  background-color: $color-accent-indigo;
}

.pricing-bar-breakdown__segment--individualFixedFee {
  background-color: $color-accent-blue;
}

.pricing-bar-breakdown__segment--profit {
  background-color: $color-accent-green;
}

.pricing-bar-breakdown__legend-swatch--costPrice {
  @extend .pricing-bar-breakdown__segment--costPrice;
}

.pricing-bar-breakdown__legend-swatch--commission {
  @extend .pricing-bar-breakdown__segment--commission;
}

.pricing-bar-breakdown__legend-swatch--fixedFee {
  @extend .pricing-bar-breakdown__segment--fixedFee;
}

.pricing-bar-breakdown__legend-swatch--shippingCost {
  @extend .pricing-bar-breakdown__segment--shippingCost;
}

.pricing-bar-breakdown__legend-swatch--operationalCost {
  @extend .pricing-bar-breakdown__segment--operationalCost;
}

.pricing-bar-breakdown__legend-swatch--tax {
  @extend .pricing-bar-breakdown__segment--tax;
}

.pricing-bar-breakdown__legend-swatch--ads {
  @extend .pricing-bar-breakdown__segment--ads;
}

.pricing-bar-breakdown__legend-swatch--affiliate {
  @extend .pricing-bar-breakdown__segment--affiliate;
}

.pricing-bar-breakdown__legend-swatch--coupon {
  @extend .pricing-bar-breakdown__segment--coupon;
}

.pricing-bar-breakdown__legend-swatch--individualFixedFee {
  @extend .pricing-bar-breakdown__segment--individualFixedFee;
}

.pricing-bar-breakdown__legend-swatch--profit {
  @extend .pricing-bar-breakdown__segment--profit;
}
</style>
