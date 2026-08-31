import { computed, ref } from 'vue'
import { listMarketplaces, listUserMarketplaces } from '../services/pricingApi'
import type { Marketplace } from '../types/marketplace.type'
import type { UserMarketplace } from '../types/userMarketplace.type'

export interface MarketplaceConnectionCard {
  connection: UserMarketplace | null
  marketplace: Marketplace
}

/**
 * Junta a lista PÚBLICA de marketplaces (`GET /marketplaces`) com as
 * conexões do próprio usuário (`GET /user-marketplaces`) — um card por
 * marketplace, `connection: null` quando ainda não conectado. Uma
 * conexão cujo `marketplaceId` não bate com nenhum marketplace da lista
 * (paginação/dado obsoleto) é silenciosamente ignorada, nunca quebra o
 * grid.
 */
export function buildMarketplaceConnectionCards(
  marketplaces: Marketplace[],
  connections: UserMarketplace[],
): MarketplaceConnectionCard[] {
  return marketplaces.map((marketplace) => ({
    connection:
      connections.find((connection) => connection.marketplaceId === marketplace.id) ?? null,
    marketplace,
  }))
}

/**
 * Dado do grid de "Canais de venda" (`MarketplacesView.vue`) — busca as
 * 2 listas em paralelo. `perPage: 100` em vez de paginação de verdade: o
 * volume esperado de marketplaces cadastrados é baixo (cadastro é
 * exclusivo do admin, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 3), não justifica `PaginationNav` num grid de cards.
 */
export function useMarketplaceConnections() {
  const marketplaces = ref<Marketplace[]>([])
  const connections = ref<UserMarketplace[]>([])
  const isLoading = ref(false)
  const error = ref<unknown>(null)

  async function refresh(): Promise<void> {
    isLoading.value = true

    try {
      const [marketplacesResult, connectionsResult] = await Promise.all([
        listMarketplaces({ perPage: 100 }),
        listUserMarketplaces({ perPage: 100 }),
      ])
      marketplaces.value = marketplacesResult.items
      connections.value = connectionsResult.items
      error.value = null
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  const cards = computed(() =>
    buildMarketplaceConnectionCards(marketplaces.value, connections.value),
  )
  const connectedCount = computed(() => connections.value.length)

  return { cards, connectedCount, error, isLoading, refresh }
}
