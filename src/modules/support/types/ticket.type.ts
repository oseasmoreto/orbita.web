import type { components } from '@/core/api/schema'
import { type AdminUser, toAdminUser } from '@/core/types/adminUser.type'

export type TicketStatus = components['schemas']['TicketStatus']

/**
 * Tipo de domínio em cima de `TicketResource` (visão do PRÓPRIO usuário —
 * dono do chamado, nunca precisa de `user`/`userId`, é sempre ele mesmo).
 * `resolvedBy` já vem embutido (`AdminUserResource`) desde o primeiro dia
 * — o backend aprendeu com o gap de `AdminAuditLogResource`/
 * `AdminSubscriptionResource` (achados reais anteriores no mesmo projeto)
 * e não repetiu o erro de expor só um id cru aqui.
 */
export interface Ticket {
  createdAt: string | null
  id: string
  resolvedAt: string | null
  resolvedBy: AdminUser | null
  status: TicketStatus
  subject: string
}

export function toTicket(resource: components['schemas']['TicketResource']): Ticket {
  return {
    createdAt: resource.created_at,
    id: resource.id,
    resolvedAt: resource.resolved_at,
    resolvedBy: resource.resolved_by ? toAdminUser(resource.resolved_by) : null,
    status: resource.status,
    subject: resource.subject,
  }
}

/**
 * Visão do admin — superset de `Ticket`, com `user` (quem abriu, já que
 * aqui não é sempre o próprio ator, mesmo padrão de `AdminSubscription`/
 * `AdminTransaction`).
 */
export interface AdminTicket extends Ticket {
  user: AdminUser
  userId: string
}

export function toAdminTicket(resource: components['schemas']['AdminTicketResource']): AdminTicket {
  return {
    ...toTicket(resource),
    user: toAdminUser(resource.user),
    userId: resource.user_id,
  }
}

/**
 * Mapeamento status→cor pro `StatusDot.vue` — `open` como "aguardando
 * ação" (amarelo, mesmo critério de `Pendente` noutros status binários
 * do projeto), `resolved` como concluído (verde).
 */
export function ticketStatusColor(status: TicketStatus): 'green' | 'yellow' {
  return status === 'resolved' ? 'green' : 'yellow'
}
