<script setup lang="ts">
/**
 * Dashboard real (2026-08-28), substitui a antiga vitrine de componentes
 * na rota `home` — a vitrine continua existindo em `/showcase`
 * (`ShowcaseView.vue`), só saiu do caminho principal do app.
 *
 * Estrutura grounded numa captura de referência (dashboard genérico
 * "eCommerce" do template SnowUI) — adaptada pro domínio real do Orbita,
 * não copiada 1:1: métricas viram `PRODUCT`/`USER_MARKETPLACE`/
 * `PRODUCT_MARKETPLACE`/`PLAN` (não "Views"/"Customers"/"Orders" de uma
 * loja), e a seção "Revenue by Location" (mapa) saiu — Orbita não tem
 * dimensão geográfica de venda nenhuma no domínio.
 *
 * **Casca pronta, dado 100% placeholder** — mesmo critério já usado em
 * `StatCard`/`ChartCard` desde a Fase 0.5: o conteúdo real (contagem de
 * produtos, marketplaces conectados, preço sugerido) depende do módulo
 * Pricing (Fase 4 de `docs/planejamento/plano-implementacao.md`), que
 * ainda não tem `services`/`composables` implementados — e mesmo quando
 * tiver, "preço sugerido" segue bloqueado pelo gap de backend já
 * documentado (`PricingCalculator` nunca exposto em rota). Vira consumo
 * real de API assim que essa fase acontecer, sem mudar a estrutura visual
 * daqui.
 */
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  DotsThreeOutlineVertical,
  Download,
  PencilSimpleLine,
  Storefront,
  Trash,
  Warning,
} from '@/shared/components/icons/regular.generated'
import ChartCard from '@/shared/components/blocks/ChartCard.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import StatCard from '@/shared/components/blocks/StatCard.vue'
import Avatar from '@/shared/components/ui/Avatar.vue'
import Badge from '@/shared/components/ui/Badge.vue'
import Button from '@/shared/components/ui/Button.vue'
import DropdownMenu from '@/shared/components/ui/DropdownMenu.vue'
import IconText from '@/shared/components/ui/IconText.vue'
import ProgressBar from '@/shared/components/ui/ProgressBar.vue'
import type { ChartMetricOption } from '@/shared/components/blocks/types/chartCard.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { DropdownMenuOption } from '@/shared/components/ui/types/dropdownMenu.type'

interface ProductRow {
  createdAt: string
  id: string
  margin: 'ok' | 'low'
  marketplace: string
  name: string
  price: string
}

const { t } = useI18n()

/**
 * Nomes de marketplace, uma vez só via `common.marketplaces` (pedido
 * direto do usuário, 2026-08-28: não duplicar a mesma string em cada
 * lugar que precisa mostrar um marketplace — gráfico, tabela, futuro
 * CRUD). Placeholder até `MARKETPLACE.name` vir de verdade da API
 * (Fase 4) — quando existir, o nome vem do backend, não daqui.
 */
const marketplace = {
  amazon: t('common.marketplaces.amazon'),
  magalu: t('common.marketplaces.magalu'),
  mercadoLivre: t('common.marketplaces.mercadoLivre'),
  other: t('common.marketplaces.other'),
  shopee: t('common.marketplaces.shopee'),
  tiktok: t('common.marketplaces.tiktok'),
}

const productColumns: DataTableColumn[] = [
  { key: 'name', sortable: true, title: t('dashboard.recentProducts.columns.product') },
  { key: 'price', sortable: true, title: t('dashboard.recentProducts.columns.price') },
  { key: 'margin', title: t('dashboard.recentProducts.columns.margin') },
  { key: 'marketplace', title: t('dashboard.recentProducts.columns.marketplace') },
  { key: 'createdAt', sortable: true, title: t('dashboard.recentProducts.columns.createdAt') },
  { key: 'operations', title: '' },
]

const rowActions: DropdownMenuOption[] = [
  { icon: PencilSimpleLine, key: 'edit', label: t('common.actions.edit') },
  { icon: Download, key: 'download', label: t('common.actions.download') },
  { icon: Trash, key: 'delete', label: t('common.actions.delete'), separatorBefore: true },
]

const productRows: ProductRow[] = [
  {
    createdAt: '12/08/2026',
    id: '1',
    margin: 'ok',
    marketplace: marketplace.shopee,
    name: 'Camiseta azul',
    price: 'R$ 59,90',
  },
  {
    createdAt: '10/08/2026',
    id: '2',
    margin: 'low',
    marketplace: marketplace.mercadoLivre,
    name: 'Tênis esportivo',
    price: 'R$ 199,90',
  },
  {
    createdAt: '08/08/2026',
    id: '3',
    margin: 'ok',
    marketplace: marketplace.amazon,
    name: 'Fone de ouvido',
    price: 'R$ 89,90',
  },
]

function handleRowAction(_productName: string, _actionKey: string): void {
  // Casca pronta — sem `services/pricingApi.ts`/`catalogApi.ts` ainda (Fase 3/4).
}

const chartMetrics: ChartMetricOption[] = [
  { key: 'price', label: t('dashboard.charts.suggestedPrice') },
  { key: 'margin', label: t('dashboard.charts.margin') },
]
const activeChartMetric = ref('price')
</script>

<template>
  <div class="dashboard">
    <p class="dashboard__eyebrow">{{ $t('dashboard.eyebrow') }}</p>

    <section class="dashboard__top">
      <div class="dashboard__stats-grid">
        <StatCard
          :label="$t('dashboard.stats.productsRegistered')"
          tint="blue"
          :trend="{ direction: 'up', value: '+12%' }"
          value="128"
        />
        <StatCard
          :icon="Storefront"
          :label="$t('dashboard.stats.marketplacesConnected')"
          tint="purple"
          value="3"
        />
        <StatCard
          :label="$t('dashboard.stats.activeLinks')"
          tint="neutral"
          :trend="{ direction: 'up', value: '+8%' }"
          value="94"
        />
        <StatCard
          :icon="Warning"
          :label="$t('dashboard.stats.outOfMargin')"
          tint="neutral"
          value="7"
        />
      </div>

      <ChartCard
        class="dashboard__top-chart"
        :labels="[
          marketplace.shopee,
          marketplace.tiktok,
          marketplace.amazon,
          marketplace.mercadoLivre,
          marketplace.magalu,
          marketplace.other,
        ]"
        :series="[{ label: $t('dashboard.charts.products'), values: [18, 32, 22, 40, 12, 26] }]"
        :title="$t('dashboard.charts.productsByMarketplace')"
        type="bar"
      />
    </section>

    <section class="dashboard__row">
      <ChartCard
        v-model:active-metric="activeChartMetric"
        class="dashboard__row-main"
        :labels="['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']"
        :metrics="chartMetrics"
        :series="[
          { label: $t('dashboard.charts.thisMonth'), values: [42, 45, 41, 48, 50, 47, 49] },
          {
            dashed: true,
            label: $t('dashboard.charts.lastMonth'),
            values: [38, 40, 44, 43, 46, 45, 48],
          },
        ]"
        :title="$t('dashboard.charts.suggestedPrice')"
        type="line"
      />

      <div class="dashboard__usage-card">
        <h2 class="dashboard__card-title">{{ $t('dashboard.planUsage.title') }}</h2>

        <div class="dashboard__usage-row">
          <ProgressBar :label="$t('dashboard.planUsage.products')" :max="200" :value="128" />
          <span class="dashboard__usage-count">128 / 200</span>
        </div>

        <div class="dashboard__usage-row">
          <ProgressBar :label="$t('dashboard.planUsage.marketplaces')" :max="5" :value="3" />
          <span class="dashboard__usage-count">3 / 5</span>
        </div>
      </div>
    </section>

    <section class="dashboard__row">
      <div class="dashboard__row-main">
        <h2 class="dashboard__card-title">{{ $t('dashboard.recentProducts.title') }}</h2>
        <DataTable :columns="productColumns" :rows="productRows">
          <template #cell-margin="{ row }">
            <Badge :variant="row.margin === 'ok' ? 'gray' : 'ghost'">
              {{
                row.margin === 'ok'
                  ? $t('dashboard.recentProducts.withinMargin')
                  : $t('dashboard.recentProducts.outsideMargin')
              }}
            </Badge>
          </template>
          <template #cell-marketplace="{ row }">
            <IconText :text="row.marketplace">
              <Avatar :name="row.marketplace" :size="20" />
            </IconText>
          </template>
          <template #cell-operations="{ row }">
            <DropdownMenu :options="rowActions" @select="(key) => handleRowAction(row.name, key)">
              <Button
                :aria-label="$t('common.actions.actions')"
                :icon-before="DotsThreeOutlineVertical"
                variant="ghost"
              />
            </DropdownMenu>
          </template>
        </DataTable>
      </div>

      <ChartCard
        :labels="[marketplace.shopee, marketplace.mercadoLivre, marketplace.amazon, marketplace.other]"
        :series="[{ label: $t('dashboard.charts.products'), values: [52, 23, 14, 11] }]"
        :title="$t('dashboard.charts.marketplaceShare')"
        type="doughnut"
      />
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.dashboard {
  display: flex;
  flex-direction: column;
  gap: $spacing-24;
  padding: $spacing-24;
}

.dashboard__eyebrow {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.dashboard__top {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;

  @media (min-width: $breakpoint-lg) {
    flex-direction: row;
    align-items: stretch;
  }
}

.dashboard__stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $spacing-16;

  @media (min-width: $breakpoint-lg) {
    flex: 1;
  }
}

.dashboard__top-chart {
  @media (min-width: $breakpoint-lg) {
    flex: 1.2;
  }
}

.dashboard__row {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;

  @media (min-width: $breakpoint-lg) {
    flex-direction: row;
    align-items: stretch;
  }
}

.dashboard__row-main {
  display: flex;
  flex-direction: column;
  gap: $spacing-12;

  @media (min-width: $breakpoint-lg) {
    flex: 2;
  }
}

.dashboard__row > :not(.dashboard__row-main) {
  @media (min-width: $breakpoint-lg) {
    flex: 1;
  }
}

.dashboard__card-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.dashboard__usage-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-20;
  padding: $spacing-24;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

.dashboard__usage-row {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
}

.dashboard__usage-count {
  align-self: flex-end;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
