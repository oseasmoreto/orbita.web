import type { components } from '@/core/api/schema'
import { type AdminUser, toAdminUser } from '@/core/types/adminUser.type'

/**
 * Tipo de domínio em cima de `TicketMessageResource` — mesma Resource
 * pro dono do chamado e pro admin (autor pode ser qualquer um dos dois),
 * `user` sempre embutido (`AdminUserResource` completo, nunca `user_id`
 * cru).
 */
export interface TicketMessage {
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
    body: resource.body,
    createdAt: resource.created_at,
    id: resource.id,
    user: toAdminUser(resource.user),
    userId: resource.user_id,
  }
}
