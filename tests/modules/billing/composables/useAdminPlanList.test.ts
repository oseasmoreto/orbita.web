import { buildAdminPlanSortParam } from '@/modules/billing/composables/useAdminPlanList'

describe('buildAdminPlanSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildAdminPlanSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildAdminPlanSortParam('name', null)).toBeUndefined()
  })

  it('maps known columns to the real API sort param, ascending', () => {
    expect(buildAdminPlanSortParam('name', 'asc')).toBe('name')
    expect(buildAdminPlanSortParam('price', 'asc')).toBe('price')
    expect(buildAdminPlanSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildAdminPlanSortParam('price', 'desc')).toBe('-price')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildAdminPlanSortParam('billingCycle', 'asc')).toBeUndefined()
  })
})
