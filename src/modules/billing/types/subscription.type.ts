import type { components } from '@/core/api/schema'

export type SubscriptionStatus = components['schemas']['SubscriptionStatus']

/**
 * Tipo de domínio em cima de `SubscriptionResource` gerado (seção 6.1 de
 * `docs/infra/convencoes-frontend-infra.md`), mesmo padrão de `Plan`/
 * `Product`. `pendingPlanId` — pedido pra sessão de backend em
 * 2026-08-31, resolvido no mesmo dia (`SubscriptionResource` não expunha
 * o campo antes, só `SubscriptionCheckoutResource` tinha) — só preenchido
 * quando existe uma troca de plano aguardando confirmação de pagamento;
 * `planId` continua o ATUAL até o webhook do Mercado Pago aprovar.
 */
export interface Subscription {
  cancelAtPeriodEnd: boolean
  createdAt: string | null
  endDate: string | null
  id: string
  pendingPlanId: string | null
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
    planId: resource.plan_id,
    startDate: resource.start_date,
    status: resource.status,
  }
}

/**
 * Resposta de `POST /subscriptions` (assinar) e `PATCH /subscriptions/{id}`
 * (trocar de plano, tarefa 38) — as duas abrem um checkout REAL no Mercado
 * Pago (Checkout Pro, hospedado), por isso o mesmo shape serve pras duas
 * ações; `status` chega como `string` solto (não o enum `SubscriptionStatus`)
 * porque `SubscriptionCheckoutResource` (backend) tipa o campo assim.
 */
export interface SubscriptionCheckout {
  checkoutUrl: string
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
