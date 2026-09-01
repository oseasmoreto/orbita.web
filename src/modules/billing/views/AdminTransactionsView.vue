<script setup lang="ts">
/**
 * "Transações" (admin) — Fase 7 (Financeiro), "ver TODAS as transações de
 * todos os usuários" (`GET /admin/transactions`,
 * `AdminTransactionController`), read-only (só `index`/`show` — registro
 * financeiro imutável, mesma regra já vale pro `TransactionController`
 * do próprio usuário, `TransactionsView.vue`). Mesma forma de
 * `TransactionsView.vue` + `ListToolbar` com filtro de `status`.
 *
 * `user` já vem embutido no resource (`AdminUserResource` completo) —
 * nunca UUID cru, mesmo padrão já resolvido em `AdminAuditLogResource`
 * no mesmo dia.
 */
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Select from '@/shared/components/ui/Select.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { formatMoney } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import { useAdminTransactionList } from '../composables/useAdminTransactionList'
import { transactionStatusColor } from '../types/transaction.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const list = useAdminTransactionList()
onMounted(list.refresh)

const statusFilterOptions = computed<SelectOption[]>(() => [
  { label: t('common.filters.all'), value: 'all' },
  { label: t('billing.transactions.status.approved'), value: 'approved' },
  { label: t('billing.transactions.status.authorized'), value: 'authorized' },
  { label: t('billing.transactions.status.pending'), value: 'pending' },
  { label: t('billing.transactions.status.in_process'), value: 'in_process' },
  { label: t('billing.transactions.status.in_mediation'), value: 'in_mediation' },
  { label: t('billing.transactions.status.rejected'), value: 'rejected' },
  { label: t('billing.transactions.status.cancelled'), value: 'cancelled' },
  { label: t('billing.transactions.status.refunded'), value: 'refunded' },
  { label: t('billing.transactions.status.charged_back'), value: 'charged_back' },
])

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'user', title: t('billing.admin.transactions.columns.user') },
  { key: 'gateway', title: t('billing.admin.transactions.columns.gateway') },
  { key: 'value', sortable: true, title: t('billing.admin.transactions.columns.value') },
  { key: 'status', title: t('billing.admin.transactions.columns.status') },
  { key: 'paymentMethod', title: t('billing.admin.transactions.columns.paymentMethod') },
  { key: 'createdAt', sortable: true, title: t('billing.admin.transactions.columns.createdAt') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'
}
</script>

<template>
  <div class="admin-transactions-view">
    <h1 class="admin-transactions-view__title">{{ $t('billing.admin.transactions.title') }}</h1>

    <ListToolbar :addable="false" :filterable="false" :searchable="false" :sortable="false">
      <template #filters>
        <Select
          :model-value="list.statusFilter.value"
          :options="statusFilterOptions"
          @update:model-value="(value) => list.setStatusFilter(value)"
        />
      </template>
    </ListToolbar>

    <p v-if="listErrorMessage" class="admin-transactions-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
      <template #cell-user="{ row }">
        {{ row.user.name }}
      </template>
      <template #cell-value="{ row }">
        {{ formatMoney(row.value) }}
      </template>
      <template #cell-status="{ row }">
        <StatusDot :color="transactionStatusColor(row.status)">
          {{ $t(`billing.transactions.status.${row.status}`) }}
        </StatusDot>
      </template>
      <template #cell-createdAt="{ row }">
        {{ formatCreatedAt(row.createdAt) }}
      </template>
      <template #empty>
        {{ $t('billing.admin.transactions.empty') }}
      </template>
    </DataTable>

    <PaginationNav
      :current-page="list.currentPage.value"
      :total-pages="list.totalPages.value"
      @update:current-page="(page) => list.setPage(page)"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-transactions-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.admin-transactions-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-transactions-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
