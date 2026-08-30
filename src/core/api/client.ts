import axios, { isAxiosError } from 'axios'
import Cookies from 'js-cookie'

declare module 'axios' {
  export interface AxiosRequestConfig {
    /**
     * Pula o `UNAUTHORIZED_EVENT` global num 401 desta chamada — usado só por
     * `fetchCurrentUser()` (bootstrap de sessão no router guard), onde um 401
     * é o caso normal de "ainda não logou" (ex.: link de reset de senha
     * aberto sem sessão), não uma sessão expirada que deveria expulsar o
     * usuário da tela atual. Sem isso, o próprio bootstrap forçava
     * `router.push({ name: 'login' })` em cima de rotas `requiresGuest`
     * (login/register/forgot-password/reset-password), atropelando o guard.
     */
    skipUnauthorizedRedirect?: boolean
  }
}

const READ_METHODS = new Set(['get', 'head'])

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const rootBaseUrl = apiBaseUrl.replace(/\/v1\/?$/, '')

/**
 * Instância única de HTTP do projeto (docs/infra/convencoes-frontend-infra.md
 * seção 8) — nenhum módulo cria seu próprio axios.
 */
export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const method = config.method?.toLowerCase()

  if (method && !READ_METHODS.has(method)) {
    const xsrfToken = Cookies.get('XSRF-TOKEN')

    if (xsrfToken) {
      config.headers.set('X-XSRF-TOKEN', xsrfToken)
    }
  }

  return config
})

/**
 * Evento disparado num 401 de resposta — quem escuta (main.ts) limpa o
 * useAuthStore e redireciona pro login. Feito via evento (não import direto
 * do store/router aqui) pra client.ts não depender de camadas que, por sua
 * vez, dependem dele (services → client).
 */
export const UNAUTHORIZED_EVENT = 'orbita:unauthorized'

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (
      isAxiosError(error) &&
      error.response?.status === 401 &&
      !error.config?.skipUnauthorizedRedirect
    ) {
      window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT))
    }

    return Promise.reject(error)
  },
)

/**
 * Sanctum SPA: garante o cookie XSRF-TOKEN antes de login/register. Rota
 * `sanctum/csrf-cookie` fica fora do prefixo /v1, por isso usa rootBaseUrl,
 * não a instância `apiClient` (que já tem baseURL em /v1).
 */
export async function ensureCsrfCookie(): Promise<void> {
  await axios.get(`${rootBaseUrl}/sanctum/csrf-cookie`, { withCredentials: true })
}
