<script setup lang="ts">
/**
 * CRUD de `PLAN` — exclusivo do admin (Fase 6). Mesma forma exata de
 * `AdminMarketplacesView.vue` (`.ai/rules/crud-pattern.md`):
 * `useResourceList`/`useCrudDrawer`/`useConfirmAction`, form único
 * cria+edita (`AdminPlanForm.vue`, em cima de `useResourceForm`).
 *
 * **`ListToolbar` com filtro de `billing_cycle`, 2026-09-01, pedido
 * direto do usuário** ("falta de padrão nos forms, só produto tem a
 * filterbar") — `Select` no slot `#filters` (`searchable`/`filterable`/
 * `sortable` desligados, mesmo raciocínio de `AdminMarketplacesView.vue`).
 */
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Button from '@/shared/components/ui/Button.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Select from '@/shared/components/ui/Select.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { PencilSimpleLine, Trash } from '@/shared/components/icons/regular.generated'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useCrudDrawer } from '@/shared/composables/useCrudDrawer'
import { useToast } from '@/shared/composables/useToast'
import { formatMoney } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import AdminPlanForm from '../components/AdminPlanForm.vue'
import { useAdminPlanList } from '../composables/useAdminPlanList'
import { deleteAdminPlan } from '../services/billingApi'
import type { AdminPlan } from '../types/plan.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const list = useAdminPlanList()
onMounted(list.refresh)

const billingCycleFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('billing.billingCycleFilter.monthly'), value: 'monthly' },
  { label: t('billing.billingCycleFilter.yearly'), value: 'yearly' },
  { label: t('billing.admin.plans.form.fields.billingCycleTrial'), value: 'trial' },
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const drawer = useCrudDrawer<AdminPlan>()
const deleteConfirmation = useConfirmAction<AdminPlan>()

const columns = computed<DataTableColumn[]>(() => [
  { key: 'name', sortable: true, title: t('billing.admin.plans.columns.name') },
  { key: 'price', sortable: true, title: t('billing.admin.plans.columns.price') },
  { key: 'billingCycle', title: t('billing.admin.plans.columns.billingCycle') },
  { key: 'limits', title: t('billing.admin.plans.columns.limits') },
  { key: 'active', title: t('billing.admin.plans.columns.active') },
  { key: 'createdAt', sortable: true, title: t('billing.admin.plans.columns.createdAt') },
  { key: 'operations', title: t('common.actions.actions') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

async function handleDelete(): Promise<void> {
  await deleteConfirmation.confirm(async (target) => {
    await deleteAdminPlan(target.id)
    toast.success(t('billing.admin.plans.deleteSuccess'))
    await list.refresh()
  })
}

function handleSaved(): void {
  drawer.close()
  void list.refresh()
}
</script>

<template>
  <div class="admin-plans-view">
    <h1 class="admin-plans-view__title">{{ $t('billing.admin.plans.title') }}</h1>

    <ListToolbar
      :add-label="$t('billing.admin.plans.createButton')"
      :filterable="false"
      :searchable="false"
      :sortable="false"
      @add="drawer.openCreate()"
    >
      <template #filters>
        <Select
          :model-value="list.billingCycleFilter.value"
          :options="billingCycleFilterOptions"
          @update:model-value="(value) => list.setBillingCycleFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-plans-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-price="{ row }">
        {{ formatMoney(row.price) }}
      </template>
      <template #cell-billingCycle="{ row }">
        {{
          row.billingCycle === 'trial'
            ? $t('billing.admin.plans.form.fields.billingCycleTrial')
            : $t(`billing.billingCycleFilter.${row.billingCycle}`)
        }}
      </template>
      <template #cell-limits="{ row }">
        {{ $t('billing.admin.plans.limitsFormat', { marketplaces: row.maxMarketplaces, products: row.maxProducts }) }}
      </template>
      <template #cell-active="{ row }">
        <StatusDot :color="row.active ? 'green' : 'gray'">
          {{ row.active ? $t('common.status.active') : $t('common.status.inactive') }}
        </StatusDot>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #cell-operations="{ row }">
        <Button
          :aria-label="$t('common.actions.edit')"
          :icon-before="PencilSimpleLine"
          variant="ghost"
          @click="drawer.openEdit(row)"
        />
        <Button
          :aria-label="$t('common.actions.delete')"
          :icon-before="Trash"
          variant="ghost"
          @click="deleteConfirmation.request(row)"
        />
      </template>
      <template #empty>
        {{ $t('billing.admin.plans.empty') }}
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
          ? $t('billing.admin.plans.form.createTitle')
          : $t('billing.admin.plans.form.editTitle')
      "
    >
      <AdminPlanForm
        :mode="drawer.mode.value"
        :plan="drawer.editingRecord.value"
        @cancel="drawer.close()"
        @saved="handleSaved"
      />
    </Drawer>

    <ConfirmDialog
      v-model:open="deleteConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('billing.admin.plans.deleteConfirm.description')"
      :title="$t('billing.admin.plans.deleteConfirm.title')"
      @cancel="deleteConfirmation.cancel()"
      @confirm="handleDelete()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-plans-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-plans-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-plans-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
