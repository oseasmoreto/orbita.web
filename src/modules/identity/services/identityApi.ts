import { isAxiosError } from 'axios'
import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse } from '@/shared/types/api.type'

type LoginRequest = components['schemas']['LoginRequest']
type LoginResultResource = components['schemas']['LoginResultResource']
type RegisterUserRequest = components['schemas']['RegisterUserRequest']
type UserResource = components['schemas']['UserResource']
type RequestPasswordResetRequest = components['schemas']['RequestPasswordResetRequest']
type ResetPasswordRequest = components['schemas']['ResetPasswordRequest']

/** Providers reais de `SSO_ACCOUNT.provider` — nunca `apple`, não existe no domínio (seção 2.1 do contexto de negócio). */
export type SsoProvider = 'google' | 'microsoft'

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
 * `GET /auth/me` (`userProfile.show`) — usado só pro bootstrap de sessão
 * no boot do app (`core/router/guards.ts`): a store de auth (Pinia) não
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
 */
export async function fetchCurrentUser(): Promise<UserResource> {
  const { data } = await apiClient.get<ApiResponse<UserResource>>('/auth/me', {
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

export async function requestPasswordReset(payload: RequestPasswordResetRequest): Promise<void> {
  await apiClient.post('/auth/password/forgot', payload)
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  await apiClient.post('/auth/password/reset', payload)
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
