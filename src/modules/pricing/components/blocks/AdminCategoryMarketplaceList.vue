<script setup lang="ts">
/**
 * "Categorias" — comissão por categoria num marketplace específico,
 * sempre aninhada a UM marketplace, nunca uma listagem própria (tarefa
 * 64). Mesmo padrão exato de `AdminPricingRuleList.vue`: `useResourceList`/
 * `useCrudDrawer`/`useConfirmAction`, `Modal.vue` (já dentro do Drawer de
 * edição do marketplace).
 */
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PencilSimpleLine, Trash } from '@/shared/components/icons/regular.generated'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useToast } from '@/shared/composables/useToast'
import { formatPercent } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import AdminCategoryMarketplaceForm from '../AdminCategoryMarketplaceForm.vue'
import { useAdminCategoryMarketplaceList } from '../../composables/useAdminCategoryMarketplaceList'
import {
  deleteAdminCategoryMarketplace,
  listAdminProductCategories,
} from '../../services/pricingApi'
import type { CategoryMarketplace } from '../../types/categoryMarketplace.type'
import type { ProductCategory } from '../../types/productCategory.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{ marketplaceId: string }>()

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminCategoryMarketplaceList(props.marketplaceId)
onMounted(list.refresh)

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const modal = useCrudDrawer<CategoryMarketplace>()
const deleteConfirmation = useConfirmAction<CategoryMarketplace>()

/**
 * Opções pro `Select` de "vincular categoria" — todas as categorias
 * ATIVAS ainda NÃO vinculadas a este marketplace (evita a Action recusar
 * com `errorMessageCategoryAlreadyLinkedToMarketplace` — validação de
 * UI, mesmo critério de `buildAvailableConnectionOptions`,
 * `useProductMarketplaces.ts`). Buscado uma vez, à parte da paginação da
 * lista de vínculos.
 */
const allActiveCategories = ref<ProductCategory[]>([])

async function loadAllActiveCategories(): Promise<void> {
  const result = await listAdminProductCategories({ active: true, perPage: 100 })
  allActiveCategories.value = result.items
}

onMounted(loadAllActiveCategories)

const availableCategoryOptions = computed<SelectOption[]>(() => {
  const linkedCategoryIds = new Set(list.items.value.map((link) => link.categoryId))
  return allActiveCategories.value
    .filter((category) => !linkedCategoryIds.has(category.id))
    .map((category) => ({ label: category.title, value: category.id }))
})

const columns = computed<DataTableColumn[]>(() => [
  { key: 'category', title: t('pricing.admin.categoryMarketplaces.columns.category') },
  {
    key: 'commissionPercentage',
    sortable: true,
    title: t('pricing.admin.categoryMarketplaces.columns.commissionPercentage'),
  },
  { key: 'operations', title: t('common.actions.actions') },
])

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteAdminCategoryMarketplace(props.marketplaceId, target.categoryId)
    toast.success(t('pricing.admin.categoryMarketplaces.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  modal.close()
  void list.refresh()
}
</script>

<template>
  <div class="admin-category-marketplace-list">
    <div class="admin-category-marketplace-list__toolbar">
      <Button
        :disabled="availableCategoryOptions.length === 0"
        variant="primary"
        @click="modal.openCreate()"
      >
        {{ $t('pricing.admin.categoryMarketplaces.createButton') }}
      </Button>
    </div>

    <p
      v-if="availableCategoryOptions.length === 0"
      class="admin-category-marketplace-list__hint"
    >
      {{ $t('pricing.admin.categoryMarketplaces.noAvailableCategoriesHint') }}
    </p>

    <p v-if="listErrorMessage" class="admin-category-marketplace-list__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-category="{ row }">
        {{ row.category.title }}
      </template>
      <template #cell-commissionPercentage="{ row }">
        {{ formatPercent(row.commissionPercentage) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="admin-category-marketplace-list__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="modal.openEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button :icon-before="Trash" variant="ghost" @click="deleteConfirmation.request(row)">
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('pricing.admin.categoryMarketplaces.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />

    <Modal
      v-model="modal.isOpen.value"
      :title="
        modal.mode.value === 'create'
          ? $t('pricing.admin.categoryMarketplaces.form.createTitle')
          : $t('pricing.admin.categoryMarketplaces.form.editTitle')
      "
    >
      <AdminCategoryMarketplaceForm
        :category-options="availableCategoryOptions"
        :link="modal.editingRecord.value"
        :marketplace-id="marketplaceId"
        :mode="modal.mode.value"
        @cancel="modal.close()"
        @saved="handleSaved"
      />
    </Modal>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('pricing.admin.categoryMarketplaces.deleteConfirm.description')"
      :title="$t('pricing.admin.categoryMarketplaces.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-category-marketplace-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.admin-category-marketplace-list__toolbar {
  display: flex;
  justify-content: flex-end;
}

.admin-category-marketplace-list__row-actions {
  display: flex;
  gap: $spacing-4;
}

.admin-category-marketplace-list__hint {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.admin-category-marketplace-list__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
