import type { components } from '@/core/api/schema'
import type { AuthUser, FavoriteItem, UserRole } from '@/core/store/types/auth.type'

type UserResource = components['schemas']['UserResource']

/**
 * `UserResource.role` chega tipado como `string` (o gerador não carrega o
 * enum do backend pra cá) — o cast é seguro porque `USER.role` só aceita
 * `admin_master`/`user` por regra de negócio (única forma de controle de
 * acesso do MVP, `docs/negocio/contexto-plataforma-precificacao.md` seção
 * 2.1), não uma limitação real deste mapper.
 *
 * `favorites` é parâmetro separado, não lido de dentro de `resource` —
 * achado real, 2026-08-31: `UserFavoriteResource[]` chega como campo
 * IRMÃO de `user` em `LoginResultResource` (`{ user, requires_subscription,
 * favorites }`), nunca aninhado dentro do próprio `UserResource`. A
 * primeira versão deste mapper (cast temporário `UserResourceWithFavorites`,
 * enquanto o campo não existia no schema gerado) já cometia esse engano —
 * lia `resource.favorites`, que nunca existiu nem existe agora, então a
 * lista sempre resolvia vazia mesmo depois do backend implementar o
 * endpoint. Corrigido chamando com o array já extraído no call site
 * (`result.favorites`, não `result.user.favorites`) — ver
 * `useLoginForm.ts`/`guards.ts`/`useVerifyEmail.ts`. `register()`/
 * `updateProfile()` (`identityApi.ts`) devolvem só `UserResource`, sem
 * `favorites` — `useRegisterForm.ts` não precisa passar nada (conta nova
 * nunca tem favorito), `useUpdateProfileForm.ts` preserva
 * `authStore.user.favorites` explicitamente, mesmo padrão já usado pra
 * `requiresSubscription` nesse mesmo composable.
 */
export function toAuthUser(resource: UserResource, favorites: FavoriteItem[] = []): AuthUser {
  return {
    email: resource.email,
    emailVerifiedAt: resource.email_verified_at,
    favorites,
    id: resource.id,
    name: resource.name,
    role: resource.role as UserRole,
    status: resource.status,
  }
}
