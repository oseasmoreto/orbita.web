import { isSubscriptionConfirmed } from '@/modules/billing/composables/useSubscriptionConfirmationPoll'
import type { Subscription } from '@/modules/billing/types/subscription.type'

function makeSubscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    cancelAtPeriodEnd: false,
    createdAt: '2026-01-01T00:00:00Z',
    endDate: null,
    id: 'sub-1',
    pendingPlanId: null,
    planId: 'plan-a',
    startDate: '2026-01-01',
    status: 'pending',
    ...overrides,
  }
}

describe('isSubscriptionConfirmed', () => {
  it('returns false when either snapshot is missing (still loading, or no subscription at all)', () => {
    expect(isSubscriptionConfirmed(null, makeSubscription())).toBe(false)
    expect(isSubscriptionConfirmed(makeSubscription(), null)).toBe(false)
    expect(isSubscriptionConfirmed(null, null)).toBe(false)
  })

  it('confirms a brand-new subscription once it flips from pending to active (SubscribeToPlanAction → webhook)', () => {
    const baseline = makeSubscription({ status: 'pending' })
    const stillPending = makeSubscription({ status: 'pending' })
    const nowActive = makeSubscription({ status: 'active' })

    expect(isSubscriptionConfirmed(baseline, stillPending)).toBe(false)
    expect(isSubscriptionConfirmed(baseline, nowActive)).toBe(true)
  })

  it('confirms a pending plan change once pendingPlanId clears (ChangeSubscriptionPlanAction → webhook)', () => {
    const baseline = makeSubscription({ pendingPlanId: 'plan-b', status: 'active' })
    const stillPending = makeSubscription({ pendingPlanId: 'plan-b', status: 'active' })
    const resolved = makeSubscription({ pendingPlanId: null, status: 'active' })

    expect(isSubscriptionConfirmed(baseline, stillPending)).toBe(false)
    expect(isSubscriptionConfirmed(baseline, resolved)).toBe(true)
  })

  it('never confirms when the baseline had nothing pending in the first place (already-settled subscription)', () => {
    const baseline = makeSubscription({ pendingPlanId: null, status: 'active' })
    const current = makeSubscription({ pendingPlanId: null, status: 'active' })

    expect(isSubscriptionConfirmed(baseline, current)).toBe(false)
  })
})
