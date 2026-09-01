import type { components } from '@/core/api/schema'
import { type AdminUser, toAdminUser } from '@/core/types/adminUser.type'
import { type Plan, toPlan } from './plan.type'

export type SubscriptionStatus = components['schemas']['SubscriptionStatus']

/**
 * Tipo de domínio em cima de `SubscriptionResource` gerado (seção 6.1 de
 * `docs/infra/convencoes-frontend-infra.md`), mesmo padrão de `Plan`/
 * `Product`. `pendingPlanId` — pedido pra sessão de backend em
 * 2026-08-31, resolvido no mesmo dia (`SubscriptionResource` não expunha
 * o campo antes, só `SubscriptionCheckoutResource` tinha) — só preenchido
 * quando existe uma troca de plano aguardando confirmação de pagamento;
 * `planId` continua o ATUAL até o webhook do Mercado Pago aprovar.
 *
 * `plan` — pedido pra sessão de backend em 2026-09-01, resolvido no mesmo
 * dia: achado real reportado pelo usuário (tela "Meu plano" mostrando "—"
 * no nome do plano pra quem está no trial). `GET /plans` só lista planos
 * `active: true` e esconde o trial de quem já tem QUALQUER histórico de
 * assinatura — inclusive a própria assinatura trial ATIVA do usuário
 * conta como esse histórico, então cruzar `planId` com aquela listagem
 * (`plans.plans` de `useChoosePlan.ts`) nunca resolvia o nome do próprio
 * plano atual. `plan` vem embutido direto na resposta agora — nunca mais
 * depender de `GET /plans` pra saber o nome do plano de UMA assinatura já
 * existente (vale pra qualquer plano desativado no futuro, não só trial).
 */
export interface Subscription {
  cancelAtPeriodEnd: boolean
  createdAt: string | null
  endDate: string | null
  id: string
  pendingPlanId: string | null
  plan: Plan
  planId: string
  startDate: string
  status: SubscriptionStatus
}

/**
 * Mapeamento status→cor pro `StatusDot.vue` (`shared/components/ui/`) —
 * o átomo não sabe o que "active"/"payment_failed" significam, quem
 * decide é o consumidor (seção 3 de `docs/infra/convencoes-frontend-infra.md`).
 * Mesmo critério de mapa simples já usado noutros lugares do projeto
 * (ex.: `PROVIDER_ICON` em `AccountView.vue`) — sem teste dedicado, é
 * apresentação pura, não decisão de negócio.
 */
export function subscriptionStatusColor(
  status: SubscriptionStatus,
): 'gray' | 'green' | 'red' | 'yellow' {
  switch (status) {
    case 'active':
      return 'green'
    case 'pending':
      return 'yellow'
    case 'payment_failed':
      return 'red'
    default:
      return 'gray'
  }
}

export function toSubscription(
  resource: components['schemas']['SubscriptionResource'],
): Subscription {
  return {
    cancelAtPeriodEnd: resource.cancel_at_period_end,
    createdAt: resource.created_at,
    endDate: resource.end_date,
    id: resource.id,
    pendingPlanId: resource.pending_plan_id,
    plan: toPlan(resource.plan),
    planId: resource.plan_id,
    startDate: resource.start_date,
    status: resource.status,
  }
}

/**
 * Tipo de domínio em cima de `AdminSubscriptionResource` (Fase 7, admin
 * — "ver TODAS as assinaturas de todos os usuários", `GET
 * /admin/subscriptions`). Sem `pendingPlanId` (o resource admin não
 * embute isso ainda — troca de plano com pagamento pendente é um detalhe
 * do fluxo do PRÓPRIO usuário, não exibido nesta listagem).
 *
 * `user` (`AdminUser` completo, mesmo shape de `GET /admin/users`) —
 * pedido pra sessão de backend em 2026-09-01, resolvido no MESMO dia,
 * mesmo padrão já usado em `AdminAuditLogResource`: sem isso a listagem
 * mostraria só `user_id` cru, sem como identificar de quem é cada linha
 * sem uma segunda consulta por linha. `userId` continua existindo no
 * tipo por completude 1:1 com o resource, a UI usa `user.name` direto.
 */
export interface AdminSubscription {
  cancelAtPeriodEnd: boolean
  createdAt: string | null
  endDate: string | null
  id: string
  plan: Plan
  planId: string
  startDate: string
  status: SubscriptionStatus
  user: AdminUser
  userId: string
}

export function toAdminSubscription(
  resource: components['schemas']['AdminSubscriptionResource'],
): AdminSubscription {
  return {
    cancelAtPeriodEnd: resource.cancel_at_period_end,
    createdAt: resource.created_at,
    endDate: resource.end_date,
    id: resource.id,
    plan: toPlan(resource.plan),
    planId: resource.plan_id,
    startDate: resource.start_date,
    status: resource.status,
    user: toAdminUser(resource.user),
    userId: resource.user_id,
  }
}

/**
 * Resposta de `POST /subscriptions` (assinar) e `PATCH /subscriptions/{id}`
 * (trocar de plano, tarefa 38) — as duas abrem um checkout REAL no Mercado
 * Pago (Checkout Pro, hospedado), por isso o mesmo shape serve pras duas
 * ações; `status` chega como `string` solto (não o enum `SubscriptionStatus`)
 * porque `SubscriptionCheckoutResource` (backend) tipa o campo assim.
 *
 * `checkoutUrl` virou `string | null` em 2026-09-01 (feature de trial,
 * backend tarefa 54): assinar um plano trial (`Plan.isTrial`) pula
 * Payment/Transaction/Mercado Pago inteiramente — a assinatura já nasce
 * `status: 'active'` e a resposta vem com `checkout_url: null`, sinal pro
 * front redirecionar direto pra `/billing/success` em vez de abrir o
 * checkout hospedado (`useSubscribeToPlan.isCheckoutSkipped`).
 */
export interface SubscriptionCheckout {
  checkoutUrl: string | null
  id: string
  pendingPlanId: string | null
  planId: string
  status: string
}

export function toSubscriptionCheckout(
  resource: components['schemas']['SubscriptionCheckoutResource'],
): SubscriptionCheckout {
  return {
    checkoutUrl: resource.checkout_url,
    id: resource.id,
    pendingPlanId: resource.pending_plan_id,
    planId: resource.plan_id,
    status: resource.status,
  }
}
