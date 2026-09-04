import type { components } from '@/core/api/schema'

type UserMarketplaceResource = components['schemas']['UserMarketplaceResource']

/**
 * A "conta/loja" do usuário num `MARKETPLACE` — nunca guarda credencial
 * de API (`docs/negocio/contexto-plataforma-precificacao.md` seção 2.1,
 * ponto já resolvido). `marketplaceId` só referencia o marketplace — o
 * NOME dele não vem embutido aqui (`UserMarketplaceResource` não expõe
 * relação), quem exibe o nome cruza com a lista de `Marketplace` já
 * carregada (`listMarketplaces()`).
 *
 * `adsPercentage`/`campaignDiscountPercentage`/`affiliatePercentage`
 * (tarefa 65, 2026-09-02) — percentuais informativos por canal
 * (investimento em ads, desconto de campanha, comissão de afiliado);
 * `ads`/`affiliate` entraram no cálculo de precificação em 2026-09-03,
 * `campaignDiscountPercentage` continua só alimentando o preço de
 * anúncio (`suggestedCampaignPrice`/`practicedCampaignPrice`), nunca a
 * soma do lucro (ver `PricingBreakdown`,
 * `productMarketplacePricing.type.ts`).
 *
 * `couponValue` (2026-09-04) — valor FIXO em R$ (não percentual, ao
 * contrário dos 3 campos acima), cupom/subsídio fixo aplicado nesse
 * canal. Já entra no breakdown de precificação
 * (`PricingBreakdown.coupon`) desde que o backend adicionou o campo.
 */
export interface UserMarketplace {
  active: UserMarketplaceResource['active']
  adsPercentage: UserMarketplaceResource['ads_percentage']
  affiliatePercentage: UserMarketplaceResource['affiliate_percentage']
  campaignDiscountPercentage: UserMarketplaceResource['campaign_discount_percentage']
  couponValue: UserMarketplaceResource['coupon_value']
  createdAt: UserMarketplaceResource['created_at']
  id: UserMarketplaceResource['id']
  marketplaceId: UserMarketplaceResource['marketplace_id']
  storeName: UserMarketplaceResource['store_name']
}

export function toUserMarketplace(resource: UserMarketplaceResource): UserMarketplace {
  return {
    active: resource.active,
    adsPercentage: resource.ads_percentage,
    affiliatePercentage: resource.affiliate_percentage,
    campaignDiscountPercentage: resource.campaign_discount_percentage,
    couponValue: resource.coupon_value,
    createdAt: resource.created_at,
    id: resource.id,
    marketplaceId: resource.marketplace_id,
    storeName: resource.store_name,
  }
}
