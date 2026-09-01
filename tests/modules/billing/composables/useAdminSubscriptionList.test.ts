import { buildAdminSubscriptionSortParam } from '@/modules/billing/composables/useAdminSubscriptionList'

describe('buildAdminSubscriptionSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminSubscriptionSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminSubscriptionSortParam('startDate', null)).toBeUndefined()
  })

  it('maps known columns to the real API sort param, ascending', () => {
    expect(buildAdminSubscriptionSortParam('startDate', 'asc')).toBe('start_date')
    expect(buildAdminSubscriptionSortParam('endDate', 'asc')).toBe('end_date')
    expect(buildAdminSubscriptionSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminSubscriptionSortParam('startDate', 'desc')).toBe('-start_date')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminSubscriptionSortParam('status', 'asc')).toBeUndefined()
  })
})
