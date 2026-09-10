import { createUpdatePracticedPriceFormSchema } from '@/modules/pricing/schemas/updatePracticedPriceFormSchema'

const updatePracticedPriceFormSchema = createUpdatePracticedPriceFormSchema((key) => key)

describe('updatePracticedPriceFormSchema', () => {
  it('accepts a valid positive price', () => {
    expect(
      updatePracticedPriceFormSchema.safeParse({
        categoryId: null,
        practicedPrice: 69.9,
        status: 'not_sent',
      }).success,
    ).toBe(true)
  })

  it('accepts null (clears an already-set price)', () => {
    expect(
      updatePracticedPriceFormSchema.safeParse({
        categoryId: null,
        practicedPrice: null,
        status: 'not_sent',
      }).success,
    ).toBe(true)
  })

  it('rejects zero (min:0.01, achado real 2026-09-11 — divisão por zero no cálculo de margem)', () => {
    expect(
      updatePracticedPriceFormSchema.safeParse({
        categoryId: null,
        practicedPrice: 0,
        status: 'not_sent',
      }).success,
    ).toBe(false)
  })

  it('accepts the smallest valid price (0.01)', () => {
    expect(
      updatePracticedPriceFormSchema.safeParse({
        categoryId: null,
        practicedPrice: 0.01,
        status: 'not_sent',
      }).success,
    ).toBe(true)
  })

  it('rejects a negative price', () => {
    expect(
      updatePracticedPriceFormSchema.safeParse({
        categoryId: null,
        practicedPrice: -1,
        status: 'not_sent',
      }).success,
    ).toBe(false)
  })

  it('accepts a real category id', () => {
    expect(
      updatePracticedPriceFormSchema.safeParse({
        categoryId: 'cat-1',
        practicedPrice: 69.9,
        status: 'not_sent',
      }).success,
    ).toBe(true)
  })

  it('accepts every valid status', () => {
    for (const status of ['not_sent', 'pending', 'sent']) {
      expect(
        updatePracticedPriceFormSchema.safeParse({
          categoryId: null,
          practicedPrice: null,
          status,
        }).success,
      ).toBe(true)
    }
  })

  it('rejects a status outside the enum', () => {
    expect(
      updatePracticedPriceFormSchema.safeParse({
        categoryId: null,
        practicedPrice: null,
        status: 'shipped',
      }).success,
    ).toBe(false)
  })
})
