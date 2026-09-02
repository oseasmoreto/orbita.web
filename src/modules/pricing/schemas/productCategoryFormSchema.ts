import { z } from 'zod'

/**
 * Espelha `CreateProductCategoryRequest`/`UpdateProductCategoryRequest`
 * (`core/api/schema.d.ts`) — cadastro de categoria é restrito ao admin,
 * mesmo raciocínio de `marketplaceFormSchema.ts`. Sem `parent_id`/
 * hierarquia (decisão do backend, revertida na mesma rodada de revisão).
 */
export function createProductCategoryFormSchema(t: (key: string) => string) {
  return z.object({
    active: z.boolean(),
    title: z.string().min(1, t('pricing.admin.productCategories.form.errors.titleRequired')),
  })
}

export type ProductCategoryFormValues = z.infer<ReturnType<typeof createProductCategoryFormSchema>>
