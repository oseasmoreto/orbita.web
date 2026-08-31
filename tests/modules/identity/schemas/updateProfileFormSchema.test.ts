import { createUpdateProfileFormSchema } from '@/modules/identity/schemas/updateProfileFormSchema'

const updateProfileFormSchema = createUpdateProfileFormSchema((key) => key)

const validPayload = {
  email: 'ana@example.com',
  name: 'Ana Silva',
  password: '',
  passwordConfirmation: '',
}

describe('updateProfileFormSchema', () => {
  it('accepts name/email with no password change', () => {
    const result = updateProfileFormSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects an empty name', () => {
    const result = updateProfileFormSchema.safeParse({ ...validPayload, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed email', () => {
    const result = updateProfileFormSchema.safeParse({ ...validPayload, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('accepts a valid new password with matching confirmation', () => {
    const result = updateProfileFormSchema.safeParse({
      ...validPayload,
      password: '12345678',
      passwordConfirmation: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a new password shorter than 8 characters', () => {
    const result = updateProfileFormSchema.safeParse({
      ...validPayload,
      password: '1234567',
      passwordConfirmation: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched password confirmation only when password was actually typed', () => {
    const result = updateProfileFormSchema.safeParse({
      ...validPayload,
      password: '12345678',
      passwordConfirmation: 'different',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('passwordConfirmation')
    }
  })

  it('does not require confirmation when password is left blank', () => {
    const result = updateProfileFormSchema.safeParse({
      ...validPayload,
      password: '',
      passwordConfirmation: 'leftover value from a previous attempt',
    })
    expect(result.success).toBe(true)
  })
})
