import dayjs from 'dayjs'
import { isSubscriptionActive } from '@/modules/billing/composables/useSubscriptionStatus'
import type { Subscription } from '@/modules/billing/types/subscription.type'

function buildSubscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    cancelAtPeriodEnd: false,
    endDate: null,
    id: 'sub-1',
    planId: 'plan-1',
    status: 'active',
    ...overrides,
  }
}

describe('isSubscriptionActive', () => {
  it('returns false when there is no subscription at all', () => {
    expect(isSubscriptionActive(null)).toBe(false)
  })

  it('returns false when status is not "active"', () => {
    expect(isSubscriptionActive(buildSubscription({ status: 'pending' }))).toBe(false)
    expect(isSubscriptionActive(buildSubscription({ status: 'canceled' }))).toBe(false)
    expect(isSubscriptionActive(buildSubscription({ status: 'expired' }))).toBe(false)
    expect(isSubscriptionActive(buildSubscription({ status: 'payment_failed' }))).toBe(false)
  })

  it('returns true for an active subscription with no end date', () => {
    expect(isSubscriptionActive(buildSubscription({ endDate: null, status: 'active' }))).toBe(true)
  })

  it('returns true for an active subscription whose end date is today or later', () => {
    const today = dayjs().format('YYYY-MM-DD')
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')

    expect(isSubscriptionActive(buildSubscription({ endDate: today, status: 'active' }))).toBe(true)
    expect(isSubscriptionActive(buildSubscription({ endDate: tomorrow, status: 'active' }))).toBe(
      true,
    )
  })

  it('returns false for an active subscription whose end date already passed — cancel_at_period_end reached', () => {
    const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    expect(isSubscriptionActive(buildSubscription({ endDate: yesterday, status: 'active' }))).toBe(
      false,
    )
  })
})
