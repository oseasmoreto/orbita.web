import { shouldSimulatePracticedPrice } from '@/modules/pricing/composables/usePracticedPriceSimulation'

describe('shouldSimulatePracticedPrice', () => {
  it('returns false for null (nothing typed yet, or field cleared)', () => {
    expect(shouldSimulatePracticedPrice(null)).toBe(false)
  })

  it('returns false for zero (backend rejects it — min:0.01, achado real 2026-09-11)', () => {
    expect(shouldSimulatePracticedPrice(0)).toBe(false)
  })

  it('returns false for a negative value', () => {
    expect(shouldSimulatePracticedPrice(-10)).toBe(false)
  })

  it('returns true for any positive value', () => {
    expect(shouldSimulatePracticedPrice(0.01)).toBe(true)
    expect(shouldSimulatePracticedPrice(49.9)).toBe(true)
  })
})
