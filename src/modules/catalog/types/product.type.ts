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
  operationalCost: ProductResource['operational_cost']
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
    operationalCost: resource.operational_cost,
    sku: resource.sku,
    targetMargin: resource.target_margin,
    weight: resource.weight,
    width: resource.width,
  }
}
