import { buildAdminMarketplaceSortParam } from '@/modules/pricing/composables/useAdminMarketplaceList'

describe('buildAdminMarketplaceSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminMarketplaceSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminMarketplaceSortParam('name', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildAdminMarketplaceSortParam('name', 'asc')).toBe('name')
    expect(buildAdminMarketplaceSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminMarketplaceSortParam('name', 'desc')).toBe('-name')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminMarketplaceSortParam('active', 'asc')).toBeUndefined()
  })
})
