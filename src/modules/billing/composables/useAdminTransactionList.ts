import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminTransactions } from '../services/billingApi'
import type { AdminTransaction } from '../types/transaction.type'

/**
 * `GET /admin/transactions` só ordena por essas 2 colunas
 * (`core/api/schema.d.ts`, `adminTransaction.index`) — mesmo critério de
 * `buildTransactionSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  value: 'value',
}

export function buildAdminTransactionSortParam(
  key: string | undefined,
  direction: DataTableSortDirection,
): string | undefined {
  if (!(key && direction)) {
    return undefined
  }

  const param = SORT_PARAM[key]

  if (!param) {
    return undefined
  }

  return direction === 'desc' ? `-${param}` : param
}

/**
 * Wrapper de `useResourceList` pra `AdminTransaction` (Fase 7), read-only
 * (`AdminTransactionController` só tem `index`/`show`). Filtro de
 * `status` (`ListToolbar` `#filters`, mesmo padrão de
 * `useAdminMarketplaceList.ts`, inclusive o sentinel `'all'`) — sem
 * `gateway` na UI: hoje só existe 1 gateway integrado (Mercado Pago,
 * `docs/infra/convencoes-frontend-infra.md` seção 15.1), um filtro sem
 * segunda opção real pra escolher não vale a pena (mesma régua de "sem
 * dimensão real pra oferecer" já usada noutros lugares do projeto).
 */
export function useAdminTransactionList() {
  const statusFilter = ref('all')

  const list = useResourceList<AdminTransaction>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminTransactions({
        page,
        perPage,
        sort: buildAdminTransactionSortParam(sortKey, sortDirection) ?? '-created_at',
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
      })
      return { items: result.items, total: result.meta.total }
    },
  })

  async function setStatusFilter(value: string): Promise<void> {
    statusFilter.value = value
    await list.setPage(1)
  }

  return { ...list, setStatusFilter, statusFilter }
}
