import { buildAdminSettingSortParam } from '@/modules/platform/composables/useAdminSettingList'

describe('buildAdminSettingSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminSettingSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminSettingSortParam('name', null)).toBeUndefined()
  })

  it('maps known columns to the real API sort param, ascending', () => {
    expect(buildAdminSettingSortParam('name', 'asc')).toBe('name')
    expect(buildAdminSettingSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminSettingSortParam('name', 'desc')).toBe('-name')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminSettingSortParam('value', 'asc')).toBeUndefined()
  })
})
