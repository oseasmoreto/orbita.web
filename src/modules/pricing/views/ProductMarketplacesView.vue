<script setup lang="ts">
/**
 * Vínculo produto↔marketplace (`PRODUCT_MARKETPLACE`) — rota PRÓPRIA
 * (`/products/:id/marketplaces`, não uma aba dentro do Drawer de edição
 * de `ProductsView.vue`) de propósito: `PRODUCT_MARKETPLACE` é do
 * Bounded Context Pricing no backend (`Api/Pricing/ProductMarketplaceController`,
 * mesmo com a URL aninhada sob `/products`), e um módulo nunca importa
 * de outro diretamente (`docs/infra/convencoes-frontend-infra.md` seção
 * 2) — `modules/catalog` só navega pra cá via `router.push` nomeado
 * (`ProductsView.vue`), nunca importa nada deste módulo.
 *
 * Cabeçalho mostra o NOME do produto — este módulo não importa
 * `modules/catalog/types/product.type.ts`/`catalogApi.ts` só por causa
 * disso; `getProductName()` (`pricingApi.ts`) lê só o campo necessário
 * do mesmo endpoint `GET /products/{id}` que Catalog já consome, sem
 * duplicar o tipo `Product`/`toProduct()` inteiro.
 *
 * `practicedPrice`/`categoryId` (`category_id` virou mutável via `PATCH`
 * em 2026-09-10) editáveis via `UpdatePracticedPriceModal.vue`, mesmo
 * modal reaproveitado por `ProductMarketplacePricingView.vue` — ver
 * comentário nele.
 *
 * **Sem modal de "vincular marketplace" (removido em 2026-09-10)** —
 * backend passou a criar `PRODUCT_MARKETPLACE` automaticamente (todo
 * produto já nasce vinculado a toda `USER_MARKETPLACE` ativa do usuário,
 * e vice-versa): a tela sempre chega aqui já com todo vínculo possível
 * existindo, então o antigo fluxo de criar (`POST`, `Select` de conexão +
 * categoria) ficaria permanentemente vazio/inalcançável.
 *
 * **Sem "Desvincular" (removido no mesmo dia)** — o endpoint `DELETE`
 * foi removido do backend junto: o vínculo nasceu pensado só como passo
 * interno de "trocar categoria" (apaga + recria), nunca como feature
 * permanente de excluir produto de canal; com o vínculo automático +
 * seeder de backfill (roda em todo deploy, recria vínculo faltante), uma
 * exclusão manual seria desfeita silenciosamente no próximo deploy —
 * achado do backend depois desta tela ter chegado a implementar
 * "Desvincular" numa rodada anterior. Coluna "Ações" some junto (nada
 * mais restava nela — editar preço já é o lápis dentro da própria
 * célula "Preço praticado").
 */
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ArrowLineLeft, PencilSimpleLine } from '@/shared/components/icons/regular.generated'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import Button from '@/shared/components/ui/Button.vue'
import IconText from '@/shared/components/ui/IconText.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { formatMoney } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import MarketplaceLogo from '../components/MarketplaceLogo.vue'
import UpdatePracticedPriceModal from '../components/UpdatePracticedPriceModal.vue'
import { useProductMarketplaces } from '../composables/useProductMarketplaces'
import { getProductName } from '../services/pricingApi'
import type { ProductMarketplaceRow } from '../composables/useProductMarketplaces'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const productId = route.params.id as string
const productName = ref<string | null>(null)

const productMarketplaces = useProductMarketplaces(productId)

onMounted(async () => {
  await productMarketplaces.refresh()
  try {
    productName.value = await getProductName(productId)
  } catch {
    // Nome é só decorativo no cabeçalho — se o produto sumiu entre a
    // navegação e esta busca, a listagem de vínculos já mostra vazio/erro
    // sozinha, sem precisar de um segundo tratamento aqui.
    productName.value = null
  }
})

const listErrorMessage = computed(() =>
  productMarketplaces.error.value
    ? resolveMessage(parseApiError(productMarketplaces.error.value).messageKey)
    : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'marketplaceName', title: t('pricing.productMarketplaces.columns.marketplace') },
  { key: 'storeName', title: t('pricing.productMarketplaces.columns.storeName') },
  { key: 'categoryTitle', title: t('pricing.productMarketplaces.columns.category') },
  { key: 'practicedPrice', title: t('pricing.productMarketplaces.columns.practicedPrice') },
  { key: 'createdAt', title: t('pricing.productMarketplaces.columns.createdAt') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

const isEditPriceModalOpen = ref(false)
const editingPriceRow = ref<ProductMarketplaceRow | null>(null)
const editingPriceRowCategoryOptions = computed(() =>
  editingPriceRow.value
    ? productMarketplaces.categoryOptionsFor(editingPriceRow.value.userMarketplaceId)
    : [],
)

function openEditPrice(row: ProductMarketplaceRow): void {
  editingPriceRow.value = row
  isEditPriceModalOpen.value = true
}

function handlePriceSaved(): void {
  void productMarketplaces.refresh()
}

function goBackToProducts(): void {
  void router.push({ name: 'products' })
}
</script>

<template>
  <div class="product-marketplaces-view">
    <div class="product-marketplaces-view__header">
      <Button
        class="product-marketplaces-view__back"
        :icon-before="ArrowLineLeft"
        variant="ghost"
        @click="goBackToProducts"
      >
        {{ $t('pricing.productMarketplaces.backToProducts') }}
      </Button>
      <h1 class="product-marketplaces-view__title">
        {{
          productName
            ? $t('pricing.productMarketplaces.titleWithProduct', { product: productName })
            : $t('pricing.productMarketplaces.title')
        }}
      </h1>
    </div>

    <p v-if="listErrorMessage" class="product-marketplaces-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable :columns="columns" :rows="productMarketplaces.rows.value" row-key="id">
      <template #cell-marketplaceName="{ row }">
        <IconText :text="row.marketplaceName">
          <MarketplaceLogo :logo-url="row.marketplaceLogoUrl" :name="row.marketplaceName" :size="24" />
        </IconText>
      </template>
      <template #cell-categoryTitle="{ row }">
        {{ row.categoryTitle ?? '—' }}
      </template>
      <template #cell-practicedPrice="{ row }">
        <div class="product-marketplaces-view__price-cell">
          <span>{{ row.practicedPrice !== null ? formatMoney(row.practicedPrice) : '—' }}</span>
          <Button
            :aria-label="$t('pricing.productMarketplacePricing.editPriceButton')"
            :icon-before="PencilSimpleLine"
            variant="ghost"
            @click="openEditPrice(row)"
          />
        </div>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #empty>
        {{ $t('pricing.productMarketplaces.empty') }}
      </template>
    </DataTable>

    <UpdatePracticedPriceModal
      v-model="isEditPriceModalOpen"
      :category-options="editingPriceRowCategoryOptions"
      :label="
        editingPriceRow
          ? `${editingPriceRow.marketplaceName} — ${editingPriceRow.storeName}`
          : undefined
      "
      :row="editingPriceRow"
      @saved="handlePriceSaved"
    />
  </div>
</template>

<style scoped lang="scss">

.product-marketplaces-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.product-marketplaces-view__header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $spacing-16;
}

.product-marketplaces-view__back {
  margin-bottom: $spacing-4;
}

.product-marketplaces-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.product-marketplaces-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}

.product-marketplaces-view__price-cell {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  white-space: nowrap;
}
</style>
