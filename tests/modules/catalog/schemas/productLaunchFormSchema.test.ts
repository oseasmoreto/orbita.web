import { createProductLaunchFormSchema } from '@/modules/catalog/schemas/productLaunchFormSchema'

const productLaunchFormSchema = createProductLaunchFormSchema((key) => key)

const validPayload = {
  date: '2026-01-15',
  purchasePrice: 30,
  quantity: 10,
}

describe('productLaunchFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = productLaunchFormSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('accepts a purchase price of exactly zero — backend allows it (min:0, not positive)', () => {
    const result = productLaunchFormSchema.safeParse({ ...validPayload, purchasePrice: 0 })
    expect(result.success).toBe(true)
  })

  it('rejects a negative purchase price', () => {
    const result = productLaunchFormSchema.safeParse({ ...validPayload, purchasePrice: -1 })
    expect(result.success).toBe(false)
  })

  it('rejects a quantity of zero — backend requires at least 1', () => {
    const result = productLaunchFormSchema.safeParse({ ...validPayload, quantity: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects a non-integer quantity', () => {
    const result = productLaunchFormSchema.safeParse({ ...validPayload, quantity: 1.5 })
    expect(result.success).toBe(false)
  })

  it('rejects a missing date', () => {
    const result = productLaunchFormSchema.safeParse({ ...validPayload, date: '' })
    expect(result.success).toBe(false)
  })
})
