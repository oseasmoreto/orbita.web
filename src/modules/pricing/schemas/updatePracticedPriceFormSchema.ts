import { z } from 'zod'

/**
 * Espelha `UpdateProductMarketplaceRequest`
 * (`practiced_price: ['present', 'nullable', 'numeric', 'min:0.01']`,
 * backend) — `nullable()` cobre limpar um preço já definido (mesmo
 * raciocínio de `endDate` em `useOverrideSubscriptionForm.ts`), `.min(0.01)`
 * replica a regra de negócio "preço não pode ser zero nem negativo" antes
 * do roundtrip do 422. **Era `.min(0)` até 2026-09-11** — achado real do
 * backend: preço exatamente zero divide por zero no cálculo de margem
 * assim que uma faixa de comissão do marketplace começa em `range_min=0`
 * (`ProductMarketplacePricingCalculator::evaluate()`), nunca deveria ter
 * sido um valor aceito. `.nullable()` continua intocado — `null` pula o
 * `.min()` inteiro (limpar o preço não é "preço zero").
 *
 * `categoryId` (2026-09-10, `category_id` virou mutável via `PATCH`) —
 * `nullable()` só pra cobrir o valor inicial de uma linha ainda sem
 * categoria (`''`→`null`, mesmo sentinela de `Select.vue` já usado em
 * `taxRegime`/`storeDocumentType`); o `service` nunca manda a chave
 * quando o valor é `null` (backend não aceita "limpar" categoria por
 * este endpoint), então essa nulabilidade nunca chega a virar um 422.
 *
 * `status` (2026-09-10, mesmo dia) — `z.enum` dos 3 valores aceitos
 * (`ProductMarketplaceStatus`, gerado). Diferente de `categoryId`, nunca
 * `null`: todo vínculo já nasce com um status real (`not_sent` default),
 * o `Select` do modal sempre tem uma opção marcada.
 */
export function createUpdatePracticedPriceFormSchema(t: (key: string) => string) {
  return z.object({
    categoryId: z.string().nullable(),
    practicedPrice: z
      .number()
      .min(0.01, t('pricing.productMarketplacePricing.editModal.errors.priceMin'))
      .nullable(),
    status: z.enum(['not_sent', 'pending', 'sent']),
  })
}

export type UpdatePracticedPriceFormValues = z.infer<
  ReturnType<typeof createUpdatePracticedPriceFormSchema>
>
