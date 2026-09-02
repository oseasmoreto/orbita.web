import { createCategoryMarketplaceFormSchema } from '@/modules/pricing/schemas/categoryMarketplaceFormSchema'

const categoryMarketplaceFormSchema = createCategoryMarketplaceFormSchema((key) => key)

const validPayload = {
  categoryId: '00000000-0000-0000-0000-000000000000',
  commissionPercentage: 12,
}

describe('categoryMarketplaceFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(categoryMarketplaceFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a missing category', () => {
    expect(
      categoryMarketplaceFormSchema.safeParse({ ...validPayload, categoryId: '' }).success,
    ).toBe(false)
  })

  it('rejects a negative commission percentage', () => {
    expect(
      categoryMarketplaceFormSchema.safeParse({ ...validPayload, commissionPercentage: -1 })
        .success,
    ).toBe(false)
  })

  it('rejects a commission percentage above 100', () => {
    expect(
      categoryMarketplaceFormSchema.safeParse({ ...validPayload, commissionPercentage: 101 })
        .success,
    ).toBe(false)
  })

  it('accepts a commission percentage of exactly 0 and exactly 100', () => {
    expect(
      categoryMarketplaceFormSchema.safeParse({ ...validPayload, commissionPercentage: 0 }).success,
    ).toBe(true)
    expect(
      categoryMarketplaceFormSchema.safeParse({ ...validPayload, commissionPercentage: 100 })
        .success,
    ).toBe(true)
  })
})
