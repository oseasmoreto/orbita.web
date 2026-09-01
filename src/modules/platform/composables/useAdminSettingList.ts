import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listSettings } from '../services/platformApi'
import type { Setting } from '../types/setting.type'

/**
 * `GET /admin/settings` só ordena por essas 2 colunas
 * (`core/api/schema.d.ts`, `setting.index`) — mesmo critério do resto do
 * projeto.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  name: 'name',
}

export function buildAdminSettingSortParam(
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
 * Wrapper de `useResourceList` pra `Setting`. Filtro de `type`
 * (`ListToolbar` `#filters`, 2026-09-01, pedido direto do usuário) —
 * `listSettings` já aceitava o param, só nunca tinha UI conectada.
 * Aplicado imediatamente na troca, mesmo padrão de
 * `useAdminMarketplaceList.ts` (inclusive o sentinel `'all'` pra "limpar
 * filtro" — `SelectItem` da Reka UI rejeita `value=""`).
 */
export function useAdminSettingList() {
  const typeFilter = ref('all')

  const list = useResourceList<Setting>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listSettings({
        page,
        perPage,
        sort: buildAdminSettingSortParam(sortKey, sortDirection),
        type: typeFilter.value === 'all' ? undefined : typeFilter.value,
      })
      return { items: result.items, total: result.meta.total }
    },
  })

  async function setTypeFilter(value: string): Promise<void> {
    typeFilter.value = value
    await list.setPage(1)
  }

  return { ...list, setTypeFilter, typeFilter }
}
