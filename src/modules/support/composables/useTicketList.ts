import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listTickets } from '../services/supportApi'
import type { Ticket } from '../types/ticket.type'

/**
 * `GET /tickets` só ordena por essas 2 colunas
 * (`core/api/schema.d.ts`, `ticket.index`) — mesmo critério de
 * `buildAdminSubscriptionSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  resolvedAt: 'resolved_at',
}

export function buildTicketSortParam(
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
 * Wrapper de `useResourceList` pra `Ticket` (próprios chamados). Filtro
 * de `status` (`ListToolbar` `#filters`, `Select`, sentinel `'all'`,
 * mesmo padrão do resto do projeto) — sem filtro de data
 * (`created_from/to`/`resolved_from/to`, a API aceita mas exigiria um
 * `DateRangePicker` que não foi pedido nesta rodada).
 */
export function useTicketList() {
  const statusFilter = ref('all')

  const list = useResourceList<Ticket>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listTickets({
        page,
        perPage,
        sort: buildTicketSortParam(sortKey, sortDirection) ?? '-created_at',
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
