import { buildAdminProductCategorySortParam } from '@/modules/pricing/composables/useAdminProductCategoryList'

describe('buildAdminProductCategorySortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminProductCategorySortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminProductCategorySortParam('title', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildAdminProductCategorySortParam('title', 'asc')).toBe('title')
    expect(buildAdminProductCategorySortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminProductCategorySortParam('title', 'desc')).toBe('-title')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminProductCategorySortParam('active', 'asc')).toBeUndefined()
  })
})
