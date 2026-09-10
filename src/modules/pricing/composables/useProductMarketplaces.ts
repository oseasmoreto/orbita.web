import { computed, ref } from 'vue'
import type { SelectOption } from '@/shared/components/ui/types/select.type'
import {
  listMarketplaceCategories,
  listMarketplaces,
  listProductMarketplaces,
  listUserMarketplaces,
} from '../services/pricingApi'
import type { CategoryMarketplace } from '../types/categoryMarketplace.type'
import type { Marketplace } from '../types/marketplace.type'
import type { ProductMarketplace, ProductMarketplaceStatus } from '../types/productMarketplace.type'
import type { UserMarketplace } from '../types/userMarketplace.type'

export interface ProductMarketplaceRow {
  categoryId: string | null
  categoryTitle: string | null
  createdAt: string | null
  id: string
  marketplaceLogoUrl: string | null
  marketplaceName: string
  practicedPrice: string | null
  productId: string
  status: ProductMarketplaceStatus
  storeName: string
  userMarketplaceId: string
}

/**
 * `ProductMarketplaceResource` só tem `user_marketplace_id`/`category_id`
 * cru — pra mostrar o NOME/LOGO do marketplace + nome da loja + título da
 * categoria numa linha de tabela, cruza com as listas já carregadas
 * (`UserMarketplace`→`Marketplace`, `categoriesByMarketplace`, tarefa
 * 64). Um vínculo cujos dados relacionados não vieram na mesma busca
 * (paginação/dado obsoleto) cai no fallback "—"/`null`, nunca quebra a
 * tabela.
 */
export function buildProductMarketplaceRows(
  links: ProductMarketplace[],
  connections: UserMarketplace[],
  marketplaces: Marketplace[],
  categoriesByMarketplace: Map<string, CategoryMarketplace[]>,
): ProductMarketplaceRow[] {
  return links.map((link) => {
    const connection = connections.find((candidate) => candidate.id === link.userMarketplaceId)
    const marketplace = connection
      ? marketplaces.find((candidate) => candidate.id === connection.marketplaceId)
      : undefined
    const categoryLink = connection
      ? (categoriesByMarketplace.get(connection.marketplaceId) ?? []).find(
          (candidate) => candidate.categoryId === link.categoryId,
        )
      : undefined

    return {
      categoryId: link.categoryId,
      categoryTitle: categoryLink?.category.title ?? null,
      createdAt: link.createdAt,
      id: link.id,
      marketplaceLogoUrl: marketplace?.logoUrl ?? null,
      marketplaceName: marketplace?.name ?? '—',
      practicedPrice: link.practicedPrice,
      productId: link.productId,
      status: link.status,
      storeName: connection?.storeName ?? '—',
      userMarketplaceId: link.userMarketplaceId,
    }
  })
}

/**
 * Dado da tela "Marketplaces do produto" (`ProductMarketplacesView.vue`)
 * — busca as 3 listas em paralelo, depois as categorias configuradas
 * pra cada marketplace conectado (tarefa 64 — `GET
 * /marketplaces/{id}/categories`, endpoint COMPARTILHADO, mesmo
 * raciocínio de `useAdminPricingRuleList.ts`). `perPage: 100`, mesmo
 * critério de `useMarketplaceConnections.ts` (volume baixo, sem
 * `PaginationNav`).
 */
export function useProductMarketplaces(productId: string) {
  const links = ref<ProductMarketplace[]>([])
  const connections = ref<UserMarketplace[]>([])
  const marketplaces = ref<Marketplace[]>([])
  const categoriesByMarketplace = ref<Map<string, CategoryMarketplace[]>>(new Map())
  const isLoading = ref(false)
  const error = ref<unknown>(null)

  async function refresh(): Promise<void> {
    isLoading.value = true

    try {
      const [linksResult, connectionsResult, marketplacesResult] = await Promise.all([
        listProductMarketplaces(productId, { perPage: 100 }),
        listUserMarketplaces({ active: true, perPage: 100 }),
        listMarketplaces({ perPage: 100 }),
      ])
      links.value = linksResult.items
      connections.value = connectionsResult.items
      marketplaces.value = marketplacesResult.items

      const marketplaceIds = [
        ...new Set(connectionsResult.items.map((connection) => connection.marketplaceId)),
      ]
      const categoryResults = await Promise.all(
        marketplaceIds.map((marketplaceId) =>
          listMarketplaceCategories(marketplaceId, { perPage: 100 }),
        ),
      )
      categoriesByMarketplace.value = new Map(
        marketplaceIds.map((marketplaceId, index) => [marketplaceId, categoryResults[index].items]),
      )

      error.value = null
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  const rows = computed(() =>
    buildProductMarketplaceRows(
      links.value,
      connections.value,
      marketplaces.value,
      categoriesByMarketplace.value,
    ),
  )

  /**
   * Opções pro `Select` de categoria do modal de edição
   * (`UpdatePracticedPriceModal.vue`, `category_id` virou mutável via
   * `PATCH` em 2026-09-10, junto com a remoção do `DELETE`/"vincular") —
   * categorias já com comissão configurada pro marketplace da conexão
   * dessa linha. Vazio quando o marketplace não tem nenhuma — o modal
   * esconde o campo inteiro nesse caso.
   */
  function categoryOptionsFor(userMarketplaceId: string): SelectOption[] {
    const connection = connections.value.find((candidate) => candidate.id === userMarketplaceId)

    if (!connection) {
      return []
    }

    return (categoriesByMarketplace.value.get(connection.marketplaceId) ?? []).map(
      (categoryLink) => ({
        label: categoryLink.category.title,
        value: categoryLink.categoryId,
      }),
    )
  }

  return {
    categoryOptionsFor,
    error,
    isLoading,
    refresh,
    rows,
  }
}
