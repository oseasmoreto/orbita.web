<script setup lang="ts">
/**
 * Tela de precificação real (tarefa 76, backend) — dado um
 * `USER_MARKETPLACE` (a conexão, ex.: a conta Shopee do usuário), lista
 * todos os `PRODUCT_MARKETPLACE` vinculados já com o cálculo pronto
 * (`ProductMarketplacePricingCalculator`, motor real informado pela
 * planilha do usuário).
 *
 * **Reaproveita o visual do rascunho mockado** (`shared/views/PricingDashboardMockupView.vue`)
 * — barra empilhada por produto + alternância barra/tabela + copiar
 * preço + abas por marketplace + KPIs + botão de editar vínculo — pedido
 * direto do usuário, 2026-09-03 ("temos uma tela linda de precificação a
 * do mockup, pq vc nao usou ela?").
 *
 * **Correção real, mesmo dia** — a 1ª versão desta reescrita (mesmo
 * pedido) só trouxe a barra/tabela/copiar, sem abas/KPIs/busca/botão de
 * vínculo — comparado lado a lado pelo usuário com o mockup, apontado
 * como "não pixel perfect, falta informação". Causa: o mockup simulava 3
 * marketplaces com dado 100% client-side (sem paginação de verdade),
 * então abas/KPIs/busca eram triviais de calcular na hora; a API real
 * pagina server-side (15 por página) e só tem UMA conexão por request —
 * abas exigem trocar de conexão SEM sair da página (novo:
 * `useProductMarketplacePricingList` aceita `Ref<string>`, não `string`,
 * pra refazer a busca ao trocar de aba sem recriar o composable), e
 * `Faturamento total`/`Lucro total`/`Margem média`/busca por nome
 * exigiam campo novo no backend (`filter[product_name]` +
 * `meta.totals`, calculados sobre TODO o conjunto filtrado da conexão,
 * não só a página atual — um total calculado só sobre 15 itens seria
 * enganoso) — pedidos no mesmo dia, atendidos em minutos.
 *
 * Diferenças reais pro mockup (não é reuso 1:1 de markup):
 * - Abas usam as CONEXÕES ATIVAS de verdade do usuário
 *   (`useMarketplaceConnections`), não 3 marketplaces fake fixos — pode
 *   ser 1, pode ser 5, depende de quantos o usuário conectou.
 * - 10 segmentos reais (`SEGMENT_KEYS`, `pricingBreakdown.ts`) — sem
 *   "Comissão campanha" do mockup (8 segmentos especulados):
 *   `USER_MARKETPLACE.campaignDiscountPercentage` não entra na fórmula
 *   real (confirmado com o backend), nunca existiu de verdade aqui.
 *   `coupon` (`USER_MARKETPLACE.couponValue`, valor FIXO em R$, não
 *   percentual, 2026-09-04) entrou como 8ª parcela de dedução;
 *   `individualFixedFee` (`MARKETPLACE.individualFixedFee`, "taxa fixa
 *   pra PF", mesmo dia, tarefa 90) entrou como 9ª — só diferente de 0
 *   quando a conexão é PF (`storeDocumentType: 'individual'`).
 * - Cada produto tem DOIS preços agora (praticado E sugerido, não um
 *   `salePrice` só) — `resolveActivePricing()` decide qual vira a barra
 *   principal (praticado quando existe, senão sugerido), com um Badge
 *   "Sugerido" quando ainda não há preço praticado e uma dica secundária
 *   com o preço sugerido (+ copiar) quando o praticado é o principal.
 *   Os KPIs de faturamento/lucro somam esse mesmo preço "ativo" por
 *   produto — mesmo critério, aplicado pelo backend no agregado.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLineLeft,
  ChartBar,
  Info,
  PencilSimpleLine,
  Storefront,
  Table as TableIcon,
} from '@/shared/components/icons/regular.generated'
import { refDebounced } from '@vueuse/core'
import Badge from '@/shared/components/ui/Badge.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Search from '@/shared/components/ui/Search.vue'
import TabBar from '@/shared/components/ui/TabBar.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import CopyablePrice from '../components/CopyablePrice.vue'
import UpdatePracticedPriceModal from '../components/UpdatePracticedPriceModal.vue'
import { useMarketplaceConnections } from '../composables/useMarketplaceConnections'
import { useProductMarketplacePricingList } from '../composables/useProductMarketplacePricingList'
import {
  buildPriceSegments,
  computeMarginPercent,
  hasCampaignMarkup,
  outcomeTone,
  resolveActivePricing,
  SEGMENT_KEYS,
} from '../services/pricingBreakdown'
import type { PriceSegment, SegmentKey } from '../services/pricingBreakdown'
import type { ProductMarketplacePricing } from '../types/productMarketplacePricing.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { TabBarOption } from '@/shared/components/ui/types/tabBar.type'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const activeConnectionId = ref((route.params.userMarketplaceId as string) ?? '')

const connections = useMarketplaceConnections()

const list = useProductMarketplacePricingList(activeConnectionId)

// Debounced (300ms, `@vueuse/core` — seção 4 de
// `docs/infra/convencoes-frontend-infra.md`, VueUse antes de escrever
// debounce próprio), mesmo padrão de `useProductList.ts`. Compartilhado
// entre abas de propósito (não resetado ao trocar de conexão) — mesmo
// comportamento já documentado no mockup original
// (`PricingDashboardMockupView.vue`): buscar "tênis" e trocar de
// marketplace deveria continuar filtrando por "tênis" na loja nova, útil
// pra comparar o mesmo produto entre canais.
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

  // Rota com um id que não está mais entre as conexões ativas (link
  // salvo, conexão desconectada/pausada depois) — cai pra primeira
  // conexão ativa disponível, com `replace` pra não sujar o histórico.
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
  void list.refresh()
})

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

/**
 * Pré-computa `active`/`segments` por linha UMA vez (não dentro do
 * template, que chamaria `resolveActivePricing`/`buildPriceSegments` de
 * novo a cada leitura de propriedade) — mesmo motivo de qualquer
 * `computed` que evita recomputar função pura repetidamente num loop de
 * template grande.
 */
const displayRows = computed(() =>
  list.items.value.map((row) => {
    const active = resolveActivePricing(row)
    return { active, row, segments: buildPriceSegments(active.breakdown) }
  }),
)

function segmentLabel(key: SegmentKey): string {
  return t(`pricing.productMarketplacePricing.segments.${key}`)
}

/**
 * Classe de cor da margem — verde (lucro E bate a meta) / amarelo
 * (prejuízo zero, ou lucro que não bate a `target_margin` do produto) /
 * vermelho (prejuízo), ver `outcomeTone`. `meetsTargetMargin` só faz
 * sentido pro preço PRATICADO — chamadores do preço sugerido não
 * passam o 2º argumento.
 */
function marginToneClass(profit: string, meetsTargetMargin?: boolean | null): string {
  return `product-marketplace-pricing-view__product-margin--${outcomeTone(profit, meetsTargetMargin)}`
}

function goToProductEdit(productId: string): void {
  void router.push({ name: 'products-edit', params: { id: productId } })
}

function goToProductMarketplaces(productId: string): void {
  void router.push({ name: 'product-marketplaces', params: { id: productId } })
}

/**
 * Sem rota própria pra abrir o modal de edição de uma conexão específica
 * direto (`ConnectMarketplaceModal.vue` só abre a partir do card em
 * `MarketplacesView.vue`) — mesma limitação já documentada no mockup
 * original, navega pra lá.
 */
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

function goBackToConnections(): void {
  void router.push({ name: 'marketplaces' })
}

type ViewMode = 'bar' | 'table'
const viewMode = ref<ViewMode>('bar')

/**
 * Praticado e sugerido viram COLUNAS separadas na visão de tabela (pedido
 * direto do usuário, 2026-09-03) — diferente da barra, que só mostra o
 * preço "ativo" (praticado quando existe, senão sugerido). Aqui os dois
 * ficam sempre visíveis lado a lado, então a linha carrega os dois
 * conjuntos de dado (margem/lucro) em vez de só o resolvido por
 * `resolveActivePricing`. `practicedPrice`/`practicedMarginPercent`/
 * `practicedProfit` ficam `null` juntos quando ainda não há preço
 * praticado — os 3 sempre nascem/faltam em conjunto.
 */
/**
 * Cada coluna de parcela carrega valor + % (2026-09-04, pedido direto do
 * usuário — mesma % agora exposta pelo backend, `PriceSegment.percent`,
 * `pricingBreakdown.ts`), não mais só a string de dinheiro — a célula
 * (`#[cell-${key}]` abaixo) mostra os dois juntos, mesmo par
 * `money (percent%)` já usado no preço principal desta view.
 */
type SegmentCell = Pick<PriceSegment, 'percent' | 'value'>

type PricingTableRow = {
  id: string
  isApproximated: boolean
  meetsTargetMargin: boolean | null
  practicedCampaignPrice: string | null
  practicedMarginPercent: number | null
  practicedPrice: string | null
  practicedProfit: string | null
  productId: string
  productName: string
  source: ProductMarketplacePricing
  suggestedCampaignPrice: string
  suggestedMarginPercent: number
  suggestedPrice: string
  suggestedProfit: string
} & Record<SegmentKey, SegmentCell>

const tableRows = computed<PricingTableRow[]>(() =>
  displayRows.value.map(({ row, segments }) => {
    const segmentValues = Object.fromEntries(
      segments.map((segment) => [segment.key, { percent: segment.percent, value: segment.value }]),
    ) as Record<SegmentKey, SegmentCell>
    const { pricing } = row
    // Achado real, 2026-09-04 (mesmo motivo de `resolveActivePricing`,
    // `pricingBreakdown.ts`) — `practicedCampaignPrice` NÃO entra mais
    // nesta checagem: o backend manda `null` de propósito quando o
    // preço praticado não bate a meta, e isso não significa "não existe
    // preço praticado". Só `practicedPrice`/`practicedProfit` (que o
    // backend sempre manda juntos) decidem.
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
      productId: row.productId,
      productName: row.productName,
      source: row,
      suggestedCampaignPrice: pricing.suggestedCampaignPrice,
      suggestedMarginPercent: computeMarginPercent(pricing.suggestedProfit, pricing.suggestedPrice),
      suggestedPrice: pricing.suggestedPrice,
      suggestedProfit: pricing.suggestedProfit,
      ...segmentValues,
    }
  }),
)

// `align: 'right'` em toda coluna numérica (pedido direto do usuário,
// 2026-09-04) — as 10 parcelas do breakdown + os 2 preços finais, nunca
// `productName` (texto).
const tableColumns = computed<DataTableColumn[]>(() => [
  { key: 'productName', title: t('pricing.productMarketplacePricing.table.columns.product') },
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
    <Button
      class="product-marketplace-pricing-view__back"
      :icon-before="ArrowLineLeft"
      variant="ghost"
      @click="goBackToConnections"
    >
      {{ $t('pricing.productMarketplacePricing.backToConnections') }}
    </Button>

    <h1 class="product-marketplace-pricing-view__title">
      {{ $t('pricing.productMarketplacePricing.title') }}
    </h1>

    <p
      v-if="connections.cards.value.length > 0 && marketplaceTabs.length === 0"
      class="product-marketplace-pricing-view__hint"
    >
      {{ $t('pricing.productMarketplacePricing.noActiveConnectionsHint') }}
    </p>

    <TabBar v-else v-model="activeConnectionId" :tabs="marketplaceTabs">
      <div class="product-marketplace-pricing-view__search-row">
        <Search
          v-model="searchInput"
          class="product-marketplace-pricing-view__search"
          :placeholder="$t('pricing.productMarketplacePricing.searchPlaceholder')"
        />

        <div
          :aria-label="$t('pricing.productMarketplacePricing.viewToggleLabel')"
          class="product-marketplace-pricing-view__view-toggle"
          role="group"
        >
          <Button
            :aria-label="$t('pricing.productMarketplacePricing.viewModes.bar')"
            :icon-before="ChartBar"
            :variant="viewMode === 'bar' ? 'secondary' : 'ghost'"
            @click="viewMode = 'bar'"
          />
          <Button
            :aria-label="$t('pricing.productMarketplacePricing.viewModes.table')"
            :icon-before="TableIcon"
            :variant="viewMode === 'table' ? 'secondary' : 'ghost'"
            @click="viewMode = 'table'"
          />
        </div>
      </div>

      <div class="product-marketplace-pricing-view__kpi-row">
        <div class="product-marketplace-pricing-view__kpis">
          <div class="product-marketplace-pricing-view__kpi">
            <p class="product-marketplace-pricing-view__kpi-label">
              {{ $t('pricing.productMarketplacePricing.kpis.totalRevenue') }}
            </p>
            <p class="product-marketplace-pricing-view__kpi-value">
              {{ formatMoney(list.totals.value.revenue) }}
            </p>
          </div>
          <div class="product-marketplace-pricing-view__kpi">
            <p class="product-marketplace-pricing-view__kpi-label">
              {{ $t('pricing.productMarketplacePricing.kpis.totalProfit') }}
            </p>
            <p
              :class="[
                'product-marketplace-pricing-view__kpi-value',
                `product-marketplace-pricing-view__kpi-value--${outcomeTone(list.totals.value.profit)}`,
              ]"
            >
              {{ formatMoney(list.totals.value.profit) }}
            </p>
          </div>
          <div class="product-marketplace-pricing-view__kpi">
            <p class="product-marketplace-pricing-view__kpi-label">
              {{ $t('pricing.productMarketplacePricing.kpis.averageMargin') }}
            </p>
            <p class="product-marketplace-pricing-view__kpi-value">
              {{ formatPercent(list.totals.value.averageMargin, 1) }}
            </p>
          </div>
          <div class="product-marketplace-pricing-view__kpi">
            <p class="product-marketplace-pricing-view__kpi-label">
              {{ $t('pricing.productMarketplacePricing.kpis.productCount') }}
            </p>
            <p class="product-marketplace-pricing-view__kpi-value">
              {{ list.totals.value.productCount }}
            </p>
          </div>
        </div>

        <Button :icon-before="Storefront" variant="outline" @click="goToMarketplaceConnection">
          {{ $t('pricing.productMarketplacePricing.editConnectionButton') }}
        </Button>
      </div>

      <p v-if="listErrorMessage" class="product-marketplace-pricing-view__error" role="alert">
        {{ listErrorMessage }}
      </p>

      <template v-if="viewMode === 'bar'">
        <div class="product-marketplace-pricing-view__legend">
          <span
            v-for="key in SEGMENT_KEYS"
            :key="key"
            class="product-marketplace-pricing-view__legend-item"
          >
            <span
              class="product-marketplace-pricing-view__legend-swatch"
              :class="`product-marketplace-pricing-view__legend-swatch--${key}`"
            />
            {{ segmentLabel(key) }}
          </span>
        </div>

        <div class="product-marketplace-pricing-view__products">
          <div
            v-for="{ active, row, segments } in displayRows"
            :key="row.id"
            class="product-marketplace-pricing-view__product"
          >
            <div class="product-marketplace-pricing-view__product-header">
              <div class="product-marketplace-pricing-view__product-title">
                <Button
                  :aria-label="$t('catalog.products.form.editTitle')"
                  :icon-before="PencilSimpleLine"
                  variant="ghost"
                  @click="goToProductEdit(row.productId)"
                />
                <p class="product-marketplace-pricing-view__product-name">{{ row.productName }}</p>
              </div>

              <div class="product-marketplace-pricing-view__product-meta">
                <div class="product-marketplace-pricing-view__prices">
                  <p class="product-marketplace-pricing-view__product-price">
                    <CopyablePrice v-if="!active.isPracticed" :value="active.price" />
                    <template v-else>{{ formatMoney(active.price) }}</template>
                    <span
                      :class="[
                        'product-marketplace-pricing-view__product-margin',
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
                  <p
                    v-if="active.isPracticed"
                    class="product-marketplace-pricing-view__suggested-hint"
                  >
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
                    class="product-marketplace-pricing-view__suggested-hint"
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
                  @click="openEditModal(row)"
                />
                <Button
                  :aria-label="$t('catalog.products.marketplacesButton')"
                  :icon-before="Storefront"
                  variant="ghost"
                  @click="goToProductMarketplaces(row.productId)"
                />
              </div>
            </div>

            <div class="product-marketplace-pricing-view__bar">
              <Tooltip
                v-for="segment in segments"
                :key="segment.key"
                :text="`${segmentLabel(segment.key)}: ${formatMoney(segment.value)}`"
              >
                <span
                  class="product-marketplace-pricing-view__segment"
                  :class="`product-marketplace-pricing-view__segment--${segment.key}`"
                  :style="{ flexBasis: `${segment.widthPercent}%` }"
                  tabindex="0"
                >
                  <span class="product-marketplace-pricing-view__segment-percent">
                    {{ formatPercent(segment.percent, 0) }}
                  </span>
                </span>
              </Tooltip>
            </div>
          </div>

          <p
            v-if="displayRows.length === 0 && !listErrorMessage"
            class="product-marketplace-pricing-view__empty"
          >
            {{ $t('pricing.productMarketplacePricing.empty') }}
          </p>
        </div>
      </template>

      <DataTable v-else :columns="tableColumns" :rows="tableRows" row-key="id">
        <template #cell-productName="{ row }">
          <div class="product-marketplace-pricing-view__table-product">
            <Button
              :aria-label="$t('catalog.products.form.editTitle')"
              :icon-before="PencilSimpleLine"
              variant="ghost"
              @click="goToProductEdit(row.productId)"
            />
            <span>{{ row.productName }}</span>
          </div>
        </template>

        <template v-for="key in SEGMENT_KEYS" :key="key" #[`cell-${key}`]="{ value }">
          {{ formatMoney((value as SegmentCell).value) }}
          <span class="product-marketplace-pricing-view__table-segment-percent">
            ({{ formatPercent((value as SegmentCell).percent, 1) }})
          </span>
        </template>

        <template #cell-practicedPrice="{ row }">
          <div class="product-marketplace-pricing-view__table-price">
            <p
              v-if="row.practicedPrice === null"
              class="product-marketplace-pricing-view__suggested-hint"
            >
              —
            </p>
            <div v-else class="product-marketplace-pricing-view__prices">
              <p class="product-marketplace-pricing-view__product-price">
                {{ formatMoney(row.practicedPrice) }}
                <span
                  :class="[
                    'product-marketplace-pricing-view__product-margin',
                    marginToneClass(row.practicedProfit as string, row.meetsTargetMargin),
                  ]"
                >
                  ({{ formatPercent(row.practicedMarginPercent as number, 0) }})
                </span>
              </p>
              <p
                v-if="hasCampaignMarkup(row.practicedCampaignPrice, row.practicedPrice)"
                class="product-marketplace-pricing-view__suggested-hint"
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
              @click="openEditModal(row.source)"
            />
          </div>
        </template>

        <template #cell-suggestedPrice="{ row }">
          <div class="product-marketplace-pricing-view__table-price">
            <div class="product-marketplace-pricing-view__prices">
              <p class="product-marketplace-pricing-view__product-price">
                <CopyablePrice :value="row.suggestedPrice" />
                <span
                  :class="[
                    'product-marketplace-pricing-view__product-margin',
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
                class="product-marketplace-pricing-view__suggested-hint"
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
              @click="goToProductMarketplaces(row.productId)"
            />
          </div>
        </template>

        <template #empty>
          {{ $t('pricing.productMarketplacePricing.empty') }}
        </template>
      </DataTable>

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

.product-marketplace-pricing-view__back {
  align-self: flex-start;
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

// Estado/ação COMPARTILHADOS entre abas (busca/KPIs/toggle/botão de
// vínculo mudam de valor conforme a aba, mas o controle em si fica uma
// vez só, dentro do slot default do `TabBar` — mesmo padrão já usado em
// `PricingDashboardMockupView.vue`). 2 linhas, mesma estrutura da
// referência: busca+toggle numa linha, KPIs+botão de vínculo na outra.
.product-marketplace-pricing-view__search-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-16;
  margin-top: $spacing-16;
}

.product-marketplace-pricing-view__search {
  width: 100%;
  max-width: 320px;
}

.product-marketplace-pricing-view__view-toggle {
  display: flex;
  flex-shrink: 0;
  gap: $spacing-4;
  padding: $spacing-4;
  background-color: $color-ink-4;
  border-radius: $radius-8;
}

.product-marketplace-pricing-view__kpi-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-16;
  margin-top: $spacing-24;
}

.product-marketplace-pricing-view__kpis {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-40;
}

.product-marketplace-pricing-view__kpi-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.product-marketplace-pricing-view__kpi-value {
  margin-top: $spacing-4;
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

// Achado real, 2026-09-04, reportado pelo usuário: "Lucro total" tinha
// UMA classe fixa (`--profit`, sempre verde) — um total negativo (soma
// de vários produtos com prejuízo) continuava pintado de verde, o
// oposto do que a cor deveria comunicar. Trocado pelas mesmas 3
// variantes de `outcomeTone` já usadas por linha
// (`__product-margin--positive/neutral/negative`), aplicadas
// dinamicamente pelo sinal do total (`list.totals.value.profit`) —
// sem `meetsTargetMargin` aqui, o total é uma soma de vários produtos
// com margens-alvo DIFERENTES, não existe uma única meta pra comparar.
.product-marketplace-pricing-view__kpi-value--positive {
  color: $color-accent-green;
}

.product-marketplace-pricing-view__kpi-value--neutral {
  color: $color-accent-yellow;
}

.product-marketplace-pricing-view__kpi-value--negative {
  color: $color-accent-red;
}

.product-marketplace-pricing-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}

.product-marketplace-pricing-view__legend {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-16;
  margin-top: $spacing-24;
}

.product-marketplace-pricing-view__legend-item {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.product-marketplace-pricing-view__legend-swatch {
  display: inline-block;
  width: $size-12;
  height: $size-12;
  border-radius: $radius-4;
}

.product-marketplace-pricing-view__empty {
  padding: $spacing-24;
  color: $color-ink-40;
  text-align: center;
}

.product-marketplace-pricing-view__products {
  display: flex;
  flex-direction: column;
  gap: $spacing-12;
  margin-top: $spacing-16;
}

.product-marketplace-pricing-view__product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-16;
  margin-bottom: $spacing-4;
}

.product-marketplace-pricing-view__product-title {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

// `<p>` global (`_reset.scss`) ganha `margin-bottom` via `paragraph-spacing`
// (espaçamento de PARÁGRAFO de prosa, não de texto de UI) — mesmo achado
// real já documentado em `PricingDashboardMockupView.vue`, reaplicado
// aqui de propósito, não redescoberto.
.product-marketplace-pricing-view__product-name {
  margin-bottom: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.product-marketplace-pricing-view__product-meta {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.product-marketplace-pricing-view__prices {
  text-align: right;
}

.product-marketplace-pricing-view__product-price {
  margin-bottom: 0;
  font-size: $font-size-sm;
  color: $color-ink;
}

.product-marketplace-pricing-view__product-margin--positive {
  color: $color-accent-green;
}

.product-marketplace-pricing-view__product-margin--neutral {
  color: $color-accent-yellow;
}

.product-marketplace-pricing-view__product-margin--negative {
  color: $color-accent-red;
}

.product-marketplace-pricing-view__suggested-hint {
  margin-bottom: 0;
  font-size: $font-size-sm;
  color: $color-ink-40;
  white-space: nowrap;
}

// Achado real, 2026-09-03 — mesma causa raiz já documentada pro
// `DataTable.vue` (`svg { max-width: 100% }` do reset global), só que
// aqui é o `display: block` do MESMO reset que importa: um ícone de
// tooltip (`isApproximated`/`campaignPrice`) dentro de um `<span
// tabindex="0">` no MEIO do texto de uma linha vira, sozinho, uma caixa
// de bloco — um bloco dentro de conteúdo inline força quebra de linha
// ANTES dele, então o ícone caía pra própria linha, órfão embaixo do
// texto (não é bug de wrap por falta de espaço, `white-space: nowrap`
// acima não resolvia isso sozinho). `:deep()` alcança o `<svg>` gerado
// dentro do `Icon.vue` filho, mesma técnica do `DataTable.vue`.
.product-marketplace-pricing-view__suggested-hint :deep(svg) {
  display: inline-block;
  vertical-align: middle;
}

.product-marketplace-pricing-view__bar {
  display: flex;
  overflow: hidden;
  height: $size-16;
  border-radius: $radius-8;
}

.product-marketplace-pricing-view__segment {
  position: relative;
  display: block;
  flex-shrink: 0;
  height: 100%;

  &:focus-visible {
    @include focus-ring;
  }
}

// Rótulo de % dentro do segmento (2026-09-04) — pill com fundo/texto
// FIXOS (`$color-ink-fixed`/`$color-paper-fixed`, nunca flipam com o
// tema), de propósito: a rampa de cor dos segmentos mistura vários deles
// com `$color-ink` puro (`tax`/`ads`/`affiliate`/`coupon`, ver comentário
// da rampa abaixo) — esse token FLIPA de preto pra branco no tema escuro,
// então o segmento em si troca de "quase preto" pra "quase branco" só de
// mudar de tema. Um texto de cor fixa (`$color-ink`/`$color-paper`
// comuns) ficaria ilegível contra pelo menos um dos dois temas em pelo
// menos um desses segmentos. O pill (fundo escuro translúcido + texto
// branco, os dois com os tokens "-fixed") garante contraste sempre,
// **independente da cor por baixo** — mesma técnica de rótulo sobre
// fundo arbitrário/gradiente usada em mapas e gráficos, sem precisar
// calibrar uma cor de texto por segmento (não verificável sem browser
// real neste ambiente, ver "Known Gaps" do design system).
.product-marketplace-pricing-view__segment-percent {
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

// Mesma rampa sequencial de `PricingDashboardMockupView.vue` — 10
// parcelas (afiliado entrou em 2026-09-03, cupom e individualFixedFee
// em 2026-09-04, mesma planilha/pedido real), ainda sem "Comissão
// campanha": o desconto de campanha não entra nessa soma, só define o
// preço de anúncio maior
// (ver `campaignPrice` no `<script>`).
.product-marketplace-pricing-view__segment--costPrice {
  background-color: color-mix(in srgb, $color-accent-orange 30%, $color-bg-2);
}

.product-marketplace-pricing-view__segment--commission {
  background-color: color-mix(in srgb, $color-accent-orange 60%, $color-bg-2);
}

.product-marketplace-pricing-view__segment--fixedFee {
  background-color: $color-accent-orange;
}

.product-marketplace-pricing-view__segment--operationalCost {
  background-color: color-mix(in srgb, $color-accent-orange 50%, $color-accent-red);
}

// Achado real, 2026-09-04, reportado pelo usuário DUAS vezes ("mesma
// cor ainda" mesmo depois de respaçar) — a 1ª correção só reespaçou o
// percentual de vermelho misturado em `$color-ink` (70/55/38/22/8), mas
// os 3 últimos degraus continuavam convergindo pra perto do preto puro
// (light mode) — a essa luminância baixa, o olho não distingue bem
// diferenças de matiz da MESMA cor (vermelho escuro vs. vermelho mais
// escuro ainda), não importa o quanto o percentual varie. Trocado de
// estratégia: `affiliate`/`coupon`/`individualFixedFee` saem da rampa
// vermelho→preto e passam a usar 3 acentos "frios" DISTINTOS da paleta
// (`accent-purple`/`accent-indigo`/`accent-blue`) — mesma técnica já
// usada pra distinguir N categorias que a rampa de 1 matiz só não
// aguenta mais (paleta categórica cíclica do `ChartCard.vue`, seção
// própria acima). `tax`/`ads` continuam na família vermelho/laranja
// (sem reclamação do usuário sobre esses dois) — a barra passa a ler
// como 2 grupos visuais: quente (custo/comissão/imposto/ads) → frio
// (afiliado/cupom/taxa PF) → verde (lucro).
.product-marketplace-pricing-view__segment--tax {
  background-color: color-mix(in srgb, $color-accent-red 70%, $color-ink);
}

.product-marketplace-pricing-view__segment--ads {
  background-color: color-mix(in srgb, $color-accent-red 45%, $color-ink);
}

.product-marketplace-pricing-view__segment--affiliate {
  background-color: $color-accent-purple;
}

.product-marketplace-pricing-view__segment--coupon {
  background-color: $color-accent-indigo;
}

.product-marketplace-pricing-view__segment--individualFixedFee {
  background-color: $color-accent-blue;
}

.product-marketplace-pricing-view__segment--profit {
  background-color: $color-accent-green;
}

.product-marketplace-pricing-view__legend-swatch--costPrice {
  @extend .product-marketplace-pricing-view__segment--costPrice;
}

.product-marketplace-pricing-view__legend-swatch--commission {
  @extend .product-marketplace-pricing-view__segment--commission;
}

.product-marketplace-pricing-view__legend-swatch--fixedFee {
  @extend .product-marketplace-pricing-view__segment--fixedFee;
}

.product-marketplace-pricing-view__legend-swatch--operationalCost {
  @extend .product-marketplace-pricing-view__segment--operationalCost;
}

.product-marketplace-pricing-view__legend-swatch--tax {
  @extend .product-marketplace-pricing-view__segment--tax;
}

.product-marketplace-pricing-view__legend-swatch--ads {
  @extend .product-marketplace-pricing-view__segment--ads;
}

.product-marketplace-pricing-view__legend-swatch--affiliate {
  @extend .product-marketplace-pricing-view__segment--affiliate;
}

.product-marketplace-pricing-view__legend-swatch--coupon {
  @extend .product-marketplace-pricing-view__segment--coupon;
}

.product-marketplace-pricing-view__legend-swatch--individualFixedFee {
  @extend .product-marketplace-pricing-view__segment--individualFixedFee;
}

.product-marketplace-pricing-view__legend-swatch--profit {
  @extend .product-marketplace-pricing-view__segment--profit;
}

.product-marketplace-pricing-view__table-product,
// `justify-content: flex-end` — a coluna inteira já fica `text-align:
// right` (`DataTable.vue`, `column.align`), mas isso não reposiciona um
// filho `display: flex` sozinho; sem isso o conteúdo continuaria colado
// à esquerda da célula mesmo com a coluna "alinhada à direita".
.product-marketplace-pricing-view__table-price {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: $spacing-4;
  white-space: nowrap;
}

// % de cada parcela sobre o preço final (2026-09-04, pedido direto do
// usuário) — texto apagado ao lado do valor em R$ na visão de tabela,
// mesmo tom `ink-40` já usado pra informação secundária no resto da
// tela (`__suggested-hint`). Nome de classe deliberadamente diferente
// de `__segment-percent` (rótulo dentro da barra, acima) — são dois
// contextos visuais distintos (célula de tabela em fundo neutro vs. pill
// sobre um segmento colorido), cada um com sua própria régua de
// contraste; usar o mesmo nome faria a regra de um pisar na do outro.
.product-marketplace-pricing-view__table-segment-percent {
  color: $color-ink-40;
}
</style>
