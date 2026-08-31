import type { components } from '@/core/api/schema'

type PricingRuleResource = components['schemas']['PricingRuleResource']

/**
 * Faixa de comissão de um `MARKETPLACE` — sempre aninhada
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 2.4), nunca
 * uma listagem própria. Money/percentual continuam `string` (mesmo
 * padrão de `Product`) — a API já devolve decimal como string.
 */
export interface PricingRule {
  createdAt: PricingRuleResource['created_at']
  fixedFee: PricingRuleResource['fixed_fee']
  id: PricingRuleResource['id']
  marketplaceId: PricingRuleResource['marketplace_id']
  order: PricingRuleResource['order']
  percentage: PricingRuleResource['percentage']
  rangeMax: PricingRuleResource['range_max']
  rangeMin: PricingRuleResource['range_min']
}

export function toPricingRule(resource: PricingRuleResource): PricingRule {
  return {
    createdAt: resource.created_at,
    fixedFee: resource.fixed_fee,
    id: resource.id,
    marketplaceId: resource.marketplace_id,
    order: resource.order,
    percentage: resource.percentage,
    rangeMax: resource.range_max,
    rangeMin: resource.range_min,
  }
}
