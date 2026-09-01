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
 * de `status` (`Select`, sentinel `'all'`) + intervalo de data de
 * abertura/resolução (`DateRangePicker`, Fase 9 — fechamento de gaps do
 * OpenAPI, 2026-09-01: `created_from/to`/`resolved_from/to` existiam na
 * API desde o início, sem UI porque "exigiria um `DateRangePicker` que
 * não foi pedido" — já existe no design system agora, sem motivo pra
 * continuar sem). `''` do `DateRangePicker` (sem data escolhida) vira
 * `undefined` no payload, nunca uma string vazia solta pro backend.
 */
export function useTicketList() {
  const statusFilter = ref('all')
  const createdFrom = ref('')
  const createdTo = ref('')
  const resolvedFrom = ref('')
  const resolvedTo = ref('')

  const list = useResourceList<Ticket>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listTickets({
        createdFrom: createdFrom.value || undefined,
        createdTo: createdTo.value || undefined,
        page,
        perPage,
        resolvedFrom: resolvedFrom.value || undefined,
        resolvedTo: resolvedTo.value || undefined,
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

  async function applyDateFilters(): Promise<void> {
    await list.setPage(1)
  }

  return {
    ...list,
    applyDateFilters,
    createdFrom,
    createdTo,
    resolvedFrom,
    resolvedTo,
    setStatusFilter,
    statusFilter,
  }
}
