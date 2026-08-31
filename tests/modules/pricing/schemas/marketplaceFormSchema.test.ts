import { createMarketplaceFormSchema } from '@/modules/pricing/schemas/marketplaceFormSchema'

const marketplaceFormSchema = createMarketplaceFormSchema((key) => key)

const validPayload = {
  active: true,
  description: null,
  logoBase64: null,
  name: 'Shopee',
  tags: [],
  websiteUrl: null,
}

describe('marketplaceFormSchema', () => {
  it('accepts a valid payload with every optional field null/empty', () => {
    expect(marketplaceFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a missing name', () => {
    expect(marketplaceFormSchema.safeParse({ ...validPayload, name: '' }).success).toBe(false)
  })

  it('accepts active: false', () => {
    expect(marketplaceFormSchema.safeParse({ ...validPayload, active: false }).success).toBe(true)
  })

  it('accepts a real description and tags', () => {
    const result = marketplaceFormSchema.safeParse({
      ...validPayload,
      description: 'Marketplace de moda e beleza',
      tags: ['moda', 'beleza'],
    })
    expect(result.success).toBe(true)
  })

  it('accepts a logoBase64 data URI', () => {
    const result = marketplaceFormSchema.safeParse({
      ...validPayload,
      logoBase64: 'data:image/png;base64,AAAA',
    })
    expect(result.success).toBe(true)
  })

  it('accepts a valid websiteUrl', () => {
    const result = marketplaceFormSchema.safeParse({
      ...validPayload,
      websiteUrl: 'https://shopee.com.br',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid websiteUrl', () => {
    const result = marketplaceFormSchema.safeParse({ ...validPayload, websiteUrl: 'not-a-url' })
    expect(result.success).toBe(false)
  })
})
