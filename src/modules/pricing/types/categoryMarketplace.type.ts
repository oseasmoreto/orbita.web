import type { components } from '@/core/api/schema'
import { type ProductCategory, toProductCategory } from './productCategory.type'

type CategoryMarketplaceResource = components['schemas']['CategoryMarketplaceResource']

/**
 * `CATEGORY_MARKETPLACE` — vínculo `PRODUCT_CATEGORY`↔`MARKETPLACE` com a
 * comissão (%) daquela categoria naquele canal, unique `(category_id,
 * marketplace_id)`. Sempre aninhado a UM marketplace (mesmo padrão de
 * `PricingRule`), endereçado por `category_id` na URL, sem `id` próprio
 * do vínculo em rota nenhuma — `category` já vem embutido no Resource
 * (mesmo raciocínio de `AdminSubscription.plan`), evita uma 2ª chamada só
 * pro título da categoria.
 */
export interface CategoryMarketplace {
  category: ProductCategory
  categoryId: CategoryMarketplaceResource['category_id']
  commissionPercentage: CategoryMarketplaceResource['commission_percentage']
  createdAt: CategoryMarketplaceResource['created_at']
  id: CategoryMarketplaceResource['id']
  marketplaceId: CategoryMarketplaceResource['marketplace_id']
}

export function toCategoryMarketplace(resource: CategoryMarketplaceResource): CategoryMarketplace {
  return {
    category: toProductCategory(resource.category),
    categoryId: resource.category_id,
    commissionPercentage: resource.commission_percentage,
    createdAt: resource.created_at,
    id: resource.id,
    marketplaceId: resource.marketplace_id,
  }
}
