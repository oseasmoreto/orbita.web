import { z } from 'zod'

/**
 * Espelha `CreatePlanRequest`/`UpdatePlanRequest` (`core/api/schema.d.ts`)
 * — cadastro de plano é exclusivo do admin (Fase 6). Fábrica, não schema
 * pronto (regra de i18n não-negociável — mensagem de validação é texto
 * de UI).
 *
 * `isTrial`/`trialDays`/`billingCycle` têm uma regra cruzada real
 * (decisão 2026-08-31, backend): só o plano trial tem `billing_cycle:
 * 'trial'` — quando é esse o ciclo, `is_trial` precisa ser `true` e
 * `trialDays` um inteiro positivo; pra qualquer outro ciclo, os dois
 * ficam sempre `false`/`null`. Replicado aqui via `.refine()` (mesmo
 * padrão de "preço de venda ≥ preço de compra" do `productFormSchema.ts`)
 * pra pegar o erro antes do 422 do backend.
 */
export function createAdminPlanFormSchema(t: (key: string) => string) {
  return z
    .object({
      active: z.boolean(),
      billingCycle: z.enum(['monthly', 'yearly', 'trial']),
      isTrial: z.boolean(),
      maxMarketplaces: z
        .number()
        .int()
        .positive(t('billing.admin.plans.form.errors.maxMarketplacesPositive')),
      maxProducts: z
        .number()
        .int()
        .positive(t('billing.admin.plans.form.errors.maxProductsPositive')),
      name: z.string().min(1, t('billing.admin.plans.form.errors.nameRequired')),
      price: z.number().nonnegative(t('billing.admin.plans.form.errors.pricePositive')),
      trialDays: z.number().int().positive().nullable(),
    })
    .refine((data) => (data.billingCycle === 'trial') === data.isTrial, {
      message: t('billing.admin.plans.form.errors.trialCycleMismatch'),
      path: ['isTrial'],
    })
    .refine((data) => data.billingCycle !== 'trial' || data.trialDays !== null, {
      message: t('billing.admin.plans.form.errors.trialDaysRequired'),
      path: ['trialDays'],
    })
}

export type AdminPlanFormValues = z.infer<ReturnType<typeof createAdminPlanFormSchema>>
