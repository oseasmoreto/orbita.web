import type { Router } from 'vue-router'
import { i18n } from '@/core/i18n'
import type { UserRole } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'
import { fetchCurrentUser } from '@/modules/identity/services/identityApi'
import { toAuthUser } from '@/modules/identity/types/user.type'

declare module 'vue-router' {
  interface RouteMeta {
    /** Rota exige sessão autenticada (cookie Sanctum válido). Default: false. */
    requiresAuth?: boolean
    /**
     * Rota só faz sentido pra quem NÃO está logado (login/cadastro/
     * recuperação de senha) — usuário já autenticado que navega pra cá é
     * redirecionado pro dashboard, mesma lógica inversa de `requiresAuth`.
     */
    requiresGuest?: boolean
    /** Restringe a rota a `USER.role` específicos — sem granularidade além disso no MVP. */
    roles?: UserRole[]
    /**
     * CHAVE de `core/i18n/messages/pt-BR.ts` (ex.: `'catalog.products.title'`),
     * nunca texto resolvido — título é texto de UI, regra não-negociável de
     * i18n (`.ai/rules/i18n.md`) vale pra `.ts` igual a `.vue`. Resolvida via
     * `i18n.global.t()` aqui (fora de componente, sem `useI18n()`) e via
     * `useI18n().t()` em `useBreadcrumb.ts`.
     */
    title?: string
  }
}

/**
 * A store de auth (Pinia) não persiste entre reloads — só o cookie httpOnly
 * do Sanctum persiste de verdade. Sem isso, `authStore.isAuthenticated`
 * começaria `false` em todo F5, mesmo com sessão válida, e o guard abaixo
 * bateria um usuário real pro login o tempo todo. Roda uma única vez por
 * carregamento do app (não por navegação) — chamadas seguintes de login/
 * registro/401 já mantêm a store em dia sozinhas.
 */
let sessionBootstrapped = false

async function bootstrapSession(): Promise<void> {
  if (sessionBootstrapped) {
    return
  }
  sessionBootstrapped = true

  const authStore = useAuthStore()

  try {
    const user = await fetchCurrentUser()
    authStore.setUser(toAuthUser(user))
  } catch {
    authStore.clear()
  }
}

/**
 * Guard central de autenticação/role (docs/infra/convencoes-frontend-infra.md
 * seção 9) — nunca espalhado em cada routes.ts de módulo. Sem checagem de
 * limite de plano aqui ainda: isso é validado na Action ao SUBMETER
 * (cadastrar produto/conectar marketplace), não como bloqueio de navegação.
 */
export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to) => {
    await bootstrapSession()

    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      return { name: 'home' }
    }

    if (to.meta.roles && !(authStore.user && to.meta.roles.includes(authStore.user.role))) {
      return { name: 'forbidden' }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = to.meta.title ? `${i18n.global.t(to.meta.title)} · Orbita` : 'Orbita'
  })
}
