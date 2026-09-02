import type { components } from '@/core/api/schema'

type ProductMarketplaceResource = components['schemas']['ProductMarketplaceResource']

/**
 * Vínculo puro produto↔`USER_MARKETPLACE` (decisão 2026-08-26, sem
 * `suggested_price`/`is_approximated` nesta rodada — ver
 * `docs/negocio/contexto-plataforma-precificacao.md` seção 2.4). Sempre
 * referencia `USER_MARKETPLACE`, nunca `MARKETPLACE` direto — é isso que
 * garante que só se vincula a um canal já conectado. `categoryId`
 * (nullable) — tarefa 64: nem todo marketplace cobra por categoria, e
 * vínculos antigos não têm categoria nenhuma. Sem `PATCH` pra trocar só a
 * categoria — trocar é sempre `DELETE`+`POST` de novo, mesmo padrão de
 * trocar de marketplace.
 */
export interface ProductMarketplace {
  categoryId: ProductMarketplaceResource['category_id']
  createdAt: ProductMarketplaceResource['created_at']
  id: ProductMarketplaceResource['id']
  productId: ProductMarketplaceResource['product_id']
  userMarketplaceId: ProductMarketplaceResource['user_marketplace_id']
}

export function toProductMarketplace(resource: ProductMarketplaceResource): ProductMarketplace {
  return {
    categoryId: resource.category_id,
    createdAt: resource.created_at,
    id: resource.id,
    productId: resource.product_id,
    userMarketplaceId: resource.user_marketplace_id,
  }
}
