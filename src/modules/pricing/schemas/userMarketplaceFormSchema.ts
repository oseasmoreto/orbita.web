import { z } from 'zod'

/**
 * Espelha `CreateUserMarketplaceRequest`/`UpdateUserMarketplaceRequest`
 * (`core/api/schema.d.ts`). `marketplaceId` entra no schema só pra bater
 * com o shape completo de `UserMarketplaceFormValues` (`useResourceForm`
 * exige `schema: ZodType<TValues>` — o shape precisa incluir todo campo
 * de `TValues`), mas nunca é digitado pelo usuário — sempre setado pelo
 * próprio código ao abrir o modal de conectar (`ConnectMarketplaceModal.vue`),
 * por isso sem mensagem de erro própria.
 *
 * `adsPercentage`/`campaignDiscountPercentage`/`affiliatePercentage`
 * (tarefa 65) — todos opcionais/nullable, 0-100.
 *
 * `couponValue` (2026-09-04) — valor FIXO em R$, não percentual: sem
 * `max` (não faz sentido pra dinheiro, mesma regra de `practiced_price`
 * em `useUpdatePracticedPriceForm.ts`), só `min(0)`.
 */
export function createUserMarketplaceFormSchema(t: (key: string) => string) {
  const percentageField = () =>
    z
      .number()
      .min(0, t('pricing.marketplaces.connectModal.errors.percentageMin'))
      .max(100, t('pricing.marketplaces.connectModal.errors.percentageMax'))
      .nullable()

  return z.object({
    adsPercentage: percentageField(),
    affiliatePercentage: percentageField(),
    campaignDiscountPercentage: percentageField(),
    couponValue: z
      .number()
      .min(0, t('pricing.marketplaces.connectModal.errors.couponValueMin'))
      .nullable(),
    marketplaceId: z.string(),
    storeName: z.string().min(1, t('pricing.marketplaces.connectModal.errors.storeNameRequired')),
  })
}

export type UserMarketplaceFormValues = z.infer<ReturnType<typeof createUserMarketplaceFormSchema>>
