import type { components } from '@/core/api/schema'

type ProductResource = components['schemas']['ProductResource']

/**
 * Tipo de domínio, em cima do `ProductResource` gerado (seção 6.1 de
 * `docs/infra/convencoes-frontend-infra.md`) — mesmos campos, chave
 * camelCase (mesmo padrão de `AuthUser`, `core/store/types/auth.type.ts`).
 * Preço/margem continuam `string` (não convertidos pra `number` aqui) —
 * a API já devolve decimal como string (`fundamentos-api.md` §4) e é
 * assim que `formatMoney`/`formatPercent`
 * (`shared/services/formatNumber.ts`) esperam receber.
 *
 * **`operationalCost` renomeado pra `shippingCost` em 2026-09-08**
 * (mudança de contrato do backend, pedido direto do usuário) —
 * `PRODUCT.operational_cost` virou `PRODUCT.shipping_cost` ("Custos de
 * envio"), mesmo dado/comportamento, só o nome mudou. Necessário porque
 * `USER_MARKETPLACE.operational_cost_percentage` (novo, ver
 * `userMarketplace.type.ts`) criou um conceito DIFERENTE também chamado
 * "custo operacional" (percentual, não fixo em R$) — o nome antigo virou
 * colisão. **Cuidado ao ler o breakdown de precificação**
 * (`productMarketplacePricing.type.ts`): a chave
 * `pricing.*_breakdown.operationalCost` NÃO é mais este campo — passou a
 * significar o NOVO valor calculado a partir da conexão. O valor deste
 * campo (o custo fixo do PRODUTO) agora aparece em
 * `pricing.*_breakdown.shippingCost`.
 */
export interface Product {
  costPrice: ProductResource['cost_price']
  createdAt: ProductResource['created_at']
  ean: ProductResource['ean']
  height: ProductResource['height']
  id: ProductResource['id']
  length: ProductResource['length']
  name: ProductResource['name']
  ncm: ProductResource['ncm']
  shippingCost: ProductResource['shipping_cost']
  sku: ProductResource['sku']
  targetMargin: ProductResource['target_margin']
  weight: ProductResource['weight']
  width: ProductResource['width']
}

export function toProduct(resource: ProductResource): Product {
  return {
    costPrice: resource.cost_price,
    createdAt: resource.created_at,
    ean: resource.ean,
    height: resource.height,
    id: resource.id,
    length: resource.length,
    name: resource.name,
    ncm: resource.ncm,
    shippingCost: resource.shipping_cost,
    sku: resource.sku,
    targetMargin: resource.target_margin,
    weight: resource.weight,
    width: resource.width,
  }
}
