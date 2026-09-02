import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/core/layouts/AppLayout.vue'
import { billingAppRoutes, billingRoutes } from '@/modules/billing/routes'
import { catalogRoutes } from '@/modules/catalog/routes'
import { identityAppRoutes, identityRoutes } from '@/modules/identity/routes'
import { platformRoutes } from '@/modules/platform/routes'
import { pricingRoutes } from '@/modules/pricing/routes'
import { supportRoutes } from '@/modules/support/routes'
import { setupRouterGuards } from './guards'

const routes: RouteRecordRaw[] = [
  {
    children: [
      {
        component: () => import('@/shared/views/HomeView.vue'),
        meta: { title: 'dashboard.title' },
        name: 'home',
        path: '',
      },
      {
        component: () => import('@/shared/views/ShowcaseView.vue'),
        meta: { title: 'showcase.title' },
        name: 'showcase',
        path: 'showcase',
      },
      {
        // Mockup visual da futura dashboard de precificação (Fase 4),
        // pedido direto do usuário em 2026-09-02 — rota isolada, fora da
        // navegação principal, sem chamada de API. Ver
        // `PricingDashboardMockupView.vue`.
        component: () => import('@/shared/views/PricingDashboardMockupView.vue'),
        meta: { title: 'pricingDashboardMockup.title' },
        name: 'pricing-dashboard-mockup',
        path: 'pricing-dashboard-mockup',
      },
      ...catalogRoutes,
      ...identityAppRoutes,
      ...billingAppRoutes,
      ...pricingRoutes,
      ...platformRoutes,
      ...supportRoutes,
    ],
    component: AppLayout,
    meta: { requiresAuth: true },
    path: '/',
  },
  ...identityRoutes,
  ...billingRoutes,
  {
    component: () => import('@/shared/views/ForbiddenView.vue'),
    name: 'forbidden',
    path: '/forbidden',
  },
  {
    component: () => import('@/shared/views/NotFoundView.vue'),
    name: 'not-found',
    path: '/:pathMatch(.*)*',
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

setupRouterGuards(router)
