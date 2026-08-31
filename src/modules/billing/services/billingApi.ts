import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type Plan, toPlan } from '../types/plan.type'
import { type Subscription, toSubscription } from '../types/subscription.type'

type PlanResource = components['schemas']['PlanResource']
type SubscribeToPlanRequest = components['schemas']['SubscribeToPlanRequest']
type SubscriptionCheckoutResource = components['schemas']['SubscriptionCheckoutResource']
type SubscriptionResource = components['schemas']['SubscriptionResource']

interface PlansEnvelope {
  items: PlanResource[]
  meta: { current_page: number; per_page: number; total: number }
}

interface SubscriptionsEnvelope {
  items: SubscriptionResource[]
  meta: { current_page: number; per_page: number; total: number }
}

/**
 * `GET /plans` (`plan.index`) é pública, sem `auth:sanctum` — lista só
 * planos ativos (`ListActivePlansAction`, backend), por isso faz sentido
 * chamar antes mesmo do usuário logar/assinar. `per_page: 100` porque não
 * existe paginação de verdade na tela de escolha de plano — mostra todos
 * de uma vez, mesmo padrão de "sem paginação ainda" já aceito noutros
 * lugares do projeto quando o volume é baixo (poucos planos cadastrados).
 */
export async function listPlans(): Promise<Paginated<Plan>> {
  const { data } = await apiClient.get<ApiResponse<PlansEnvelope>>('/plans', {
    params: { per_page: 100, sort: 'price' },
  })

  return {
    items: data.data.items.map(toPlan),
    meta: data.data.meta,
  }
}

export interface SubscriptionCheckout {
  checkoutUrl: string
  id: string
  planId: string
}

/**
 * `POST /subscriptions` (`SubscribeToPlanAction`, backend) cria a
 * assinatura E a preferência de checkout no Mercado Pago (Checkout Pro,
 * hospedado — nunca renderizado por nós, só redirecionamos pra
 * `checkout_url`) na mesma chamada. `document` só é obrigatório quando o
 * usuário ainda não tem CPF/CNPJ cadastrado — vem `undefined` na
 * primeira tentativa; se a resposta vier com `errorMessageDocumentRequired`,
 * `useSubscribeToPlan.ts` pede o documento e chama de novo com ele.
 */
export async function subscribeToPlan(
  planId: string,
  document?: string,
): Promise<SubscriptionCheckout> {
  const payload: SubscribeToPlanRequest = { document, plan_id: planId }
  const { data } = await apiClient.post<ApiResponse<SubscriptionCheckoutResource>>(
    '/subscriptions',
    payload,
  )

  return {
    checkoutUrl: data.data.checkout_url,
    id: data.data.id,
    planId: data.data.plan_id,
  }
}

/**
 * `GET /subscriptions` (`ListOwnSubscriptionsAction`, `auth:sanctum`) —
 * histórico do próprio usuário. Só pega a MAIS RECENTE
 * (`sort: '-created_at', per_page: 1`) — é o suficiente pra
 * `useSubscriptionStatus.hasActiveSubscription()` decidir se o guard de
 * rota deixa passar (`core/router/guards.ts`), sem trazer o histórico
 * inteiro pra isso.
 */
export async function fetchMostRecentSubscription(): Promise<Subscription | null> {
  const { data } = await apiClient.get<ApiResponse<SubscriptionsEnvelope>>('/subscriptions', {
    params: { per_page: 1, sort: '-created_at' },
  })

  const [mostRecent] = data.data.items
  return mostRecent ? toSubscription(mostRecent) : null
}
