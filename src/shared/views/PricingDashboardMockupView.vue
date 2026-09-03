<script setup lang="ts">
/**
 * Mockup visual da futura dashboard de precificação (Fase 4,
 * `docs/planejamento/plano-implementacao.md` — `PricingCalculator` já
 * existe e é testado isoladamente, mas nunca foi conectado a rota
 * nenhuma; `PRODUCT_MARKETPLACE.suggested_price`/`is_approximated`
 * ficam "pra uma tela/tabela futura, ainda não desenhada",
 * `docs/negocio/contexto-plataforma-precificacao.md` seção 3).
 *
 * Pedido direto do usuário, 2026-09-02, com referência visual de outro
 * produto (barra horizontal empilhada por produto, decomposta em custo +
 * taxas + lucro) — "vamos desenhar a tela de precificação... monta um
 * mockup numa rota a parte, sem comunicação com api, só pra vermos como
 * fica, com aba por marketplace pra usarmos nosso componente de aba".
 *
 * **100% mockado, sem chamada de API nenhuma** — os dados abaixo são
 * calculados de um "recipe" fixo por produto/marketplace (nunca
 * buscados), só pra a matemática de cada barra bater 100% com o preço
 * final (soma dos segmentos = `salePrice`), do jeito que a versão real
 * vai calcular quando `PricingCalculator` for conectado de verdade. Os 8
 * segmentos mapeiam 1:1 pros campos reais já existentes no modelo de
 * dados (nenhum campo novo, só a composição visual é nova):
 * `PRODUCT.costPrice`, `PRICING_RULE.percentage`/`fixed_fee`,
 * `PRODUCT.operationalCost`, `USER_MARKETPLACE.campaignDiscountPercentage`/
 * `adsPercentage`, `COMPANY.salesTaxPercentage`, lucro = resto.
 *
 * Rota isolada (`/pricing-dashboard-mockup`), fora da navegação
 * principal — mesmo espírito de `ShowcaseView.vue` (`/showcase`): uma
 * superfície de exploração visual, não uma feature real ainda.
 */
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { TabsContent } from 'reka-ui'
import {
  ChartBar,
  CopySimple,
  PencilSimpleLine,
  Storefront,
  Table as TableIcon,
} from '@/shared/components/icons/regular.generated'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import Button from '@/shared/components/ui/Button.vue'
import Search from '@/shared/components/ui/Search.vue'
import TabBar from '@/shared/components/ui/TabBar.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import { useToast } from '@/shared/composables/useToast'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { TabBarOption } from '@/shared/components/ui/types/tabBar.type'

const { t } = useI18n()
const router = useRouter()
const toast = useToast()

/**
 * Botão "Editar produto" por linha — mesmo ícone/destino da tela real
 * (`PencilSimpleLine` → `products-edit`, mesmo par já usado em
 * `ProductsView.vue`). Como os dados aqui são 100% mockados, `id` é um
 * UUID falso — clicar navega de verdade (mesma rota nomeada da tela
 * real), só não existe produto nenhum com esse id no backend, então a
 * tela de destino mostra o próprio estado de erro dela (comportamento
 * normal da rota, não um bug deste mockup).
 */
function goToProductEdit(productId: string): void {
  void router.push({ name: 'products-edit', params: { id: productId } })
}

/**
 * Botão "Editar vínculo" por LINHA de produto — edita o vínculo
 * `PRODUCT_MARKETPLACE` (produto↔`USER_MARKETPLACE`, categoria por
 * canal), mesmo par já usado no botão "Marketplaces" de
 * `ProductsView.vue`.
 */
function goToProductMarketplaces(productId: string): void {
  void router.push({ name: 'product-marketplaces', params: { id: productId } })
}

/**
 * Botão "Editar vínculo" — UMA vez por ABA de marketplace (não por
 * produto): edita o vínculo `USER_MARKETPLACE` (a conexão usuário↔canal
 * — `store_name`/`ads_percentage`/`campaignDiscountPercentage`/comissão),
 * diferente do vínculo por produto acima (`PRODUCT_MARKETPLACE`) — são os
 * campos de `USER_MARKETPLACE` que alimentam os segmentos "Comissão
 * campanha"/"Ads" de CADA barra da aba inteira, não um produto isolado.
 * Não existe rota própria pra abrir o modal de edição de uma conexão
 * específica direto (`ConnectMarketplaceModal.vue` só abre a partir do
 * card em `MarketplacesView.vue`) — navega pra lá, mesmo destino que o
 * usuário chegaria clicando "Gerenciar" no card certo.
 */
function goToMarketplaceConnection(): void {
  void router.push({ name: 'marketplaces' })
}

/**
 * Botão de copiar o preço sugerido, pedido direto do usuário — presente
 * nas duas visualizações (barra e tabela). `navigator.clipboard` exige
 * contexto seguro (https ou localhost, sempre o caso em dev/produção
 * deste projeto) — sem fallback de `document.execCommand('copy')`
 * (descontinuado), o `catch` só cobre o caso raro de permissão negada
 * pelo browser.
 */
async function copySuggestedPrice(price: number): Promise<void> {
  try {
    await navigator.clipboard.writeText(formatMoney(price))
    toast.success(t('pricingDashboardMockup.priceCopied'))
  } catch {
    toast.error(t('pricingDashboardMockup.priceCopyFailed'))
  }
}

/** Ordem = ordem visual da legenda e das barras, esquerda pra direita. */
const SEGMENT_KEYS = [
  'costPrice',
  'commission',
  'fixedFee',
  'operational',
  'campaignDiscount',
  'tax',
  'ads',
  'profit',
] as const

type SegmentKey = (typeof SEGMENT_KEYS)[number]

interface ProductSegment {
  key: SegmentKey
  value: number
  widthPercent: number
}

interface MockProduct {
  id: string
  marginPercent: number
  name: string
  salePrice: number
  segments: ProductSegment[]
}

interface ProductRecipe {
  costPrice: number
  id: string
  name: string
  operationalCost: number
  salePrice: number
}

interface MarketplaceRecipe {
  adsPercentage: number
  campaignDiscountPercentage: number
  commissionPercentage: number
  fixedFee: number
  key: string
  label: string
}

/**
 * 50 nomes de produto (pedido direto do usuário, 2026-09-02 — "coloque 50
 * produtos pra eu ver como fica", pra validar densidade real de planilha
 * grande, mesmo motivo já citado na redução de espaçamento entre linhas).
 * `costPrice`/`operationalCost`/`salePrice` são GERADOS por
 * `generateProductRecipe` a partir do índice (determinístico, não
 * `Math.random()`) — escrever 50 objetos à mão só pra um mockup 100%
 * descartável seria esforço sem retorno; a fórmula mantém a mesma
 * proporção custo/operacional/venda dos 6 produtos originais (custo
 * ~15-27,5% do preço de venda, operacional pequeno e fixo) pra continuar
 * gerando lucro positivo nas 3 abas mesmo na faixa de preço mais barata
 * (soma de comissão+taxa fixa+campanha+imposto+ads nunca passa de ~41%
 * do preço nas recipes de marketplace abaixo).
 */
const PRODUCT_NAME_POOL = [
  'Camiseta básica algodão',
  'Tênis esportivo leve',
  'Fone bluetooth in-ear',
  'Mochila impermeável',
  'Relógio digital esportivo',
  'Garrafa térmica 1L',
  'Boné trucker',
  'Óculos de sol polarizado',
  'Carteira de couro sintético',
  'Mouse sem fio',
  'Teclado mecânico compacto',
  'Suporte para celular',
  'Caixa de som portátil',
  'Carregador portátil 10000mAh',
  'Cabo USB-C 1m',
  'Capa para notebook',
  'Luminária de mesa LED',
  'Organizador de gavetas',
  'Jogo de toalhas',
  'Tapete antiderrapante',
  'Panela antiaderente 24cm',
  'Kit de facas inox',
  'Squeeze 750ml',
  'Tênis de corrida',
  'Legging fitness',
  'Camiseta dry fit',
  'Shorts esportivo',
  'Jaqueta corta-vento',
  'Meia esportiva kit 3',
  'Luva de academia',
  'Faixa elástica de resistência',
  'Corda de pular',
  'Colchonete para yoga',
  'Halter emborrachado 2kg',
  'Kettlebell 8kg',
  'Bola de pilates',
  'Mochila de trilha 30L',
  'Cantil de alumínio',
  'Lanterna recarregável',
  'Kit de ferramentas 12 peças',
  'Fita isolante',
  'Pilha recarregável AA',
  'Adaptador multi-tomadas',
  'Filtro de linha 5 tomadas',
  'Câmera de segurança wifi',
  'Fechadura digital',
  'Sensor de presença',
  'Régua de LED',
  'Suporte de TV articulado',
  'Cabo HDMI 2m',
] as const

const SALE_PRICE_STEPS = [
  29.9, 39.9, 49.9, 59.9, 79.9, 89.9, 99.9, 119.9, 129.9, 149.9, 159.9, 179.9, 199.9, 239.9, 269.9,
  299.9, 349.9,
]

function generateProductRecipe(name: string, index: number): ProductRecipe {
  const salePrice = SALE_PRICE_STEPS[index % SALE_PRICE_STEPS.length] ?? 89.9
  const costRatio = 0.15 + (index % 6) * 0.025
  const costPrice = Math.round(salePrice * costRatio * 100) / 100
  const operationalCost = 2 + (index % 5)

  return {
    costPrice,
    id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, '0')}`,
    name,
    operationalCost,
    salePrice,
  }
}

/** Preço de custo/operacional é do PRODUTO — não muda entre marketplaces (mesmo catálogo, canais diferentes). `id` é um UUID falso, só pra dar destino real pros botões de editar/vínculo. */
const PRODUCT_RECIPES: ProductRecipe[] = PRODUCT_NAME_POOL.map((name, index) =>
  generateProductRecipe(name, index),
)

/** Comissão/taxa fixa/campanha/ads variam por CANAL (`USER_MARKETPLACE`/`PRICING_RULE`) — mesmo produto, números diferentes por aba. */
const MARKETPLACE_RECIPES: MarketplaceRecipe[] = [
  {
    adsPercentage: 4,
    campaignDiscountPercentage: 3,
    commissionPercentage: 16,
    fixedFee: 5,
    key: 'mercado-livre',
    label: 'Mercado Livre',
  },
  {
    adsPercentage: 6,
    campaignDiscountPercentage: 5,
    commissionPercentage: 14,
    fixedFee: 4,
    key: 'shopee',
    label: 'Shopee',
  },
  {
    adsPercentage: 3,
    campaignDiscountPercentage: 2,
    commissionPercentage: 18,
    fixedFee: 6,
    key: 'amazon',
    label: 'Amazon',
  },
]

/** `COMPANY.salesTaxPercentage` — nível de empresa, não de marketplace, fica igual nas 3 abas. */
const TAX_PERCENTAGE = 6

function buildProduct(product: ProductRecipe, marketplace: MarketplaceRecipe): MockProduct {
  const commission = (marketplace.commissionPercentage / 100) * product.salePrice
  const campaignDiscount = (marketplace.campaignDiscountPercentage / 100) * product.salePrice
  const tax = (TAX_PERCENTAGE / 100) * product.salePrice
  const ads = (marketplace.adsPercentage / 100) * product.salePrice

  const profit =
    product.salePrice -
    product.costPrice -
    commission -
    marketplace.fixedFee -
    product.operationalCost -
    campaignDiscount -
    tax -
    ads

  const rawValues: Record<SegmentKey, number> = {
    ads,
    campaignDiscount,
    commission,
    costPrice: product.costPrice,
    fixedFee: marketplace.fixedFee,
    operational: product.operationalCost,
    profit,
    tax,
  }

  const segments = SEGMENT_KEYS.map((key) => ({
    key,
    value: rawValues[key],
    widthPercent: (rawValues[key] / product.salePrice) * 100,
  }))

  return {
    id: product.id,
    marginPercent: (profit / product.salePrice) * 100,
    name: product.name,
    salePrice: product.salePrice,
    segments,
  }
}

const productsByMarketplace = computed<Record<string, MockProduct[]>>(() =>
  Object.fromEntries(
    MARKETPLACE_RECIPES.map((marketplace) => [
      marketplace.key,
      PRODUCT_RECIPES.map((product) => buildProduct(product, marketplace)),
    ]),
  ),
)

/**
 * Barra de busca por nome, pedido direto do usuário — filtra as 3 abas
 * ao mesmo tempo (o `ref` é compartilhado, não reaplicado por aba). KPIs
 * (faturamento/lucro/margem/contagem) refletem o conjunto FILTRADO, não
 * o catálogo inteiro — mesmo comportamento esperado de um filtro de
 * dashboard de verdade.
 */
const searchQuery = ref('')

const visibleProductsByMarketplace = computed<Record<string, MockProduct[]>>(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return productsByMarketplace.value
  }

  return Object.fromEntries(
    Object.entries(productsByMarketplace.value).map(([key, products]) => [
      key,
      products.filter((product) => product.name.toLowerCase().includes(query)),
    ]),
  )
})

function totalsFor(products: MockProduct[]) {
  const revenue = products.reduce((sum, product) => sum + product.salePrice, 0)
  const profit = products.reduce(
    (sum, product) => sum + (product.salePrice * product.marginPercent) / 100,
    0,
  )
  const averageMargin =
    products.length === 0
      ? 0
      : products.reduce((sum, product) => sum + product.marginPercent, 0) / products.length

  return { averageMargin, productCount: products.length, profit, revenue }
}

/**
 * Visualização em tabela, pedido direto do usuário ("faça uma
 * visualização de tabela, com um botão para o usuario ficar alternando
 * as views") — alternativa à barra empilhada pra quem prefere ler os
 * valores em planilha em vez de comparar visualmente. Reaproveita
 * `DataTable.vue` (mesmo bloco genérico usado em toda listagem admin do
 * projeto) — os 8 segmentos viram COLUNA em vez de segmento de barra,
 * `PencilSimpleLine` colada ao nome espelha o mesmo botão da visão em
 * barra.
 */
type ProductTableRow = {
  id: string
  marginPercent: number
  name: string
  salePrice: number
} & Record<SegmentKey, number>

function toTableRow(product: MockProduct): ProductTableRow {
  const segmentValues = Object.fromEntries(
    product.segments.map((segment) => [segment.key, segment.value]),
  ) as Record<SegmentKey, number>

  return {
    id: product.id,
    marginPercent: product.marginPercent,
    name: product.name,
    salePrice: product.salePrice,
    ...segmentValues,
  }
}

const tableRowsByMarketplace = computed<Record<string, ProductTableRow[]>>(() =>
  Object.fromEntries(
    Object.entries(visibleProductsByMarketplace.value).map(([key, products]) => [
      key,
      products.map(toTableRow),
    ]),
  ),
)

const tableColumns = computed<DataTableColumn[]>(() => [
  { key: 'name', title: t('pricingDashboardMockup.table.columns.product') },
  ...SEGMENT_KEYS.map((key) => ({ key, title: segmentLabel(key) })),
  { key: 'salePrice', title: t('pricingDashboardMockup.table.columns.suggestedPrice') },
])

type ViewMode = 'bar' | 'table'

const viewMode = ref<ViewMode>('bar')

const marketplaceTabs = computed<TabBarOption[]>(() =>
  MARKETPLACE_RECIPES.map((marketplace) => ({ key: marketplace.key, label: marketplace.label })),
)

const activeMarketplaceKey = ref(MARKETPLACE_RECIPES[0]?.key ?? '')

function segmentLabel(key: SegmentKey): string {
  return t(`pricingDashboardMockup.segments.${key}`)
}
</script>

<template>
  <div class="pricing-dashboard-mockup">
    <p class="pricing-dashboard-mockup__notice">
      {{ $t('pricingDashboardMockup.notice') }}
    </p>

    <h1 class="pricing-dashboard-mockup__title">{{ $t('pricingDashboardMockup.title') }}</h1>

    <TabBar v-model="activeMarketplaceKey" :tabs="marketplaceTabs">
      <div class="pricing-dashboard-mockup__toolbar">
        <Search
          v-model="searchQuery"
          class="pricing-dashboard-mockup__search"
          :placeholder="$t('pricingDashboardMockup.searchPlaceholder')"
        />

        <div
          :aria-label="$t('pricingDashboardMockup.viewToggleLabel')"
          class="pricing-dashboard-mockup__view-toggle"
          role="group"
        >
          <Button
            :aria-label="$t('pricingDashboardMockup.viewModes.bar')"
            :icon-before="ChartBar"
            :variant="viewMode === 'bar' ? 'secondary' : 'ghost'"
            @click="viewMode = 'bar'"
          />
          <Button
            :aria-label="$t('pricingDashboardMockup.viewModes.table')"
            :icon-before="TableIcon"
            :variant="viewMode === 'table' ? 'secondary' : 'ghost'"
            @click="viewMode = 'table'"
          />
        </div>
      </div>

      <TabsContent
        v-for="marketplace in MARKETPLACE_RECIPES"
        :key="marketplace.key"
        class="pricing-dashboard-mockup__panel"
        :value="marketplace.key"
      >
        <div class="pricing-dashboard-mockup__kpis">
          <div class="pricing-dashboard-mockup__kpi">
            <p class="pricing-dashboard-mockup__kpi-label">
              {{ $t('pricingDashboardMockup.kpis.totalRevenue') }}
            </p>
            <p class="pricing-dashboard-mockup__kpi-value">
              {{ formatMoney(totalsFor(visibleProductsByMarketplace[marketplace.key] ?? []).revenue) }}
            </p>
          </div>

          <div class="pricing-dashboard-mockup__kpi">
            <p class="pricing-dashboard-mockup__kpi-label">
              {{ $t('pricingDashboardMockup.kpis.totalProfit') }}
            </p>
            <p class="pricing-dashboard-mockup__kpi-value pricing-dashboard-mockup__kpi-value--profit">
              {{ formatMoney(totalsFor(visibleProductsByMarketplace[marketplace.key] ?? []).profit) }}
            </p>
          </div>

          <div class="pricing-dashboard-mockup__kpi">
            <p class="pricing-dashboard-mockup__kpi-label">
              {{ $t('pricingDashboardMockup.kpis.averageMargin') }}
            </p>
            <p class="pricing-dashboard-mockup__kpi-value">
              {{ formatPercent(totalsFor(visibleProductsByMarketplace[marketplace.key] ?? []).averageMargin, 1) }}
            </p>
          </div>

          <div class="pricing-dashboard-mockup__kpi">
            <p class="pricing-dashboard-mockup__kpi-label">
              {{ $t('pricingDashboardMockup.kpis.productCount') }}
            </p>
            <p class="pricing-dashboard-mockup__kpi-value">
              {{ totalsFor(visibleProductsByMarketplace[marketplace.key] ?? []).productCount }}
            </p>
          </div>

          <Button
            class="pricing-dashboard-mockup__kpi-menu"
            :icon-before="Storefront"
            variant="outline"
            @click="goToMarketplaceConnection"
          >
            {{ $t('pricingDashboardMockup.editConnectionButton') }}
          </Button>
        </div>

        <template v-if="viewMode === 'bar'">
          <div class="pricing-dashboard-mockup__legend">
            <span
              v-for="key in SEGMENT_KEYS"
              :key="key"
              class="pricing-dashboard-mockup__legend-item"
            >
              <span
                class="pricing-dashboard-mockup__legend-swatch"
                :class="`pricing-dashboard-mockup__legend-swatch--${key}`"
              />
              {{ segmentLabel(key) }}
            </span>
          </div>

          <div class="pricing-dashboard-mockup__products">
            <div
              v-for="product in visibleProductsByMarketplace[marketplace.key]"
              :key="product.id"
              class="pricing-dashboard-mockup__product"
            >
              <div class="pricing-dashboard-mockup__product-header">
                <div class="pricing-dashboard-mockup__product-title">
                  <Button
                    :aria-label="$t('catalog.products.form.editTitle')"
                    :icon-before="PencilSimpleLine"
                    variant="ghost"
                    @click="goToProductEdit(product.id)"
                  />
                  <p class="pricing-dashboard-mockup__product-name">{{ product.name }}</p>
                </div>

                <div class="pricing-dashboard-mockup__product-meta">
                  <p class="pricing-dashboard-mockup__product-price">
                    {{ formatMoney(product.salePrice) }}
                    <span class="pricing-dashboard-mockup__product-margin">
                      ({{ formatPercent(product.marginPercent, 0) }})
                    </span>
                  </p>

                  <Button
                    :aria-label="$t('pricingDashboardMockup.copyPriceButton')"
                    :icon-before="CopySimple"
                    variant="ghost"
                    @click="copySuggestedPrice(product.salePrice)"
                  />

                  <Button
                    :aria-label="$t('catalog.products.marketplacesButton')"
                    :icon-before="Storefront"
                    variant="ghost"
                    @click="goToProductMarketplaces(product.id)"
                  />
                </div>
              </div>

              <div class="pricing-dashboard-mockup__bar">
                <Tooltip
                  v-for="segment in product.segments"
                  :key="segment.key"
                  :text="`${segmentLabel(segment.key)}: ${formatMoney(segment.value)}`"
                >
                  <span
                    class="pricing-dashboard-mockup__segment"
                    :class="`pricing-dashboard-mockup__segment--${segment.key}`"
                    :style="{ flexBasis: `${segment.widthPercent}%` }"
                    tabindex="0"
                  />
                </Tooltip>
              </div>
            </div>

            <p
              v-if="(visibleProductsByMarketplace[marketplace.key] ?? []).length === 0"
              class="pricing-dashboard-mockup__empty"
            >
              {{ $t('pricingDashboardMockup.table.empty') }}
            </p>
          </div>
        </template>

        <DataTable
          v-else
          :columns="tableColumns"
          :rows="tableRowsByMarketplace[marketplace.key] ?? []"
          row-key="id"
        >
          <template #cell-name="{ row }">
            <div class="pricing-dashboard-mockup__table-product">
              <Button
                :aria-label="$t('catalog.products.form.editTitle')"
                :icon-before="PencilSimpleLine"
                variant="ghost"
                @click="goToProductEdit(row.id)"
              />
              <span>{{ row.name }}</span>
            </div>
          </template>

          <template v-for="key in SEGMENT_KEYS" :key="key" #[`cell-${key}`]="{ value }">
            {{ formatMoney(value as number) }}
          </template>

          <template #cell-salePrice="{ row }">
            <div class="pricing-dashboard-mockup__table-price">
              <span>
                {{ formatMoney(row.salePrice) }}
                <span class="pricing-dashboard-mockup__product-margin">
                  ({{ formatPercent(row.marginPercent, 0) }})
                </span>
              </span>

              <Button
                :aria-label="$t('pricingDashboardMockup.copyPriceButton')"
                :icon-before="CopySimple"
                variant="ghost"
                @click="copySuggestedPrice(row.salePrice)"
              />

              <Button
                :aria-label="$t('catalog.products.marketplacesButton')"
                :icon-before="Storefront"
                variant="ghost"
                @click="goToProductMarketplaces(row.id)"
              />
            </div>
          </template>

          <template #empty>
            {{ $t('pricingDashboardMockup.table.empty') }}
          </template>
        </DataTable>
      </TabsContent>
    </TabBar>
  </div>
</template>

<style scoped lang="scss">

.pricing-dashboard-mockup {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.pricing-dashboard-mockup__notice {
  padding: $spacing-8 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-yellow;
  background-color: color-mix(in srgb, $color-accent-yellow 16%, transparent);
  border-radius: $radius-8;
}

.pricing-dashboard-mockup__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

// Fora de `.pricing-dashboard-mockup__panel` de propósito — busca e
// alternância de visão são estado COMPARTILHADO entre as 3 abas (o
// `ref` não é reaplicado por marketplace), então o controle fica uma
// vez só, acima dos painéis (dentro do slot default do `TabBar`, que
// renderiza depois da lista de abas — ver `TabBar.vue`).
.pricing-dashboard-mockup__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-16;
  margin-top: $spacing-16;
}

.pricing-dashboard-mockup__search {
  width: 100%;
  max-width: 320px;
}

.pricing-dashboard-mockup__view-toggle {
  display: flex;
  flex-shrink: 0;
  gap: $spacing-4;
  padding: $spacing-4;
  background-color: $color-ink-4;
  border-radius: $radius-8;
}

// Achado real: `TabsContent` (reka-ui) mantém as 3 abas sempre no DOM
// (`unmountOnHide` default só remove o CONTEÚDO da inativa, não o
// wrapper) e controla visibilidade via atributo nativo `hidden` — mas
// `display: flex` aqui, com a especificidade extra do `[data-v-xxx]`
// do scoped CSS, vence o `[hidden] { display: none }` padrão do
// navegador (mesma especificidade — classe vs. atributo — mas o
// scoped adiciona um segundo seletor de atributo, desempatando a favor
// da MINHA regra). Resultado: cada aba inativa (vazia, sem conteúdo,
// mas ainda com `padding-top: {spacing.16}` deste bloco) continuava
// ocupando 16px de altura visível, empilhando a cada troca de aba —
// bug real reportado pelo usuário com 2 screenshots ("vai ficando um
// espaço em branco perdido"). `&[hidden]` reforça `display: none` de
// volta, com especificidade ainda maior (classe + atributo), sem
// precisar tocar `TabBar.vue`/nenhum outro consumidor de `TabsContent`
// do projeto — nenhum deles aplica `display` direto no próprio
// elemento `TabsContent`, só no conteúdo de dentro, por isso não
// pegava esse bug.
.pricing-dashboard-mockup__panel {
  display: flex;
  flex-direction: column;
  gap: $spacing-24;
  padding-top: $spacing-16;

  &[hidden] {
    display: none;
  }
}

.pricing-dashboard-mockup__kpis {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: $spacing-40;
}

.pricing-dashboard-mockup__kpi-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.pricing-dashboard-mockup__kpi-value {
  margin-top: $spacing-4;
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.pricing-dashboard-mockup__kpi-value--profit {
  color: $color-accent-green;
}

.pricing-dashboard-mockup__kpi-menu {
  margin-left: auto;
}

.pricing-dashboard-mockup__legend {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-16;
}

.pricing-dashboard-mockup__legend-item {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.pricing-dashboard-mockup__legend-swatch {
  display: inline-block;
  width: $size-12;
  height: $size-12;
  border-radius: $radius-4;
}

.pricing-dashboard-mockup__empty {
  padding: $spacing-24;
  color: $color-ink-40;
  text-align: center;
}

.pricing-dashboard-mockup__table-product,
.pricing-dashboard-mockup__table-price {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  white-space: nowrap;
}

// Gap/altura reduzidos, pedido direto do usuário — pensando em planilhas
// reais com 50+ produtos, densidade importa mais que respiro aqui
// (diferente de um card de dashboard solto). `{spacing.20}`→`{spacing.12}`
// entre linhas, `{spacing.8}`→`{spacing.4}` entre nome/preço e a barra,
// altura da barra `{size.24}`→`{size.16}` (ver bloco `__bar` abaixo).
.pricing-dashboard-mockup__products {
  display: flex;
  flex-direction: column;
  gap: $spacing-12;
}

.pricing-dashboard-mockup__product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-4;
}

.pricing-dashboard-mockup__product-title {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

// `<p>` global (`_reset.scss`) ganha `margin-bottom: $font-size-md` via
// `paragraph-spacing` (espaçamento de PARÁGRAFO de prosa, não de texto de
// UI — design-system.md, seção Typography: "Texto de UI (label, botão)
// não herda esse espaçamento — fica em 0 por padrão"). Sem esse reset,
// a margem invisível inflava a altura da caixa deste `<p>` bem mais que
// o ícone ao lado (`Button` ghost 28px), e o `align-items: center` da
// linha centralizava as duas CAIXAS (não o texto visível dentro delas) —
// resultado: nome/preço apareciam desalinhados verticalmente contra o
// ícone, mesmo com a linha inteira "centralizada". Achado real, reportado
// pelo usuário com captura de tela ("deixe alinhado bonitinho").
.pricing-dashboard-mockup__product-name {
  margin-bottom: 0;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.pricing-dashboard-mockup__product-meta {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.pricing-dashboard-mockup__product-price {
  margin-bottom: 0;
  font-size: $font-size-sm;
  color: $color-ink;
}

.pricing-dashboard-mockup__product-margin {
  color: $color-accent-green;
}

.pricing-dashboard-mockup__bar {
  display: flex;
  overflow: hidden;
  height: $size-16;
  border-radius: $radius-8;
}

.pricing-dashboard-mockup__segment {
  display: block;
  flex-shrink: 0;
  height: 100%;

  &:focus-visible {
    @include focus-ring;
  }
}

// Rampa sequencial construída em cima dos acentos já existentes
// (`{colors.accent-orange}` → `{colors.accent-red}` → `{colors.ink}`),
// nunca uma cor nova fora da escala — mesma técnica de `color-mix` já
// usada em `StatusDot` `variant="pill"`/`DateRangePicker`, só aplicada
// numa progressão em vez de um tom só. `profit` fecha em
// `{colors.accent-green}` sólido, mesma cor já usada pra "lucro"/valor
// positivo no resto do app (`StatCard`, `MySubscriptionView`).
.pricing-dashboard-mockup__segment--costPrice {
  background-color: color-mix(in srgb, $color-accent-orange 30%, $color-bg-2);
}

.pricing-dashboard-mockup__segment--commission {
  background-color: color-mix(in srgb, $color-accent-orange 60%, $color-bg-2);
}

.pricing-dashboard-mockup__segment--fixedFee {
  background-color: $color-accent-orange;
}

.pricing-dashboard-mockup__segment--operational {
  background-color: color-mix(in srgb, $color-accent-orange 50%, $color-accent-red);
}

.pricing-dashboard-mockup__segment--campaignDiscount {
  background-color: $color-accent-red;
}

.pricing-dashboard-mockup__segment--tax {
  background-color: color-mix(in srgb, $color-accent-red 70%, $color-ink);
}

.pricing-dashboard-mockup__segment--ads {
  background-color: color-mix(in srgb, $color-accent-red 45%, $color-ink);
}

.pricing-dashboard-mockup__segment--profit {
  background-color: $color-accent-green;
}

.pricing-dashboard-mockup__legend-swatch--costPrice {
  @extend .pricing-dashboard-mockup__segment--costPrice;
}

.pricing-dashboard-mockup__legend-swatch--commission {
  @extend .pricing-dashboard-mockup__segment--commission;
}

.pricing-dashboard-mockup__legend-swatch--fixedFee {
  @extend .pricing-dashboard-mockup__segment--fixedFee;
}

.pricing-dashboard-mockup__legend-swatch--operational {
  @extend .pricing-dashboard-mockup__segment--operational;
}

.pricing-dashboard-mockup__legend-swatch--campaignDiscount {
  @extend .pricing-dashboard-mockup__segment--campaignDiscount;
}

.pricing-dashboard-mockup__legend-swatch--tax {
  @extend .pricing-dashboard-mockup__segment--tax;
}

.pricing-dashboard-mockup__legend-swatch--ads {
  @extend .pricing-dashboard-mockup__segment--ads;
}

.pricing-dashboard-mockup__legend-swatch--profit {
  @extend .pricing-dashboard-mockup__segment--profit;
}
</style>
