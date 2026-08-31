import type { components } from '@/core/api/schema'

type SubscriptionResource = components['schemas']['SubscriptionResource']

export type SubscriptionStatus = components['schemas']['SubscriptionStatus']

/**
 * Tipo de domínio, em cima do `SubscriptionResource` gerado — mesmo
 * padrão de `Plan`/`Product`. Usado hoje só pra decidir se o guard de
 * rota deixa passar (`useSubscriptionStatus.ts`), não por uma tela de
 * histórico ainda (fora de escopo, `docs/planejamento/plano-implementacao.md`).
 */
export interface Subscription {
  cancelAtPeriodEnd: SubscriptionResource['cancel_at_period_end']
  endDate: SubscriptionResource['end_date']
  id: SubscriptionResource['id']
  planId: SubscriptionResource['plan_id']
  status: SubscriptionStatus
}

export function toSubscription(resource: SubscriptionResource): Subscription {
  return {
    cancelAtPeriodEnd: resource.cancel_at_period_end,
    endDate: resource.end_date,
    id: resource.id,
    planId: resource.plan_id,
    status: resource.status,
  }
}
