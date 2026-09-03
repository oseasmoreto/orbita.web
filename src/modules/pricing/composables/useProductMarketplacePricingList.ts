import { type Ref, ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import type { ProductMarketplacePricingTotals } from '../services/pricingApi'
import { listProductMarketplacePricing } from '../services/pricingApi'
import type { ProductMarketplacePricing } from '../types/productMarketplacePricing.type'

/**
 * `GET /user-marketplaces/{id}/products` só ordena por `created_at`
 * (contrato real da tarefa 76) — mesmo padrão de `buildProductSortParam`
 * (`useProductList.ts`): qualquer outra `key` não tem `sortable: true`
 * na tabela e nunca chega aqui, devolve `undefined` com segurança pra
 * qualquer key desconhecida.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
}

export function buildProductMarketplacePricingSortParam(
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

const EMPTY_TOTALS: ProductMarketplacePricingTotals = {
  averageMargin: '0',
  productCount: 0,
  profit: '0',
  revenue: '0',
}

/**
 * Wrapper de `useResourceList` pra `ProductMarketplacePricing` —
 * `search`/`totals` (busca por nome + KPIs agregados, pedidos ao
 * backend em 2026-09-03) adicionados no mesmo dia que ficaram prontos.
 * `totals` não é modelado por `useResourceList` (só sabe `items`/`total`
 * de contagem, não um agregado de negócio) — guardado num `ref` à parte,
 * atualizado como efeito colateral dentro de `fetchPage`, sempre em
 * sincronia com a página buscada (inclusive quando a busca filtra o
 * conjunto: os totais respeitam o mesmo filtro).
 *
 * `userMarketplaceId` é um `Ref<string>`, não `string` — achado real,
 * 2026-09-03: a v1 recebia só o id inicial (da rota), sem suporte a
 * trocar de conexão sem sair da página (abas por marketplace, mockup
 * original tinha isso via `TabBar`, a v1 real tinha perdido). Trocar o
 * `.value` do ref e chamar `refresh()` já refaz a busca pra conexão
 * nova, sem precisar recriar o composable inteiro.
 */
export function useProductMarketplacePricingList(userMarketplaceId: Ref<string>) {
  const totals = ref<ProductMarketplacePricingTotals>(EMPTY_TOTALS)

  const list = useResourceList<ProductMarketplacePricing>({
    fetchPage: async ({ page, perPage, search, sortDirection, sortKey }) => {
      const result = await listProductMarketplacePricing(userMarketplaceId.value, {
        page,
        perPage,
        productName: search || undefined,
        sort: buildProductMarketplacePricingSortParam(sortKey, sortDirection),
      })
      totals.value = result.totals
      return { items: result.items, total: result.meta.total }
    },
    perPage: 15,
  })

  return { ...list, totals }
}
