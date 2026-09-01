import { createAdminSettingFormSchema } from '@/modules/platform/schemas/adminSettingFormSchema'

const adminSettingFormSchema = createAdminSettingFormSchema((key) => key)

const validPayload = {
  hash: 'billing.trial_days',
  name: 'Dias de trial',
  type: 'int' as const,
  value: '10',
}

describe('adminSettingFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(adminSettingFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a missing hash', () => {
    expect(adminSettingFormSchema.safeParse({ ...validPayload, hash: '' }).success).toBe(false)
  })

  it('rejects a hash with spaces/uppercase (dot-notation slug only)', () => {
    expect(
      adminSettingFormSchema.safeParse({ ...validPayload, hash: 'Billing Trial Days' }).success,
    ).toBe(false)
  })

  it('accepts a dot-notation hash with underscores', () => {
    expect(
      adminSettingFormSchema.safeParse({ ...validPayload, hash: 'billing.trial_days_v2' }).success,
    ).toBe(true)
  })

  it('rejects a missing name', () => {
    expect(adminSettingFormSchema.safeParse({ ...validPayload, name: '' }).success).toBe(false)
  })

  it('rejects a missing value', () => {
    expect(adminSettingFormSchema.safeParse({ ...validPayload, value: '' }).success).toBe(false)
  })

  it('rejects an invalid type', () => {
    expect(adminSettingFormSchema.safeParse({ ...validPayload, type: 'not-a-type' }).success).toBe(
      false,
    )
  })
})
