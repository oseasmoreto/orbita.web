import type { components } from '@/core/api/schema'

type MarketplaceResource = components['schemas']['MarketplaceResource']
type AdminMarketplaceResource = components['schemas']['AdminMarketplaceResource']

/**
 * Versão pública (`GET /marketplaces`, qualquer usuário autenticado) — só
 * `id`/`name`, já filtrado pra `active: true` pelo backend
 * (`MarketplaceController::index`). Usado pra popular a lista de canais
 * disponíveis pra conectar (`MarketplacesView.vue`).
 */
export interface Marketplace {
  id: MarketplaceResource['id']
  name: MarketplaceResource['name']
}

export function toMarketplace(resource: MarketplaceResource): Marketplace {
  return {
    id: resource.id,
    name: resource.name,
  }
}

/**
 * Versão admin (`GET/POST/PATCH/DELETE /admin/marketplaces`) — inclui
 * `active`/`created_at`, únicos campos que só o `admin_master` pode ver/
 * gerenciar (cadastro de marketplace é restrito ao admin,
 * `docs/negocio/contexto-plataforma-precificacao.md` seção 3).
 */
export interface AdminMarketplace {
  active: AdminMarketplaceResource['active']
  createdAt: AdminMarketplaceResource['created_at']
  id: AdminMarketplaceResource['id']
  name: AdminMarketplaceResource['name']
}

export function toAdminMarketplace(resource: AdminMarketplaceResource): AdminMarketplace {
  return {
    active: resource.active,
    createdAt: resource.created_at,
    id: resource.id,
    name: resource.name,
  }
}
