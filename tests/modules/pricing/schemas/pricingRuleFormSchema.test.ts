import { createPricingRuleFormSchema } from '@/modules/pricing/schemas/pricingRuleFormSchema'

const pricingRuleFormSchema = createPricingRuleFormSchema((key) => key)

const validPayload = {
  fixedFee: 4,
  order: 0,
  percentage: 20,
  rangeMax: 40,
  rangeMin: 0,
}

describe('pricingRuleFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(pricingRuleFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a negative range_min', () => {
    expect(pricingRuleFormSchema.safeParse({ ...validPayload, rangeMin: -1 }).success).toBe(false)
  })

  it('rejects a percentage above 100', () => {
    expect(pricingRuleFormSchema.safeParse({ ...validPayload, percentage: 101 }).success).toBe(
      false,
    )
  })

  it('rejects a negative percentage', () => {
    expect(pricingRuleFormSchema.safeParse({ ...validPayload, percentage: -1 }).success).toBe(false)
  })

  it('rejects a negative fixed_fee', () => {
    expect(pricingRuleFormSchema.safeParse({ ...validPayload, fixedFee: -1 }).success).toBe(false)
  })

  it('rejects a non-integer order', () => {
    expect(pricingRuleFormSchema.safeParse({ ...validPayload, order: 1.5 }).success).toBe(false)
  })

  it('rejects a negative order', () => {
    expect(pricingRuleFormSchema.safeParse({ ...validPayload, order: -1 }).success).toBe(false)
  })

  it('rejects range_max lower than range_min — the canonical cross-field rule', () => {
    const result = pricingRuleFormSchema.safeParse({ ...validPayload, rangeMax: 5, rangeMin: 10 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('rangeMax')
    }
  })

  it('accepts range_max exactly equal to range_min', () => {
    expect(
      pricingRuleFormSchema.safeParse({ ...validPayload, rangeMax: 10, rangeMin: 10 }).success,
    ).toBe(true)
  })
})
