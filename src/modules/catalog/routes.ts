import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Catalog — diferente de `identityRoutes`
 * (`modules/identity/routes.ts`), estas são FILHAS do `AppLayout`
 * (precisam do shell autenticado: sidebar/header), então entram no
 * array `children` da rota raiz em `core/router/index.ts`, não
 * espalhadas soltas com `...`.
 */
export const catalogRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/ProductsView.vue'),
    meta: { title: 'catalog.products.title' },
    name: 'products',
    path: 'products',
  },
]
