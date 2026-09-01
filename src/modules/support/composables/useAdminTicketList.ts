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
 * todos os usuários). Filtro de `status` (`Select`, sentinel `'all'`) —
 * sem busca de texto livre, a API não tem esse filtro.
 *
 * **Fase 9 (fechamento de gaps do OpenAPI), 2026-09-01**: `user_id`
 * (quem abriu) e `replied_by` (quem respondeu — qualquer mensagem
 * daquele `user_id` no chamado) via `useAdminUserOptions`
 * (`core/composables/`, mesmo picker reusado em `AdminSubscriptionsView`/
 * `AdminTransactionsView`); intervalo de data de abertura/resolução via
 * `DateRangePicker`, aplicado manualmente (`applyDateFilters`, botão
 * "Filtrar" — mesmo padrão de `useAuditLogList.ts` pra filtro de
 * texto/data, diferente do `Select` que aplica na hora).
 */
export function useAdminTicketList() {
  const statusFilter = ref('all')
  const userIdFilter = ref('all')
  const repliedByFilter = ref('all')
  const createdFrom = ref('')
  const createdTo = ref('')
  const resolvedFrom = ref('')
  const resolvedTo = ref('')

  const list = useResourceList<AdminTicket>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminTickets({
        createdFrom: createdFrom.value || undefined,
        createdTo: createdTo.value || undefined,
        page,
        perPage,
        repliedBy: repliedByFilter.value === 'all' ? undefined : repliedByFilter.value,
        resolvedFrom: resolvedFrom.value || undefined,
        resolvedTo: resolvedTo.value || undefined,
        sort: buildAdminTicketSortParam(sortKey, sortDirection) ?? '-created_at',
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

  async function setRepliedByFilter(value: string): Promise<void> {
    repliedByFilter.value = value
    await list.setPage(1)
  }

  async function applyDateFilters(): Promise<void> {
    await list.setPage(1)
  }

  return {
    ...list,
    applyDateFilters,
    createdFrom,
    createdTo,
    repliedByFilter,
    resolvedFrom,
    resolvedTo,
    setRepliedByFilter,
    setStatusFilter,
    setUserIdFilter,
    statusFilter,
    userIdFilter,
  }
}
