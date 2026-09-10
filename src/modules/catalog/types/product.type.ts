import type { components } from '@/core/api/schema'

type ProductResource = components['schemas']['ProductResource']
type ProductResourceMarketplace = NonNullable<ProductResource['marketplaces']>[number]

/**
 * Status manual do vendedor (`not_sent`/`pending`/`sent`) — mesmo enum
 * de `PRODUCT_MARKETPLACE.status` (`modules/pricing/types/productMarketplace.type.ts`),
 * derivado direto do schema gerado aqui (não importado de lá) porque um
 * módulo nunca importa de outro diretamente
 * (`docs/infra/convencoes-frontend-infra.md` seção 2) — duplicar este
 * alias de 1 linha é mais barato que promover o tipo inteiro pra
 * `shared/` só por causa dele.
 */
export type ProductMarketplaceStatus = ProductResourceMarketplace['status']

/**
 * Cor/chave de tradução do `StatusDot` — duplicado de
 * `productMarketplaceStatusColor`/`productMarketplaceStatusLabelKey`
 * (`modules/pricing/types/productMarketplace.type.ts`), mesmo motivo do
 * `ProductMarketplaceStatus` acima (módulo nunca importa de outro). As
 * CHAVES de tradução apontam pro mesmo namespace `pricing.productMarketplaceStatus.*`
 * do catálogo pt-BR — só a função-mapa é duplicada, o texto/i18n
 * continua único.
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
 * Resumo de UM vínculo produto↔marketplace, achatado pro que as colunas
 * por marketplace da listagem precisam (pedido direto do usuário,
 * 2026-09-10 — "GET /products passou a trazer os vínculos, cada logo
 * de mktplace tem que ser uma coluna na tabela com o status"). `id` aqui
 * é o `PRODUCT_MARKETPLACE.id` (o vínculo), não o `MARKETPLACE.id` —
 * `marketplaceId` (não este `id`) é quem identifica QUAL coluna a linha
 * preenche, ver `buildProductMarketplaceColumns` em `ProductsView.vue`.
 */
export interface ProductMarketplaceSummary {
  id: ProductResourceMarketplace['id']
  marketplaceId: ProductResourceMarketplace['marketplace_id']
  marketplaceLogoUrl: ProductResourceMarketplace['marketplace_logo_url']
  marketplaceName: ProductResourceMarketplace['marketplace_name']
  status: ProductMarketplaceStatus
}

function toProductMarketplaceSummary(
  resource: ProductResourceMarketplace,
): ProductMarketplaceSummary {
  return {
    id: resource.id,
    marketplaceId: resource.marketplace_id,
    marketplaceLogoUrl: resource.marketplace_logo_url,
    marketplaceName: resource.marketplace_name,
    status: resource.status,
  }
}

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
 *
 * `marketplaces` (2026-09-10) — só populado quando o endpoint que gerou
 * este `Product` faz eager load do vínculo (`ListProductsAction`,
 * backend); nunca `undefined` aqui do lado do front — vira `[]` quando o
 * backend não manda a chave, pra `ProductsView.vue` nunca precisar de um
 * `?? []` espalhado pelo template. `ProductsView.vue` transforma isso em
 * UMA COLUNA POR MARKETPLACE (não uma coluna só com vários logos) —
 * ver `buildProductMarketplaceColumns` lá.
 */
export interface Product {
  costPrice: ProductResource['cost_price']
  createdAt: ProductResource['created_at']
  ean: ProductResource['ean']
  height: ProductResource['height']
  id: ProductResource['id']
  length: ProductResource['length']
  marketplaces: ProductMarketplaceSummary[]
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
    marketplaces: (resource.marketplaces ?? []).map(toProductMarketplaceSummary),
    name: resource.name,
    ncm: resource.ncm,
    shippingCost: resource.shipping_cost,
    sku: resource.sku,
    targetMargin: resource.target_margin,
    weight: resource.weight,
    width: resource.width,
  }
}
