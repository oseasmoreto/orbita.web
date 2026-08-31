<script setup lang="ts">
/**
 * "Faturas" — pendência real da Fase 2, histórico próprio via
 * `GET /transactions` (read-only, `ListOwnTransactionsAction`). Mesmo
 * padrão de `ProductsView.vue` (`useResourceList`/`DataTable`/
 * `PaginationNav`), sem `ListToolbar`/`useCrudDrawer`/`ConfirmDialog` —
 * não há criar/editar/excluir transação (registro financeiro imutável,
 * mesma regra já vale pro admin — `AdminTransactionController` só tem
 * `index`/`show`, nunca `store`/`update`/`destroy`).
 */
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { formatMoney } from '@/shared/services/formatNumber'
import { parseApiError } from '@/shared/services/parseApiError'
import { useTransactionList } from '../composables/useTransactionList'
import { transactionStatusColor } from '../types/transaction.type'
import type { DataTableColumn } from '@/shared/components/ui/types/dataTable.type'

const { t } = useI18n()
const { resolveMessage } = useApiMessage()

const list = useTransactionList()
onMounted(list.refresh)

const listErrorMessage = computed(() =>
  list.error.value ? resolveMessage(parseApiError(list.error.value).messageKey) : null,
)

const columns = computed<DataTableColumn[]>(() => [
  { key: 'gateway', title: t('billing.transactions.columns.gateway') },
  { key: 'value', sortable: true, title: t('billing.transactions.columns.value') },
  { key: 'status', title: t('billing.transactions.columns.status') },
  { key: 'paymentMethod', title: t('billing.transactions.columns.paymentMethod') },
  { key: 'createdAt', sortable: true, title: t('billing.transactions.columns.createdAt') },
])

function formatCreatedAt(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : '—'
}
</script>

<template>
  <div class="transactions-view">
    <h1 class="transactions-view__title">{{ $t('billing.transactions.title') }}</h1>

    <p v-if="listErrorMessage" class="transactions-view__error" role="alert">
      {{ listErrorMessage }}
    </p>

    <DataTable
      :columns="columns"
      :rows="list.items.value"
      row-key="id"
      @sort="(key, direction) => list.setSort(key, direction)"
    >
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
        {{ $t('billing.transactions.empty') }}
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

.transactions-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.transactions-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

// Mesma técnica já usada em `ProductsView.vue`/`StatusDot.vue` (variante
// `pill`) — não existe token de "tint vermelho" pronto na escala.
.transactions-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}
</style>
