import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type AdminNotification, toAdminNotification } from '../types/adminNotification.type'
import { type AuditLog, toAuditLog } from '../types/auditLog.type'
import { type Notification, toNotification } from '../types/notification.type'
import { type Setting, toSetting } from '../types/setting.type'

type NotificationResource = components['schemas']['NotificationResource']
type AdminNotificationResource = components['schemas']['AdminNotificationResource']
type AdminAuditLogResource = components['schemas']['AdminAuditLogResource']
type SendNotificationToUserRequest = components['schemas']['SendNotificationToUserRequest']
type BroadcastNotificationRequest = components['schemas']['BroadcastNotificationRequest']
type SettingResource = components['schemas']['SettingResource']
type CreateSettingRequest = components['schemas']['CreateSettingRequest']
type UpdateSettingRequest = components['schemas']['UpdateSettingRequest']

interface Envelope<T> {
  items: T[]
  meta: { current_page: number; per_page: number; total: number }
}

// ---------------------------------------------------------------------------
// NOTIFICATION — caixa de entrada do PRÓPRIO usuário (`GET/PATCH /notifications`,
// entrega/leitura, docs/negocio/contexto-plataforma-precificacao.md seção 2.5).
// ---------------------------------------------------------------------------

export interface ListNotificationsParams {
  page?: number
  perPage?: number
  /** `filter[read]` real da API (`notification.index`) — `undefined` não filtra. */
  read?: boolean
  sort?: string
}

/**
 * `notification.index` (`docs/api/fundamentos-api.md` §7, `QueryFilters`
 * genérico) não tem `page` explícito no schema — a API aceita, é o mesmo
 * padrão de paginação de toda listagem do projeto (`page`/`per_page`),
 * só não documentado no `#[QueryParameter]` do Controller (achado
 * consistente com `TransactionController::index`, que também só
 * documenta `sort`/`filter`/`per_page`).
 */
export async function listNotifications(
  params: ListNotificationsParams = {},
): Promise<Paginated<Notification>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<NotificationResource>>>(
    '/notifications',
    {
      params: {
        'filter[read]': params.read,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toNotification), meta: data.data.meta }
}

/**
 * `meta.total` do envelope paginado é a contagem TOTAL de linhas que
 * batem no filtro (não só as da página) — `per_page: 1` já basta pra ler
 * esse número sem transferir a lista inteira. É assim que
 * `core/store/useNotificationStore.ts` sabe o contador de não lidas sem
 * precisar de um endpoint dedicado.
 */
export async function countUnreadNotifications(): Promise<number> {
  const result = await listNotifications({ perPage: 1, read: false })
  return result.meta.total
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
  const { data } = await apiClient.patch<ApiResponse<NotificationResource>>(`/notifications/${id}`)
  return toNotification(data.data)
}

// ---------------------------------------------------------------------------
// ADMIN NOTIFICATION — gerenciamento/broadcast (`AdminNotificationController`),
// diferente da caixa de entrada acima: conteúdo compartilhado, sem dono.
// ---------------------------------------------------------------------------

export interface ListAdminNotificationsParams {
  page?: number
  perPage?: number
  sort?: string
  status?: string
  type?: string
}

export async function listAdminNotifications(
  params: ListAdminNotificationsParams = {},
): Promise<Paginated<AdminNotification>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<AdminNotificationResource>>>(
    '/admin/notifications',
    {
      params: {
        'filter[status]': params.status,
        'filter[type]': params.type,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toAdminNotification), meta: data.data.meta }
}

export async function deleteAdminNotification(id: string): Promise<AdminNotification> {
  const { data } = await apiClient.delete<ApiResponse<AdminNotificationResource>>(
    `/admin/notifications/${id}`,
  )
  return toAdminNotification(data.data)
}

export interface SendNotificationToUserParams {
  message?: string
  title?: string
  userId: string
}

export async function sendNotificationToUser(
  params: SendNotificationToUserParams,
): Promise<AdminNotification> {
  const payload: SendNotificationToUserRequest = {
    message: params.message,
    title: params.title,
    user_id: params.userId,
  }
  const { data } = await apiClient.post<ApiResponse<AdminNotificationResource>>(
    '/admin/notifications',
    payload,
  )
  return toAdminNotification(data.data)
}

export interface BroadcastNotificationParams {
  message?: string
  title?: string
}

/**
 * Assíncrono no backend (Job em fila, `202`) — `AdminNotificationResource`
 * volta com `status: 'pending'` na hora, só vira `sent` depois do Job
 * terminar de enfileirar todo mundo (`NotificationStatus`, seção 2.5 do
 * doc de negócio). Front não faz poll disso — a listagem (`GET
 * /admin/notifications`) já mostra o status real na próxima visita/refresh.
 */
export async function broadcastNotification(
  params: BroadcastNotificationParams = {},
): Promise<AdminNotification> {
  const payload: BroadcastNotificationRequest = { message: params.message, title: params.title }
  const { data } = await apiClient.post<ApiResponse<AdminNotificationResource>>(
    '/admin/notifications/broadcast',
    payload,
  )
  return toAdminNotification(data.data)
}

// ---------------------------------------------------------------------------
// ADMIN AUDIT LOG — read-only (`AdminAuditLogController` só tem index/show).
// ---------------------------------------------------------------------------

export interface ListAuditLogsParams {
  action?: string
  module?: string
  page?: number
  perPage?: number
  sort?: string
}

export async function listAuditLogs(
  params: ListAuditLogsParams = {},
): Promise<Paginated<AuditLog>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<AdminAuditLogResource>>>(
    '/admin/audit-logs',
    {
      params: {
        'filter[action]': params.action,
        'filter[module]': params.module,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toAuditLog), meta: data.data.meta }
}

// ---------------------------------------------------------------------------
// SETTING — CRUD completo (`/admin/settings`), restrito a `admin_master`,
// configuração interna da aplicação em formato chave-valor (Fase 6).
// ---------------------------------------------------------------------------

export interface ListSettingsParams {
  page?: number
  perPage?: number
  sort?: string
  type?: string
}

export async function listSettings(params: ListSettingsParams = {}): Promise<Paginated<Setting>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<SettingResource>>>('/admin/settings', {
    params: {
      'filter[type]': params.type,
      page: params.page,
      per_page: params.perPage,
      sort: params.sort,
    },
  })

  return { items: data.data.items.map(toSetting), meta: data.data.meta }
}

export async function createSetting(payload: CreateSettingRequest): Promise<Setting> {
  const { data } = await apiClient.post<ApiResponse<SettingResource>>('/admin/settings', payload)
  return toSetting(data.data)
}

/**
 * `hash` nunca entra no payload de update (`UpdateSettingRequest` não
 * aceita o campo, é a PK, imutável) — `AdminSettingForm.vue` desabilita
 * o campo em modo `edit`, mas o payload em si já garante isso mesmo que
 * alguém tentasse burlar a UI.
 */
export async function updateSetting(hash: string, payload: UpdateSettingRequest): Promise<Setting> {
  const { data } = await apiClient.patch<ApiResponse<SettingResource>>(
    `/admin/settings/${hash}`,
    payload,
  )
  return toSetting(data.data)
}

export async function deleteSetting(hash: string): Promise<void> {
  await apiClient.delete(`/admin/settings/${hash}`)
}
