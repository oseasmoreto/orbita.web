import type { components } from '@/core/api/schema'

type ProductMarketplaceResource = components['schemas']['ProductMarketplaceResource']

/**
 * Vínculo produto↔`USER_MARKETPLACE`. Sempre referencia `USER_MARKETPLACE`,
 * nunca `MARKETPLACE` direto — é isso que garante que só se vincula a um
 * canal já conectado. `categoryId` (nullable) — tarefa 64: nem todo
 * marketplace cobra por categoria, e vínculos antigos não têm categoria
 * nenhuma. `practicedPrice` (nullable, tarefa 76) e `categoryId` são os
 * 2 campos mutáveis via `PATCH` — `categoryId` virou mutável em
 * 2026-09-10, junto com a remoção do `POST`/`DELETE` de "vincular"
 * (backend passou a criar o vínculo automaticamente: todo produto já
 * nasce vinculado a toda conexão ativa, então "excluir e recriar pra
 * trocar categoria" deixou de fazer sentido). Categoria só pode ser
 * TROCADA por esse `PATCH`, não LIMPA de volta pra `null` — decisão do
 * próprio backend (categoria não entra em cálculo de precificação hoje).
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
