import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminSubscriptions } from '../services/billingApi'
import type { AdminSubscription } from '../types/subscription.type'

/**
 * `GET /admin/subscriptions` só ordena por essas 3 colunas
 * (`core/api/schema.d.ts`, `adminSubscription.index`) — mesmo critério de
 * `buildAdminPlanSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  endDate: 'end_date',
  startDate: 'start_date',
}

export function buildAdminSubscriptionSortParam(
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
 * Wrapper de `useResourceList` pra `AdminSubscription` (Fase 7). Filtro
 * de `status` (`ListToolbar` `#filters`, mesmo padrão de
 * `useAdminMarketplaceList.ts`, inclusive o sentinel `'all'` pra "limpar
 * filtro" — `SelectItem` da Reka UI rejeita `value=""`). Sem busca — a
 * API não tem filtro de texto livre, só `filter[user_id]`/`filter[plan_id]`/
 * `filter[status]`, os 2 primeiros sem UI útil sem uma tela de busca de
 * usuário/plano por texto.
 */
export function useAdminSubscriptionList() {
  const statusFilter = ref('all')

  const list = useResourceList<AdminSubscription>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminSubscriptions({
        page,
        perPage,
        sort: buildAdminSubscriptionSortParam(sortKey, sortDirection) ?? '-created_at',
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
