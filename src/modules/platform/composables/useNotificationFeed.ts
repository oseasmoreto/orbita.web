import { useNotificationStore } from '@/core/store/useNotificationStore'
import { useResourceList } from '@/shared/composables/useResourceList'
import {
  countUnreadNotifications,
  listNotifications,
  markNotificationAsRead,
} from '../services/platformApi'
import type { Notification } from '../types/notification.type'

/**
 * Marcar como lida é sempre idempotente no backend
 * (`MarkNotificationAsReadAction`), mas evitar o `PATCH` redundante numa
 * já lida também evita decrementar `unreadCount` (`useNotificationStore`)
 * abaixo de zero por engano — única ramificação de decisão real deste
 * composable, testada isoladamente.
 */
export function shouldMarkAsRead(notification: Notification): boolean {
  return !notification.read
}

/**
 * Feed de notificações do PRÓPRIO usuário — consumido tanto pelo
 * `NotificationPanel.vue` (lista curta, sino do `AppHeader`) quanto por
 * `NotificationsView.vue` (`/notifications`, lista completa paginada).
 * Cada chamada cria um `useResourceList` independente (2 instâncias, 2
 * fetches próprios) — o que É compartilhado entre as duas telas é só o
 * CONTADOR de não lidas (`useNotificationStore`, seção 5 de
 * `docs/infra/convencoes-frontend-infra.md`), nunca a lista em si.
 */
export function useNotificationFeed() {
  const notificationStore = useNotificationStore()

  const list = useResourceList<Notification>({
    fetchPage: async ({ page, perPage }) => {
      const result = await listNotifications({ page, perPage, sort: '-created_at' })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })

  async function markAsRead(notification: Notification): Promise<void> {
    if (!shouldMarkAsRead(notification)) {
      return
    }

    const updated = await markNotificationAsRead(notification.id)
    const index = list.items.value.findIndex((item) => item.id === notification.id)

    if (index !== -1) {
      list.items.value[index] = updated
    }

    notificationStore.decrementUnread()
  }

  async function refreshUnreadCount(): Promise<void> {
    notificationStore.setUnreadCount(await countUnreadNotifications())
  }

  return { ...list, markAsRead, refreshUnreadCount }
}
