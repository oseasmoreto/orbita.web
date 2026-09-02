import { z } from 'zod'

/**
 * Espelha `CreateCategoryMarketplaceRequest`/`UpdateCategoryMarketplaceRequest`
 * (`core/api/schema.d.ts`) — `categoryId` só é exigido/editável no CREATE
 * (`AdminCategoryMarketplaceForm.vue` esconde o campo no modo `edit`,
 * mostra o título read-only) — `UpdateCategoryMarketplaceRequest` real do
 * backend nem aceita esse campo, mas o schema mantém a validação sempre
 * presente porque `reset()` (`useResourceForm`) já popula `categoryId`
 * a partir do vínculo existente em modo edit, então nunca fica vazio de
 * verdade nesse caminho.
 */
export function createCategoryMarketplaceFormSchema(t: (key: string) => string) {
  return z.object({
    categoryId: z
      .string()
      .min(1, t('pricing.admin.categoryMarketplaces.form.errors.categoryRequired')),
    commissionPercentage: z
      .number()
      .min(0, t('pricing.admin.categoryMarketplaces.form.errors.commissionPercentageMin'))
      .max(100, t('pricing.admin.categoryMarketplaces.form.errors.commissionPercentageMax')),
  })
}

export type CategoryMarketplaceFormValues = z.infer<
  ReturnType<typeof createCategoryMarketplaceFormSchema>
>
