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
 * do projeto), `in_progress` como "já em andamento" (`indigo`, 3º valor
 * do enum desde 2026-09-08 — mesmo tom já usado noutros lugares do
 * design system pra "In Progress", `ProgressBar.vue`/showcase), `resolved`
 * como concluído (verde). `in_progress` é setado automaticamente pelo
 * backend assim que um `admin_master` responde pela 1ª vez a um chamado
 * `open` (`AdminReplyToTicketAction`, sem endpoint novo) — puramente
 * informativo aqui, não muda nenhuma regra de UI (composer/"Marcar como
 * resolvido" continuam tratando `open`/`in_progress` igual, só
 * `resolved` é especial).
 */
export function ticketStatusColor(status: TicketStatus): 'green' | 'indigo' | 'yellow' {
  if (status === 'resolved') {
    return 'green'
  }

  return status === 'in_progress' ? 'indigo' : 'yellow'
}

/**
 * Chave i18n do rótulo de status — nunca `` `support.tickets.status.${status}` ``
 * direto no consumidor (achado real, reportado pelo usuário com print:
 * mostrava a chave crua "support.tickets.status.in_progress" na tela).
 * `status` vem do backend em snake_case (mesmo formato de qualquer valor
 * de enum da API), mas o catálogo `pt-BR.ts` segue camelCase como todo o
 * resto do arquivo (`inProgress`) — `open`/`resolved` não têm underscore
 * então nunca expuseram esse descompasso, só `in_progress` expôs.
 */
const TICKET_STATUS_LABEL_KEYS: Record<TicketStatus, string> = {
  in_progress: 'support.tickets.status.inProgress',
  open: 'support.tickets.status.open',
  resolved: 'support.tickets.status.resolved',
}

export function ticketStatusLabelKey(status: TicketStatus): string {
  return TICKET_STATUS_LABEL_KEYS[status]
}
