import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminTickets } from '../services/supportApi'
import type { AdminTicket } from '../types/ticket.type'

const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  resolvedAt: 'resolved_at',
}

export function buildAdminTicketSortParam(
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
 * Wrapper de `useResourceList` pra `AdminTicket` (todos os chamados, de
 * todos os usuários). Filtro de `status`, mesmo padrão de
 * `useTicketList.ts` — sem `user_id`/`replied_by` na UI (a API aceita,
 * mas exigiriam um seletor de busca por usuário que não existe ainda,
 * mesma régua já usada em `useAdminSubscriptionList.ts`).
 */
export function useAdminTicketList() {
  const statusFilter = ref('all')

  const list = useResourceList<AdminTicket>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminTickets({
        page,
        perPage,
        sort: buildAdminTicketSortParam(sortKey, sortDirection) ?? '-created_at',
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
