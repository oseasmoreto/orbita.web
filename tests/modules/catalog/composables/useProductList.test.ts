import { buildProductSortParam } from '@/modules/catalog/composables/useProductList'

describe('buildProductSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildProductSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildProductSortParam('name', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildProductSortParam('name', 'asc')).toBe('name')
    expect(buildProductSortParam('fullSalePrice', 'asc')).toBe('full_sale_price')
    expect(buildProductSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildProductSortParam('name', 'desc')).toBe('-name')
    expect(buildProductSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildProductSortParam('margin', 'asc')).toBeUndefined()
  })
})
