import { z } from 'zod'

/**
 * Espelha `CreateMarketplaceRequest`/`UpdateMarketplaceRequest`
 * (`core/api/schema.d.ts`) — cadastro de marketplace é restrito ao admin
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 3). Fábrica,
 * não schema pronto (regra de i18n não-negociável — mensagem de
 * validação é texto de UI).
 */
export function createMarketplaceFormSchema(t: (key: string) => string) {
  return z.object({
    active: z.boolean(),
    name: z.string().min(1, t('pricing.admin.marketplaces.form.errors.nameRequired')),
  })
}

export type MarketplaceFormValues = z.infer<ReturnType<typeof createMarketplaceFormSchema>>
