import { buildAdminTransactionSortParam } from '@/modules/billing/composables/useAdminTransactionList'

describe('buildAdminTransactionSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminTransactionSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminTransactionSortParam('value', null)).toBeUndefined()
  })

  it('maps known columns to the real API sort param, ascending', () => {
    expect(buildAdminTransactionSortParam('value', 'asc')).toBe('value')
    expect(buildAdminTransactionSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminTransactionSortParam('value', 'desc')).toBe('-value')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminTransactionSortParam('gateway', 'asc')).toBeUndefined()
  })
})
