import { createLoginFormSchema } from '@/modules/identity/schemas/loginFormSchema'

const loginFormSchema = createLoginFormSchema((key) => key)

describe('loginFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = loginFormSchema.safeParse({ email: 'user@example.com', password: '12345678' })
    expect(result.success).toBe(true)
  })

  it('rejects a missing email with the "required" message, not "invalid" — order-dependent regression guard', () => {
    const result = loginFormSchema.safeParse({ email: '', password: '12345678' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssues = result.error.issues.filter((issue) => issue.path[0] === 'email')
      expect(emailIssues.at(-1)?.message).toBe('identity.login.errors.emailRequired')
    }
  })

  it('rejects a malformed email with the "invalid" message', () => {
    const result = loginFormSchema.safeParse({ email: 'not-an-email', password: '12345678' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssues = result.error.issues.filter((issue) => issue.path[0] === 'email')
      expect(emailIssues.at(-1)?.message).toBe('identity.login.errors.emailInvalid')
    }
  })

  it('rejects a missing password', () => {
    const result = loginFormSchema.safeParse({ email: 'user@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})
