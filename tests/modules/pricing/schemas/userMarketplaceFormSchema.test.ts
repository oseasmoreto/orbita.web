import { createUserMarketplaceFormSchema } from '@/modules/pricing/schemas/userMarketplaceFormSchema'

const userMarketplaceFormSchema = createUserMarketplaceFormSchema((key) => key)

const validPayload = {
  adsPercentage: null,
  affiliatePercentage: null,
  campaignDiscountPercentage: null,
  couponValue: null,
  marketplaceId: 'marketplace-1',
  storeName: 'Minha Loja',
}

describe('userMarketplaceFormSchema', () => {
  it('accepts a valid payload with all percentage fields null', () => {
    expect(userMarketplaceFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a missing store name', () => {
    expect(userMarketplaceFormSchema.safeParse({ ...validPayload, storeName: '' }).success).toBe(
      false,
    )
  })

  it('accepts a real value for each percentage field', () => {
    expect(
      userMarketplaceFormSchema.safeParse({
        ...validPayload,
        adsPercentage: 12.5,
        affiliatePercentage: 3,
        campaignDiscountPercentage: 10,
      }).success,
    ).toBe(true)
  })

  it('rejects a negative percentage', () => {
    expect(
      userMarketplaceFormSchema.safeParse({ ...validPayload, adsPercentage: -1 }).success,
    ).toBe(false)
  })

  it('rejects a percentage above 100', () => {
    expect(
      userMarketplaceFormSchema.safeParse({ ...validPayload, affiliatePercentage: 101 }).success,
    ).toBe(false)
  })

  it('accepts a percentage of exactly 0 and exactly 100', () => {
    expect(
      userMarketplaceFormSchema.safeParse({ ...validPayload, campaignDiscountPercentage: 0 })
        .success,
    ).toBe(true)
    expect(
      userMarketplaceFormSchema.safeParse({ ...validPayload, campaignDiscountPercentage: 100 })
        .success,
    ).toBe(true)
  })

  it('accepts a real (fixed R$, not percentage) coupon value, including above 100', () => {
    expect(userMarketplaceFormSchema.safeParse({ ...validPayload, couponValue: 250 }).success).toBe(
      true,
    )
  })

  it('rejects a negative coupon value', () => {
    expect(userMarketplaceFormSchema.safeParse({ ...validPayload, couponValue: -1 }).success).toBe(
      false,
    )
  })
})
