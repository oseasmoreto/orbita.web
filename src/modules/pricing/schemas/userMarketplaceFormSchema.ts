import { z } from 'zod'

/**
 * Espelha `CreateUserMarketplaceRequest`/`UpdateUserMarketplaceRequest`
 * (`core/api/schema.d.ts`). `marketplaceId` entra no schema só pra bater
 * com o shape completo de `UserMarketplaceFormValues` (`useResourceForm`
 * exige `schema: ZodType<TValues>` — o shape precisa incluir todo campo
 * de `TValues`), mas nunca é digitado pelo usuário — sempre setado pelo
 * próprio código ao abrir o modal de conectar (`ConnectMarketplaceModal.vue`),
 * por isso sem mensagem de erro própria.
 */
export function createUserMarketplaceFormSchema(t: (key: string) => string) {
  return z.object({
    marketplaceId: z.string(),
    storeName: z.string().min(1, t('pricing.marketplaces.connectModal.errors.storeNameRequired')),
  })
}

export type UserMarketplaceFormValues = z.infer<ReturnType<typeof createUserMarketplaceFormSchema>>
