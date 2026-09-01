import { createAdminUserFormSchema } from '@/modules/identity/schemas/createAdminUserFormSchema'

const adminUserFormSchema = createAdminUserFormSchema((key) => key)

const validPayload = {
  email: 'user@example.com',
  name: 'Ana Silva',
  password: '12345678',
  passwordConfirmation: '12345678',
  role: 'user' as const,
}

describe('createAdminUserFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(adminUserFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a missing name', () => {
    expect(adminUserFormSchema.safeParse({ ...validPayload, name: '' }).success).toBe(false)
  })

  it('rejects a malformed email', () => {
    expect(adminUserFormSchema.safeParse({ ...validPayload, email: 'not-an-email' }).success).toBe(
      false,
    )
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = adminUserFormSchema.safeParse({
      ...validPayload,
      password: '1234567',
      passwordConfirmation: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched password confirmation — the canonical cross-field rule', () => {
    const result = adminUserFormSchema.safeParse({
      ...validPayload,
      passwordConfirmation: 'different',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('passwordConfirmation')
    }
  })

  it('accepts role admin_master', () => {
    expect(adminUserFormSchema.safeParse({ ...validPayload, role: 'admin_master' }).success).toBe(
      true,
    )
  })

  it('rejects an invalid role', () => {
    expect(adminUserFormSchema.safeParse({ ...validPayload, role: 'superuser' }).success).toBe(
      false,
    )
  })
})
