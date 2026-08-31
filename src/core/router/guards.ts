import type { Router } from 'vue-router'
import { i18n } from '@/core/i18n'
import type { UserRole } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'
import { fetchCurrentUser } from '@/modules/identity/services/identityApi'
import { toAuthUser } from '@/modules/identity/types/user.type'

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Variante de `BillingCheckoutResultView.vue` (`modules/billing/routes.ts`)
     * — as 3 rotas de retorno do Checkout Pro do Mercado Pago
     * (`/billing/success`/`/pending`/`/failure`) compartilham o mesmo
     * componente, só variando ícone/cor/texto/CTA por esse meta.
     */
    checkoutResult?: 'success' | 'pending' | 'failure'
    /** Rota exige sessão autenticada (cookie Sanctum válido). Default: false. */
    requiresAuth?: boolean
    /**
     * Rota só faz sentido pra quem NÃO está logado (login/cadastro/
     * recuperação de senha) — usuário já autenticado que navega pra cá é
     * redirecionado pro dashboard, mesma lógica inversa de `requiresAuth`.
     */
    requiresGuest?: boolean
    /** Restringe a rota a `USER.role` específicos — sem granularidade além disso no MVP. */
    roles?: UserRole[]
    /**
     * Pula os 2 checks de onboarding abaixo (e-mail verificado + assinatura
     * ativa) mesmo em rota `requiresAuth` — pras poucas rotas que são
     * justamente ESSE fluxo (`verify-email`, `choose-plan`,
     * `billing-success`/`pending`/`failure`). Marcar a exceção nessas
     * poucas rotas é mais sustentável que marcar "precisa de onboarding
     * completo" em toda rota nova do app principal.
     */
    skipOnboardingChecks?: boolean
    /**
     * CHAVE de `core/i18n/messages/pt-BR.ts` (ex.: `'catalog.products.title'`),
     * nunca texto resolvido — título é texto de UI, regra não-negociável de
     * i18n (`.ai/rules/i18n.md`) vale pra `.ts` igual a `.vue`. Resolvida via
     * `i18n.global.t()` aqui (fora de componente, sem `useI18n()`) e via
     * `useI18n().t()` em `useBreadcrumb.ts`.
     */
    title?: string
  }
}

/**
 * A store de auth (Pinia) não persiste entre reloads — só o cookie httpOnly
 * do Sanctum persiste de verdade. Sem isso, `authStore.isAuthenticated`
 * começaria `false` em todo F5, mesmo com sessão válida, e o guard abaixo
 * bateria um usuário real pro login o tempo todo. Roda uma única vez por
 * carregamento do app (não por navegação) — chamadas seguintes de login/
 * registro/401 já mantêm a store em dia sozinhas.
 */
let sessionBootstrapped = false

async function bootstrapSession(): Promise<void> {
  if (sessionBootstrapped) {
    return
  }
  sessionBootstrapped = true

  const authStore = useAuthStore()

  try {
    const result = await fetchCurrentUser()
    authStore.setUser(toAuthUser(result.user), {
      requiresSubscription: result.requires_subscription,
    })
  } catch {
    authStore.clear()
  }
}

/**
 * Guard central de autenticação/role (docs/infra/convencoes-frontend-infra.md
 * seção 9) — nunca espalhado em cada routes.ts de módulo. Sem checagem de
 * LIMITE de plano aqui (`max_products`/`max_marketplaces`): isso é
 * validado na Action ao SUBMETER (cadastrar produto/conectar
 * marketplace), não como bloqueio de navegação — mas TER ou não uma
 * assinatura ativa é diferente, e precisa bloquear navegação mesmo:
 * achado real, reportado pelo usuário em 2026-08-30 — um usuário mandado
 * pra `/choose-plan` (sem assinatura) conseguia editar a URL pra `/` e
 * cair direto no dashboard, porque nada aqui conferia isso além do
 * redirect logo após o cadastro/login (`useRegisterForm`/`useLoginForm`).
 * O mesmo valia pra e-mail não verificado.
 *
 * `authStore.requiresSubscription` já vem calculado pelo backend
 * (`ShowAuthenticatedUserAction`, achado real 2026-08-31 — mesmo cálculo
 * de `LoginUserAction`, já excluindo `admin_master`) toda vez que
 * `bootstrapSession()` roda, então não precisa de nenhuma chamada extra
 * nem reimplementação de regra aqui — só ler o campo.
 */
export function setupRouterGuards(router: Router): void {
  router.beforeEach(async (to) => {
    await bootstrapSession()

    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      return { name: 'home' }
    }

    if (
      to.meta.requiresAuth &&
      !to.meta.skipOnboardingChecks &&
      authStore.user &&
      authStore.user.role !== 'admin_master'
    ) {
      if (!authStore.user.emailVerifiedAt) {
        return { name: 'verify-email' }
      }

      if (authStore.requiresSubscription) {
        return { name: 'choose-plan' }
      }
    }

    if (to.meta.roles && !(authStore.user && to.meta.roles.includes(authStore.user.role))) {
      return { name: 'forbidden' }
    }

    return true
  })

  router.afterEach((to) => {
    document.title = to.meta.title ? `${i18n.global.t(to.meta.title)} · Orbita` : 'Orbita'
  })
}
