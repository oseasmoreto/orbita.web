import type { components } from '@/core/api/schema'

type ProductCategoryResource = components['schemas']['ProductCategoryResource']

/**
 * `PRODUCT_CATEGORY` (Bounded Context Pricing, tarefa 64 de
 * `docs/api/ordem-de-implementacao.md` no repo `backend`) — categoria
 * simples, sem hierarquia/subcategoria (decisão revertida de um desenho
 * inicial com `parent_id`, a pedido do usuário). Cadastro é exclusivo do
 * admin (`/admin/product-categories`), mesmo raciocínio de `MARKETPLACE`.
 * Comissão por categoria por marketplace mora em `CategoryMarketplace`
 * (`categoryMarketplace.type.ts`), nunca aqui.
 */
export interface ProductCategory {
  active: ProductCategoryResource['active']
  createdAt: ProductCategoryResource['created_at']
  id: ProductCategoryResource['id']
  title: ProductCategoryResource['title']
}

export function toProductCategory(resource: ProductCategoryResource): ProductCategory {
  return {
    active: resource.active,
    createdAt: resource.created_at,
    id: resource.id,
    title: resource.title,
  }
}
