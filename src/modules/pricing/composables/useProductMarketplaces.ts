import { computed, ref } from 'vue'
import type { SelectOption } from '@/shared/components/ui/types/select.type'
import {
  createProductMarketplace,
  deleteProductMarketplace,
  listMarketplaces,
  listProductMarketplaces,
  listUserMarketplaces,
} from '../services/pricingApi'
import type { Marketplace } from '../types/marketplace.type'
import type { ProductMarketplace } from '../types/productMarketplace.type'
import type { UserMarketplace } from '../types/userMarketplace.type'

export interface ProductMarketplaceRow {
  createdAt: string | null
  id: string
  marketplaceName: string
  storeName: string
  userMarketplaceId: string
}

/**
 * `ProductMarketplaceResource` só tem `user_marketplace_id` (vínculo
 * puro, decisão 2026-08-26) — pra mostrar o NOME do marketplace/loja
 * numa linha de tabela, cruza com as 2 listas já carregadas
 * (`UserMarketplace`, que por sua vez referencia `Marketplace`). Um
 * vínculo cujos dados relacionados não vieram na mesma busca (paginação/
 * dado obsoleto) cai no fallback "—", nunca quebra a tabela.
 */
export function buildProductMarketplaceRows(
  links: ProductMarketplace[],
  connections: UserMarketplace[],
  marketplaces: Marketplace[],
): ProductMarketplaceRow[] {
  return links.map((link) => {
    const connection = connections.find((candidate) => candidate.id === link.userMarketplaceId)
    const marketplace = connection
      ? marketplaces.find((candidate) => candidate.id === connection.marketplaceId)
      : undefined

    return {
      createdAt: link.createdAt,
      id: link.id,
      marketplaceName: marketplace?.name ?? '—',
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
 * — busca as 3 listas em paralelo. `perPage: 100`, mesmo critério de
 * `useMarketplaceConnections.ts` (volume baixo, sem `PaginationNav`).
 */
export function useProductMarketplaces(productId: string) {
  const links = ref<ProductMarketplace[]>([])
  const connections = ref<UserMarketplace[]>([])
  const marketplaces = ref<Marketplace[]>([])
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
      error.value = null
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  const rows = computed(() =>
    buildProductMarketplaceRows(links.value, connections.value, marketplaces.value),
  )
  const availableOptions = computed(() =>
    buildAvailableConnectionOptions(connections.value, marketplaces.value, links.value),
  )

  async function link(userMarketplaceId: string): Promise<void> {
    await createProductMarketplace(productId, { user_marketplace_id: userMarketplaceId })
    await refresh()
  }

  async function unlink(productMarketplaceId: string): Promise<void> {
    await deleteProductMarketplace(productId, productMarketplaceId)
    await refresh()
  }

  return { availableOptions, error, isLoading, link, refresh, rows, unlink }
}
