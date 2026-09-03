import { buildProductMarketplacePricingSortParam } from '@/modules/pricing/composables/useProductMarketplacePricingList'

describe('buildProductMarketplacePricingSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildProductMarketplacePricingSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildProductMarketplacePricingSortParam('createdAt', null)).toBeUndefined()
  })

  it('maps the known column to the real API sort param, ascending', () => {
    expect(buildProductMarketplacePricingSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildProductMarketplacePricingSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildProductMarketplacePricingSortParam('practicedPrice', 'asc')).toBeUndefined()
  })
})
