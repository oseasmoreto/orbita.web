import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Pricing — filhas do `AppLayout` (shell autenticado),
 * mesmo padrão de `catalogRoutes.ts`. `admin-marketplaces` é a primeira
 * rota do projeto restrita por `meta.roles` (cadastro de marketplace é
 * exclusivo do admin, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 3) — checada em `core/router/guards.ts`.
 *
 * `marketplaces`/`product-marketplaces` SEM restrição de role — achado
 * real, corrigido em 2026-08-31 (pedido direto do usuário: "admin deve
 * ver a tela de link do produto e mktplace"): a v1 restringia as duas a
 * `roles: ['user']`, com o raciocínio de que `admin_master` "nunca tem
 * assinatura própria" — só que o middleware `subscription.active`
 * (backend, `pricing.php`) já EXCLUI `admin_master` da checagem de
 * assinatura de propósito (mesmo comentário real em
 * `CreateUserMarketplaceAction`: "subscription.active já libera ele
 * antes daqui"), então a suposição de que essas rotas "não fazem
 * sentido" pra essa conta estava errada — o backend já as permite,
 * só o frontend bloqueava sem necessidade.
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
    meta: { title: 'pricing.marketplaces.title' },
    name: 'marketplaces',
    path: 'marketplaces',
  },
  {
    component: () => import('./views/ProductMarketplacesView.vue'),
    meta: { title: 'pricing.productMarketplaces.title' },
    name: 'product-marketplaces',
    path: 'products/:id/marketplaces',
  },
]
