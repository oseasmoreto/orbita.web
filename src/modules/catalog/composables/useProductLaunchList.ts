import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listProductLaunches } from '../services/catalogApi'
import type { ProductLaunch } from '../types/productLaunch.type'

/**
 * `GET /products/{product}/launches` só ordena por essas 4 colunas
 * (`core/api/schema.d.ts`, `productLaunch.index`) — mesmo critério de
 * `buildProductSortParam` (`useProductList.ts`).
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  date: 'date',
  purchasePrice: 'purchase_price',
  quantity: 'quantity',
}

export function buildProductLaunchSortParam(
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
 * Wrapper de `useResourceList` pra `ProductLaunch` de UM produto —
 * `productId` é fixo pra uma instância do composable (recebido como
 * parâmetro na criação, não trocável depois), mesmo padrão de
 * `useProductList.ts`. Sem busca — a API não tem filtro de texto pra
 * lançamento, só paginação/ordenação.
 */
export function useProductLaunchList(productId: string) {
  return useResourceList<ProductLaunch>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listProductLaunches(productId, {
        page,
        perPage,
        sort: buildProductLaunchSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })
}
