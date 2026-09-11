import { createShippingRuleFormSchema } from '@/modules/pricing/schemas/shippingRuleFormSchema'

const shippingRuleFormSchema = createShippingRuleFormSchema((key) => key)

const validPayload = {
  fixedFee: 12,
  order: 0,
  weightMax: 1,
  weightMin: 0,
}

describe('shippingRuleFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(shippingRuleFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a negative weight_min', () => {
    expect(shippingRuleFormSchema.safeParse({ ...validPayload, weightMin: -1 }).success).toBe(false)
  })

  it('rejects a negative weight_max', () => {
    expect(shippingRuleFormSchema.safeParse({ ...validPayload, weightMax: -1 }).success).toBe(false)
  })

  it('rejects a negative fixed_fee', () => {
    expect(shippingRuleFormSchema.safeParse({ ...validPayload, fixedFee: -1 }).success).toBe(false)
  })

  it('rejects a non-integer order', () => {
    expect(shippingRuleFormSchema.safeParse({ ...validPayload, order: 1.5 }).success).toBe(false)
  })

  it('rejects a negative order', () => {
    expect(shippingRuleFormSchema.safeParse({ ...validPayload, order: -1 }).success).toBe(false)
  })

  it('rejects weight_max lower than weight_min — the canonical cross-field rule', () => {
    const result = shippingRuleFormSchema.safeParse({
      ...validPayload,
      weightMax: 0.5,
      weightMin: 1,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('weightMax')
    }
  })

  it('accepts weight_max exactly equal to weight_min', () => {
    expect(
      shippingRuleFormSchema.safeParse({ ...validPayload, weightMax: 2, weightMin: 2 }).success,
    ).toBe(true)
  })
})
