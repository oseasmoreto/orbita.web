import type { components } from '@/core/api/schema'

type UserMarketplaceResource = components['schemas']['UserMarketplaceResource']

/**
 * A "conta/loja" do usuário num `MARKETPLACE` — nunca guarda credencial
 * de API (`docs/negocio/contexto-plataforma-precificacao.md` seção 2.1,
 * ponto já resolvido). `marketplaceId` só referencia o marketplace — o
 * NOME dele não vem embutido aqui (`UserMarketplaceResource` não expõe
 * relação), quem exibe o nome cruza com a lista de `Marketplace` já
 * carregada (`listMarketplaces()`).
 */
export interface UserMarketplace {
  active: UserMarketplaceResource['active']
  createdAt: UserMarketplaceResource['created_at']
  id: UserMarketplaceResource['id']
  marketplaceId: UserMarketplaceResource['marketplace_id']
  storeName: UserMarketplaceResource['store_name']
}

export function toUserMarketplace(resource: UserMarketplaceResource): UserMarketplace {
  return {
    active: resource.active,
    createdAt: resource.created_at,
    id: resource.id,
    marketplaceId: resource.marketplace_id,
    storeName: resource.store_name,
  }
}
