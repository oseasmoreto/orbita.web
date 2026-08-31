import { isPlanResourceLimitReached } from '@/shared/composables/usePlanResourceLimit'

describe('isPlanResourceLimitReached', () => {
  it('returns false when there is no known limit (admin_master, or plan without this limit)', () => {
    expect(isPlanResourceLimitReached(null, 10)).toBe(false)
  })

  it('returns false when the current count is below the limit', () => {
    expect(isPlanResourceLimitReached(10, 9)).toBe(false)
  })

  it('returns true when the current count already reached the limit', () => {
    expect(isPlanResourceLimitReached(10, 10)).toBe(true)
  })

  it('returns true when the current count exceeds the limit', () => {
    expect(isPlanResourceLimitReached(10, 11)).toBe(true)
  })
})
