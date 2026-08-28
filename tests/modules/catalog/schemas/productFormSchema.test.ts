import { createProductFormSchema } from '@/modules/catalog/schemas/productFormSchema'

const productFormSchema = createProductFormSchema((key) => key)

const validPayload = {
  ean: '4006381333931',
  fullSalePrice: 59.9,
  height: null,
  length: null,
  name: 'Camiseta azul',
  ncm: '61091000',
  purchasePrice: 30,
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

  it('rejects a sale price of zero or less', () => {
    const result = productFormSchema.safeParse({ ...validPayload, fullSalePrice: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects a purchase price of zero or less', () => {
    const result = productFormSchema.safeParse({ ...validPayload, purchasePrice: -1 })
    expect(result.success).toBe(false)
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

  it('rejects sale price lower than purchase price — the canonical cross-field rule', () => {
    const result = productFormSchema.safeParse({
      ...validPayload,
      fullSalePrice: 20,
      purchasePrice: 30,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('fullSalePrice')
    }
  })

  it('accepts sale price exactly equal to purchase price', () => {
    const result = productFormSchema.safeParse({
      ...validPayload,
      fullSalePrice: 30,
      purchasePrice: 30,
    })
    expect(result.success).toBe(true)
  })
})
