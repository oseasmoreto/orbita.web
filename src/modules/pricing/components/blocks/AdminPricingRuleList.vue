<script setup lang="ts">
/**
 * "Regras de comissão" — sempre aninhada a UM marketplace, nunca uma
 * listagem própria (`docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.4). Mesmo padrão exato de `ProductLaunchList.vue` (Catalog):
 * `useResourceList`/`useCrudDrawer`/`useConfirmAction`, `Modal.vue` (já
 * dentro do Drawer de edição do marketplace) em vez de `Drawer.vue`.
 * Sem toolbar de busca — a API não tem filtro de texto pra regra.
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
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import AdminPricingRuleForm from '../AdminPricingRuleForm.vue'
import { useAdminPricingRuleList } from '../../composables/useAdminPricingRuleList'
import { deleteAdminPricingRule } from '../../services/pricingApi'
import type { PricingRule } from '../../types/pricingRule.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'

const props = defineProps<{ marketplaceId: string }>()

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminPricingRuleList(props.marketplaceId)
onMounted(list.refresh)

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const modal = useCrudDrawer<PricingRule>()
const deleteConfirmation = useConfirmAction<PricingRule>()

const columns = computed<DataTableColumn[]>(() => [
  { key: 'rangeMin', sortable: true, title: t('pricing.admin.pricingRules.columns.rangeMin') },
  { key: 'rangeMax', title: t('pricing.admin.pricingRules.columns.rangeMax') },
  { key: 'percentage', title: t('pricing.admin.pricingRules.columns.percentage') },
  { key: 'fixedFee', title: t('pricing.admin.pricingRules.columns.fixedFee') },
  { key: 'order', sortable: true, title: t('pricing.admin.pricingRules.columns.order') },
  { key: 'operations', title: t('common.actions.actions') },
])

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteAdminPricingRule(props.marketplaceId, target.id)
    toast.success(t('pricing.admin.pricingRules.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  modal.close()
  void list.refresh()
}
</script>

<template>
  <div class="admin-pricing-rule-list">
    <div class="admin-pricing-rule-list__toolbar">
      <Button variant="primary" @click="modal.openCreate()">
        {{ $t('pricing.admin.pricingRules.createButton') }}
      </Button>
    </div>

    <p v-if="listErrorMessage" class="admin-pricing-rule-list__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-rangeMin="{ row }">
        {{ formatMoney(row.rangeMin) }}
      </template>
      <template #cell-rangeMax="{ row }">
        {{ formatMoney(row.rangeMax) }}
      </template>
      <template #cell-percentage="{ row }">
        {{ formatPercent(row.percentage) }}
      </template>
      <template #cell-fixedFee="{ row }">
        {{ formatMoney(row.fixedFee) }}
      </template>
      <template #cell-operations="{ row }">
        <div class="admin-pricing-rule-list__row-actions">
          <Button :icon-before="PencilSimpleLine" variant="ghost" @click="modal.openEdit(row)">
            {{ $t('common.actions.edit') }}
          </Button>
          <Button :icon-before="Trash" variant="ghost" @click="deleteConfirmation.request(row)">
            {{ $t('common.actions.delete') }}
          </Button>
        </div>
      </template>
      <template #empty>
        {{ $t('pricing.admin.pricingRules.empty') }}
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
          ? $t('pricing.admin.pricingRules.form.createTitle')
          : $t('pricing.admin.pricingRules.form.editTitle')
      "
    >
      <AdminPricingRuleForm
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
      :description="$t('pricing.admin.pricingRules.deleteConfirm.description')"
      :title="$t('pricing.admin.pricingRules.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">

.admin-pricing-rule-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.admin-pricing-rule-list__toolbar {
  display: flex;
  justify-content: flex-end;
}

.admin-pricing-rule-list__row-actions {
  display: flex;
  gap: $spacing-4;
}

.admin-pricing-rule-list__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
