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
 *
 * `comingSoon` (tarefa 66, 2026-09-02) — ortogonal a `active`: um
 * marketplace "em breve" continua aparecendo em `GET /marketplaces`
 * (a listagem que alimenta o grid de conectar), só não pode ser
 * conectado ainda (`POST /user-marketplaces` recusa com
 * `errorMessageMarketplaceComingSoon`) — `MarketplacesView.vue` já
 * desabilita o botão antes de tentar.
 *
 * `requiresStoreDocumentType` (2026-09-04, pedido direto do usuário) —
 * quando `true`, conectar esse marketplace exige informar se a loja é
 * PF ou PJ (`UserMarketplace.storeDocumentType`,
 * `ConnectMarketplaceModal.vue` só mostra o campo quando esta flag é
 * verdadeira). Aparece tanto na versão pública (`GET /marketplaces`,
 * pro usuário decidir antes de conectar) quanto na admin.
 */
export interface MarketplaceFields {
  comingSoon: boolean
  description: string | null
  logoUrl: string | null
  requiresStoreDocumentType: boolean
  tags: string[] | null
  websiteUrl: string | null
}

function toMarketplaceFields(resource: {
  coming_soon: boolean
  description: string | null
  logo_url: string | null
  requires_store_document_type: boolean
  tags: unknown[] | null
  website_url: string | null
}): MarketplaceFields {
  return {
    comingSoon: resource.coming_soon,
    description: resource.description,
    logoUrl: resource.logo_url,
    requiresStoreDocumentType: resource.requires_store_document_type,
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
 *
 * `individualFixedFee` (2026-09-04, "taxa fixa para PF", pedido direto
 * do usuário) — só visível/editável na visão admin (não aparece em
 * `GET /marketplaces`, o usuário comum nunca vê essa configuração
 * interna). Só armazenado nesta rodada, ainda sem uso em nenhum cálculo
 * de precificação (mesmo status que `ads_percentage` teve antes de
 * entrar na fórmula) — vem numa rodada futura.
 */
export interface AdminMarketplace extends MarketplaceFields {
  active: AdminMarketplaceResource['active']
  createdAt: AdminMarketplaceResource['created_at']
  id: AdminMarketplaceResource['id']
  individualFixedFee: AdminMarketplaceResource['individual_fixed_fee']
  name: AdminMarketplaceResource['name']
}

export function toAdminMarketplace(resource: AdminMarketplaceResource): AdminMarketplace {
  return {
    active: resource.active,
    createdAt: resource.created_at,
    id: resource.id,
    individualFixedFee: resource.individual_fixed_fee,
    name: resource.name,
    ...toMarketplaceFields(resource),
  }
}
