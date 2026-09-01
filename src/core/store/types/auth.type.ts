import type { components } from '@/core/api/schema'

export type UserRole = 'admin_master' | 'user'

/**
 * Favorito de navegação da sidebar (`AppSidebarContent.vue`) — pedido
 * direto do usuário, 2026-08-31. `routeName` (não a URL/path) porque é o
 * identificador estável do Vue Router — sobrevive a uma mudança de path
 * futura, uma URL guardada não sobreviveria.
 */
export interface FavoriteItem {
  id: string
  label: string
  routeName: string
}

/**
 * Mapper vive aqui (não em `modules/identity/types/user.type.ts`, onde
 * nasceu) porque `modules/platform/composables/useFavorites.ts` precisa
 * dele também (`POST /favorites` devolve o mesmo `UserFavoriteResource`)
 * — um módulo nunca importa de outro módulo diretamente
 * (`docs/infra/convencoes-frontend-infra.md` seção 2), então o mapper sobe
 * pra `core/`, que os dois já podem importar, ao lado do tipo `FavoriteItem`
 * que ele produz.
 */
export function toFavoriteItem(
  resource: components['schemas']['UserFavoriteResource'],
): FavoriteItem {
  return {
    id: resource.id,
    label: resource.label,
    routeName: resource.route_name,
  }
}

/**
 * Limites do plano ATUAL — `null` pra `admin_master` (sem assinatura
 * própria) ou usuário ainda sem plano. `maxProducts`/`maxMarketplaces`
 * também podem ser `null` individualmente (plano sem limite nesse
 * recurso). Pedido pra sessão de backend em 2026-08-31 (mesmo padrão de
 * `favorites`/`requiresSubscription`, denormalizado direto em
 * `LoginResultResource` pra `modules/catalog` nunca precisar importar
 * `modules/billing` só pra achar o plano ativo).
 */
export interface PlanLimits {
  maxMarketplaces: number | null
  maxProducts: number | null
}

export function toPlanLimits(
  resource: components['schemas']['LoginResultResource']['plan_limits'],
): PlanLimits | null {
  if (!resource) {
    return null
  }

  return { maxMarketplaces: resource.max_marketplaces, maxProducts: resource.max_products }
}

/**
 * `id`/`name` do admin ORIGINAL — `null` quando a sessão atual não é uma
 * impersonation. Pedido pra sessão de backend em 2026-09-01 (Fase 6,
 * mesmo dia): `impersonated_by` já existia como estado real na Session
 * do servidor (`StartImpersonationAction`/`impersonator_id`), só não
 * estava exposto em `GET /auth/me` — sem isso, o front só sabia "estou
 * impersonando" no instante síncrono do clique em "Impersonar", perdia
 * esse dado em qualquer reload. Objeto completo (não só um boolean) pra
 * `ImpersonationBanner.vue` mostrar o nome sem uma segunda chamada.
 */
export interface ImpersonatedBy {
  id: string
  name: string
}

export function toImpersonatedBy(
  resource: components['schemas']['LoginResultResource']['impersonated_by'],
): ImpersonatedBy | null {
  return resource ? { id: resource.id, name: resource.name } : null
}

export interface AuthUser {
  email: string
  emailVerifiedAt: string | null
  favorites: FavoriteItem[]
  id: string
  impersonatedBy: ImpersonatedBy | null
  name: string
  planLimits: PlanLimits | null
  role: UserRole
  status: string
}
