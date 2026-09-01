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
 * Wrapper de `useResourceList` pra `AdminSubscription` (Fase 7). Filtros
 * de `status` (`Select`, sentinel `'all'`), `user_id` e `plan_id`
 * (`ListToolbar` `#filters`, Fase 9 — fechamento de gaps do OpenAPI,
 * 2026-09-01: os 2 últimos existiam na API desde sempre, sem UI porque
 * "exigiriam um seletor de busca de usuário/plano" — `useAdminUserOptions`
 * (`core/composables/`) resolveu o primeiro, `listAdminPlans` (já
 * existente, mesmo módulo) resolve o segundo sem precisar de nada novo.
 * Sem busca de texto livre — a API não tem esse filtro.
 */
export function useAdminSubscriptionList() {
  const statusFilter = ref('all')
  const userIdFilter = ref('all')
  const planIdFilter = ref('all')

  const list = useResourceList<AdminSubscription>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminSubscriptions({
        page,
        perPage,
        planId: planIdFilter.value === 'all' ? undefined : planIdFilter.value,
        sort: buildAdminSubscriptionSortParam(sortKey, sortDirection) ?? '-created_at',
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
        userId: userIdFilter.value === 'all' ? undefined : userIdFilter.value,
      })
      return { items: result.items, total: result.meta.total }
    },
  })

  async function setStatusFilter(value: string): Promise<void> {
    statusFilter.value = value
    await list.setPage(1)
  }

  async function setUserIdFilter(value: string): Promise<void> {
    userIdFilter.value = value
    await list.setPage(1)
  }

  async function setPlanIdFilter(value: string): Promise<void> {
    planIdFilter.value = value
    await list.setPage(1)
  }

  return {
    ...list,
    planIdFilter,
    setPlanIdFilter,
    setStatusFilter,
    setUserIdFilter,
    statusFilter,
    userIdFilter,
  }
}
