<script setup lang="ts">
/**
 * Tela de precificação real por conexão (`USER_MARKETPLACE`) — orquestra
 * composables/estado e delega apresentação pros blocks abaixo. Histórico
 * completo (motivação, achados reais, decisões de layout) mora em
 * `docs/design/screens/pricing-dashboard-and-help.md`, seção
 * `ProductMarketplacePricingView` — não duplicado aqui.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { refDebounced } from '@vueuse/core'
import Button from '@/shared/components/ui/Button.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import TabBar from '@/shared/components/ui/TabBar.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { parseApiError } from '@/shared/services/parseApiError'
import PricingBarBreakdown from '../components/blocks/PricingBarBreakdown.vue'
import PricingConnectionToolbar from '../components/blocks/PricingConnectionToolbar.vue'
import PricingMarginKpiRow from '../components/blocks/PricingMarginKpiRow.vue'
import PricingTableView from '../components/blocks/PricingTableView.vue'
import UpdatePracticedPriceModal from '../components/UpdatePracticedPriceModal.vue'
import { useMarketplaceConnections } from '../composables/useMarketplaceConnections'
import { useProductMarketplacePricingList } from '../composables/useProductMarketplacePricingList'
import {
  buildPriceSegments,
  computeMarginPercent,
  resolveActivePricing,
  SEGMENT_KEYS,
} from '../services/pricingBreakdown'
import type { SegmentKey } from '../services/pricingBreakdown'
import type {
  PricingTableRow,
  PricingTableSegmentCell,
  PricingViewMode,
  ProductMarketplacePricing,
} from '../types/productMarketplacePricing.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { TabBarOption } from '@/shared/components/ui/types/tabBar.type'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const activeConnectionId = ref((route.params.userMarketplaceId as string) ?? '')

const connections = useMarketplaceConnections()

const list = useProductMarketplacePricingList(activeConnectionId)

const searchInput = ref('')
const debouncedSearchInput = refDebounced(searchInput, 300)

watch(debouncedSearchInput, (value) => {
  void list.setSearch(value)
})

const marketplaceTabs = computed<TabBarOption[]>(() =>
  connections.cards.value.flatMap((card) =>
    card.connection?.active ? [{ key: card.connection.id, label: card.marketplace.name }] : [],
  ),
)

onMounted(async () => {
  await connections.refresh()

  const availableIds = new Set(marketplaceTabs.value.map((tab) => tab.key))

  if (!availableIds.has(activeConnectionId.value)) {
    const fallback = marketplaceTabs.value[0]?.key ?? ''
    activeConnectionId.value = fallback

    if (fallback) {
      void router.replace({ name: 'marketplace-pricing', params: { userMarketplaceId: fallback } })
    }
  }

  if (activeConnectionId.value) {
    await list.refresh()
  }
})

watch(activeConnectionId, (id, previousId) => {
  if (!id || id === previousId) {
    return
  }

  void router.replace({ name: 'marketplace-pricing', params: { userMarketplaceId: id } })
  list.reset()
  void list.refresh()
})

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const displayRows = computed(() =>
  list.items.value.map((row) => {
    const { pricing } = row

    if (pricing === null) {
      return { active: null, row, segments: [] }
    }

    const active = resolveActivePricing({ ...row, pricing })
    return { active, row, segments: buildPriceSegments(active.breakdown) }
  }),
)

function segmentLabel(key: SegmentKey): string {
  return t(`pricing.productMarketplacePricing.segments.${key}`)
}

function goToProductEdit(productId: string): void {
  void router.push({ name: 'products-edit', params: { id: productId } })
}

function goToProductMarketplaces(productId: string): void {
  void router.push({ name: 'product-marketplaces', params: { id: productId } })
}

function goToMarketplaceConnection(): void {
  void router.push({ name: 'marketplaces' })
}

const isEditModalOpen = ref(false)
const editingRow = ref<ProductMarketplacePricing | null>(null)

function openEditModal(row: ProductMarketplacePricing): void {
  editingRow.value = row
  isEditModalOpen.value = true
}

function handleSaved(): void {
  void list.refresh()
}

const viewMode = ref<PricingViewMode>('table')

/**
 * Linha-placeholder pra vínculo com `pricingUnavailableReason` — os
 * campos monetários/booleanos abaixo nunca são lidos de verdade
 * (`PricingTableView.vue` sempre checa `pricingUnavailableReason` antes
 * de renderizar qualquer célula numérica), só existem pra satisfazer o
 * tipo `PricingTableRow`.
 */
function buildUnavailableTableRow(row: ProductMarketplacePricing): PricingTableRow {
  const emptySegments = Object.fromEntries(
    SEGMENT_KEYS.map((key) => [key, { percent: '0.00', value: '0.00' }]),
  ) as Record<SegmentKey, PricingTableSegmentCell>

  return {
    id: row.id,
    isApproximated: false,
    meetsTargetMargin: null,
    practicedCampaignPrice: null,
    practicedMarginPercent: null,
    practicedPrice: null,
    practicedProfit: null,
    pricingUnavailableReason: row.pricingUnavailableReason,
    productId: row.productId,
    productName: row.productName,
    source: row,
    status: row.status,
    suggestedCampaignPrice: '0.00',
    suggestedMarginPercent: 0,
    suggestedPrice: '0.00',
    suggestedProfit: '0.00',
    ...emptySegments,
  }
}

const tableRows = computed<PricingTableRow[]>(() =>
  displayRows.value.map(({ row, segments }) => {
    const { pricing } = row

    if (pricing === null) {
      return buildUnavailableTableRow(row)
    }

    const segmentValues = Object.fromEntries(
      segments.map((segment) => [segment.key, { percent: segment.percent, value: segment.value }]),
    ) as Record<SegmentKey, PricingTableSegmentCell>
    const hasPracticedPrice = row.practicedPrice !== null && pricing.practicedProfit !== null

    return {
      id: row.id,
      isApproximated: pricing.isApproximated,
      meetsTargetMargin: hasPracticedPrice ? pricing.meetsTargetMargin : null,
      practicedCampaignPrice: hasPracticedPrice ? pricing.practicedCampaignPrice : null,
      practicedMarginPercent: hasPracticedPrice
        ? Number(pricing.practicedMarginPercentage ?? '0')
        : null,
      practicedPrice: hasPracticedPrice ? row.practicedPrice : null,
      practicedProfit: hasPracticedPrice ? pricing.practicedProfit : null,
      pricingUnavailableReason: null,
      productId: row.productId,
      productName: row.productName,
      source: row,
      status: row.status,
      suggestedCampaignPrice: pricing.suggestedCampaignPrice,
      suggestedMarginPercent: computeMarginPercent(pricing.suggestedProfit, pricing.suggestedPrice),
      suggestedPrice: pricing.suggestedPrice,
      suggestedProfit: pricing.suggestedProfit,
      ...segmentValues,
    }
  }),
)

const tableColumns = computed<DataTableColumn[]>(() => [
  {
    key: 'productName',
    sticky: true,
    title: t('pricing.productMarketplacePricing.table.columns.product'),
  },
  {
    key: 'status',
    sticky: true,
    title: t('pricing.productMarketplacePricing.table.columns.status'),
  },
  ...SEGMENT_KEYS.map((key) => ({ align: 'right' as const, key, title: segmentLabel(key) })),
  {
    align: 'right',
    key: 'practicedPrice',
    title: t('pricing.productMarketplacePricing.table.columns.practicedPrice'),
  },
  {
    align: 'right',
    key: 'suggestedPrice',
    title: t('pricing.productMarketplacePricing.table.columns.suggestedPrice'),
  },
])
</script>

<template>
  <div class="product-marketplace-pricing-view">

    <h1 class="product-marketplace-pricing-view__title">
      {{ $t('pricing.productMarketplacePricing.title') }}
    </h1>

    <div
      v-if="!connections.isLoading.value && connections.connectedCount.value === 0"
      class="product-marketplace-pricing-view__empty-state"
    >
      <p class="product-marketplace-pricing-view__hint">
        {{ $t('pricing.productMarketplacePricing.noConnectionsHint') }}
      </p>
      <Button variant="outline" @click="router.push({ name: 'marketplaces' })">
        {{ $t('pricing.productMarketplacePricing.noConnectionsCta') }}
      </Button>
    </div>

    <p
      v-else-if="connections.connectedCount.value > 0 && marketplaceTabs.length === 0"
      class="product-marketplace-pricing-view__hint"
    >
      {{ $t('pricing.productMarketplacePricing.noActiveConnectionsHint') }}
    </p>

    <TabBar v-else v-model="activeConnectionId" :tabs="marketplaceTabs">
      <PricingConnectionToolbar v-model:search="searchInput" v-model:view-mode="viewMode" />

      <PricingMarginKpiRow
        :average-margin="list.totals.value.averageMargin"
        @edit-connection="goToMarketplaceConnection"
      />

      <p v-if="listErrorMessage" class="product-marketplace-pricing-view__error" role="alert">
        {{ listErrorMessage }}
      </p>

      <PricingBarBreakdown
        v-if="viewMode === 'bar'"
        :rows="displayRows"
        :show-empty="displayRows.length === 0 && !listErrorMessage"
        @edit-price="openEditModal"
        @edit-product="goToProductEdit"
        @view-marketplaces="goToProductMarketplaces"
      />

      <PricingTableView
        v-else
        :columns="tableColumns"
        :rows="tableRows"
        @edit-price="openEditModal"
        @edit-product="goToProductEdit"
        @view-marketplaces="goToProductMarketplaces"
      />

      <PaginationNav
        :current-page="list.currentPage.value"
        :total-pages="list.totalPages.value"
        @update:current-page="(page) => list.setPage(page)"
      />
    </TabBar>

    <UpdatePracticedPriceModal
      v-model="isEditModalOpen"
      :label="editingRow?.productName"
      :row="editingRow"
      @saved="handleSaved"
    />
  </div>
</template>

<style scoped lang="scss">

.product-marketplace-pricing-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.product-marketplace-pricing-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.product-marketplace-pricing-view__hint {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.product-marketplace-pricing-view__empty-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $spacing-16;
  padding: $spacing-24;
  text-align: left;
  background-color: $color-bg-2;
  border-radius: $radius-16;
}

.product-marketplace-pricing-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
