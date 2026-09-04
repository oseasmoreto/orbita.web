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
 *
 * `storeDocumentType` (2026-09-04) — `''` (não escolhido) ou
 * `'individual'`/`'company'`, nunca `null` no MODEL do form (mesmo
 * raciocínio de `categoryId` em `ProductMarketplacesView.vue`:
 * `Select.vue` só trabalha com `string`, string vazia é o "não
 * escolhido" no formulário, convertida pra `null` só na borda do
 * payload — `useUserMarketplaceForm.ts`). Obrigatório só quando o
 * MARKETPLACE da conexão exige (`Marketplace.requiresStoreDocumentType`)
 * — informação que não mora nos campos do próprio form, por isso entra
 * como parâmetro extra da fábrica (`isStoreDocumentTypeRequired`, uma
 * função — não um boolean fixo — porque uma ÚNICA instância deste
 * schema/composable é reaproveitada pro grid INTEIRO de cards, cada
 * abertura do modal pode ser um marketplace DIFERENTE; a função lê o
 * valor mais recente a cada `.safeParse()`, nunca fica presa ao
 * marketplace de quando o schema foi criado).
 */
export function createUserMarketplaceFormSchema(
  t: (key: string) => string,
  isStoreDocumentTypeRequired: () => boolean,
) {
  const percentageField = () =>
    z
      .number()
      .min(0, t('pricing.marketplaces.connectModal.errors.percentageMin'))
      .max(100, t('pricing.marketplaces.connectModal.errors.percentageMax'))
      .nullable()

  return z
    .object({
      adsPercentage: percentageField(),
      affiliatePercentage: percentageField(),
      campaignDiscountPercentage: percentageField(),
      couponValue: z
        .number()
        .min(0, t('pricing.marketplaces.connectModal.errors.couponValueMin'))
        .nullable(),
      marketplaceId: z.string(),
      storeDocumentType: z.string(),
      storeName: z.string().min(1, t('pricing.marketplaces.connectModal.errors.storeNameRequired')),
    })
    .superRefine((data, ctx) => {
      if (isStoreDocumentTypeRequired() && data.storeDocumentType === '') {
        ctx.addIssue({
          code: 'custom',
          message: t('pricing.marketplaces.connectModal.errors.storeDocumentTypeRequired'),
          path: ['storeDocumentType'],
        })
      }
    })
}

export type UserMarketplaceFormValues = z.infer<ReturnType<typeof createUserMarketplaceFormSchema>>
