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
 *
 * `skipOnboardingChecks: true` nas 4 — sem isso, o guard de assinatura
 * ativa (`core/router/guards.ts`, achado real reportado pelo usuário em
 * 2026-08-30) redirecionaria `/choose-plan` pra ELA MESMA (usuário sem
 * assinatura navegando pra `/choose-plan` seria barrado por... não ter
 * assinatura, indo parar de novo em `/choose-plan`) e bloquearia as 3
 * telas de retorno do checkout, que existem justamente pra quem ainda
 * está finalizando a assinatura.
 */
export const billingRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/ChoosePlanView.vue'),
    meta: { requiresAuth: true, skipOnboardingChecks: true, title: 'billing.choosePlan.title' },
    name: 'choose-plan',
    path: '/choose-plan',
  },
  // `back_urls` reais do Checkout Pro do Mercado Pago
  // (`MercadoPagoGateway::createCheckout`, backend) — paths exatos,
  // ditados pelo gateway, não convenção nossa. As 3 rotas compartilham
  // `BillingCheckoutResultView.vue`, só variando `meta.checkoutResult`.
  {
    component: () => import('./views/BillingCheckoutResultView.vue'),
    meta: {
      checkoutResult: 'success',
      requiresAuth: true,
      skipOnboardingChecks: true,
      title: 'billing.checkoutResult.success.title',
    },
    name: 'billing-success',
    path: '/billing/success',
  },
  {
    component: () => import('./views/BillingCheckoutResultView.vue'),
    meta: {
      checkoutResult: 'pending',
      requiresAuth: true,
      skipOnboardingChecks: true,
      title: 'billing.checkoutResult.pending.title',
    },
    name: 'billing-pending',
    path: '/billing/pending',
  },
  {
    component: () => import('./views/BillingCheckoutResultView.vue'),
    meta: {
      checkoutResult: 'failure',
      requiresAuth: true,
      skipOnboardingChecks: true,
      title: 'billing.checkoutResult.failure.title',
    },
    name: 'billing-failure',
    path: '/billing/failure',
  },
]

/**
 * Diferente das rotas acima, "Meu plano"/"Faturas" são telas do APP
 * PRINCIPAL (não passos de onboarding) — precisam do chrome de
 * `AppLayout.vue` (sidebar/header), então entram como FILHAS dele em
 * `core/router/index.ts`, mesmo padrão de `identityAppRoutes`/
 * `catalogRoutes`. Sem `skipOnboardingChecks` (diferente de `/account`) —
 * são páginas normais do app, sujeitas ao mesmo guard de assinatura ativa
 * que qualquer outra rota principal.
 */
export const billingAppRoutes: RouteRecordRaw[] = [
  {
    component: () => import('./views/MySubscriptionView.vue'),
    meta: { title: 'billing.mySubscription.title' },
    name: 'billing-subscription',
    path: 'billing/subscription',
  },
  {
    component: () => import('./views/TransactionsView.vue'),
    meta: { title: 'billing.transactions.title' },
    name: 'billing-transactions',
    path: 'billing/transactions',
  },
  {
    // Fase 6 — CRUD de plano do lado do admin (`docs/planejamento/plano-implementacao.md`,
    // "adicione tbm planos e configurações já que vamos tratar de
    // módulos do admin", pedido direto do usuário em 2026-09-01).
    component: () => import('./views/AdminPlansView.vue'),
    meta: { roles: ['admin_master'], title: 'billing.admin.plans.title' },
    name: 'admin-plans',
    path: 'admin/plans',
  },
]
