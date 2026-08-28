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
  createdAt: ProductResource['created_at']
  ean: ProductResource['ean']
  fullSalePrice: ProductResource['full_sale_price']
  height: ProductResource['height']
  id: ProductResource['id']
  length: ProductResource['length']
  name: ProductResource['name']
  ncm: ProductResource['ncm']
  purchasePrice: ProductResource['purchase_price']
  sku: ProductResource['sku']
  targetMargin: ProductResource['target_margin']
  weight: ProductResource['weight']
  width: ProductResource['width']
}

export function toProduct(resource: ProductResource): Product {
  return {
    createdAt: resource.created_at,
    ean: resource.ean,
    fullSalePrice: resource.full_sale_price,
    height: resource.height,
    id: resource.id,
    length: resource.length,
    name: resource.name,
    ncm: resource.ncm,
    purchasePrice: resource.purchase_price,
    sku: resource.sku,
    targetMargin: resource.target_margin,
    weight: resource.weight,
    width: resource.width,
  }
}
