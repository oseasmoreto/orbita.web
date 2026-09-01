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
  {
    // Path EXATO que o Google atinge de verdade (`GOOGLE_REDIRECT_URI`,
    // `../backend/.env`) — não é uma convenção de rota nossa, é ditado pelo
    // provider. Sem `requiresGuest`/`requiresAuth`: não há sessão ainda
    // quando essa navegação chega (só o backend cria depois do relay), e um
    // usuário já logado que caísse aqui por engano não deveria ser bloqueado
    // — ver `SsoCallbackView.vue` pro fluxo completo.
    component: () => import('./views/SsoCallbackView.vue'),
    name: 'sso-callback',
    path: '/v1/auth/sso/:provider/callback',
  },
  {
    // Segundo hop, novo em 2026-08-31 (proteção anti-bounce-tracking do
    // browser, ver `useSsoExchange.ts`) — destino real do redirect final
    // do backend (`{FRONTEND_URL}/sso/callback?token=...`), path fixo
    // ditado pelo contrato do backend, não uma convenção nossa. Mesma
    // ausência de guard de `SsoCallbackView.vue`: não há sessão ainda
    // quando esta navegação chega, é o próprio ponto onde ela nasce.
    component: () => import('./views/SsoExchangeView.vue'),
    name: 'sso-exchange',
    path: '/sso/callback',
  },
  {
    // `requiresAuth`, não `requiresGuest` — quem chega aqui já tem sessão
    // (cadastro já loga via `Auth::login()`, `RegisterUserAction`), só
    // falta confirmar o e-mail. O link do e-mail em si não volta pra cá
    // (backend redireciona direto pro destino final) — ver
    // `VerifyEmailView.vue` pro fluxo completo. `skipOnboardingChecks`:
    // essa rota É o check de e-mail verificado, aplicá-lo aqui também
    // criaria um loop de redirect.
    component: () => import('./views/VerifyEmailView.vue'),
    meta: { requiresAuth: true, skipOnboardingChecks: true, title: 'identity.verifyEmail.title' },
    name: 'verify-email',
    path: '/verify-email',
  },
]

/**
 * Diferente das rotas acima, `/account` é uma tela do APP PRINCIPAL (não
 * um passo de auth avulso) — precisa do chrome de `AppLayout.vue`
 * (sidebar/header), então entra como FILHA dele em `core/router/index.ts`,
 * não espalhada solta como `identityRoutes`. `skipOnboardingChecks: true`
 * de propósito: gestão da própria conta (inclusive excluir) não pode
 * ficar bloqueada atrás do gate de e-mail verificado/assinatura — quem
 * quer sair da plataforma precisa conseguir chegar aqui de qualquer jeito.
 */
export const identityAppRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/AccountView.vue'),
    meta: { skipOnboardingChecks: true, title: 'identity.account.title' },
    name: 'account',
    path: 'account',
  },
  {
    // Fase 6 — CRUD de usuário do lado do admin + impersonation
    // (`useImpersonation.ts`). `skipOnboardingChecks` não é necessário
    // aqui (diferente de `/account`) — só `admin_master` acessa, que já
    // é isento do guard de assinatura/onboarding em `core/router/guards.ts`.
    component: () => import('./views/AdminUsersView.vue'),
    meta: { roles: ['admin_master'], title: 'identity.admin.users.title' },
    name: 'admin-users',
    path: 'admin/users',
  },
]
