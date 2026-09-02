<script setup lang="ts">
/**
 * CRUD de `PRODUCT_CATEGORY` — exclusivo do admin (tarefa 64). Mesma
 * forma exata de `AdminMarketplacesView.vue`, sem aba dentro do Drawer
 * de edição (categoria não tem conteúdo aninhado próprio — comissão por
 * marketplace mora na aba "Categorias" de `AdminMarketplacesView.vue`,
 * não aqui).
 *
 * Filtro de `marketplace_id` (`ListToolbar` `#filters`, pedido do usuário
 * no planejamento da tarefa 64) mostra só categorias já com comissão
 * configurada pra um marketplace específico — `useMarketplaceOptions.ts`
 * alimenta o `Select`, mesmo padrão de `useAdminUserOptions`/
 * `useAdminPlanOptions` já usado noutros CRUDs admin.
 */
import { PencilSimpleLine, Trash } from '@/shared/components/icons/regular.generated'
import dayjs from 'dayjs'
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import Button from '@/shared/components/ui/Button.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Select from '@/shared/components/ui/Select.vue'
import AdminProductCategoryForm from '../components/AdminProductCategoryForm.vue'
import { useAdminProductCategoryList } from '../composables/useAdminProductCategoryList'
import { useMarketplaceOptions } from '../composables/useMarketplaceOptions'
import { deleteAdminProductCategory } from '../services/pricingApi'
import type { ProductCategory } from '../types/productCategory.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminProductCategoryList()
onMounted(list.refresh)

const marketplaceOptions = useMarketplaceOptions()
onMounted(marketplaceOptions.load)

const activeFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('common.status.active'), value: 'true' },
  { label: t('common.status.inactive'), value: 'false' },
])

const marketplaceFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  ...marketplaceOptions.options.value,
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const drawer = useCrudDrawer<ProductCategory>()
const deleteConfirmation = useConfirmAction<ProductCategory>()

const columns = computed<DataTableColumn[]>(() => [
  { key: 'title', sortable: true, title: t('pricing.admin.productCategories.columns.title') },
  { key: 'active', title: t('pricing.admin.productCategories.columns.active') },
  {
    key: 'createdAt',
    sortable: true,
    title: t('pricing.admin.productCategories.columns.createdAt'),
  },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteAdminProductCategory(target.id)
    toast.success(t('pricing.admin.productCategories.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  drawer.close()
  void list.refresh()
}
</script>

<template>
  <div class="admin-product-categories-view">
    <h1 class="admin-product-categories-view__title">
      {{ $t('pricing.admin.productCategories.title') }}
    </h1>

    <ListToolbar
      :add-label="$t('pricing.admin.productCategories.createButton')"
      :filterable="false"
      :searchable="false"
      :sortable="false"
      @add="drawer.openCreate()"
    >
      <template #filters>
        <Select
          :label="$t('pricing.admin.productCategories.filters.active')"
          :model-value="list.activeFilter.value"
          :options="activeFilterOptions"
          @update:model-value="(value) => list.setActiveFilter(value)"
        />
        <Select
          :label="$t('pricing.admin.productCategories.filters.marketplace')"
          :model-value="list.marketplaceFilter.value"
          :options="marketplaceFilterOptions"
          @update:model-value="(value) => list.setMarketplaceFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-product-categories-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-active="{ row }">
        <StatusDot :color="row.active ? 'green' : 'gray'">
          {{
            row.active
              ? $t('pricing.admin.productCategories.status.active')
              : $t('pricing.admin.productCategories.status.inactive')
          }}
        </StatusDot>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="admin-product-categories-view__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="drawer.openEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button :icon-before="Trash" variant="ghost" @click="deleteConfirmation.request(row)">
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('pricing.admin.productCategories.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Drawer
      v-model="drawer.isOpen.value"
      size="md"
      :title="
        drawer.mode.value === 'create'
          ? $t('pricing.admin.productCategories.form.createTitle')
          : $t('pricing.admin.productCategories.form.editTitle')
      "
    >
      <AdminProductCategoryForm
        :category="drawer.editingRecord.value"
        :mode="drawer.mode.value"
        @cancel="drawer.close()"
        @saved="handleSaved"
      />
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('pricing.admin.productCategories.deleteConfirm.description')"
      :title="$t('pricing.admin.productCategories.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-product-categories-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-product-categories-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-product-categories-view__row-actions {
  display: flex;
  gap: $spacing-4;
}

.admin-product-categories-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
