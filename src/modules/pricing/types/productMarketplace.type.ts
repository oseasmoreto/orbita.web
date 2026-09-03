import type { components } from '@/core/api/schema'

type ProductMarketplaceResource = components['schemas']['ProductMarketplaceResource']

/**
 * Vínculo produto↔`USER_MARKETPLACE`. Sempre referencia `USER_MARKETPLACE`,
 * nunca `MARKETPLACE` direto — é isso que garante que só se vincula a um
 * canal já conectado. `categoryId` (nullable) — tarefa 64: nem todo
 * marketplace cobra por categoria, e vínculos antigos não têm categoria
 * nenhuma. Sem `PATCH` pra trocar categoria/marketplace — trocar é sempre
 * `DELETE`+`POST` de novo. `practicedPrice` (nullable, tarefa 76) é o
 * ÚNICO campo mutável via `PATCH` — achado real, 2026-09-03: o tipo de
 * domínio nunca tinha sido atualizado quando o backend adicionou o campo
 * ao `ProductMarketplaceResource` (só `ProductMarketplacePricingResource`,
 * o resource NOVO da listagem calculada, tinha ganhado o campo aqui do
 * lado do frontend) — `ProductMarketplacesView.vue` (tabela por PRODUTO,
 * não por conexão) ficou sem mostrar/editar o preço praticado por causa
 * disso, mesmo o backend já expondo o dado desde sempre.
 */
export interface ProductMarketplace {
  categoryId: ProductMarketplaceResource['category_id']
  createdAt: ProductMarketplaceResource['created_at']
  id: ProductMarketplaceResource['id']
  practicedPrice: ProductMarketplaceResource['practiced_price']
  productId: ProductMarketplaceResource['product_id']
  userMarketplaceId: ProductMarketplaceResource['user_marketplace_id']
}

export function toProductMarketplace(resource: ProductMarketplaceResource): ProductMarketplace {
  return {
    categoryId: resource.category_id,
    createdAt: resource.created_at,
    id: resource.id,
    practicedPrice: resource.practiced_price,
    productId: resource.product_id,
    userMarketplaceId: resource.user_marketplace_id,
  }
}
