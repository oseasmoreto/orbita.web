import { z } from 'zod'

/**
 * Espelha `CreateMarketplaceRequest`/`UpdateMarketplaceRequest`
 * (`core/api/schema.d.ts`) — cadastro de marketplace é restrito ao admin
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 3). Fábrica,
 * não schema pronto (regra de i18n não-negociável — mensagem de
 * validação é texto de UI).
 *
 * `logoBase64` — mudança de contrato pedida pelo usuário em 2026-08-31
 * ("não podemos ficar dependendo de links externos"): o campo de
 * ENTRADA agora é a imagem em base64 (`AdminMarketplaceForm.vue` lê via
 * `FileReader`), nunca mais uma URL colada — `logo_url` continua
 * existindo, mas só do lado da RESPOSTA (`AdminMarketplace.logoUrl`,
 * sempre um link nosso, nunca externo). Sem validação de formato aqui
 * além de "string ou null" — o `accept` do `<input type="file">` já
 * restringe o tipo de arquivo antes de chegar no form.
 *
 * `websiteUrl` continua sendo link EXTERNO de verdade (site do
 * marketplace, não a logo) — `url()` nele não mudou.
 *
 * `requiresStoreDocumentType`/`individualFixedFee` (2026-09-04, pedido
 * direto do usuário) — o primeiro liga a exigência de PF/PJ no momento
 * de conectar (`ConnectMarketplaceModal.vue`), o segundo ("taxa fixa
 * para PF") é valor FIXO em R$, sem `max:100`, mesma regra de
 * `couponValue` (`userMarketplaceFormSchema.ts`) — ainda sem uso em
 * nenhum cálculo de precificação.
 */
export function createMarketplaceFormSchema(t: (key: string) => string) {
  return z.object({
    active: z.boolean(),
    comingSoon: z.boolean(),
    description: z.string().nullable(),
    individualFixedFee: z
      .number()
      .min(0, t('pricing.admin.marketplaces.form.errors.individualFixedFeeMin'))
      .nullable(),
    logoBase64: z.string().nullable(),
    name: z.string().min(1, t('pricing.admin.marketplaces.form.errors.nameRequired')),
    requiresStoreDocumentType: z.boolean(),
    tags: z.array(z.string()),
    websiteUrl: z
      .string()
      .url(t('pricing.admin.marketplaces.form.errors.websiteUrlInvalid'))
      .nullable(),
  })
}

export type MarketplaceFormValues = z.infer<ReturnType<typeof createMarketplaceFormSchema>>
