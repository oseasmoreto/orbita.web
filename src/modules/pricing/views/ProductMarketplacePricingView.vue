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
 * - 7 segmentos (`SEGMENT_KEYS`, `pricingBreakdown.ts`), não 8 — sem
 *   "Comissão campanha": `USER_MARKETPLACE.campaignDiscountPercentage`
 *   não entra na fórmula real (confirmado com o backend), era 100%
 *   especulado no mockup.
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
  CopySimple,
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
import { useToast } from '@/shared/composables/useToast'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
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
import type { SegmentKey } from '../services/pricingBreakdown'
import type { ProductMarketplacePricing } from '../types/productMarketplacePricing.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { TabBarOption } from '@/shared/components/ui/types/tabBar.type'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
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
    return { active, row, segments: buildPriceSegments(active.breakdown, active.price) }
  }),
)

function segmentLabel(key: SegmentKey): string {
  return t(`pricing.productMarketplacePricing.segments.${key}`)
}

/** Classe de cor da margem — verde (lucro) / amarelo (0x0) / vermelho (prejuízo), ver `outcomeTone`. */
function marginToneClass(profit: string): string {
  return `product-marketplace-pricing-view__product-margin--${outcomeTone(profit)}`
}

async function copySuggestedPrice(price: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(formatMoney(price))
    toast.success(t('pricing.productMarketplacePricing.priceCopied'))
  } catch {
    toast.error(t('pricing.productMarketplacePricing.priceCopyFailed'))
  }
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
type PricingTableRow = {
  id: string
  isApproximated: boolean
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
} & Record<SegmentKey, string>

const tableRows = computed<PricingTableRow[]>(() =>
  displayRows.value.map(({ row, segments }) => {
    const segmentValues = Object.fromEntries(
      segments.map((segment) => [segment.key, segment.value]),
    ) as Record<SegmentKey, string>
    const { pricing } = row
    const hasPracticedPrice =
      row.practicedPrice !== null &&
      pricing.practicedProfit !== null &&
      pricing.practicedCampaignPrice !== null

    return {
      id: row.id,
      isApproximated: pricing.isApproximated,
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

const tableColumns = computed<DataTableColumn[]>(() => [
  { key: 'productName', title: t('pricing.productMarketplacePricing.table.columns.product') },
  ...SEGMENT_KEYS.map((key) => ({ key, title: segmentLabel(key) })),
  {
    key: 'practicedPrice',
    title: t('pricing.productMarketplacePricing.table.columns.practicedPrice'),
  },
  {
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
              class="product-marketplace-pricing-view__kpi-value product-marketplace-pricing-view__kpi-value--profit"
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
                    {{ formatMoney(active.price) }}
                    <span
                      :class="[
                        'product-marketplace-pricing-view__product-margin',
                        marginToneClass(active.profit),
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
                    {{ formatMoney(row.pricing.suggestedPrice) }}
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
                    {{ formatMoney(active.campaignPrice) }}
                    <Tooltip :text="$t('pricing.productMarketplacePricing.campaignPriceTooltip')">
                      <span tabindex="0">
                        <Icon :icon="Info" :size="12" style="color: var(--color-accent-yellow)" />
                      </span>
                    </Tooltip>
                  </p>
                </div>

                <Button
                  :aria-label="$t('pricing.productMarketplacePricing.copyPriceButton')"
                  :icon-before="CopySimple"
                  variant="ghost"
                  @click="copySuggestedPrice(row.pricing.suggestedPrice)"
                />
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
                />
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
          {{ formatMoney(value as string) }}
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
                    marginToneClass(row.practicedProfit as string),
                  ]"
                >
                  ({{ formatPercent(row.practicedMarginPercent as number, 0) }})
                </span>
              </p>
              <p
                v-if="hasCampaignMarkup(row.practicedCampaignPrice as string, row.practicedPrice)"
                class="product-marketplace-pricing-view__suggested-hint"
              >
                {{ $t('pricing.productMarketplacePricing.campaignPriceLabel') }}:
                {{ formatMoney(row.practicedCampaignPrice as string) }}
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
                {{ formatMoney(row.suggestedPrice) }}
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
                {{ formatMoney(row.suggestedCampaignPrice) }}
                <Tooltip :text="$t('pricing.productMarketplacePricing.campaignPriceTooltip')">
                  <span tabindex="0">
                    <Icon :icon="Info" :size="12" style="color: var(--color-accent-yellow)" />
                  </span>
                </Tooltip>
              </p>
            </div>
            <Button
              :aria-label="$t('pricing.productMarketplacePricing.copyPriceButton')"
              :icon-before="CopySimple"
              variant="ghost"
              @click="copySuggestedPrice(row.suggestedPrice)"
            />
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

.product-marketplace-pricing-view__kpi-value--profit {
  color: $color-accent-green;
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
  display: block;
  flex-shrink: 0;
  height: 100%;

  &:focus-visible {
    @include focus-ring;
  }
}

// Mesma rampa sequencial de `PricingDashboardMockupView.vue` — 8
// parcelas (afiliado entrou em 2026-09-03, mesma planilha real), ainda
// sem "Comissão campanha": o desconto de campanha não entra nessa soma,
// só define o preço de anúncio maior (ver `campaignPrice` no `<script>`).
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

.product-marketplace-pricing-view__segment--tax {
  background-color: color-mix(in srgb, $color-accent-red 70%, $color-ink);
}

.product-marketplace-pricing-view__segment--ads {
  background-color: color-mix(in srgb, $color-accent-red 45%, $color-ink);
}

.product-marketplace-pricing-view__segment--affiliate {
  background-color: color-mix(in srgb, $color-accent-red 20%, $color-ink);
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

.product-marketplace-pricing-view__legend-swatch--profit {
  @extend .product-marketplace-pricing-view__segment--profit;
}

.product-marketplace-pricing-view__table-product,
.product-marketplace-pricing-view__table-price {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  white-space: nowrap;
}
</style>
