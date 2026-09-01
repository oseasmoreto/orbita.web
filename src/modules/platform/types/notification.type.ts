import type { Component } from 'vue'
import type { components } from '@/core/api/schema'
import { CheckCircle, Megaphone, UserSwitch } from '@/shared/components/icons/regular.generated'

type NotificationResource = components['schemas']['NotificationResource']

export type NotificationType = components['schemas']['NotificationType']

/**
 * Tipo de domínio em cima de `NotificationResource` gerado (seção 6.1 de
 * `docs/infra/convencoes-frontend-infra.md`) — `id` aqui É o id da
 * entrega (`USER_NOTIFICATION.id`, não `NOTIFICATION.id`): é o que
 * `PATCH /notifications/{id}` espera (`docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.5 — "lida"/"não lida" mora na entrega, nunca no conteúdo).
 * `title`/`message` continuam CRUA (chave catalogada OU texto livre,
 * mesma disciplina do `ApiMessageKey`) — resolvida via `useApiMessage()`
 * no consumidor, nunca aqui.
 */
export interface Notification {
  createdAt: string | null
  id: string
  message: string
  read: boolean
  title: string
  type: NotificationType
}

export function toNotification(resource: NotificationResource): Notification {
  return {
    createdAt: resource.created_at,
    id: resource.id,
    message: resource.message,
    read: resource.read,
    title: resource.title,
    type: resource.type,
  }
}

/**
 * Ícone/tint do tile por `NotificationType` — decisão de apresentação
 * (não regra de negócio, mas testável como função pura, mesma régua de
 * `subscriptionStatusColor`/`transactionStatusColor`). `{colors.tint-1}`
 * ("blue")/`{colors.tint-2}` ("purple") já são os 2 tons usados em todo
 * `IconTile.vue` do projeto — sem inventar um 3º tom só pra este caso.
 */
const NOTIFICATION_ICON: Record<NotificationType, Component> = {
  admin_announcement: Megaphone,
  impersonation_started: UserSwitch,
  subscription_activated: CheckCircle,
}

const NOTIFICATION_TINT: Record<NotificationType, 'blue' | 'purple'> = {
  admin_announcement: 'blue',
  impersonation_started: 'purple',
  subscription_activated: 'blue',
}

export function notificationIconFor(type: NotificationType): Component {
  return NOTIFICATION_ICON[type]
}

export function notificationTintFor(type: NotificationType): 'blue' | 'purple' {
  return NOTIFICATION_TINT[type]
}
