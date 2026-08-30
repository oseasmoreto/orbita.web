import type { RouteRecordRaw } from 'vue-router'

/**
 * Rotas do módulo Identity, agregadas em core/router (docs/infra/convencoes-frontend-infra.md
 * seção 9). Lazy loading obrigatório, sem exceção.
 *
 * `requiresGuest: true` nas 4 — pedido direto do usuário, 2026-08-28
 * ("ative ele", referindo ao guard de auth que ficou desligado quando as
 * telas de Identity foram construídas): um usuário JÁ autenticado que
 * navega pra `/login` não deveria ver o formulário de novo, mesma lógica
 * inversa de `requiresAuth` — `core/router/guards.ts` redireciona pro
 * dashboard nesse caso.
 */
export const identityRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/LoginView.vue'),
    meta: { requiresGuest: true, title: 'identity.login.title' },
    name: 'login',
    path: '/login',
  },
  {
    component: () => import('./views/RegisterView.vue'),
    meta: { requiresGuest: true, title: 'identity.register.title' },
    name: 'register',
    path: '/register',
  },
  {
    component: () => import('./views/ForgotPasswordView.vue'),
    meta: { requiresGuest: true, title: 'identity.forgotPassword.title' },
    name: 'forgot-password',
    path: '/forgot-password',
  },
  {
    // `email`/`token` chegam via query string (link recebido por e-mail),
    // não como segmento de rota — ver comentário de `ResetPasswordView.vue`.
    component: () => import('./views/ResetPasswordView.vue'),
    meta: { requiresGuest: true, title: 'identity.resetPassword.title' },
    name: 'reset-password',
    path: '/reset-password',
  },
]
