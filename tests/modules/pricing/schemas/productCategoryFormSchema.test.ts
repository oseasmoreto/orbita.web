import { createProductCategoryFormSchema } from '@/modules/pricing/schemas/productCategoryFormSchema'

const productCategoryFormSchema = createProductCategoryFormSchema((key) => key)

describe('productCategoryFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(
      productCategoryFormSchema.safeParse({ active: true, title: 'Eletrônicos' }).success,
    ).toBe(true)
  })

  it('rejects a missing title', () => {
    expect(productCategoryFormSchema.safeParse({ active: true, title: '' }).success).toBe(false)
  })

  it('accepts active false', () => {
    expect(
      productCategoryFormSchema.safeParse({ active: false, title: 'Eletrônicos' }).success,
    ).toBe(true)
  })
})
