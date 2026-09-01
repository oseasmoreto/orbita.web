import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type AdminTicket, type Ticket, toAdminTicket, toTicket } from '../types/ticket.type'
import { type TicketMessage, toTicketMessage } from '../types/ticketMessage.type'

type TicketResource = components['schemas']['TicketResource']
type AdminTicketResource = components['schemas']['AdminTicketResource']
type TicketMessageResource = components['schemas']['TicketMessageResource']
type CreateTicketRequest = components['schemas']['CreateTicketRequest']
type ReplyToTicketRequest = components['schemas']['ReplyToTicketRequest']
type DisputeTicketRequest = components['schemas']['DisputeTicketRequest']

interface Envelope<T> {
  items: T[]
  meta: { current_page: number; per_page: number; total: number }
}

// ---------------------------------------------------------------------------
// TICKET — sempre do PRÓPRIO usuário (`GET/POST /tickets`,
// `UserOwnedScope` no Model, backend). Sem `subscription.active` de
// propósito no backend — usuário com assinatura vencida ainda consegue
// abrir chamado (ex: dúvida sobre cobrança).
// ---------------------------------------------------------------------------

export interface ListTicketsParams {
  page?: number
  perPage?: number
  sort?: string
  status?: string
}

export async function listTickets(params: ListTicketsParams = {}): Promise<Paginated<Ticket>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<TicketResource>>>('/tickets', {
    params: {
      'filter[status]': params.status,
      page: params.page,
      per_page: params.perPage,
      sort: params.sort,
    },
  })

  return { items: data.data.items.map(toTicket), meta: data.data.meta }
}

export async function createTicket(payload: CreateTicketRequest): Promise<Ticket> {
  const { data } = await apiClient.post<ApiResponse<TicketResource>>('/tickets', payload)
  return toTicket(data.data)
}

export async function getTicket(id: string): Promise<Ticket> {
  const { data } = await apiClient.get<ApiResponse<TicketResource>>(`/tickets/${id}`)
  return toTicket(data.data)
}

export async function resolveTicket(id: string): Promise<Ticket> {
  const { data } = await apiClient.post<ApiResponse<TicketResource>>(`/tickets/${id}/resolve`)
  return toTicket(data.data)
}

/**
 * Só chamado quando o chamado já está `resolved` — reabre E registra
 * `message` como uma `TicketMessage` no histórico (`DisputeTicketAction`,
 * backend, decisão 2026-09-01: sem 3º status, a mensagem da contestação
 * já é o registro). `useTicketThread.ts` decide qual dos dois (esta ou
 * `createTicketMessage`) chamar, conforme o status atual do chamado.
 */
export async function disputeTicket(id: string, message: string): Promise<Ticket> {
  const payload: DisputeTicketRequest = { message }
  const { data } = await apiClient.post<ApiResponse<TicketResource>>(
    `/tickets/${id}/dispute`,
    payload,
  )
  return toTicket(data.data)
}

export async function listTicketMessages(id: string): Promise<TicketMessage[]> {
  const { data } = await apiClient.get<ApiResponse<Envelope<TicketMessageResource>>>(
    `/tickets/${id}/messages`,
    { params: { per_page: 100, sort: 'created_at' } },
  )
  return data.data.items.map(toTicketMessage)
}

export async function createTicketMessage(id: string, body: string): Promise<TicketMessage> {
  const payload: ReplyToTicketRequest = { body }
  const { data } = await apiClient.post<ApiResponse<TicketMessageResource>>(
    `/tickets/${id}/messages`,
    payload,
  )
  return toTicketMessage(data.data)
}

// ---------------------------------------------------------------------------
// ADMIN TICKET — "ver TODOS os chamados de todos os usuários"
// (`GET /admin/tickets`), qualquer `admin_master` responde/resolve
// QUALQUER chamado, sem atribuição (`AdminTicketController`). Sem
// `dispute` do lado do admin — reabrir é sempre iniciativa de quem abriu.
// ---------------------------------------------------------------------------

export interface ListAdminTicketsParams {
  page?: number
  perPage?: number
  sort?: string
  status?: string
}

export async function listAdminTickets(
  params: ListAdminTicketsParams = {},
): Promise<Paginated<AdminTicket>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<AdminTicketResource>>>(
    '/admin/tickets',
    {
      params: {
        'filter[status]': params.status,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toAdminTicket), meta: data.data.meta }
}

export async function getAdminTicket(id: string): Promise<AdminTicket> {
  const { data } = await apiClient.get<ApiResponse<AdminTicketResource>>(`/admin/tickets/${id}`)
  return toAdminTicket(data.data)
}

export async function resolveAdminTicket(id: string): Promise<AdminTicket> {
  const { data } = await apiClient.post<ApiResponse<AdminTicketResource>>(
    `/admin/tickets/${id}/resolve`,
  )
  return toAdminTicket(data.data)
}

export async function listAdminTicketMessages(id: string): Promise<TicketMessage[]> {
  const { data } = await apiClient.get<ApiResponse<Envelope<TicketMessageResource>>>(
    `/admin/tickets/${id}/messages`,
    { params: { per_page: 100, sort: 'created_at' } },
  )
  return data.data.items.map(toTicketMessage)
}

export async function createAdminTicketMessage(id: string, body: string): Promise<TicketMessage> {
  const payload: ReplyToTicketRequest = { body }
  const { data } = await apiClient.post<ApiResponse<TicketMessageResource>>(
    `/admin/tickets/${id}/messages`,
    payload,
  )
  return toTicketMessage(data.data)
}
