import { canEditUser, canImpersonate } from '@/modules/identity/composables/useImpersonation'
import type { AdminUser } from '@/modules/identity/types/adminUser.type'

function buildAdminUser(overrides: Partial<AdminUser> = {}): AdminUser {
  return {
    createdAt: '2026-01-01T00:00:00Z',
    document: null,
    email: 'user@test.com',
    emailVerifiedAt: '2026-01-01T00:00:00Z',
    id: 'target-1',
    name: 'Target User',
    role: 'user',
    status: 'active',
    ...overrides,
  }
}

describe('canImpersonate', () => {
  it('is true for a regular user, not the current admin', () => {
    expect(canImpersonate('admin-1', buildAdminUser({ id: 'target-1', role: 'user' }))).toBe(true)
  })

  it("is false for the current admin's own row (backend would reject with errorMessageCannotModifyOwnAccount)", () => {
    expect(canImpersonate('admin-1', buildAdminUser({ id: 'admin-1', role: 'user' }))).toBe(false)
  })

  it('is false for another admin_master (backend would reject with CannotImpersonateAdminException)', () => {
    expect(
      canImpersonate('admin-1', buildAdminUser({ id: 'target-1', role: 'admin_master' })),
    ).toBe(false)
  })
})

describe('canEditUser', () => {
  it('is true for any user other than the current admin', () => {
    expect(canEditUser('admin-1', buildAdminUser({ id: 'target-1' }))).toBe(true)
  })

  it("is false for the current admin's own row", () => {
    expect(canEditUser('admin-1', buildAdminUser({ id: 'admin-1' }))).toBe(false)
  })
})
