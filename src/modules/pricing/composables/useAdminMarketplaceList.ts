import { ref } from 'vue'
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
 * admin não tem filtro de texto por nome (só `filter[active]`). Filtro
 * de `active` (`ListToolbar` `#filters`, 2026-09-01, pedido direto do
 * usuário) — `activeFilter` como `string` (`'all'`/`'true'`/`'false'`,
 * valor de `Select`), convertido pra `boolean | undefined` só na hora de
 * chamar o service, aplicado imediatamente na troca (sem exigir clique
 * num botão "Filtrar" separado — diferente do filtro de texto livre de
 * `useAuditLogList.ts`, aqui é uma escolha discreta de dropdown).
 *
 * **`'all'`, não `''`, como valor do sentinel de "limpar filtro"** —
 * achado real, verificado em browser: `SelectItem` da Reka UI rejeita
 * `value=""` com throw (`"must have a value prop that is not an empty
 * string"` — string vazia é reservada internamente pra "sem seleção"/
 * mostrar o placeholder). Todo `Select` de filtro do projeto usa esse
 * mesmo sentinel — ver `AdminMarketplacesView.vue` e os outros 4 CRUDs
 * admin migrados na mesma rodada.
 */
export function useAdminMarketplaceList() {
  const activeFilter = ref('all')

  const list = useResourceList<AdminMarketplace>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminMarketplaces({
        active: activeFilter.value === 'all' ? undefined : activeFilter.value === 'true',
        page,
        perPage,
        sort: buildAdminMarketplaceSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
  })

  async function setActiveFilter(value: string): Promise<void> {
    activeFilter.value = value
    await list.setPage(1)
  }

  return { ...list, activeFilter, setActiveFilter }
}
