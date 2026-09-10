import { z } from 'zod'

/**
 * Espelha `UpdateProductMarketplaceRequest`
 * (`practiced_price: ['present', 'nullable', 'numeric', 'min:0']`,
 * backend) — `nullable()` cobre limpar um preço já definido (mesmo
 * raciocínio de `endDate` em `useOverrideSubscriptionForm.ts`), `.min(0)`
 * replica a regra de negócio "preço não pode ser negativo" antes do
 * roundtrip do 422.
 *
 * `categoryId` (2026-09-10, `category_id` virou mutável via `PATCH`) —
 * `nullable()` só pra cobrir o valor inicial de uma linha ainda sem
 * categoria (`''`→`null`, mesmo sentinela de `Select.vue` já usado em
 * `taxRegime`/`storeDocumentType`); o `service` nunca manda a chave
 * quando o valor é `null` (backend não aceita "limpar" categoria por
 * este endpoint), então essa nulabilidade nunca chega a virar um 422.
 */
export function createUpdatePracticedPriceFormSchema(t: (key: string) => string) {
  return z.object({
    categoryId: z.string().nullable(),
    practicedPrice: z
      .number()
      .min(0, t('pricing.productMarketplacePricing.editModal.errors.priceMin'))
      .nullable(),
  })
}

export type UpdatePracticedPriceFormValues = z.infer<
  ReturnType<typeof createUpdatePracticedPriceFormSchema>
>
