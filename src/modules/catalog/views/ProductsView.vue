<script setup lang="ts">
/**
 * Primeiro CRUD real do Orbita (pedido direto do usuário, 2026-08-28,
 * grounded numa captura de referência de uma tela "Order List" —
 * estrutura adaptada, não copiada: sem coluna de usuário/endereço, que
 * não existem no domínio de `PRODUCT`). Consome `GET/POST/PATCH/DELETE
 * /products`, endpoint real já implementado no backend
 * (`core/api/schema.d.ts` tem `ProductResource` gerado de verdade — não
 * é dado placeholder como o dashboard, `HomeView.vue`).
 *
 * **Padrão pra reutilizar em qualquer CRUD futuro** (pedido explícito):
 * `useResourceList`/`useCrudDrawer`/`useConfirmAction`
 * (`shared/composables/`) fazem TODO o estado genérico — este arquivo só
 * pluga `catalogApi`/`ProductForm` neles. Um CRUD novo (ex.: Marketplaces
 * conectados, Fase 4) repete exatamente esta forma, trocando só o
 * service/tipo/colunas/form.
 *
 * Colunas espelham só campos reais de `ProductResource` — sem
 * "Marketplace" (isso é `PRODUCT_MARKETPLACE`, fora do CRUD de produto)
 * nem badge de "dentro/fora da margem" (precisaria do preço sugerido,
 * gap de backend já registrado — `PricingCalculator` nunca exposto em
 * rota). `targetMargin` aparece como o valor configurado, não um status
 * calculado.
 */
import { PencilSimpleLine, Trash } from '@/shared/components/icons/regular.generated'
import dayjs from 'dayjs'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import ProductForm from '../components/ProductForm.vue'
// MOCK TEMPORÁRIO (ver `services/catalogApi.mock.ts`) — trocar de volta pra
// `../services/catalogApi` quando a Fase 1 (Identity/login) existir.
import { deleteProduct } from '../services/catalogApi.mock'
import { useProductList } from '../composables/useProductList'
import type { Product } from '../types/product.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useProductList()
void list.refresh()

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const drawer = useCrudDrawer<Product>()
const deleteConfirmation = useConfirmAction<Product>()

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', sortable: true, title: t('catalog.products.columns.name') },
  { key: 'sku', title: t('catalog.products.columns.sku') },
  { key: 'fullSalePrice', sortable: true, title: t('catalog.products.columns.fullSalePrice') },
  { key: 'targetMargin', title: t('catalog.products.columns.targetMargin') },
  { key: 'createdAt', sortable: true, title: t('catalog.products.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteProduct(target.id)
    toast.success(t('catalog.products.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  drawer.close()
  void list.refresh()
}
</script>

<template>
  <div class="products-view">
    <h1 class="products-view__title">{{ $t('catalog.products.title') }}</h1>

    <!--
      `filterable`/`sortable` desligados de propósito (2026-08-28, achado
      do usuário: botão sem ação): ordenação já existe via clique no
      cabeçalho da `DataTable` (nome/preço/data — as únicas 3 colunas que
      a API real aceita `sort`, ver `useProductList.ts`), um botão de
      "Ordenar" genérico ao lado não teria nenhuma ação própria pra
      disparar. Filtro não tem nenhuma dimensão real além do SKU, que a
      busca já cobre (`filter[sku]`, a única query da API pra produto) —
      não existe um segundo filtro pra esse botão abrir.
    -->
    <ListToolbar
      v-model:search="list.searchInput.value"
      :add-label="$t('catalog.products.createButton')"
      :filterable="false"
      :search-placeholder="$t('catalog.products.searchPlaceholder')"
      :sortable="false"
      @add="drawer.openCreate()"
    />

    <p v-if="listErrorMessage" class="products-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-fullSalePrice="{ row }">
        {{ formatMoney(row.fullSalePrice) }}
      </template>
      <template #cell-targetMargin="{ row }">
        {{ formatPercent(row.targetMargin) }}
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="products-view__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="drawer.openEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button
            :icon-before="Trash"
            variant="ghost"
            @click="deleteConfirmation.request(row)"
          >
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('catalog.products.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Drawer
      v-model="drawer.isOpen.value"
      :title="
        drawer.mode.value === 'create'
          ? $t('catalog.products.form.createTitle')
          : $t('catalog.products.form.editTitle')
      "
      size="md"
    >
      <ProductForm
        :mode="drawer.mode.value"
        :product="drawer.editingRecord.value"
        @cancel="drawer.close()"
        @saved="handleSaved"
      />
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('catalog.products.deleteConfirm.description')"
      :title="$t('catalog.products.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.products-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.products-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.products-view__row-actions {
  display: flex;
  gap: $spacing-4;
}

// `color-mix()` (mesma técnica já usada em `StatusDot.vue`, variante
// `pill`) deriva um fundo claro a partir de `$color-accent-red` — não
// existe token de "tint vermelho" pronto na escala (só `tint-1`/`tint-2`,
// azul/roxo), e essa técnica já é convenção do projeto pra esse caso.
.products-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
