import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Billing, agregadas em core/router (docs/infra/convencoes-frontend-infra.md
 * seção 9). Lazy loading obrigatório, sem exceção.
 *
 * `requiresAuth: true` (não `requiresGuest`) — quem chega aqui já tem
 * sessão (cadastro/login já criou o cookie), só falta escolher um plano.
 * Fora de `AppLayout` de propósito (não entra em `catalogRoutes`/`children`
 * do layout com sidebar/header) — é um passo de onboarding, não uma tela
 * do app principal.
 */
export const billingRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/ChoosePlanView.vue'),
    meta: { requiresAuth: true, title: 'billing.choosePlan.title' },
    name: 'choose-plan',
    path: '/choose-plan',
  },
]
