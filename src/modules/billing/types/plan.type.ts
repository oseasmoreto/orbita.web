import type { components } from '@/core/api/schema'

type PlanResource = components['schemas']['PlanResource']

export type BillingCycle = components['schemas']['BillingCycle']

/**
 * Tipo de domínio, em cima do `PlanResource` gerado (seção 6.1 de
 * `docs/infra/convencoes-frontend-infra.md`) — mesmo padrão de `Product`
 * (`modules/catalog/types/product.type.ts`). `price` continua `string`
 * (decimal do backend, `fundamentos-api.md` §4) — é assim que
 * `formatMoney` (`shared/services/formatNumber.ts`) espera receber.
 *
 * `isTrial`/`trialDays` (decisão de negócio 2026-08-31, contrato de API
 * confirmado em 2026-09-01 — `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 6): `billingCycle` já distingue um plano trial (`'trial'`, nem
 * `'monthly'` nem `'yearly'`), mas os 2 campos extras são o que
 * `PlanCard.vue` usa pra decidir o texto certo (CTA "Testar grátis",
 * descrição "N dias grátis") sem precisar comparar string solta em mais
 * de um lugar.
 */
export interface Plan {
  billingCycle: BillingCycle
  id: PlanResource['id']
  isTrial: PlanResource['is_trial']
  maxMarketplaces: PlanResource['max_marketplaces']
  maxProducts: PlanResource['max_products']
  name: PlanResource['name']
  price: PlanResource['price']
  trialDays: PlanResource['trial_days']
}

export function toPlan(resource: PlanResource): Plan {
  return {
    billingCycle: resource.billing_cycle,
    id: resource.id,
    isTrial: resource.is_trial,
    maxMarketplaces: resource.max_marketplaces,
    maxProducts: resource.max_products,
    name: resource.name,
    price: resource.price,
    trialDays: resource.trial_days,
  }
}
