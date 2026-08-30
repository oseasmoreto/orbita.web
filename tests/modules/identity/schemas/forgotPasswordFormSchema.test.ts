import { createForgotPasswordFormSchema } from '@/modules/identity/schemas/forgotPasswordFormSchema'

const forgotPasswordFormSchema = createForgotPasswordFormSchema((key) => key)

describe('forgotPasswordFormSchema', () => {
  it('accepts a valid email', () => {
    const result = forgotPasswordFormSchema.safeParse({ email: 'user@example.com' })
    expect(result.success).toBe(true)
  })

  it('rejects a missing email with the "required" message, not "invalid" — order-dependent regression guard', () => {
    const result = forgotPasswordFormSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssues = result.error.issues.filter((issue) => issue.path[0] === 'email')
      expect(emailIssues.at(-1)?.message).toBe('identity.forgotPassword.errors.emailRequired')
    }
  })

  it('rejects a malformed email', () => {
    const result = forgotPasswordFormSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
  })
})
