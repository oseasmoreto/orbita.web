import { ref } from 'vue'
import type { AdminUser } from '@/core/types/adminUser.type'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminUsers } from '../services/identityApi'

/**
 * `GET /admin/users` só ordena por essas 3 colunas
 * (`core/api/schema.d.ts`, `adminUser.index`) — mesmo critério de
 * `buildAdminMarketplaceSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  email: 'email',
  name: 'name',
}

export function buildAdminUserSortParam(
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
 * Wrapper de `useResourceList` pra `AdminUser`. Filtros de `role`/
 * `status` (`ListToolbar` `#filters`, 2026-09-01, pedido direto do
 * usuário) — `listAdminUsers` já aceitava os 2 params desde a Fase 6
 * (`identityApi.ts`), só nunca tinham sido conectados a nenhum `Select`
 * na UI. Aplicados imediatamente na troca, mesmo padrão de
 * `useAdminMarketplaceList.ts` (inclusive o sentinel `'all'` pra "limpar
 * filtro" — `SelectItem` da Reka UI rejeita `value=""`).
 */
export function useAdminUserList() {
  const roleFilter = ref('all')
  const statusFilter = ref('all')

  const list = useResourceList<AdminUser>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminUsers({
        page,
        perPage,
        role: roleFilter.value === 'all' ? undefined : roleFilter.value,
        sort: buildAdminUserSortParam(sortKey, sortDirection),
        status: statusFilter.value === 'all' ? undefined : statusFilter.value,
      })
      return { items: result.items, total: result.meta.total }
    },
  })

  async function setRoleFilter(value: string): Promise<void> {
    roleFilter.value = value
    await list.setPage(1)
  }

  async function setStatusFilter(value: string): Promise<void> {
    statusFilter.value = value
    await list.setPage(1)
  }

  return { ...list, roleFilter, setRoleFilter, setStatusFilter, statusFilter }
}
