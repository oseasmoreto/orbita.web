import type { components } from '@/core/api/schema'

type ShippingRuleResource = components['schemas']['ShippingRuleResource']

/**
 * Faixa de frete calculado de um `MARKETPLACE`, por PESO — mirror de
 * `PricingRule` (`docs/api/planejamento-shein.md` §3), sempre aninhada
 * (nunca uma listagem própria). `weightMin`/`weightMax` em kg,
 * `fixedFee` em R$, sem percentual (diferente de `PricingRule`, que tem
 * `percentage`). Só entra no cálculo pra marketplace com
 * `MARKETPLACE.requiresWeightAndDimensions=true` — Shopee/TikTok nunca
 * têm linha aqui, `calculatedFreight` sempre "0.00" pra eles.
 */
export interface ShippingRule {
  createdAt: ShippingRuleResource['created_at']
  fixedFee: ShippingRuleResource['fixed_fee']
  id: ShippingRuleResource['id']
  marketplaceId: ShippingRuleResource['marketplace_id']
  order: ShippingRuleResource['order']
  weightMax: ShippingRuleResource['weight_max']
  weightMin: ShippingRuleResource['weight_min']
}

export function toShippingRule(resource: ShippingRuleResource): ShippingRule {
  return {
    createdAt: resource.created_at,
    fixedFee: resource.fixed_fee,
    id: resource.id,
    marketplaceId: resource.marketplace_id,
    order: resource.order,
    weightMax: resource.weight_max,
    weightMin: resource.weight_min,
  }
}
