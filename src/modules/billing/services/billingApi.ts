import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import {
  type AdminPlan,
  type BillingCycle,
  type Plan,
  toAdminPlan,
  toPlan,
} from '../types/plan.type'
import {
  type AdminSubscription,
  type Subscription,
  type SubscriptionCheckout,
  toAdminSubscription,
  toSubscription,
  toSubscriptionCheckout,
} from '../types/subscription.type'
import {
  type AdminTransaction,
  type Transaction,
  toAdminTransaction,
  toTransaction,
} from '../types/transaction.type'

type PlanResource = components['schemas']['PlanResource']
type AdminPlanResource = components['schemas']['AdminPlanResource']
type CreatePlanRequest = components['schemas']['CreatePlanRequest']
type UpdatePlanRequest = components['schemas']['UpdatePlanRequest']
type SubscribeToPlanRequest = components['schemas']['SubscribeToPlanRequest']
type ChangeSubscriptionPlanRequest = components['schemas']['ChangeSubscriptionPlanRequest']
type SubscriptionResource = components['schemas']['SubscriptionResource']
type TransactionResource = components['schemas']['TransactionResource']
type AdminSubscriptionResource = components['schemas']['AdminSubscriptionResource']
type AdminTransactionResource = components['schemas']['AdminTransactionResource']
type OverrideSubscriptionRequest = components['schemas']['OverrideSubscriptionRequest']

interface PlansEnvelope {
  items: PlanResource[]
  meta: { current_page: number; per_page: number; total: number }
}

interface AdminPlansEnvelope {
  items: AdminPlanResource[]
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

interface AdminSubscriptionsEnvelope {
  items: AdminSubscriptionResource[]
  meta: { current_page: number; per_page: number; total: number }
}

interface AdminTransactionsEnvelope {
  items: AdminTransactionResource[]
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

// ---------------------------------------------------------------------------
// ADMIN PLAN — CRUD completo (`/admin/plans`), restrito a `admin_master`
// (cadastro de plano é exclusivo do admin, Fase 6).
// ---------------------------------------------------------------------------

export interface ListAdminPlansParams {
  billingCycle?: string
  page?: number
  perPage?: number
  sort?: string
}

export async function listAdminPlans(
  params: ListAdminPlansParams = {},
): Promise<Paginated<AdminPlan>> {
  const { data } = await apiClient.get<ApiResponse<AdminPlansEnvelope>>('/admin/plans', {
    params: {
      'filter[billing_cycle]': params.billingCycle,
      page: params.page,
      per_page: params.perPage,
      sort: params.sort,
    },
  })

  return { items: data.data.items.map(toAdminPlan), meta: data.data.meta }
}

export async function createAdminPlan(payload: CreatePlanRequest): Promise<AdminPlan> {
  const { data } = await apiClient.post<ApiResponse<AdminPlanResource>>('/admin/plans', payload)
  return toAdminPlan(data.data)
}

export async function updateAdminPlan(id: string, payload: UpdatePlanRequest): Promise<AdminPlan> {
  const { data } = await apiClient.patch<ApiResponse<AdminPlanResource>>(
    `/admin/plans/${id}`,
    payload,
  )
  return toAdminPlan(data.data)
}

export async function deleteAdminPlan(id: string): Promise<void> {
  await apiClient.delete(`/admin/plans/${id}`)
}

/**
 * `POST /subscriptions` (`SubscribeToPlanAction`, backend) cria a
 * assinatura E a preferência de checkout no Mercado Pago (Checkout Pro,
 * hospedado — nunca renderizado por nós, só redirecionamos pra
 * `checkout_url`) na mesma chamada. **Perdeu o parâmetro `document`
 * (tarefa 63, 2026-09-02)** — CPF/CNPJ saiu do checkout de assinatura pra
 * virar cadastro de empresa próprio (`modules/identity`, ver
 * `CompanyRegistrationView.vue`); o guard de rota já garante que ninguém
 * chega aqui sem empresa cadastrada, então `errorMessageCompanyRequired`
 * (`useSubscribeToPlan.ts`) é só defesa residual, não o caminho normal.
 */
export async function subscribeToPlan(planId: string): Promise<SubscriptionCheckout> {
  const payload: SubscribeToPlanRequest = { plan_id: planId }
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

// ---------------------------------------------------------------------------
// ADMIN SUBSCRIPTION/TRANSACTION — Fase 7 (Financeiro), "ver TODAS as
// assinaturas/transações de todos os usuários", restrito a `admin_master`.
// Assinatura é editável (`OverrideSubscriptionAction` — só `status`/
// `end_date`, correção manual de suporte); transação é sempre read-only
// (`AdminTransactionController` só tem `index`/`show`, registro
// financeiro imutável, mesma regra já vale pro `TransactionController`
// do próprio usuário).
// ---------------------------------------------------------------------------

export interface ListAdminSubscriptionsParams {
  page?: number
  perPage?: number
  planId?: string
  sort?: string
  status?: string
  userId?: string
}

export async function listAdminSubscriptions(
  params: ListAdminSubscriptionsParams = {},
): Promise<Paginated<AdminSubscription>> {
  const { data } = await apiClient.get<ApiResponse<AdminSubscriptionsEnvelope>>(
    '/admin/subscriptions',
    {
      params: {
        'filter[plan_id]': params.planId,
        'filter[status]': params.status,
        'filter[user_id]': params.userId,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toAdminSubscription), meta: data.data.meta }
}

export async function updateAdminSubscription(
  id: string,
  payload: OverrideSubscriptionRequest,
): Promise<AdminSubscription> {
  const { data } = await apiClient.patch<ApiResponse<AdminSubscriptionResource>>(
    `/admin/subscriptions/${id}`,
    payload,
  )
  return toAdminSubscription(data.data)
}

export interface ListAdminTransactionsParams {
  gateway?: string
  page?: number
  perPage?: number
  sort?: string
  status?: string
  userId?: string
}

export async function listAdminTransactions(
  params: ListAdminTransactionsParams = {},
): Promise<Paginated<AdminTransaction>> {
  const { data } = await apiClient.get<ApiResponse<AdminTransactionsEnvelope>>(
    '/admin/transactions',
    {
      params: {
        'filter[gateway]': params.gateway,
        'filter[status]': params.status,
        'filter[user_id]': params.userId,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toAdminTransaction), meta: data.data.meta }
}
