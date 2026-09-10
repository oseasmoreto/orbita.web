import type { components } from '@/core/api/schema'

type ProductMarketplaceResource = components['schemas']['ProductMarketplaceResource']

export type ProductMarketplaceStatus = components['schemas']['ProductMarketplaceStatus']

/**
 * Status manual do vendedor (`not_sent`/`pending`/`sent`, decisão
 * 2026-09-10) — puramente informativo, sem regra de negócio conectada
 * (mesmo espírito de `tax_regime` da empresa), editável via `PATCH`
 * junto de `practicedPrice`/`categoryId`. Cor segue o mesmo padrão de
 * `ticketStatusColor` (`modules/support/types/ticket.type.ts`) — nunca
 * construir a chave de i18n com template literal
 * (`` `pricing.productMarketplaceStatus.${status}` ``): a API é
 * snake_case, o catálogo pt-BR é camelCase (`notSent`), um `Record`
 * explícito evita esse descompasso.
 */
export function productMarketplaceStatusColor(
  status: ProductMarketplaceStatus,
): 'gray' | 'green' | 'yellow' {
  if (status === 'sent') {
    return 'green'
  }

  return status === 'pending' ? 'yellow' : 'gray'
}

const PRODUCT_MARKETPLACE_STATUS_LABEL_KEYS: Record<ProductMarketplaceStatus, string> = {
  not_sent: 'pricing.productMarketplaceStatus.notSent',
  pending: 'pricing.productMarketplaceStatus.pending',
  sent: 'pricing.productMarketplaceStatus.sent',
}

export function productMarketplaceStatusLabelKey(status: ProductMarketplaceStatus): string {
  return PRODUCT_MARKETPLACE_STATUS_LABEL_KEYS[status]
}

/**
 * Vínculo produto↔`USER_MARKETPLACE`. Sempre referencia `USER_MARKETPLACE`,
 * nunca `MARKETPLACE` direto — é isso que garante que só se vincula a um
 * canal já conectado. `categoryId` (nullable) — tarefa 64: nem todo
 * marketplace cobra por categoria, e vínculos antigos não têm categoria
 * nenhuma. `practicedPrice` (nullable, tarefa 76), `categoryId` e
 * `status` (2026-09-10) são os 3 campos mutáveis via `PATCH` —
 * `categoryId` virou mutável em 2026-09-10, junto com a remoção do
 * `POST`/`DELETE` de "vincular" (backend passou a criar o vínculo
 * automaticamente: todo produto já nasce vinculado a toda conexão
 * ativa, então "excluir e recriar pra trocar categoria" deixou de fazer
 * sentido). Categoria só pode ser TROCADA por esse `PATCH`, não LIMPA de
 * volta pra `null` — decisão do próprio backend (categoria não entra em
 * cálculo de precificação hoje). `status` é o oposto: sempre um dos 3
 * valores do enum, nunca `null` — default `not_sent` em todo vínculo
 * (inclusive os automáticos).
 */
export interface ProductMarketplace {
  categoryId: ProductMarketplaceResource['category_id']
  createdAt: ProductMarketplaceResource['created_at']
  id: ProductMarketplaceResource['id']
  practicedPrice: ProductMarketplaceResource['practiced_price']
  productId: ProductMarketplaceResource['product_id']
  status: ProductMarketplaceStatus
  userMarketplaceId: ProductMarketplaceResource['user_marketplace_id']
}

export function toProductMarketplace(resource: ProductMarketplaceResource): ProductMarketplace {
  return {
    categoryId: resource.category_id,
    createdAt: resource.created_at,
    id: resource.id,
    practicedPrice: resource.practiced_price,
    productId: resource.product_id,
    status: resource.status,
    userMarketplaceId: resource.user_marketplace_id,
  }
}
