import { buildAdminUserSortParam } from '@/modules/identity/composables/useAdminUserList'

describe('buildAdminUserSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminUserSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminUserSortParam('name', null)).toBeUndefined()
  })

  it('maps known columns to the real API sort param, ascending', () => {
    expect(buildAdminUserSortParam('name', 'asc')).toBe('name')
    expect(buildAdminUserSortParam('email', 'asc')).toBe('email')
    expect(buildAdminUserSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminUserSortParam('name', 'desc')).toBe('-name')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminUserSortParam('role', 'asc')).toBeUndefined()
  })
})
