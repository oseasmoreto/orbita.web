import { buildTransactionSortParam } from '@/modules/billing/composables/useTransactionList'

describe('buildTransactionSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildTransactionSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildTransactionSortParam('value', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildTransactionSortParam('value', 'asc')).toBe('value')
    expect(buildTransactionSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildTransactionSortParam('value', 'desc')).toBe('-value')
    expect(buildTransactionSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildTransactionSortParam('gateway', 'asc')).toBeUndefined()
  })
})
