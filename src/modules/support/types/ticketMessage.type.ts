import type { components } from '@/core/api/schema'
import { type AdminUser, toAdminUser } from '@/core/types/adminUser.type'

/**
 * Imagem anexada a uma `TicketMessage` (`TICKET_MESSAGE.attachments`,
 * 2026-09-08, pedido direto do usuário) — `url` já é o link próprio
 * hospedado pelo backend (mesmo padrão de `MARKETPLACE.logo_url`, nunca
 * um link externo).
 */
export interface TicketAttachment {
  createdAt: string | null
  id: string
  url: string
}

function toTicketAttachment(
  resource: components['schemas']['TicketMessageAttachmentResource'],
): TicketAttachment {
  return { createdAt: resource.created_at, id: resource.id, url: resource.url }
}

/**
 * Tipo de domínio em cima de `TicketMessageResource` — mesma Resource
 * pro dono do chamado e pro admin (autor pode ser qualquer um dos dois),
 * `user` sempre embutido (`AdminUserResource` completo, nunca `user_id`
 * cru).
 */
export interface TicketMessage {
  attachments: TicketAttachment[]
  body: string
  createdAt: string | null
  id: string
  user: AdminUser
  userId: string
}

export function toTicketMessage(
  resource: components['schemas']['TicketMessageResource'],
): TicketMessage {
  return {
    attachments: (resource.attachments ?? []).map(toTicketAttachment),
    body: resource.body,
    createdAt: resource.created_at,
    id: resource.id,
    user: toAdminUser(resource.user),
    userId: resource.user_id,
  }
}
