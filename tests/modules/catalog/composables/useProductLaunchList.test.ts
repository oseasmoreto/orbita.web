import { buildProductLaunchSortParam } from '@/modules/catalog/composables/useProductLaunchList'

describe('buildProductLaunchSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildProductLaunchSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildProductLaunchSortParam('date', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildProductLaunchSortParam('date', 'asc')).toBe('date')
    expect(buildProductLaunchSortParam('quantity', 'asc')).toBe('quantity')
    expect(buildProductLaunchSortParam('purchasePrice', 'asc')).toBe('purchase_price')
    expect(buildProductLaunchSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildProductLaunchSortParam('date', 'desc')).toBe('-date')
    expect(buildProductLaunchSortParam('purchasePrice', 'desc')).toBe('-purchase_price')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildProductLaunchSortParam('productId', 'asc')).toBeUndefined()
  })
})
