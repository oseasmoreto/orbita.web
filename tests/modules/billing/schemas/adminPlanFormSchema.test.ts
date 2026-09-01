import { createAdminPlanFormSchema } from '@/modules/billing/schemas/adminPlanFormSchema'

const adminPlanFormSchema = createAdminPlanFormSchema((key) => key)

const validPayload = {
  active: true,
  billingCycle: 'monthly' as const,
  isTrial: false,
  maxMarketplaces: 2,
  maxProducts: 50,
  name: 'Starter',
  price: 49.9,
  trialDays: null,
}

describe('adminPlanFormSchema', () => {
  it('accepts a valid non-trial payload', () => {
    expect(adminPlanFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('accepts a valid trial payload', () => {
    const result = adminPlanFormSchema.safeParse({
      ...validPayload,
      billingCycle: 'trial',
      isTrial: true,
      price: 0,
      trialDays: 10,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a missing name', () => {
    expect(adminPlanFormSchema.safeParse({ ...validPayload, name: '' }).success).toBe(false)
  })

  it('rejects a negative price', () => {
    expect(adminPlanFormSchema.safeParse({ ...validPayload, price: -10 }).success).toBe(false)
  })

  it('rejects billingCycle "trial" without isTrial (cross-field rule)', () => {
    const result = adminPlanFormSchema.safeParse({
      ...validPayload,
      billingCycle: 'trial',
      isTrial: false,
      trialDays: 10,
    })
    expect(result.success).toBe(false)
  })

  it('rejects isTrial=true when billingCycle is not "trial" (cross-field rule)', () => {
    const result = adminPlanFormSchema.safeParse({
      ...validPayload,
      billingCycle: 'monthly',
      isTrial: true,
      trialDays: 10,
    })
    expect(result.success).toBe(false)
  })

  it('rejects billingCycle "trial" without trialDays', () => {
    const result = adminPlanFormSchema.safeParse({
      ...validPayload,
      billingCycle: 'trial',
      isTrial: true,
      trialDays: null,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a non-integer maxProducts', () => {
    expect(adminPlanFormSchema.safeParse({ ...validPayload, maxProducts: 1.5 }).success).toBe(false)
  })
})
