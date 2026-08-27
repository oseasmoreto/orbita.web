import type { Router } from 'vue-router'
import type { UserRole } from '@/core/store/useAuthStore'
import { useAuthStore } from '@/core/store/useAuthStore'

declare module 'vue-router' {
  interface RouteMeta {
    /** Rota exige sessão autenticada (cookie Sanctum válido). Default: false. */
    requiresAuth?: boolean
    /** Restringe a rota a `USER.role` específicos — sem granularidade além disso no MVP. */
    roles?: UserRole[]
  }
}

/**
 * Guard central de autenticação/role (docs/infra/convencoes-frontend-infra.md
 * seção 9) — nunca espalhado em cada routes.ts de módulo. Sem checagem de
 * limite de plano aqui ainda: isso é validado na Action ao SUBMETER
 * (cadastrar produto/conectar marketplace), não como bloqueio de navegação.
 */
export function setupRouterGuards(router: Router): void {
  router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.roles && !(authStore.user && to.meta.roles.includes(authStore.user.role))) {
      return { name: 'forbidden' }
    }

    return true
  })
}
