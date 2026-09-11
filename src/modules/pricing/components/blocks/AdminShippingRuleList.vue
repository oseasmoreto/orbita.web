<script setup lang="ts">
/**
 * "Regras de frete" — mirror exato de `AdminPricingRuleList.vue`, aba
 * irmã dentro do Drawer de edição do marketplace
 * (`AdminMarketplacesView.vue`). Sempre aninhada a UM marketplace. Só
 * tem efeito real no cálculo pra marketplace com
 * `requiresWeightAndDimensions=true` (Shein hoje), mas o CRUD fica
 * disponível pra qualquer marketplace — mesmo critério já usado por
 * `AdminPricingRuleList.vue`/`AdminCategoryMarketplaceList.vue` (o admin
 * decide o que cadastrar, a tela não pré-filtra por estratégia).
 */
import { computed, onMounted } from 'vue'
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
import { formatMoney } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import AdminShippingRuleForm from '../AdminShippingRuleForm.vue'
import { useAdminShippingRuleList } from '../../composables/useAdminShippingRuleList'
import { deleteAdminShippingRule } from '../../services/pricingApi'
import type { ShippingRule } from '../../types/shippingRule.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'

const props = defineProps<{ marketplaceId: string }>()

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminShippingRuleList(props.marketplaceId)
onMounted(list.refresh)

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const modal = useCrudDrawer<ShippingRule>()
const deleteConfirmation = useConfirmAction<ShippingRule>()

const columns = computed<DataTableColumn[]>(() => [
  { key: 'weightMin', sortable: true, title: t('pricing.admin.shippingRules.columns.weightMin') },
  { key: 'weightMax', title: t('pricing.admin.shippingRules.columns.weightMax') },
  { key: 'fixedFee', title: t('pricing.admin.shippingRules.columns.fixedFee') },
  { key: 'order', sortable: true, title: t('pricing.admin.shippingRules.columns.order') },
  { key: 'operations', title: t('common.actions.actions') },
])

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteAdminShippingRule(props.marketplaceId, target.id)
    toast.success(t('pricing.admin.shippingRules.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  modal.close()
  void list.refresh()
}
</script>

<template>
  <div class="admin-shipping-rule-list">
    <div class="admin-shipping-rule-list__toolbar">
      <Button variant="primary" @click="modal.openCreate()">
        {{ $t('pricing.admin.shippingRules.createButton') }}
      </Button>
    </div>

    <p v-if="listErrorMessage" class="admin-shipping-rule-list__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-weightMin="{ row }">
        {{ row.weightMin }} kg
      </template>
      <template #cell-weightMax="{ row }">
        {{ row.weightMax }} kg
      </template>
      <template #cell-fixedFee="{ row }">
        {{ formatMoney(row.fixedFee) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="admin-shipping-rule-list__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="modal.openEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button :icon-before="Trash" variant="ghost" @click="deleteConfirmation.request(row)">
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('pricing.admin.shippingRules.empty') }}
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
          ? $t('pricing.admin.shippingRules.form.createTitle')
          : $t('pricing.admin.shippingRules.form.editTitle')
      "
    >
      <AdminShippingRuleForm
        :marketplace-id="marketplaceId"
        :mode="modal.mode.value"
        :rule="modal.editingRecord.value"
        @cancel="modal.close()"
        @saved="handleSaved"
      />
    </Modal>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('pricing.admin.shippingRules.deleteConfirm.description')"
      :title="$t('pricing.admin.shippingRules.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">

.admin-shipping-rule-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.admin-shipping-rule-list__toolbar {
  display: flex;
  justify-content: flex-end;
}

.admin-shipping-rule-list__row-actions {
  display: flex;
  gap: $spacing-4;
}

.admin-shipping-rule-list__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
