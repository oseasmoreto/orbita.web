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

export interface AuthUser {
  email: string
  emailVerifiedAt: string | null
  favorites: FavoriteItem[]
  id: string
  name: string
  role: UserRole
  status: string
}
