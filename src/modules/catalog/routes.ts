import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Catalog — diferente de `identityRoutes`
 * (`modules/identity/routes.ts`), estas são FILHAS do `AppLayout`
 * (precisam do shell autenticado: sidebar/header), então entram no
 * array `children` da rota raiz em `core/router/index.ts`, não
 * espalhadas soltas com `...`.
 *
 * `products-new`/`products-edit` — pedido direto do usuário em
 * 2026-08-31 (deep link pro Drawer de criar/editar, não uma página
 * cheia nova): as 3 rotas apontam pro MESMO componente
 * (`ProductsView.vue`) — a tabela continua por trás, só o Drawer
 * sincroniza com a URL (`ProductsView.vue` observa `route.name`/
 * `route.params.id`). Continua valendo a decisão original de 2026-08-28
 * ("renderizarão no modal lateral direito") — isso não vira
 * `/products/new` como PÁGINA própria, só ganha uma URL que abre o mesmo
 * Drawer de sempre.
 */
export const catalogRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/ProductsView.vue'),
    meta: { title: 'catalog.products.title' },
    name: 'products',
    path: 'products',
  },
  {
    // Título PRÓPRIO (não `catalog.products.title`) — mesma chave já
    // usada no `title` do Drawer (`ProductsView.vue`), reaproveitada
    // aqui pro 3º nível do breadcrumb ("Catálogo / Produtos / Novo
    // produto", `useBreadcrumb.ts`) e pro título da aba do navegador.
    component: () => import('./views/ProductsView.vue'),
    meta: { title: 'catalog.products.form.createTitle' },
    name: 'products-new',
    path: 'products/new',
  },
  {
    component: () => import('./views/ProductsView.vue'),
    meta: { title: 'catalog.products.form.editTitle' },
    name: 'products-edit',
    path: 'products/:id/edit',
  },
]
