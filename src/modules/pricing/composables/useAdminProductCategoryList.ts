import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminProductCategories } from '../services/pricingApi'
import type { ProductCategory } from '../types/productCategory.type'

/**
 * `GET /admin/product-categories` só ordena por essas 2 colunas
 * (`core/api/schema.d.ts`, `adminProductCategory.index`).
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  title: 'title',
}

export function buildAdminProductCategorySortParam(
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
 * Wrapper de `useResourceList` pra `ProductCategory` — mesmo padrão de
 * `useAdminMarketplaceList.ts`. Filtro de `marketplace_id` (pedido do
 * usuário no planejamento da tarefa 64, "filter[marketplace_id]
 * adicionado por pedido seu") mostra só categorias já com comissão
 * configurada pra aquele marketplace — mesmo sentinel `'all'` já usado
 * em todo `Select` de filtro do projeto (`SelectItem` da Reka UI rejeita
 * `value=""`).
 */
export function useAdminProductCategoryList() {
  const activeFilter = ref('all')
  const marketplaceFilter = ref('all')

  const list = useResourceList<ProductCategory>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminProductCategories({
        active: activeFilter.value === 'all' ? undefined : activeFilter.value === 'true',
        marketplaceId: marketplaceFilter.value === 'all' ? undefined : marketplaceFilter.value,
        page,
        perPage,
        sort: buildAdminProductCategorySortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
  })

  async function setActiveFilter(value: string): Promise<void> {
    activeFilter.value = value
    await list.setPage(1)
  }

  async function setMarketplaceFilter(value: string): Promise<void> {
    marketplaceFilter.value = value
    await list.setPage(1)
  }

  return { ...list, activeFilter, marketplaceFilter, setActiveFilter, setMarketplaceFilter }
}
