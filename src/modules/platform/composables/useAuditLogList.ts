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
 * (`filter[module]`/`filter[action]` reais da API) — sem filtro por
 * `user_id`/`impersonated_by` ainda: exigiriam um seletor de usuário, que
 * depende da tela de admin de usuários (Fase 6, não construída).
 *
 * `-created_at` como sort padrão (não exige clicar no cabeçalho) — mesmo
 * critério de `useAdminNotificationList.ts`: log de auditoria é uma
 * timeline, o registro mais recente sempre importa mais que a ordem
 * "natural" (id) do banco.
 */
export function useAuditLogList() {
  const action = ref('')
  const module = ref('')

  const list = useResourceList<AuditLog>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAuditLogs({
        action: action.value || undefined,
        module: module.value || undefined,
        page,
        perPage,
        sort: buildAuditLogSortParam(sortKey, sortDirection) ?? '-created_at',
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 15,
  })

  async function applyFilters(): Promise<void> {
    await list.setPage(1)
  }

  return { ...list, action, applyFilters, module }
}
