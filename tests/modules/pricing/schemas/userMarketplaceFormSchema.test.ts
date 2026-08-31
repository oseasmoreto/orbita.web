import { createUserMarketplaceFormSchema } from '@/modules/pricing/schemas/userMarketplaceFormSchema'

const userMarketplaceFormSchema = createUserMarketplaceFormSchema((key) => key)

describe('userMarketplaceFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = userMarketplaceFormSchema.safeParse({
      marketplaceId: 'marketplace-1',
      storeName: 'Minha Loja',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a missing store name', () => {
    const result = userMarketplaceFormSchema.safeParse({
      marketplaceId: 'marketplace-1',
      storeName: '',
    })
    expect(result.success).toBe(false)
  })
})
