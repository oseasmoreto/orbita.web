import { buildPricingRuleSortParam } from '@/modules/pricing/composables/useAdminPricingRuleList'

describe('buildPricingRuleSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildPricingRuleSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildPricingRuleSortParam('order', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildPricingRuleSortParam('order', 'asc')).toBe('order')
    expect(buildPricingRuleSortParam('rangeMin', 'asc')).toBe('range_min')
    expect(buildPricingRuleSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildPricingRuleSortParam('order', 'desc')).toBe('-order')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildPricingRuleSortParam('percentage', 'asc')).toBeUndefined()
  })
})
