import { createMarketplaceFormSchema } from '@/modules/pricing/schemas/marketplaceFormSchema'

const marketplaceFormSchema = createMarketplaceFormSchema((key) => key)

describe('marketplaceFormSchema', () => {
  it('accepts a valid payload', () => {
    const result = marketplaceFormSchema.safeParse({ active: true, name: 'Shopee' })
    expect(result.success).toBe(true)
  })

  it('rejects a missing name', () => {
    const result = marketplaceFormSchema.safeParse({ active: true, name: '' })
    expect(result.success).toBe(false)
  })

  it('accepts active: false', () => {
    const result = marketplaceFormSchema.safeParse({ active: false, name: 'Shopee' })
    expect(result.success).toBe(true)
  })
})
