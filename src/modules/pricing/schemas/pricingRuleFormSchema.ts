import { z } from 'zod'

/**
 * Espelha `CreatePricingRuleRequest`/`UpdatePricingRuleRequest`
 * (`core/api/schema.d.ts`). "`rangeMax` ≥ `rangeMin`" é o mesmo padrão de
 * regra replicável no cliente já usado em `productFormSchema.ts`
 * (`fullSalePrice` ≥ `purchasePrice`) — o backend só valida essa
 * combinação no CREATE (`gte:range_min` exige os dois campos juntos no
 * corpo, `CreatePricingRuleRequest`, comentário real do backend); no
 * UPDATE (PATCH parcial) a Action revalida com a combinação final
 * mergeada, então o `.refine()` aqui também vale pros dois modos (o form
 * sempre popula os 2 campos via `reset()`, nunca um PATCH parcial de
 * verdade do lado do cliente).
 */
export function createPricingRuleFormSchema(t: (key: string) => string) {
  return z
    .object({
      fixedFee: z.number().min(0, t('pricing.admin.pricingRules.form.errors.fixedFeeMin')),
      order: z
        .number()
        .int(t('pricing.admin.pricingRules.form.errors.orderInteger'))
        .min(0, t('pricing.admin.pricingRules.form.errors.orderMin')),
      percentage: z
        .number()
        .min(0, t('pricing.admin.pricingRules.form.errors.percentageMin'))
        .max(100, t('pricing.admin.pricingRules.form.errors.percentageMax')),
      rangeMax: z.number().min(0, t('pricing.admin.pricingRules.form.errors.rangeMaxMin')),
      rangeMin: z.number().min(0, t('pricing.admin.pricingRules.form.errors.rangeMinMin')),
    })
    .refine((data) => data.rangeMax >= data.rangeMin, {
      message: t('pricing.admin.pricingRules.form.errors.rangeMaxBelowMin'),
      path: ['rangeMax'],
    })
}

export type PricingRuleFormValues = z.infer<ReturnType<typeof createPricingRuleFormSchema>>
