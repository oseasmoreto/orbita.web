import { z } from 'zod'

/**
 * Espelha `CreateShippingRuleRequest`/`UpdateShippingRuleRequest`
 * (`core/api/schema.d.ts`) — mirror exato de `pricingRuleFormSchema.ts`,
 * faixa por PESO em vez de valor, sem `percentage` (frete é só taxa
 * fixa). "`weightMax` ≥ `weightMin`" é a mesma regra replicável no
 * cliente que `pricingRuleFormSchema.ts` já usa pra `rangeMax`/`rangeMin`
 * — o backend revalida a combinação final tanto no CREATE quanto no
 * UPDATE (`docs/api/planejamento-shein.md` §3).
 */
export function createShippingRuleFormSchema(t: (key: string) => string) {
  return z
    .object({
      fixedFee: z.number().min(0, t('pricing.admin.shippingRules.form.errors.fixedFeeMin')),
      order: z
        .number()
        .int(t('pricing.admin.shippingRules.form.errors.orderInteger'))
        .min(0, t('pricing.admin.shippingRules.form.errors.orderMin')),
      weightMax: z.number().min(0, t('pricing.admin.shippingRules.form.errors.weightMaxMin')),
      weightMin: z.number().min(0, t('pricing.admin.shippingRules.form.errors.weightMinMin')),
    })
    .refine((data) => data.weightMax >= data.weightMin, {
      message: t('pricing.admin.shippingRules.form.errors.weightMaxBelowMin'),
      path: ['weightMax'],
    })
}

export type ShippingRuleFormValues = z.infer<ReturnType<typeof createShippingRuleFormSchema>>
