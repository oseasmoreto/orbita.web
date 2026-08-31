import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminMarketplaces } from '../services/pricingApi'
import type { AdminMarketplace } from '../types/marketplace.type'

/**
 * `GET /admin/marketplaces` só ordena por essas 2 colunas
 * (`core/api/schema.d.ts`, `adminMarketplace.index`) — mesmo critério de
 * `buildProductSortParam` (`modules/catalog/composables/useProductList.ts`).
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  name: 'name',
}

export function buildAdminMarketplaceSortParam(
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
 * Wrapper de `useResourceList` pra `AdminMarketplace` — sem busca: a API
 * admin não tem filtro de texto por nome (só `filter[active]`, ainda sem
 * UI pra ele nesta rodada — a tabela mostra o status via coluna, o
 * volume esperado de marketplaces cadastrados é baixo o bastante pra não
 * precisar filtrar).
 */
export function useAdminMarketplaceList() {
  return useResourceList<AdminMarketplace>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminMarketplaces({
        page,
        perPage,
        sort: buildAdminMarketplaceSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
  })
}
