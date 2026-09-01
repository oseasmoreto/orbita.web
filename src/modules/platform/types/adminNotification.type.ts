import type { components } from '@/core/api/schema'

type AdminNotificationResource = components['schemas']['AdminNotificationResource']

export type NotificationStatus = components['schemas']['NotificationStatus']

/**
 * Tipo de domínio em cima de `AdminNotificationResource` gerado (seção
 * 6.1 de `docs/infra/convencoes-frontend-infra.md`) — conteúdo
 * COMPARTILHADO (`NOTIFICATION`, sem dono, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.5), diferente de `Notification` (`notification.type.ts`, que é
 * a ENTREGA pra 1 usuário — `read` mora lá, nunca aqui).
 */
export interface AdminNotification {
  createdAt: string | null
  id: string
  message: string
  status: NotificationStatus
  title: string
  type: components['schemas']['NotificationType']
}

export function toAdminNotification(resource: AdminNotificationResource): AdminNotification {
  return {
    createdAt: resource.created_at,
    id: resource.id,
    message: resource.message,
    status: resource.status,
    title: resource.title,
    type: resource.type,
  }
}

/**
 * Mapeamento status→cor pro `StatusDot.vue` — mesmo critério de
 * `subscriptionStatusColor`/`transactionStatusColor` (o átomo não sabe o
 * que "sending"/"cancelled" significam, decisão do consumidor).
 */
export function notificationStatusColor(
  status: NotificationStatus,
): 'gray' | 'green' | 'red' | 'yellow' {
  switch (status) {
    case 'sent':
      return 'green'
    case 'sending':
    case 'pending':
      return 'yellow'
    case 'cancelled':
      return 'gray'
    default:
      return 'gray'
  }
}
