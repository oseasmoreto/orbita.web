import { buildAuditLogSortParam } from '@/modules/platform/composables/useAuditLogList'

describe('buildAuditLogSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAuditLogSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAuditLogSortParam('createdAt', null)).toBeUndefined()
  })

  it('maps createdAt to the real API sort param, ascending', () => {
    expect(buildAuditLogSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAuditLogSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAuditLogSortParam('action', 'asc')).toBeUndefined()
  })
})
