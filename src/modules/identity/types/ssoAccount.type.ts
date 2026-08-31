import type { components } from '@/core/api/schema'

type SsoAccountResource = components['schemas']['SsoAccountResource']

/** Providers reais de `SSO_ACCOUNT.provider` — nunca `apple`, não existe no domínio (seção 2.1 do contexto de negócio). */
export type SsoProvider = 'google' | 'microsoft'

/**
 * Tipo de domínio, em cima do `SsoAccountResource` gerado — mesmo padrão
 * de `AuthUser`/`Product`. `access_token`/`refresh_token` nunca são
 * expostos pelo backend (`SsoAccountResource.php`, comentário real: "são
 * credenciais, não dado de exibição"), então nem aparecem aqui.
 */
export interface SsoAccount {
  createdAt: SsoAccountResource['created_at']
  id: SsoAccountResource['id']
  provider: SsoProvider
}

/**
 * `provider` chega tipado como `string` genérico (o gerador não carrega o
 * enum do backend pra cá) — cast seguro pelo mesmo motivo de
 * `toAuthUser`: `SSO_ACCOUNT.provider` só aceita `google`/`microsoft` por
 * regra de negócio.
 */
export function toSsoAccount(resource: SsoAccountResource): SsoAccount {
  return {
    createdAt: resource.created_at,
    id: resource.id,
    provider: resource.provider as SsoProvider,
  }
}
