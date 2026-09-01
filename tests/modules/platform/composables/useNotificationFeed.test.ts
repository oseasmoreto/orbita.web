import { shouldMarkAsRead } from '@/modules/platform/composables/useNotificationFeed'
import type { Notification } from '@/modules/platform/types/notification.type'

function buildNotification(overrides: Partial<Notification> = {}): Notification {
  return {
    createdAt: '2026-01-01T00:00:00Z',
    id: 'notif-1',
    message: 'notificationMessageSubscriptionActivated',
    read: false,
    title: 'notificationTitleSubscriptionActivated',
    type: 'subscription_activated',
    ...overrides,
  }
}

describe('shouldMarkAsRead', () => {
  it('is true for an unread notification', () => {
    expect(shouldMarkAsRead(buildNotification({ read: false }))).toBe(true)
  })

  it('is false for an already-read notification (avoids a redundant PATCH call)', () => {
    expect(shouldMarkAsRead(buildNotification({ read: true }))).toBe(false)
  })
})
