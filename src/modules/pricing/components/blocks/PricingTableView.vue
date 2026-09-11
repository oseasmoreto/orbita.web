<script setup lang="ts">
/**
 * Visão em tabela da tela de precificação — 1 linha por produto, parcelas
 * do breakdown como colunas. Extraído de `ProductMarketplacePricingView.vue`
 * em 2026-09-11, ver `docs/design/screens/pricing-dashboard-and-help.md`.
 *
 * O botão "editar preço" continua visível mesmo numa linha com
 * `pricingUnavailableReason` (célula `practicedPrice`) — é o caminho pra
 * resolver `category_required` (o `UpdatePracticedPriceModal.vue` que
 * ele abre ganha o `Select` de categoria via `categoryOptions`,
 * `ProductMarketplacePricingView.vue`), não só pra editar um preço que
 * ainda não existe.
 */
import { Info, PencilSimpleLine, Storefront } from '@/shared/components/icons/regular.generated'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Button from '@/shared/components/ui/Button.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import CopyablePrice from '../CopyablePrice.vue'
import { hasCampaignMarkup, outcomeTone, SEGMENT_KEYS } from '../../services/pricingBreakdown'
import {
  productMarketplaceStatusColor,
  productMarketplaceStatusLabelKey,
} from '../../types/productMarketplace.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type {
  PricingTableRow,
  PricingTableSegmentCell,
  PricingUnavailableReason,
} from '../../types/productMarketplacePricing.type'

defineProps<{
  columns: DataTableColumn[]
  rows: PricingTableRow[]
}>()

const emit = defineEmits<{
  editPrice: [row: PricingTableRow['source']]
  editProduct: [productId: string]
  viewMarketplaces: [productId: string]
}>()

function marginToneClass(profit: string, meetsTargetMargin?: boolean | null): string {
  return `pricing-table-view__product-margin--${outcomeTone(profit, meetsTargetMargin)}`
}

/** Mirror de `unavailableReasonLabel` (`PricingBarBreakdown.vue`). */
const UNAVAILABLE_REASON_KEY: Record<PricingUnavailableReason, string> = {
  category_required: 'pricing.productMarketplacePricing.pricingUnavailable.categoryRequired',
  weight_and_dimensions_required:
    'pricing.productMarketplacePricing.pricingUnavailable.weightAndDimensionsRequired',
}

function unavailableReasonKey(reason: PricingUnavailableReason | null): string {
  return reason
    ? UNAVAILABLE_REASON_KEY[reason]
    : 'pricing.productMarketplacePricing.pricingUnavailable.categoryRequired'
}
</script>

<template>
  <DataTable :columns="columns" :rows="rows" row-key="id">
    <template #cell-productName="{ row }">
      <div class="pricing-table-view__table-product">
        <Button
          :aria-label="$t('catalog.products.form.editTitle')"
          :icon-before="PencilSimpleLine"
          variant="ghost"
          @click="emit('editProduct', row.productId)"
        />
        <span>{{ row.productName }}</span>
      </div>
    </template>

    <template #cell-status="{ row }">
      <StatusDot :color="productMarketplaceStatusColor(row.status)">
        {{ $t(productMarketplaceStatusLabelKey(row.status)) }}
      </StatusDot>
      <p
        v-if="row.pricingUnavailableReason"
        class="pricing-table-view__unavailable"
      >
        {{ $t(unavailableReasonKey(row.pricingUnavailableReason)) }}
      </p>
    </template>

    <template v-for="key in SEGMENT_KEYS" :key="key" #[`cell-${key}`]="{ row, value }">
      <template v-if="row.pricingUnavailableReason">—</template>
      <template v-else>
        {{ formatMoney((value as PricingTableSegmentCell).value) }}
        <span class="pricing-table-view__table-segment-percent">
          ({{ formatPercent((value as PricingTableSegmentCell).percent, 1) }})
        </span>
      </template>
    </template>

    <template #cell-practicedPrice="{ row }">
      <div v-if="row.pricingUnavailableReason" class="pricing-table-view__table-price">
        <p class="pricing-table-view__suggested-hint">—</p>
        <Button
          :aria-label="$t('pricing.productMarketplacePricing.editPriceButton')"
          :icon-before="PencilSimpleLine"
          variant="ghost"
          @click="emit('editPrice', row.source)"
        />
      </div>
      <div v-else class="pricing-table-view__table-price">
        <p v-if="row.practicedPrice === null" class="pricing-table-view__suggested-hint">—</p>
        <div v-else class="pricing-table-view__prices">
          <p class="pricing-table-view__product-price">
            {{ formatMoney(row.practicedPrice) }}
            <span
              :class="[
                'pricing-table-view__product-margin',
                marginToneClass(row.practicedProfit as string, row.meetsTargetMargin),
              ]"
            >
              ({{ formatPercent(row.practicedMarginPercent as number, 0) }})
            </span>
          </p>
          <p
            v-if="hasCampaignMarkup(row.practicedCampaignPrice, row.practicedPrice)"
            class="pricing-table-view__suggested-hint"
          >
            {{ $t('pricing.productMarketplacePricing.campaignPriceLabel') }}:
            <CopyablePrice :value="row.practicedCampaignPrice" />
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
          @click="emit('editPrice', row.source)"
        />
      </div>
    </template>

    <template #cell-suggestedPrice="{ row }">
      <div v-if="row.pricingUnavailableReason" class="pricing-table-view__table-price">
        <p class="pricing-table-view__suggested-hint">—</p>
        <Button
          :aria-label="$t('catalog.products.marketplacesButton')"
          :icon-before="Storefront"
          variant="ghost"
          @click="emit('viewMarketplaces', row.productId)"
        />
      </div>
      <div v-else class="pricing-table-view__table-price">
        <div class="pricing-table-view__prices">
          <p class="pricing-table-view__product-price">
            <CopyablePrice :value="row.suggestedPrice" />
            <span
              :class="[
                'pricing-table-view__product-margin',
                marginToneClass(row.suggestedProfit),
              ]"
            >
              ({{ formatPercent(row.suggestedMarginPercent, 0) }})
            </span>
            <Tooltip
              v-if="row.isApproximated"
              :text="$t('pricing.productMarketplacePricing.isApproximatedTooltip')"
            >
              <span tabindex="0">
                <Icon :icon="Info" :size="12" style="color: var(--color-accent-yellow)" />
              </span>
            </Tooltip>
          </p>
          <p
            v-if="hasCampaignMarkup(row.suggestedCampaignPrice, row.suggestedPrice)"
            class="pricing-table-view__suggested-hint"
          >
            {{ $t('pricing.productMarketplacePricing.campaignPriceLabel') }}:
            <CopyablePrice :value="row.suggestedCampaignPrice" />
            <Tooltip :text="$t('pricing.productMarketplacePricing.campaignPriceTooltip')">
              <span tabindex="0">
                <Icon :icon="Info" :size="12" style="color: var(--color-accent-yellow)" />
              </span>
            </Tooltip>
          </p>
        </div>
        <Button
          :aria-label="$t('catalog.products.marketplacesButton')"
          :icon-before="Storefront"
          variant="ghost"
          @click="emit('viewMarketplaces', row.productId)"
        />
      </div>
    </template>

    <template #empty>
      {{ $t('pricing.productMarketplacePricing.empty') }}
    </template>
  </DataTable>
</template>

<style scoped lang="scss">

.pricing-table-view__table-product,
.pricing-table-view__table-price {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-4;
  white-space: nowrap;
}

.pricing-table-view__prices {
  text-align: right;
}

.pricing-table-view__product-price {
  margin-bottom: 0;
  font-size: $font-size-sm;
  color: $color-ink;
}

.pricing-table-view__product-margin--positive {
  color: $color-accent-green;
}

.pricing-table-view__product-margin--neutral {
  color: $color-accent-yellow;
}

.pricing-table-view__product-margin--negative {
  color: $color-accent-red;
}

.pricing-table-view__suggested-hint {
  margin-bottom: 0;
  font-size: $font-size-sm;
  color: $color-ink-40;
  white-space: nowrap;
}

.pricing-table-view__table-segment-percent {
  color: $color-ink-40;
}

.pricing-table-view__unavailable {
  margin-bottom: 0;
  font-size: $font-size-2xs;
  color: $color-accent-yellow;
  white-space: normal;
}
</style>
