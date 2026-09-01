import {
  findMostEconomicalPlan,
  getMonthlyEquivalent,
  getYearlySavings,
} from '@/modules/billing/composables/usePlanPricing'
import type { Plan } from '@/modules/billing/types/plan.type'

function buildPlan(overrides: Partial<Plan> = {}): Plan {
  return {
    billingCycle: 'monthly',
    id: 'plan-1',
    isTrial: false,
    maxMarketplaces: 3,
    maxProducts: 100,
    name: 'Plano Mensal',
    price: '49.90',
    trialDays: null,
    ...overrides,
  }
}

describe('getMonthlyEquivalent', () => {
  it('returns the plan own price for a monthly plan', () => {
    const plan = buildPlan({ billingCycle: 'monthly', price: '49.90' })
    expect(getMonthlyEquivalent(plan)).toBeCloseTo(49.9)
  })

  it('divides the price by 12 for a yearly plan', () => {
    const plan = buildPlan({ billingCycle: 'yearly', price: '449.90' })
    expect(getMonthlyEquivalent(plan)).toBeCloseTo(37.4917, 4)
  })
})

describe('getYearlySavings', () => {
  it('returns the yearly savings against the cheapest monthly plan', () => {
    const monthly = buildPlan({ billingCycle: 'monthly', id: 'm1', price: '49.90' })
    const yearly = buildPlan({ billingCycle: 'yearly', id: 'y1', price: '449.90' })

    // 49.90 * 12 = 598.80; 598.80 - 449.90 = 148.90
    expect(getYearlySavings(yearly, [monthly, yearly])).toBeCloseTo(148.9, 2)
  })

  it('picks the cheapest monthly plan when there is more than one', () => {
    const cheapMonthly = buildPlan({ billingCycle: 'monthly', id: 'm1', price: '30' })
    const pricierMonthly = buildPlan({ billingCycle: 'monthly', id: 'm2', price: '50' })
    const yearly = buildPlan({ billingCycle: 'yearly', id: 'y1', price: '300' })

    // 30 * 12 = 360; 360 - 300 = 60 (nunca compara contra o de 50)
    expect(getYearlySavings(yearly, [cheapMonthly, pricierMonthly, yearly])).toBeCloseTo(60, 2)
  })

  it('returns null when there is no monthly plan to compare against', () => {
    const yearly = buildPlan({ billingCycle: 'yearly', id: 'y1', price: '449.90' })
    expect(getYearlySavings(yearly, [yearly])).toBeNull()
  })

  it('returns null when the yearly plan is not actually cheaper', () => {
    const monthly = buildPlan({ billingCycle: 'monthly', id: 'm1', price: '10' })
    const yearly = buildPlan({ billingCycle: 'yearly', id: 'y1', price: '999' })

    expect(getYearlySavings(yearly, [monthly, yearly])).toBeNull()
  })
})

describe('findMostEconomicalPlan', () => {
  it('returns null for an empty list', () => {
    expect(findMostEconomicalPlan([])).toBeNull()
  })

  it('picks the plan with the lowest monthly-equivalent price', () => {
    const monthly = buildPlan({ billingCycle: 'monthly', id: 'm1', price: '49.90' })
    const yearly = buildPlan({ billingCycle: 'yearly', id: 'y1', price: '449.90' })

    expect(findMostEconomicalPlan([monthly, yearly])?.id).toBe('y1')
  })

  it('returns the single plan when there is only one', () => {
    const onlyPlan = buildPlan({ id: 'solo' })
    expect(findMostEconomicalPlan([onlyPlan])?.id).toBe('solo')
  })

  it('never picks a trial plan, even though it is always the cheapest (R$0)', () => {
    const trial = buildPlan({
      billingCycle: 'trial',
      id: 'trial-1',
      isTrial: true,
      price: '0',
      trialDays: 10,
    })
    const starter = buildPlan({ billingCycle: 'monthly', id: 'starter', price: '49.90' })
    const pro = buildPlan({ billingCycle: 'monthly', id: 'pro', price: '99.90' })

    expect(findMostEconomicalPlan([trial, starter, pro])?.id).toBe('starter')
  })

  it('returns null when every plan is trial', () => {
    const trial = buildPlan({ billingCycle: 'trial', id: 'trial-1', isTrial: true, price: '0' })
    expect(findMostEconomicalPlan([trial])).toBeNull()
  })
})
