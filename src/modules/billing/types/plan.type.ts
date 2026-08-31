import type { components } from '@/core/api/schema'

type PlanResource = components['schemas']['PlanResource']

export type BillingCycle = components['schemas']['BillingCycle']

/**
 * Tipo de domínio, em cima do `PlanResource` gerado (seção 6.1 de
 * `docs/infra/convencoes-frontend-infra.md`) — mesmo padrão de `Product`
 * (`modules/catalog/types/product.type.ts`). `price` continua `string`
 * (decimal do backend, `fundamentos-api.md` §4) — é assim que
 * `formatMoney` (`shared/services/formatNumber.ts`) espera receber.
 */
export interface Plan {
  billingCycle: BillingCycle
  id: PlanResource['id']
  maxMarketplaces: PlanResource['max_marketplaces']
  maxProducts: PlanResource['max_products']
  name: PlanResource['name']
  price: PlanResource['price']
}

export function toPlan(resource: PlanResource): Plan {
  return {
    billingCycle: resource.billing_cycle,
    id: resource.id,
    maxMarketplaces: resource.max_marketplaces,
    maxProducts: resource.max_products,
    name: resource.name,
    price: resource.price,
  }
}
