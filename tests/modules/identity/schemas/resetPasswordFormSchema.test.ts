import { createResetPasswordFormSchema } from '@/modules/identity/schemas/resetPasswordFormSchema'

const resetPasswordFormSchema = createResetPasswordFormSchema((key) => key)

describe('resetPasswordFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = resetPasswordFormSchema.safeParse({
      password: '12345678',
      passwordConfirmation: '12345678',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = resetPasswordFormSchema.safeParse({
      password: '1234567',
      passwordConfirmation: '1234567',
    })
    expect(result.success).toBe(false)
  })

  it('rejects mismatched password confirmation — the canonical cross-field rule', () => {
    const result = resetPasswordFormSchema.safeParse({
      password: '12345678',
      passwordConfirmation: 'different',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('passwordConfirmation')
    }
  })
})
