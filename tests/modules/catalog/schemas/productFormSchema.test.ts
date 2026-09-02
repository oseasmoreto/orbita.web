import { createProductFormSchema } from '@/modules/catalog/schemas/productFormSchema'

const productFormSchema = createProductFormSchema((key) => key)

const validPayload = {
  costPrice: 30,
  ean: '4006381333931',
  height: null,
  length: null,
  name: 'Camiseta azul',
  ncm: '61091000',
  operationalCost: null,
  sku: 'SKU-001',
  targetMargin: 20,
  weight: null,
  width: null,
}

describe('productFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = productFormSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects a missing name', () => {
    const result = productFormSchema.safeParse({ ...validPayload, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing SKU', () => {
    const result = productFormSchema.safeParse({ ...validPayload, sku: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a cost price of zero or less', () => {
    const result = productFormSchema.safeParse({ ...validPayload, costPrice: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects a negative operational cost', () => {
    const result = productFormSchema.safeParse({ ...validPayload, operationalCost: -1 })
    expect(result.success).toBe(false)
  })

  it('accepts a null or zero operational cost — it is optional', () => {
    expect(productFormSchema.safeParse({ ...validPayload, operationalCost: null }).success).toBe(
      true,
    )
    expect(productFormSchema.safeParse({ ...validPayload, operationalCost: 0 }).success).toBe(true)
  })

  it('rejects a target margin above 100', () => {
    const result = productFormSchema.safeParse({ ...validPayload, targetMargin: 101 })
    expect(result.success).toBe(false)
  })

  it('rejects a negative target margin', () => {
    const result = productFormSchema.safeParse({ ...validPayload, targetMargin: -1 })
    expect(result.success).toBe(false)
  })

  it('accepts a target margin of exactly 0 and exactly 100', () => {
    expect(productFormSchema.safeParse({ ...validPayload, targetMargin: 0 }).success).toBe(true)
    expect(productFormSchema.safeParse({ ...validPayload, targetMargin: 100 }).success).toBe(true)
  })

  it('accepts null for the optional dimension fields', () => {
    const result = productFormSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('accepts a real value for the optional dimension fields', () => {
    const result = productFormSchema.safeParse({
      ...validPayload,
      height: 10,
      length: 20,
      weight: 0.5,
      width: 15,
    })
    expect(result.success).toBe(true)
  })
})
