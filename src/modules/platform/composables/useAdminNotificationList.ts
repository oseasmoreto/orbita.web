import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminNotifications } from '../services/platformApi'
import type { AdminNotification } from '../types/adminNotification.type'

/**
 * `GET /admin/notifications` só ordena por `created_at`
 * (`core/api/schema.d.ts`, `adminNotification.index`) — mesmo critério de
 * `buildAuditLogSortParam`/`buildTransactionSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
}

export function buildAdminNotificationSortParam(
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
 * Wrapper de `useResourceList` pra `AdminNotification` — mesmo padrão do
 * resto do projeto. Diferente de `useTransactionList`/`useAuditLogList`
 * (sem sort default, exige clicar no cabeçalho), esta lista É uma feed de
 * atividade — `-created_at` como padrão sem interação nenhuma faz mais
 * sentido aqui: achado real verificando em browser, o broadcast recém-
 * enviado não aparecia no topo até o admin clicar pra ordenar.
 */
export function useAdminNotificationList() {
  const typeFilter = ref('all')
  const statusFilter = ref('all')

  const list = useResourceList<AdminNotification>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminNotifications({
        page,
        perPage,
        sort: buildAdminNotificationSortParam(sortKey, sortDirection) ?? '-created_at',
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
        type: typeFilter.value === 'all' ? undefined : typeFilter.value,
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })

  // `ListToolbar` `#filters`, 2026-09-01, pedido direto do usuário —
  // aplicado imediatamente na troca do `Select`, mesmo padrão de
  // `useAdminMarketplaceList.ts` (inclusive o sentinel `'all'` pra
  // "limpar filtro" — `SelectItem` da Reka UI rejeita `value=""`).
  async function setTypeFilter(value: string): Promise<void> {
    typeFilter.value = value
    await list.setPage(1)
  }

  async function setStatusFilter(value: string): Promise<void> {
    statusFilter.value = value
    await list.setPage(1)
  }

  return { ...list, setStatusFilter, setTypeFilter, statusFilter, typeFilter }
}
