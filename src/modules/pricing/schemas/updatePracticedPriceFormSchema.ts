import { z } from 'zod'

/**
 * Espelha `UpdateProductMarketplaceRequest`
 * (`practiced_price: ['present', 'nullable', 'numeric', 'min:0']`,
 * backend) — `nullable()` cobre limpar um preço já definido (mesmo
 * raciocínio de `endDate` em `useOverrideSubscriptionForm.ts`), `.min(0)`
 * replica a regra de negócio "preço não pode ser negativo" antes do
 * roundtrip do 422.
 */
export function createUpdatePracticedPriceFormSchema(t: (key: string) => string) {
  return z.object({
    practicedPrice: z
      .number()
      .min(0, t('pricing.productMarketplacePricing.editModal.errors.priceMin'))
      .nullable(),
  })
}

export type UpdatePracticedPriceFormValues = z.infer<
  ReturnType<typeof createUpdatePracticedPriceFormSchema>
>
