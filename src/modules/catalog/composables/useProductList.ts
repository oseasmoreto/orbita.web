import { refDebounced } from '@vueuse/core'
import { ref, watch } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listProducts } from '../services/catalogApi'
import type { Product } from '../types/product.type'

/**
 * `GET /products` só ordena por essas 3 colunas (`core/api/schema.d.ts`,
 * `product.index`) — qualquer outra `key` (ex.: uma coluna calculada
 * tipo "margem") não tem `sortable: true` na tabela (`ProductsView.vue`)
 * e nunca chega aqui, mas a função ainda devolve `undefined` com
 * segurança pra qualquer key desconhecida.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  fullSalePrice: 'full_sale_price',
  name: 'name',
}

export function buildProductSortParam(
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
 * Wrapper de `useResourceList` (`shared/composables/`) pra `Product` —
 * o "encanamento" (chamar `catalogApi`, mapear sort da UI pro parâmetro
 * real) mora aqui; a lógica de paginação/busca/ordenação genérica já foi
 * testada em `useResourceList.test.ts`, não repete teste aqui pro que já
 * está coberto — só `buildProductSortParam` (decisão de negócio real:
 * quais colunas a API aceita) ganha teste próprio.
 *
 * Busca é por SKU exato (`filter[sku]`), não nome — limitação real da
 * API hoje (só esse filtro existe pra produto). Debounced via
 * `refDebounced` do `@vueuse/core` (decisão 2026-08-26 da seção 4:
 * VueUse antes de escrever debounce próprio) antes de disparar a
 * requisição.
 */
export function useProductList() {
  const list = useResourceList<Product>({
    fetchPage: async ({ page, perPage, search, sortDirection, sortKey }) => {
      const result = await listProducts({
        page,
        perPage,
        sku: search || undefined,
        sort: buildProductSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })

  const searchInput = ref('')
  const debouncedSearchInput = refDebounced(searchInput, 300)

  watch(debouncedSearchInput, (value) => {
    void list.setSearch(value)
  })

  return { ...list, searchInput }
}
