import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Pricing — filhas do `AppLayout` (shell autenticado),
 * mesmo padrão de `catalogRoutes.ts`. `admin-marketplaces` é a primeira
 * rota do projeto restrita por `meta.roles` (cadastro de marketplace é
 * exclusivo do admin, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 3) — checada em `core/router/guards.ts`. `marketplaces`
 * (`roles: ['user']`) é o grid de conectar/gerenciar `USER_MARKETPLACE`
 * — `admin_master` nunca tem assinatura própria, e essas rotas exigem
 * `subscription.active` no backend (`pricing.php`), então não fazem
 * sentido pra essa conta (mesmo raciocínio já usado em `billingGroup`,
 * `core/layouts/config/navigation.ts`).
 */
export const pricingRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/AdminMarketplacesView.vue'),
    meta: { roles: ['admin_master'], title: 'pricing.admin.marketplaces.title' },
    name: 'admin-marketplaces',
    path: 'admin/marketplaces',
  },
  {
    component: () => import('./views/MarketplacesView.vue'),
    meta: { roles: ['user'], title: 'pricing.marketplaces.title' },
    name: 'marketplaces',
    path: 'marketplaces',
  },
  {
    component: () => import('./views/ProductMarketplacesView.vue'),
    meta: { roles: ['user'], title: 'pricing.productMarketplaces.title' },
    name: 'product-marketplaces',
    path: 'products/:id/marketplaces',
  },
]
