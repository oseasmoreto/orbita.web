import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listMarketplaceCategories } from '../services/pricingApi'
import type { CategoryMarketplace } from '../types/categoryMarketplace.type'

/**
 * `GET /marketplaces/{id}/categories` só ordena por essas 2 colunas
 * (`core/api/schema.d.ts`, `categoryMarketplace.index`).
 */
const SORT_PARAM: Record<string, string> = {
  commissionPercentage: 'commission_percentage',
  createdAt: 'created_at',
}

export function buildCategoryMarketplaceSortParam(
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
 * Wrapper de `useResourceList` pra `CategoryMarketplace` de UM
 * marketplace — mesmo padrão exato de `useAdminPricingRuleList.ts`.
 * Leitura via endpoint COMPARTILHADO (`listMarketplaceCategories`,
 * `auth:sanctum` só) — funciona pro admin igual pra qualquer usuário, só
 * a escrita (`useAdminCategoryMarketplaceForm.ts`) é exclusiva do admin.
 */
export function useAdminCategoryMarketplaceList(marketplaceId: string) {
  return useResourceList<CategoryMarketplace>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listMarketplaceCategories(marketplaceId, {
        page,
        perPage,
        sort: buildCategoryMarketplaceSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })
}
