import { isMarketplaceLimitReached } from '@/modules/pricing/composables/useMarketplaceLimit'

describe('isMarketplaceLimitReached', () => {
  it('returns false when there is no plan limit info (admin_master, or session not loaded yet)', () => {
    expect(isMarketplaceLimitReached(null, 10)).toBe(false)
  })

  it('returns false when the plan has no marketplace limit (maxMarketplaces: null = unlimited)', () => {
    expect(isMarketplaceLimitReached({ maxMarketplaces: null, maxProducts: 10 }, 999)).toBe(false)
  })

  it('returns false when the current count is below the limit', () => {
    expect(isMarketplaceLimitReached({ maxMarketplaces: 5, maxProducts: 10 }, 4)).toBe(false)
  })

  it('returns true when the current count already reached the limit', () => {
    expect(isMarketplaceLimitReached({ maxMarketplaces: 5, maxProducts: 10 }, 5)).toBe(true)
  })

  it('returns true when the current count exceeds the limit', () => {
    expect(isMarketplaceLimitReached({ maxMarketplaces: 5, maxProducts: 10 }, 6)).toBe(true)
  })
})
