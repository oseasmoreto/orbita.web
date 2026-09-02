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
 * Sem update — trocar de canal é sempre `DELETE` + `POST` de novo (sem
 * `suggested_price`/`is_approximated` não sobra campo mutável,
 * `pricing.php`).
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { ArrowLineLeft, Trash } from '@/shared/components/icons/regular.generated'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import Button from '@/shared/components/ui/Button.vue'
import IconText from '@/shared/components/ui/IconText.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Select from '@/shared/components/ui/Select.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import MarketplaceLogo from '../components/MarketplaceLogo.vue'
import { useProductMarketplaces } from '../composables/useProductMarketplaces'
import { getProductName } from '../services/pricingApi'
import type { ProductMarketplaceRow } from '../composables/useProductMarketplaces'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()
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
  { key: 'createdAt', title: t('pricing.productMarketplaces.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

const isLinkModalOpen = ref(false)
const selectedConnectionId = ref('')
const selectedCategoryId = ref('')
const isLinking = ref(false)

function openLinkModal(): void {
  selectedConnectionId.value = ''
  selectedCategoryId.value = ''
  isLinkModalOpen.value = true
}

// Categoria reseta sempre que a conexão muda — o `Select` de categoria
// que estava marcado pode não existir mais no marketplace da NOVA
// conexão escolhida (tarefa 64: categoria é sempre por marketplace).
watch(selectedConnectionId, () => {
  selectedCategoryId.value = ''
})

const categoryOptionsForSelectedConnection = computed<SelectOption[]>(() =>
  selectedConnectionId.value
    ? productMarketplaces.categoryOptionsFor(selectedConnectionId.value)
    : [],
)

async function handleLink(): Promise<void> {
  if (!selectedConnectionId.value) {
    return
  }

  isLinking.value = true

  try {
    await productMarketplaces.link(selectedConnectionId.value, selectedCategoryId.value)
    toast.success(t('pricing.productMarketplaces.linkSuccess'))
    isLinkModalOpen.value = false
  } catch (caughtError) {
    toast.error(resolveMessage(parseApiError(caughtError).messageKey))
  } finally {
    isLinking.value = false
  }
}

const unlinkConfirmation = useConfirmAction<ProductMarketplaceRow>()

async function handleUnlink(): Promise<void> {
  await unlinkConfirmation.confirm(async (target) => {
    await productMarketplaces.unlink(target.id)
    toast.success(t('pricing.productMarketplaces.unlinkSuccess'))
  })
}

function goBackToProducts(): void {
  void router.push({ name: 'products' })
}
</script>

<template>
  <div class="product-marketplaces-view">
    <div class="product-marketplaces-view__header">
      <div>
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
      <Button
        :disabled="productMarketplaces.availableOptions.value.length === 0"
        variant="primary"
        @click="openLinkModal"
      >
        {{ $t('pricing.productMarketplaces.linkButton') }}
      </Button>
    </div>

    <p
      v-if="productMarketplaces.availableOptions.value.length === 0"
      class="product-marketplaces-view__hint"
    >
      {{ $t('pricing.productMarketplaces.noAvailableConnectionsHint') }}
    </p>

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
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <Button :icon-before="Trash" variant="ghost" @click="unlinkConfirmation.request(row)">
          {{ $t('pricing.productMarketplaces.unlinkButton') }}
        </Button>
      </template>
      <template #empty>
        {{ $t('pricing.productMarketplaces.empty') }}
      </template>
    </DataTable>

    <Modal v-model="isLinkModalOpen" :title="$t('pricing.productMarketplaces.linkModal.title')">
      <Select
        v-model="selectedConnectionId"
        :label="$t('pricing.productMarketplaces.linkModal.fields.connection')"
        :options="productMarketplaces.availableOptions.value"
        :placeholder="$t('pricing.productMarketplaces.linkModal.placeholder')"
      />

      <!--
        Categoria é sempre OPCIONAL (tarefa 64) — só aparece quando o
        marketplace da conexão escolhida tem alguma categoria com
        comissão configurada (`categoryOptionsFor`, `useProductMarketplaces.ts`).
        Nem todo marketplace cobra por categoria.
      -->
      <Select
        v-if="categoryOptionsForSelectedConnection.length > 0"
        v-model="selectedCategoryId"
        class="product-marketplaces-view__category-select"
        :label="$t('pricing.productMarketplaces.linkModal.fields.category')"
        :options="categoryOptionsForSelectedConnection"
        :placeholder="$t('pricing.productMarketplaces.linkModal.categoryPlaceholder')"
      />

      <template #footer>
        <Button variant="outline" @click="isLinkModalOpen = false">
          {{ $t('common.actions.cancel') }}
        </Button>
        <Button
          :disabled="isLinking || !selectedConnectionId"
          variant="primary"
          @click="handleLink"
        >
          {{ $t('pricing.productMarketplaces.linkModal.submit') }}
        </Button>
      </template>
    </Modal>

    <ConfirmDialog
      v-model:open="unlinkConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('pricing.productMarketplaces.unlinkButton')"
      :description="$t('pricing.productMarketplaces.unlinkConfirm.description')"
      :title="$t('pricing.productMarketplaces.unlinkConfirm.title')"
      @cancel="unlinkConfirmation.cancel()"
      @confirm="handleUnlink()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.product-marketplaces-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.product-marketplaces-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
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

.product-marketplaces-view__hint {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.product-marketplaces-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}

.product-marketplaces-view__category-select {
  margin-top: $spacing-16;
}
</style>
