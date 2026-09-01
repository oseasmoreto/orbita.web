import { isAxiosError } from 'axios'
import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import { type AdminUser, toAdminUser } from '@/core/types/adminUser.type'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type SsoAccount, type SsoProvider, toSsoAccount } from '../types/ssoAccount.type'

type LoginRequest = components['schemas']['LoginRequest']
type LoginResultResource = components['schemas']['LoginResultResource']
type RegisterUserRequest = components['schemas']['RegisterUserRequest']
type UserResource = components['schemas']['UserResource']
type RequestPasswordResetRequest = components['schemas']['RequestPasswordResetRequest']
type ResetPasswordRequest = components['schemas']['ResetPasswordRequest']
type UpdateUserProfileRequest = components['schemas']['UpdateUserProfileRequest']
type SsoAccountResource = components['schemas']['SsoAccountResource']
type AdminUserResource = components['schemas']['AdminUserResource']
type CreateUserByAdminRequest = components['schemas']['CreateUserByAdminRequest']
type UpdateUserByAdminRequest = components['schemas']['UpdateUserByAdminRequest']

interface AdminUsersEnvelope {
  items: AdminUserResource[]
  meta: { current_page: number; per_page: number; total: number }
}

/**
 * `GET /auth/login` real (`core/api/schema.d.ts`, `login.store`) tem uma
 * particularidade: 402 (Payment Required) devolve o MESMO
 * `LoginResultResource` que o 200 — é o caso "credenciais corretas, sessão
 * criada, mas sem assinatura ativa" (`requires_subscription: true`), não
 * uma falha de autenticação. Axios trata qualquer status fora de 2xx como
 * erro, então o 402 é capturado aqui e devolvido como sucesso normal — só
 * um erro de verdade (422, credenciais inválidas) continua propagando pro
 * chamador. Isso mantém `useLoginForm.ts` livre dessa nuance de transporte.
 */
export async function login(payload: LoginRequest): Promise<LoginResultResource> {
  try {
    const { data } = await apiClient.post<ApiResponse<LoginResultResource>>('/auth/login', payload)
    return data.data
  } catch (error) {
    if (isAxiosError<ApiResponse<LoginResultResource>>(error) && error.response?.status === 402) {
      return error.response.data.data
    }
    throw error
  }
}

export async function register(payload: RegisterUserRequest): Promise<UserResource> {
  const { data } = await apiClient.post<ApiResponse<UserResource>>('/auth/register', payload)
  return data.data
}

/**
 * `GET /auth/me` (`userProfile.show`) — usado pro bootstrap de sessão no
 * boot do app (`core/router/guards.ts`): a store de auth (Pinia) não
 * persiste entre reloads, mas o cookie httpOnly do Sanctum sim, então sem
 * isso todo F5 derrubaria um usuário de verdade pro login. Deixa o 401
 * propagar pro `catch` de `bootstrapSession()` sem tratamento especial —
 * ausência de sessão é o caso normal (usuário nunca logou, ex.: abriu um
 * link de reset de senha direto), não um erro a esconder do chamador.
 * `skipUnauthorizedRedirect` evita que esse 401 esperado dispare o
 * `UNAUTHORIZED_EVENT` global (`core/api/client.ts`) e force um
 * `router.push({ name: 'login' })` por cima de rotas `requiresGuest` —
 * achado real: sem essa flag, abrir `/reset-password` sem sessão era
 * redirecionado pro login antes mesmo do guard de rota decidir algo.
 *
 * **Achado real, 2026-08-31**: `ShowAuthenticatedUserAction` (backend)
 * passou a devolver `LoginResultResource` em vez de `UserResource` puro —
 * mesmo cálculo de `requires_subscription` de `LoginUserAction`, já
 * excluindo `admin_master`. Motivo (comentário real do backend): login
 * via SSO nunca devolve JSON (só redireciona o browser), então `/me` é o
 * único jeito do front saber se um usuário logado via SSO precisa
 * assinar um plano. Isso fechou uma reimplementação client-side que
 * existia aqui antes (`modules/billing/composables/useSubscriptionStatus`
 * batendo em `GET /subscriptions` e replicando `UserSubscriptionStatus::isActive`)
 * — removida, `bootstrapSession()` usa `result.requires_subscription`
 * direto agora.
 */
export async function fetchCurrentUser(): Promise<LoginResultResource> {
  const { data } = await apiClient.get<ApiResponse<LoginResultResource>>('/auth/me', {
    skipUnauthorizedRedirect: true,
  })
  return data.data
}

/**
 * `POST /auth/logout` (`logout.store`, `auth:sanctum`) — invalida a sessão
 * no backend (`LogoutUserAction`). Sem request body, sem 402 especial como
 * `login()`; um 401 aqui (sessão já expirada, ex.: logout com 2 abas
 * abertas) é tratado pelo chamador (`useLogout.ts`), não aqui.
 */
export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout')
}

/**
 * `POST /auth/email/verification-notification` (`emailVerification.resend`,
 * `auth:sanctum`) — reenvia o e-mail de verificação pro usuário logado.
 * `ResendEmailVerificationAction` (backend) já é um no-op se o e-mail já
 * estiver verificado, então não precisa checar isso aqui antes de chamar.
 */
export async function resendEmailVerification(): Promise<void> {
  await apiClient.post('/auth/email/verification-notification')
}

export async function requestPasswordReset(payload: RequestPasswordResetRequest): Promise<void> {
  await apiClient.post('/auth/password/forgot', payload)
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/password/reset', payload)
}

/**
 * `PATCH /auth/me` (`userProfile.update`, `auth:sanctum`) — os 3 únicos
 * campos editáveis (`mapeamento-cruds-perfil.md`, P3): nome, e-mail,
 * senha. `sometimes` no backend — manda só os campos que o usuário
 * realmente alterou (`useUpdateProfileForm.ts` decide isso, não aqui).
 * Trocar o e-mail zera `email_verified_at` e reenvia a verificação
 * (`UpdateUserProfileAction`, backend) — o front não precisa fazer nada
 * a mais por isso, o guard (`core/router/guards.ts`) já manda pro
 * `verify-email` sozinho na próxima navegação se isso acontecer.
 */
export async function updateProfile(payload: UpdateUserProfileRequest): Promise<UserResource> {
  const { data } = await apiClient.patch<ApiResponse<UserResource>>('/auth/me', payload)
  return data.data
}

/**
 * `DELETE /auth/me` (`userProfile.destroy`, `auth:sanctum`) —
 * soft-delete/anonimização (`DeleteUserAccountAction`, backend), nunca
 * hard delete. `password` é query param (não body — assim que o Scramble
 * documentou a rota, `DeleteUserAccountRequest` lê `sometimes`), só
 * exigido de verdade pra conta que TEM senha — conta só-SSO não manda
 * nada aqui, a Action nem cobra confirmação nesse caso.
 */
export async function deleteAccount(password?: string): Promise<void> {
  await apiClient.delete('/auth/me', { params: { password } })
}

/**
 * `GET /auth/me/sso-accounts` (`ssoAccount.index`, `auth:sanctum`) —
 * "quais provedores conectei", parte da mesma tela de perfil
 * (`mapeamento-cruds-perfil.md`, P6). Sem paginação — número de provedores
 * é sempre pequeno (no máximo `google`/`microsoft`, um de cada).
 */
export async function listSsoAccounts(): Promise<SsoAccount[]> {
  const { data } = await apiClient.get<ApiResponse<SsoAccountResource[]>>('/auth/me/sso-accounts')
  return data.data.map(toSsoAccount)
}

/**
 * `DELETE /auth/me/sso-accounts/{ssoAccount}` (`ssoAccount.destroy`,
 * `auth:sanctum`) — desconectar um provedor. Backend recusa
 * (`errorMessageCannotDisconnectLastAccessMethod`) se for o único jeito
 * de acessar a conta (sem senha E sem outro SSO conectado,
 * `DisconnectSsoAccountAction`) — o front não tenta prever isso antes,
 * só mostra o erro que vier.
 */
export async function disconnectSsoAccount(ssoAccountId: string): Promise<void> {
  await apiClient.delete(`/auth/me/sso-accounts/${ssoAccountId}`)
}

/**
 * `POST /auth/sso/exchange` (`sso.exchange`) — segundo hop do fluxo SSO,
 * introduzido em 2026-08-31 pra contornar proteção de rastreamento de
 * redirecionamento do browser (Firefox Redirect Tracking Protection,
 * Safari ITP): o cookie de sessão setado no meio de uma cadeia
 * "app → terceiro → app → outra origem" era descartado de forma
 * consistente, não intermitente — achado real da sessão de backend,
 * confirmado com a suíte completa simulando os 2 hops reais.
 *
 * O callback do backend (`SsoCallbackView.vue`, `sso-callback`) NÃO
 * autentica mais direto — agora redireciona pra
 * `{FRONTEND_URL}/sso/callback?token=...` (token opaco, 60s de validade,
 * uso único). Esta função troca esse token por uma sessão de verdade via
 * fetch normal (`withCredentials`, como qualquer chamada da API) — como
 * essa chamada roda numa origem "parada" (não no meio de um bounce), o
 * `Set-Cookie` funciona. Devolve o MESMO shape de `login()`/
 * `fetchCurrentUser()` (`LoginResultResource` — `user`/
 * `requires_subscription`/`favorites`/`plan_limits`), então
 * `useSsoExchange.ts` não precisa de uma segunda chamada a `/auth/me`
 * depois. Erro real: 422 `errorMessageInvalidSsoLoginToken` (token
 * inexistente, expirado, ou já usado — é single-use, proteção contra
 * reload/double-fetch acidental da página).
 */
export async function exchangeSsoLoginToken(token: string): Promise<LoginResultResource> {
  const { data } = await apiClient.post<ApiResponse<LoginResultResource>>('/auth/sso/exchange', {
    token,
  })
  return data.data
}

/**
 * `GET /auth/sso/{provider}/redirect` é navegação de browser de verdade
 * (o backend redireciona pro provider OAuth), nunca uma chamada `apiClient`
 * — só a URL de destino, montada com a mesma env var que `client.ts` usa
 * (`VITE_API_BASE_URL`, já inclui `/v1`).
 */
export function buildSsoRedirectUrl(provider: SsoProvider): string {
  const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL
  return `${apiBaseUrl}/auth/sso/${provider}/redirect`
}

/**
 * Monta a URL de RELAY do callback OAuth pro backend real. `GOOGLE_REDIRECT_URI`
 * (`../backend/.env`) está configurado pra apontar pro FRONTEND
 * (`http://localhost:5173/v1/auth/sso/google/callback`), não pro backend —
 * só o domínio do front está autorizado no console do Google neste
 * ambiente. `SsoCallbackView.vue` é quem recebe essa navegação de verdade
 * e repassa a query string exata (code/state/...) pra cá, via navegação de
 * página inteira (nunca fetch/axios — ver comentário na view pro motivo:
 * validação de `state` contra a sessão do passo `/redirect` original
 * exige uma navegação top-level de verdade, não uma chamada cross-origin).
 */
export function buildSsoCallbackUrl(provider: SsoProvider): string {
  const apiBaseUrl: string = import.meta.env.VITE_API_BASE_URL
  return `${apiBaseUrl}/auth/sso/${provider}/callback`
}

// ---------------------------------------------------------------------------
// ADMIN USER — CRUD + impersonation (`/admin/users`), restrito a
// `admin_master` (Fase 6).
// ---------------------------------------------------------------------------

export interface ListAdminUsersParams {
  page?: number
  perPage?: number
  role?: string
  sort?: string
  status?: string
}

export async function listAdminUsers(
  params: ListAdminUsersParams = {},
): Promise<Paginated<AdminUser>> {
  const { data } = await apiClient.get<ApiResponse<AdminUsersEnvelope>>('/admin/users', {
    params: {
      'filter[role]': params.role,
      'filter[status]': params.status,
      page: params.page,
      per_page: params.perPage,
      sort: params.sort,
    },
  })

  return { items: data.data.items.map(toAdminUser), meta: data.data.meta }
}

export async function createAdminUser(payload: CreateUserByAdminRequest): Promise<AdminUser> {
  const { data } = await apiClient.post<ApiResponse<AdminUserResource>>('/admin/users', payload)
  return toAdminUser(data.data)
}

/**
 * `role`/`status` — os únicos 2 campos editáveis por aqui
 * (`UpdateUserByAdminRequest`, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.1) — nome/e-mail/senha são autoatendimento (`updateProfile()`
 * acima), nunca editáveis pelo admin. Backend recusa
 * (`errorMessageCannotModifyOwnAccount`) se o admin tentar editar a
 * própria conta por aqui — `AdminUsersView.vue` já desabilita a ação
 * antes disso pra própria linha, proativamente.
 */
export async function updateAdminUser(
  id: string,
  payload: UpdateUserByAdminRequest,
): Promise<AdminUser> {
  const { data } = await apiClient.patch<ApiResponse<AdminUserResource>>(
    `/admin/users/${id}`,
    payload,
  )
  return toAdminUser(data.data)
}

/**
 * `POST /admin/users/{id}/impersonate` (`StartImpersonationAction`) troca
 * a SESSÃO inteira pro usuário alvo — a resposta é o `UserResource` do
 * alvo, mas quem realmente decide o que fazer com isso é
 * `useImpersonation.ts` (refaz `/auth/me` via `refreshCurrentUser()`,
 * nunca confia só neste retorno pra popular a store, que não tem
 * `favorites`/`planLimits`/`impersonated_by`). Só usuários com role
 * `user` podem ser impersonados (`CannotImpersonateAdminException`) —
 * `AdminUsersView.vue` já esconde a ação pra linhas `admin_master`.
 */
export async function impersonateUser(userId: string): Promise<UserResource> {
  const { data } = await apiClient.post<ApiResponse<UserResource>>(
    `/admin/users/${userId}/impersonate`,
  )
  return data.data
}

/**
 * `POST /auth/impersonation/stop` (`StopImpersonationAction`) — devolve a
 * sessão pro admin original (`impersonator_id` guardado na Session do
 * servidor desde o `impersonateUser()`). Mesmo raciocínio: o retorno aqui
 * não é usado pra popular a store direto, `useImpersonation.ts` refaz
 * `/auth/me`.
 */
export async function stopImpersonation(): Promise<UserResource> {
  const { data } = await apiClient.post<ApiResponse<UserResource>>('/auth/impersonation/stop')
  return data.data
}
