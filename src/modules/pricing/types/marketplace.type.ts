import type { components } from '@/core/api/schema'

type MarketplaceResource = components['schemas']['MarketplaceResource']
type AdminMarketplaceResource = components['schemas']['AdminMarketplaceResource']

/**
 * `logo_url`/`description`/`tags`/`website_url` — pedidos pro backend em
 * 2026-08-31 pra fechar o gap real de "pixel perfect" do grid de cards
 * (`MarketplacesView.vue`): a referência visual do usuário tinha logo por
 * marca, descrição, badges de categoria e link externo, e `MARKETPLACE`
 * só tinha `id`/`name`/`active` até então. `tags` chega como `unknown[]`
 * do schema gerado (Scramble não infere o tipo do item de array em
 * `Resource`, só em `Request` — `CreateMarketplaceRequest.tags` já é
 * `string[]` corretamente) — cast seguro aqui porque o backend confirma
 * que é sempre array de string.
 */
export interface MarketplaceFields {
  description: string | null
  logoUrl: string | null
  tags: string[] | null
  websiteUrl: string | null
}

function toMarketplaceFields(resource: {
  description: string | null
  logo_url: string | null
  tags: unknown[] | null
  website_url: string | null
}): MarketplaceFields {
  return {
    description: resource.description,
    logoUrl: resource.logo_url,
    tags: resource.tags as string[] | null,
    websiteUrl: resource.website_url,
  }
}

/**
 * Versão pública (`GET /marketplaces`, qualquer usuário autenticado) —
 * já filtrado pra `active: true` pelo backend
 * (`MarketplaceController::index`). Usado pra popular o grid de canais
 * disponíveis pra conectar (`MarketplacesView.vue`).
 */
export interface Marketplace extends MarketplaceFields {
  id: MarketplaceResource['id']
  name: MarketplaceResource['name']
}

export function toMarketplace(resource: MarketplaceResource): Marketplace {
  return {
    id: resource.id,
    name: resource.name,
    ...toMarketplaceFields(resource),
  }
}

/**
 * Versão admin (`GET/POST/PATCH/DELETE /admin/marketplaces`) — inclui
 * `active`/`created_at`, únicos campos que só o `admin_master` pode ver/
 * gerenciar (cadastro de marketplace é restrito ao admin,
 * `docs/negocio/contexto-plataforma-precificacao.md` seção 3).
 */
export interface AdminMarketplace extends MarketplaceFields {
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
    ...toMarketplaceFields(resource),
  }
}
