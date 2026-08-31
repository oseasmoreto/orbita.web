import { isProductLimitReached } from '@/modules/catalog/composables/usePlanLimit'

describe('isProductLimitReached', () => {
  it('returns false when there is no plan limit info (admin_master, or session not loaded yet)', () => {
    expect(isProductLimitReached(null, 10)).toBe(false)
  })

  it('returns false when the plan has no product limit (maxProducts: null = unlimited)', () => {
    expect(isProductLimitReached({ maxMarketplaces: 5, maxProducts: null }, 999)).toBe(false)
  })

  it('returns false when the current count is below the limit', () => {
    expect(isProductLimitReached({ maxMarketplaces: 5, maxProducts: 10 }, 9)).toBe(false)
  })

  it('returns true when the current count already reached the limit', () => {
    expect(isProductLimitReached({ maxMarketplaces: 5, maxProducts: 10 }, 10)).toBe(true)
  })

  it('returns true when the current count exceeds the limit', () => {
    expect(isProductLimitReached({ maxMarketplaces: 5, maxProducts: 10 }, 11)).toBe(true)
  })
})
