import { createRegisterFormSchema } from '@/modules/identity/schemas/registerFormSchema'

const registerFormSchema = createRegisterFormSchema((key) => key)

const validPayload = {
  email: 'user@example.com',
  name: 'Ana Silva',
  password: '12345678',
  passwordConfirmation: '12345678',
}

describe('registerFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = registerFormSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects a missing name', () => {
    const result = registerFormSchema.safeParse({ ...validPayload, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a malformed email', () => {
    const result = registerFormSchema.safeParse({ ...validPayload, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing email with the "required" message, not "invalid" — order-dependent regression guard', () => {
    const result = registerFormSchema.safeParse({ ...validPayload, email: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssues = result.error.issues.filter((issue) => issue.path[0] === 'email')
      expect(emailIssues.at(-1)?.message).toBe('identity.register.errors.emailRequired')
    }
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = registerFormSchema.safeParse({
      ...validPayload,
      password: '1234567',
      passwordConfirmation: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched password confirmation — the canonical cross-field rule', () => {
    const result = registerFormSchema.safeParse({
      ...validPayload,
      passwordConfirmation: 'different',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('passwordConfirmation')
    }
  })
})
