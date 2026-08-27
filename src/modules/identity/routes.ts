import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Identity, agregadas em core/router (docs/infra/convencoes-frontend-infra.md
 * seção 9). Lazy loading obrigatório, sem exceção.
 */
export const identityRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/LoginView.vue'),
    name: 'login',
    path: '/login',
  },
  {
    component: () => import('./views/RegisterView.vue'),
    name: 'register',
    path: '/register',
  },
]
