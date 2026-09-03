import { createUpdatePracticedPriceFormSchema } from '@/modules/pricing/schemas/updatePracticedPriceFormSchema'

const updatePracticedPriceFormSchema = createUpdatePracticedPriceFormSchema((key) => key)

describe('updatePracticedPriceFormSchema', () => {
  it('accepts a valid positive price', () => {
    expect(updatePracticedPriceFormSchema.safeParse({ practicedPrice: 69.9 }).success).toBe(true)
  })

  it('accepts null (clears an already-set price)', () => {
    expect(updatePracticedPriceFormSchema.safeParse({ practicedPrice: null }).success).toBe(true)
  })

  it('accepts zero', () => {
    expect(updatePracticedPriceFormSchema.safeParse({ practicedPrice: 0 }).success).toBe(true)
  })

  it('rejects a negative price', () => {
    expect(updatePracticedPriceFormSchema.safeParse({ practicedPrice: -1 }).success).toBe(false)
  })
})
