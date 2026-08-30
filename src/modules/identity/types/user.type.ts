import type { components } from '@/core/api/schema'
import type { AuthUser, UserRole } from '@/core/store/types/auth.type'

type UserResource = components['schemas']['UserResource']

/**
 * `UserResource.role` chega tipado como `string` (o gerador não carrega o
 * enum do backend pra cá) — o cast é seguro porque `USER.role` só aceita
 * `admin_master`/`user` por regra de negócio (única forma de controle de
 * acesso do MVP, `docs/negocio/contexto-plataforma-precificacao.md` seção
 * 2.1), não uma limitação real deste mapper.
 */
export function toAuthUser(resource: UserResource): AuthUser {
  return {
    email: resource.email,
    emailVerifiedAt: resource.email_verified_at,
    id: resource.id,
    name: resource.name,
    role: resource.role as UserRole,
    status: resource.status,
  }
}
