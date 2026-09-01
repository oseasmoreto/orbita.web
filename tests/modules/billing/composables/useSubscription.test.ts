import {
  canCancelSubscription,
  canChangeToPlan,
} from '@/modules/billing/composables/useSubscription'
import type { Plan } from '@/modules/billing/types/plan.type'
import type { Subscription } from '@/modules/billing/types/subscription.type'

function makePlan(overrides: Partial<Plan> = {}): Plan {
  return {
    billingCycle: 'monthly',
    id: 'plan-a',
    isTrial: false,
    maxMarketplaces: 3,
    maxProducts: 100,
    name: 'Plano A',
    price: '49.90',
    trialDays: null,
    ...overrides,
  }
}

function makeSubscription(overrides: Partial<Subscription> = {}): Subscription {
  return {
    cancelAtPeriodEnd: false,
    createdAt: '2026-01-01T00:00:00Z',
    endDate: '2026-02-01',
    id: 'sub-1',
    pendingPlanId: null,
    plan: makePlan(),
    planId: 'plan-a',
    startDate: '2026-01-01',
    status: 'active',
    ...overrides,
  }
}

describe('canCancelSubscription', () => {
  it('returns false when there is no subscription yet', () => {
    expect(canCancelSubscription(null)).toBe(false)
  })

  it('returns true for an active subscription not yet marked for cancellation', () => {
    expect(canCancelSubscription(makeSubscription())).toBe(true)
  })

  it('returns false when cancellation is already scheduled (avoids a redundant DELETE call)', () => {
    expect(canCancelSubscription(makeSubscription({ cancelAtPeriodEnd: true }))).toBe(false)
  })
})

describe('canChangeToPlan', () => {
  it('returns false when there is no subscription yet', () => {
    expect(canChangeToPlan(null, 'plan-b')).toBe(false)
  })

  it('returns true for a plan different from the current one', () => {
    expect(canChangeToPlan(makeSubscription({ planId: 'plan-a' }), 'plan-b')).toBe(true)
  })

  it('returns false for the same plan the user already has (backend would reject with errorMessageSamePlan)', () => {
    expect(canChangeToPlan(makeSubscription({ planId: 'plan-a' }), 'plan-a')).toBe(false)
  })
})
