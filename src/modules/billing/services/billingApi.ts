import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type BillingCycle, type Plan, toPlan } from '../types/plan.type'
import {
  type Subscription,
  type SubscriptionCheckout,
  toSubscription,
  toSubscriptionCheckout,
} from '../types/subscription.type'
import { type Transaction, toTransaction } from '../types/transaction.type'

type PlanResource = components['schemas']['PlanResource']
type SubscribeToPlanRequest = components['schemas']['SubscribeToPlanRequest']
type ChangeSubscriptionPlanRequest = components['schemas']['ChangeSubscriptionPlanRequest']
type SubscriptionResource = components['schemas']['SubscriptionResource']
type TransactionResource = components['schemas']['TransactionResource']

interface PlansEnvelope {
  items: PlanResource[]
  meta: { current_page: number; per_page: number; total: number }
}

interface SubscriptionsEnvelope {
  items: SubscriptionResource[]
  meta: { current_page: number; per_page: number; total: number }
}

interface TransactionsEnvelope {
  items: TransactionResource[]
  meta: { current_page: number; per_page: number; total: number }
}

export interface ListPlansParams {
  /** `filter[billing_cycle]` real da API (`plan.index`) — pedido direto do usuário, 2026-08-31 (seletor de ciclo em `ChoosePlanView.vue`/`MySubscriptionView.vue`). */
  billingCycle?: BillingCycle
}

/**
 * `GET /plans` (`plan.index`) é pública, sem `auth:sanctum` — lista só
 * planos ativos (`ListActivePlansAction`, backend), por isso faz sentido
 * chamar antes mesmo do usuário logar/assinar. `per_page: 100` porque não
 * existe paginação de verdade na tela de escolha de plano — mostra todos
 * de uma vez, mesmo padrão de "sem paginação ainda" já aceito noutros
 * lugares do projeto quando o volume é baixo (poucos planos cadastrados).
 */
export async function listPlans(params: ListPlansParams = {}): Promise<Paginated<Plan>> {
  const { data } = await apiClient.get<ApiResponse<PlansEnvelope>>('/plans', {
    params: {
      'filter[billing_cycle]': params.billingCycle,
      per_page: 100,
      sort: 'price',
    },
  })

  return {
    items: data.data.items.map(toPlan),
    meta: data.data.meta,
  }
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
  const { data } = await apiClient.post<
    ApiResponse<components['schemas']['SubscriptionCheckoutResource']>
  >('/subscriptions', payload)

  return toSubscriptionCheckout(data.data)
}

/**
 * `GET /subscriptions` (`ListOwnSubscriptionsAction`, tarefa 37) — modelo
 * é "1 login = 1 assinatura" (troca de plano atualiza a mesma linha,
 * nunca cria uma nova, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.2), então na prática a lista tem sempre 0 ou 1 item. `per_page: 1`
 * + `sort: '-created_at'` já basta pra pegar a linha certa sem paginação
 * de UI — `null` quando o usuário nunca assinou nada (`choose-plan` já
 * teria barrado a navegação antes disso pela guard de assinatura, mas a
 * função continua honesta sobre o caso).
 */
export async function getCurrentSubscription(): Promise<Subscription | null> {
  const { data } = await apiClient.get<ApiResponse<SubscriptionsEnvelope>>('/subscriptions', {
    params: { per_page: 1, sort: '-created_at' },
  })

  const [subscription] = data.data.items
  return subscription ? toSubscription(subscription) : null
}

/**
 * `PATCH /subscriptions/{id}` (`ChangeSubscriptionPlanAction`, tarefa 38)
 * — mesmo formato de resposta/fluxo de `subscribeToPlan`: abre um novo
 * checkout REAL no Mercado Pago pelo valor prorata, `plan_id` só muda de
 * verdade quando o webhook aprova o pagamento (fica em `pendingPlanId`
 * até lá). Erros de negócio reais: `errorMessageSamePlan` (mesmo plano
 * atual), `errorMessagePlanChangeAlreadyPending` (já existe troca
 * aguardando pagamento), `errorMessageSubscriptionNotActive`.
 */
export async function changeSubscriptionPlan(
  subscriptionId: string,
  planId: string,
): Promise<SubscriptionCheckout> {
  const payload: ChangeSubscriptionPlanRequest = { plan_id: planId }
  const { data } = await apiClient.patch<
    ApiResponse<components['schemas']['SubscriptionCheckoutResource']>
  >(`/subscriptions/${subscriptionId}`, payload)

  return toSubscriptionCheckout(data.data)
}

/**
 * `DELETE /subscriptions/{id}` (`CancelSubscriptionAction`, tarefa 39) —
 * NUNCA apaga a linha nem cancela na hora: só marca
 * `cancel_at_period_end`, mantém acesso até `end_date` do ciclo já pago,
 * sem reembolso. Idempotente no backend (chamar de novo numa assinatura
 * já marcada não é erro) — o front não precisa checar isso antes.
 */
export async function cancelSubscription(subscriptionId: string): Promise<Subscription> {
  const { data } = await apiClient.delete<ApiResponse<SubscriptionResource>>(
    `/subscriptions/${subscriptionId}`,
  )

  return toSubscription(data.data)
}

export interface ListTransactionsParams {
  page?: number
  perPage?: number
  /** Um de `value`/`created_at`, prefixo `-` inverte pra desc (`core/api/schema.d.ts`, `transaction.index`). */
  sort?: string
}

/**
 * `GET /transactions` (`ListOwnTransactionsAction`, tarefa 40) — histórico
 * próprio, read-only. Sem filtro de status/gateway/subscription na UI por
 * enquanto (a API aceita, mas não existe pedido pra isso ainda) — só
 * paginação/ordenação, mesmo padrão de `listProducts`.
 */
export async function listTransactions(
  params: ListTransactionsParams = {},
): Promise<Paginated<Transaction>> {
  const { data } = await apiClient.get<ApiResponse<TransactionsEnvelope>>('/transactions', {
    params: {
      page: params.page,
      per_page: params.perPage,
      sort: params.sort,
    },
  })

  return {
    items: data.data.items.map(toTransaction),
    meta: data.data.meta,
  }
}
