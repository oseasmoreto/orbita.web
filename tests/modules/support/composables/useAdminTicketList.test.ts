import { buildAdminTicketSortParam } from '@/modules/support/composables/useAdminTicketList'

describe('buildAdminTicketSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminTicketSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminTicketSortParam('createdAt', null)).toBeUndefined()
  })

  it('maps known columns to the real API sort param, ascending', () => {
    expect(buildAdminTicketSortParam('createdAt', 'asc')).toBe('created_at')
    expect(buildAdminTicketSortParam('resolvedAt', 'asc')).toBe('resolved_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminTicketSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminTicketSortParam('subject', 'asc')).toBeUndefined()
  })
})
