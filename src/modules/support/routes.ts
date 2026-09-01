import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Support (novo Bounded Context, backend, 2026-09-01) —
 * filhas do `AppLayout`, mesmo padrão de `platformRoutes.ts`. `tickets`
 * sem `meta.roles` de propósito: `TicketController` (backend) só exige
 * `auth:sanctum`, qualquer usuário autenticado — inclusive `admin_master`
 * — pode abrir um chamado, mesmo raciocínio de `catalogRoutes`/
 * `marketplacesGroup` (disponíveis pros dois papéis).
 */
export const supportRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/TicketsView.vue'),
    meta: { title: 'support.tickets.title' },
    name: 'support-tickets',
    path: 'support/tickets',
  },
  {
    component: () => import('./views/AdminTicketsView.vue'),
    meta: { roles: ['admin_master'], title: 'support.admin.tickets.title' },
    name: 'admin-tickets',
    path: 'admin/tickets',
  },
]
