import { z } from 'zod'

/**
 * Espelha `CreateProductLaunchRequest`/`UpdateProductLaunchRequest`
 * (`core/api/schema.d.ts`) — mesmos campos, mesma obrigatoriedade
 * (`purchase_price`: `numeric|min:0`, aceita zero; `quantity`:
 * `integer|min:1`; `date`: `required|date`). Fábrica, não schema pronto —
 * mesma regra de i18n não-negociável já aplicada em `productFormSchema.ts`.
 */
export function createProductLaunchFormSchema(t: (key: string) => string) {
  return z.object({
    date: z.string().min(1, t('catalog.products.launches.form.errors.dateRequired')),
    purchasePrice: z.number().min(0, t('catalog.products.launches.form.errors.purchasePriceMin')),
    quantity: z
      .number()
      .int(t('catalog.products.launches.form.errors.quantityInteger'))
      .min(1, t('catalog.products.launches.form.errors.quantityMin')),
  })
}

export type ProductLaunchFormValues = z.infer<ReturnType<typeof createProductLaunchFormSchema>>
