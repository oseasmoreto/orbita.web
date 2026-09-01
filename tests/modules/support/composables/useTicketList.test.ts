import { buildTicketSortParam } from '@/modules/support/composables/useTicketList'

describe('buildTicketSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildTicketSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildTicketSortParam('createdAt', null)).toBeUndefined()
  })

  it('maps known columns to the real API sort param, ascending', () => {
    expect(buildTicketSortParam('createdAt', 'asc')).toBe('created_at')
    expect(buildTicketSortParam('resolvedAt', 'asc')).toBe('resolved_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildTicketSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildTicketSortParam('subject', 'asc')).toBeUndefined()
  })
})
