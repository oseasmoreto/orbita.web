import type { components } from '@/core/api/schema'
import { type AdminUser, toAdminUser } from '@/core/types/adminUser.type'

export type TransactionStatus = components['schemas']['TransactionStatus']

/**
 * Tipo de domínio em cima de `TransactionResource` gerado — `value`
 * continua `string` (decimal do backend, `fundamentos-api.md` §4), mesmo
 * padrão de `Plan.price`.
 */
export interface Transaction {
  createdAt: string | null
  gateway: string
  id: string
  paymentMethod: string
  status: TransactionStatus
  subscriptionId: string | null
  value: string
}

/**
 * Mapeamento status→cor pro `StatusDot.vue`, mesmo critério de
 * `subscriptionStatusColor` (`subscription.type.ts`).
 */
export function transactionStatusColor(
  status: TransactionStatus,
): 'gray' | 'green' | 'red' | 'yellow' {
  switch (status) {
    case 'approved':
    case 'authorized':
      return 'green'
    case 'in_mediation':
    case 'in_process':
    case 'pending':
      return 'yellow'
    case 'cancelled':
    case 'rejected':
      return 'red'
    default:
      return 'gray'
  }
}

export function toTransaction(resource: components['schemas']['TransactionResource']): Transaction {
  return {
    createdAt: resource.created_at,
    gateway: resource.gateway,
    id: resource.id,
    paymentMethod: resource.payment_method,
    status: resource.status,
    subscriptionId: resource.subscription_id,
    value: resource.value,
  }
}

/**
 * Tipo de domínio em cima de `AdminTransactionResource` (Fase 7, admin —
 * "ver TODAS as transações de todos os usuários", `GET
 * /admin/transactions`, read-only: `AdminTransactionController` só tem
 * `index`/`show`). `user` (`AdminUser` completo) — pedido pra sessão de
 * backend em 2026-09-01, resolvido no MESMO dia, mesmo padrão de
 * `AdminSubscription` (`subscription.type.ts`)/`AdminAuditLogResource`.
 * `userId` continua no tipo por completude 1:1, a UI usa `user.name`.
 */
export interface AdminTransaction {
  createdAt: string | null
  gateway: string
  id: string
  paymentMethod: string
  status: TransactionStatus
  subscriptionId: string | null
  user: AdminUser
  userId: string
  value: string
}

export function toAdminTransaction(
  resource: components['schemas']['AdminTransactionResource'],
): AdminTransaction {
  return {
    createdAt: resource.created_at,
    gateway: resource.gateway,
    id: resource.id,
    paymentMethod: resource.payment_method,
    status: resource.status,
    subscriptionId: resource.subscription_id,
    user: toAdminUser(resource.user),
    userId: resource.user_id,
    value: resource.value,
  }
}
