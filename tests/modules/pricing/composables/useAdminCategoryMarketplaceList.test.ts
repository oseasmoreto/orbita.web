import { buildCategoryMarketplaceSortParam } from '@/modules/pricing/composables/useAdminCategoryMarketplaceList'

describe('buildCategoryMarketplaceSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildCategoryMarketplaceSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildCategoryMarketplaceSortParam('commissionPercentage', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildCategoryMarketplaceSortParam('commissionPercentage', 'asc')).toBe(
      'commission_percentage',
    )
    expect(buildCategoryMarketplaceSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildCategoryMarketplaceSortParam('commissionPercentage', 'desc')).toBe(
      '-commission_percentage',
    )
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildCategoryMarketplaceSortParam('title', 'asc')).toBeUndefined()
  })
})
