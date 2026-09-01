import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Platform — filhas do `AppLayout` (shell autenticado),
 * mesmo padrão de `pricingRoutes.ts`/`catalogRoutes.ts`. `admin-*`
 * restritas por `meta.roles` (gerenciamento/broadcast de notificação e
 * auditoria são exclusivos do admin — `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.5/3).
 *
 * `notifications` (caixa de entrada do PRÓPRIO usuário) não tem entrada
 * própria na sidebar — alcançada só pelo sino do `AppHeader`
 * (`NotificationPanel.vue`), mesmo padrão de `product-marketplaces`
 * (rota real, sem item de menu).
 */
export const platformRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/NotificationsView.vue'),
    meta: { title: 'platform.notifications.title' },
    name: 'notifications',
    path: 'notifications',
  },
  {
    component: () => import('./views/AdminNotificationsView.vue'),
    meta: { roles: ['admin_master'], title: 'platform.admin.notifications.title' },
    name: 'admin-notifications',
    path: 'admin/notifications',
  },
  {
    component: () => import('./views/AdminAuditLogsView.vue'),
    meta: { roles: ['admin_master'], title: 'platform.admin.auditLogs.title' },
    name: 'admin-audit-logs',
    path: 'admin/audit-logs',
  },
  {
    // Fase 6 — CRUD de configuração interna (`SETTINGS`), pedido direto
    // do usuário junto com usuários/planos ("já que vamos tratar de
    // módulos do admin", 2026-09-01).
    component: () => import('./views/AdminSettingsView.vue'),
    meta: { roles: ['admin_master'], title: 'platform.admin.settings.title' },
    name: 'admin-settings',
    path: 'admin/settings',
  },
]
