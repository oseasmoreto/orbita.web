import { buildAdminNotificationSortParam } from '@/modules/platform/composables/useAdminNotificationList'

describe('buildAdminNotificationSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminNotificationSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminNotificationSortParam('createdAt', null)).toBeUndefined()
  })

  it('maps createdAt to the real API sort param, ascending', () => {
    expect(buildAdminNotificationSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminNotificationSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminNotificationSortParam('title', 'asc')).toBeUndefined()
  })
})
