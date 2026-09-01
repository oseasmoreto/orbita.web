import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAuditLogs } from '../services/platformApi'
import type { AuditLog } from '../types/auditLog.type'

/**
 * `GET /admin/audit-logs` só ordena por `created_at`
 * (`core/api/schema.d.ts`, `adminAuditLog.index`) — mesmo critério de
 * `buildTransactionSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
}

export function buildAuditLogSortParam(
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
 * Wrapper de `useResourceList` pra `AuditLog` — mesmo padrão de
 * `useTransactionList.ts`. Filtros exatos por `module`/`action`
 * (`filter[module]`/`filter[action]` reais da API, aplicados via botão
 * "Filtrar" explícito) + `user_id`/`impersonated_by` (`Select` de
 * usuário, auto-aplica ao trocar — mesmo padrão dos filtros de usuário
 * de `useAdminSubscriptionList.ts`/`useAdminTransactionList.ts`,
 * Fase 9). Os 2 filtros de usuário reaproveitam `useAdminUserOptions`
 * pra ambos os papéis (`user_id`=dono do log, `impersonated_by`=admin
 * que agiu via impersonation) — mesma lista de usuários serve pros dois.
 *
 * `-created_at` como sort padrão (não exige clicar no cabeçalho) — mesmo
 * critério de `useAdminNotificationList.ts`: log de auditoria é uma
 * timeline, o registro mais recente sempre importa mais que a ordem
 * "natural" (id) do banco.
 */
export function useAuditLogList() {
  const action = ref('')
  const module = ref('')
  const userIdFilter = ref('all')
  const impersonatedByFilter = ref('all')

  const list = useResourceList<AuditLog>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAuditLogs({
        action: action.value || undefined,
        impersonatedBy:
          impersonatedByFilter.value === 'all' ? undefined : impersonatedByFilter.value,
        module: module.value || undefined,
        page,
        perPage,
        sort: buildAuditLogSortParam(sortKey, sortDirection) ?? '-created_at',
        userId: userIdFilter.value === 'all' ? undefined : userIdFilter.value,
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 15,
  })

  async function applyFilters(): Promise<void> {
    await list.setPage(1)
  }

  async function setUserIdFilter(value: string): Promise<void> {
    userIdFilter.value = value
    await list.setPage(1)
  }

  async function setImpersonatedByFilter(value: string): Promise<void> {
    impersonatedByFilter.value = value
    await list.setPage(1)
  }

  return {
    ...list,
    action,
    applyFilters,
    impersonatedByFilter,
    module,
    setImpersonatedByFilter,
    setUserIdFilter,
    userIdFilter,
  }
}
