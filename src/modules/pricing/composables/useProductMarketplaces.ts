import { computed, ref } from 'vue'
import type { SelectOption } from '@/shared/components/ui/types/select.type'
import {
  createProductMarketplace,
  deleteProductMarketplace,
  listMarketplaceCategories,
  listMarketplaces,
  listProductMarketplaces,
  listUserMarketplaces,
} from '../services/pricingApi'
import type { CategoryMarketplace } from '../types/categoryMarketplace.type'
import type { Marketplace } from '../types/marketplace.type'
import type { ProductMarketplace } from '../types/productMarketplace.type'
import type { UserMarketplace } from '../types/userMarketplace.type'

export interface ProductMarketplaceRow {
  categoryTitle: string | null
  createdAt: string | null
  id: string
  marketplaceLogoUrl: string | null
  marketplaceName: string
  practicedPrice: string | null
  productId: string
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
      categoryTitle: categoryLink?.category.title ?? null,
      createdAt: link.createdAt,
      id: link.id,
      marketplaceLogoUrl: marketplace?.logoUrl ?? null,
      marketplaceName: marketplace?.name ?? '—',
      practicedPrice: link.practicedPrice,
      productId: link.productId,
      storeName: connection?.storeName ?? '—',
      userMarketplaceId: link.userMarketplaceId,
    }
  })
}

/**
 * Opções pro `Select` de "vincular marketplace" — só conexões ATIVAS
 * (`UserMarketplaceNotActiveException`, backend) e ainda NÃO vinculadas
 * a este produto (evita a Action recusar com
 * `ProductAlreadyLinkedToMarketplaceException` — validação de UI, não só
 * espera o 422, mesmo critério já usado em `useMarketplaceConnection`
 * pro unique de `USER_MARKETPLACE`). Nunca lista `Marketplace` direto —
 * regra não-negociável do `CLAUDE.md` (produto só vincula a marketplace
 * CONECTADO).
 */
export function buildAvailableConnectionOptions(
  connections: UserMarketplace[],
  marketplaces: Marketplace[],
  links: ProductMarketplace[],
): SelectOption[] {
  const linkedConnectionIds = new Set(links.map((link) => link.userMarketplaceId))

  return connections
    .filter((connection) => connection.active && !linkedConnectionIds.has(connection.id))
    .map((connection) => {
      const marketplace = marketplaces.find(
        (candidate) => candidate.id === connection.marketplaceId,
      )
      return {
        label: `${marketplace?.name ?? '—'} — ${connection.storeName}`,
        value: connection.id,
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
  const availableOptions = computed(() =>
    buildAvailableConnectionOptions(connections.value, marketplaces.value, links.value),
  )

  /**
   * Opções pro `Select` de categoria — categorias já com comissão
   * configurada pro marketplace da conexão escolhida (`nem todo
   * marketplace tem categoria vinculada`, cross-session tarefa 64). Vazio
   * quando o marketplace não tem nenhuma — `ProductMarketplacesView.vue`
   * esconde o campo inteiro nesse caso, categoria é sempre opcional.
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

  async function link(userMarketplaceId: string, categoryId?: string): Promise<void> {
    await createProductMarketplace(productId, {
      category_id: categoryId === '' ? undefined : categoryId,
      user_marketplace_id: userMarketplaceId,
    })
    await refresh()
  }

  async function unlink(productMarketplaceId: string): Promise<void> {
    await deleteProductMarketplace(productId, productMarketplaceId)
    await refresh()
  }

  return {
    availableOptions,
    categoryOptionsFor,
    error,
    isLoading,
    link,
    refresh,
    rows,
    unlink,
  }
}
