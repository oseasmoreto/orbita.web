import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listTransactions } from '../services/billingApi'
import type { Transaction } from '../types/transaction.type'

/**
 * `GET /transactions` só ordena por `value`/`created_at`
 * (`core/api/schema.d.ts`, `transaction.index`) — mesmo critério de
 * `buildProductSortParam` (`modules/catalog/composables/useProductList.ts`).
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  value: 'value',
}

export function buildTransactionSortParam(
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
 * Wrapper de `useResourceList` pra `Transaction` — mesmo padrão de
 * `useProductList.ts`. Sem busca (a API não tem um filtro de texto livre
 * pra transação, só filtros exatos por `subscription_id`/`status`/
 * `gateway`, sem pedido de UI pra isso ainda).
 */
export function useTransactionList() {
  return useResourceList<Transaction>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listTransactions({
        page,
        perPage,
        sort: buildTransactionSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })
}
