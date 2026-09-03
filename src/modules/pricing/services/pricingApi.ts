import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type CategoryMarketplace, toCategoryMarketplace } from '../types/categoryMarketplace.type'
import {
  type AdminMarketplace,
  type Marketplace,
  toAdminMarketplace,
  toMarketplace,
} from '../types/marketplace.type'
import { type PricingRule, toPricingRule } from '../types/pricingRule.type'
import { type ProductCategory, toProductCategory } from '../types/productCategory.type'
import { type ProductMarketplace, toProductMarketplace } from '../types/productMarketplace.type'
import {
  type ProductMarketplacePricing,
  toProductMarketplacePricing,
} from '../types/productMarketplacePricing.type'
import { toUserMarketplace, type UserMarketplace } from '../types/userMarketplace.type'

type MarketplaceResource = components['schemas']['MarketplaceResource']
type AdminMarketplaceResource = components['schemas']['AdminMarketplaceResource']
type CreateMarketplaceRequest = components['schemas']['CreateMarketplaceRequest']
type UpdateMarketplaceRequest = components['schemas']['UpdateMarketplaceRequest']
type PricingRuleResource = components['schemas']['PricingRuleResource']
type CreatePricingRuleRequest = components['schemas']['CreatePricingRuleRequest']
type UpdatePricingRuleRequest = components['schemas']['UpdatePricingRuleRequest']
type UserMarketplaceResource = components['schemas']['UserMarketplaceResource']
type CreateUserMarketplaceRequest = components['schemas']['CreateUserMarketplaceRequest']
type UpdateUserMarketplaceRequest = components['schemas']['UpdateUserMarketplaceRequest']
type ProductMarketplaceResource = components['schemas']['ProductMarketplaceResource']
type CreateProductMarketplaceRequest = components['schemas']['CreateProductMarketplaceRequest']
type UpdateProductMarketplaceRequest = components['schemas']['UpdateProductMarketplaceRequest']
type ProductMarketplacePricingResource = components['schemas']['ProductMarketplacePricingResource']
type ProductCategoryResource = components['schemas']['ProductCategoryResource']
type CreateProductCategoryRequest = components['schemas']['CreateProductCategoryRequest']
type UpdateProductCategoryRequest = components['schemas']['UpdateProductCategoryRequest']
type CategoryMarketplaceResource = components['schemas']['CategoryMarketplaceResource']
type CreateCategoryMarketplaceRequest = components['schemas']['CreateCategoryMarketplaceRequest']
type UpdateCategoryMarketplaceRequest = components['schemas']['UpdateCategoryMarketplaceRequest']

interface Envelope<T> {
  items: T[]
  meta: { current_page: number; per_page: number; total: number }
}

// ---------------------------------------------------------------------------
// MARKETPLACE — leitura pública (`GET /marketplaces`, qualquer usuário
// autenticado, já filtrado pra `active: true` no backend) + CRUD completo
// admin (`/admin/marketplaces`, restrito a `admin_master`, cadastro de
// marketplace é exclusivo do admin — contexto-plataforma-precificacao.md
// seção 3).
// ---------------------------------------------------------------------------

export interface ListMarketplacesParams {
  page?: number
  perPage?: number
  sort?: string
}

export async function listMarketplaces(
  params: ListMarketplacesParams = {},
): Promise<Paginated<Marketplace>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<MarketplaceResource>>>(
    '/marketplaces',
    { params: { page: params.page, per_page: params.perPage, sort: params.sort } },
  )

  return { items: data.data.items.map(toMarketplace), meta: data.data.meta }
}

export interface ListAdminMarketplacesParams {
  active?: boolean
  page?: number
  perPage?: number
  sort?: string
}

export async function listAdminMarketplaces(
  params: ListAdminMarketplacesParams = {},
): Promise<Paginated<AdminMarketplace>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<AdminMarketplaceResource>>>(
    '/admin/marketplaces',
    {
      params: {
        'filter[active]': params.active,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toAdminMarketplace), meta: data.data.meta }
}

export async function createAdminMarketplace(
  payload: CreateMarketplaceRequest,
): Promise<AdminMarketplace> {
  const { data } = await apiClient.post<ApiResponse<AdminMarketplaceResource>>(
    '/admin/marketplaces',
    payload,
  )
  return toAdminMarketplace(data.data)
}

export async function updateAdminMarketplace(
  id: string,
  payload: UpdateMarketplaceRequest,
): Promise<AdminMarketplace> {
  const { data } = await apiClient.patch<ApiResponse<AdminMarketplaceResource>>(
    `/admin/marketplaces/${id}`,
    payload,
  )
  return toAdminMarketplace(data.data)
}

export async function deleteAdminMarketplace(id: string): Promise<void> {
  await apiClient.delete(`/admin/marketplaces/${id}`)
}

// ---------------------------------------------------------------------------
// PRICING_RULE — leitura sempre pelo endpoint COMPARTILHADO
// (`GET /marketplaces/{id}/pricing-rules`, `auth:sanctum` só, sem
// middleware `admin` — transparência de faixa/taxa pra qualquer usuário
// decidir conectar, `pricing.php`), escrita só pelo admin
// (`/admin/marketplaces/{id}/pricing-rules`). Sempre aninhada a UM
// marketplace, nunca listagem própria — mesmo padrão de `PRODUCT_LAUNCH`.
// ---------------------------------------------------------------------------

export interface ListPricingRulesParams {
  page?: number
  perPage?: number
  sort?: string
}

export async function listPricingRules(
  marketplaceId: string,
  params: ListPricingRulesParams = {},
): Promise<Paginated<PricingRule>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<PricingRuleResource>>>(
    `/marketplaces/${marketplaceId}/pricing-rules`,
    { params: { page: params.page, per_page: params.perPage, sort: params.sort } },
  )

  return { items: data.data.items.map(toPricingRule), meta: data.data.meta }
}

export async function createAdminPricingRule(
  marketplaceId: string,
  payload: CreatePricingRuleRequest,
): Promise<PricingRule> {
  const { data } = await apiClient.post<ApiResponse<PricingRuleResource>>(
    `/admin/marketplaces/${marketplaceId}/pricing-rules`,
    payload,
  )
  return toPricingRule(data.data)
}

export async function updateAdminPricingRule(
  marketplaceId: string,
  pricingRuleId: string,
  payload: UpdatePricingRuleRequest,
): Promise<PricingRule> {
  const { data } = await apiClient.patch<ApiResponse<PricingRuleResource>>(
    `/admin/marketplaces/${marketplaceId}/pricing-rules/${pricingRuleId}`,
    payload,
  )
  return toPricingRule(data.data)
}

export async function deleteAdminPricingRule(
  marketplaceId: string,
  pricingRuleId: string,
): Promise<void> {
  await apiClient.delete(`/admin/marketplaces/${marketplaceId}/pricing-rules/${pricingRuleId}`)
}

// ---------------------------------------------------------------------------
// USER_MARKETPLACE — sempre do próprio usuário (`UserOwnedScope` no
// backend), protegido por `subscription.active` (conectar marketplace só
// faz sentido depois de assinar).
// ---------------------------------------------------------------------------

export interface ListUserMarketplacesParams {
  active?: boolean
  page?: number
  perPage?: number
  sort?: string
}

export async function listUserMarketplaces(
  params: ListUserMarketplacesParams = {},
): Promise<Paginated<UserMarketplace>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<UserMarketplaceResource>>>(
    '/user-marketplaces',
    {
      params: {
        'filter[active]': params.active,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toUserMarketplace), meta: data.data.meta }
}

export async function createUserMarketplace(
  payload: CreateUserMarketplaceRequest,
): Promise<UserMarketplace> {
  const { data } = await apiClient.post<ApiResponse<UserMarketplaceResource>>(
    '/user-marketplaces',
    payload,
  )
  return toUserMarketplace(data.data)
}

export async function updateUserMarketplace(
  id: string,
  payload: UpdateUserMarketplaceRequest,
): Promise<UserMarketplace> {
  const { data } = await apiClient.patch<ApiResponse<UserMarketplaceResource>>(
    `/user-marketplaces/${id}`,
    payload,
  )
  return toUserMarketplace(data.data)
}

export async function deleteUserMarketplace(id: string): Promise<void> {
  await apiClient.delete(`/user-marketplaces/${id}`)
}

/**
 * Leitura mínima do nome da loja, só pro cabeçalho de
 * `ProductMarketplacePricingView.vue` — mesmo critério de
 * `getProductName` (decorativo, sem justificar buscar/mapear o
 * `UserMarketplace` inteiro de novo já que a listagem principal não
 * precisa dele).
 */
export async function getUserMarketplaceStoreName(userMarketplaceId: string): Promise<string> {
  const { data } = await apiClient.get<ApiResponse<{ store_name: string }>>(
    `/user-marketplaces/${userMarketplaceId}`,
  )
  return data.data.store_name
}

// ---------------------------------------------------------------------------
// PRODUCT_MARKETPLACE — vínculo puro, sempre aninhado a UM produto
// próprio. `categoryId` continua imutável (trocar de canal é sempre
// DELETE + POST de novo) — só `practicedPrice` é mutável via PATCH
// (tarefa 76, motor de precificação real), ver `updateProductMarketplacePracticedPrice`
// logo abaixo.
// ---------------------------------------------------------------------------

export interface ListProductMarketplacesParams {
  page?: number
  perPage?: number
  sort?: string
}

export async function listProductMarketplaces(
  productId: string,
  params: ListProductMarketplacesParams = {},
): Promise<Paginated<ProductMarketplace>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<ProductMarketplaceResource>>>(
    `/products/${productId}/marketplaces`,
    { params: { page: params.page, per_page: params.perPage, sort: params.sort } },
  )

  return { items: data.data.items.map(toProductMarketplace), meta: data.data.meta }
}

export async function createProductMarketplace(
  productId: string,
  payload: CreateProductMarketplaceRequest,
): Promise<ProductMarketplace> {
  const { data } = await apiClient.post<ApiResponse<ProductMarketplaceResource>>(
    `/products/${productId}/marketplaces`,
    payload,
  )
  return toProductMarketplace(data.data)
}

export async function deleteProductMarketplace(
  productId: string,
  productMarketplaceId: string,
): Promise<void> {
  await apiClient.delete(`/products/${productId}/marketplaces/${productMarketplaceId}`)
}

/**
 * `practicedPrice: null` limpa o preço já definido — o backend exige a
 * CHAVE sempre presente no corpo (`present`, não `sometimes`/`required`),
 * nunca omitida (`UpdateProductMarketplaceRequest`, backend). Vem de
 * `useNumberFieldModel` (string vazia → `null`) no consumidor, convertido
 * pra `number` aqui só na borda da chamada de API — mesmo padrão de
 * `useProductForm.ts` pros campos decimais opcionais.
 */
export async function updateProductMarketplacePracticedPrice(
  productId: string,
  productMarketplaceId: string,
  practicedPrice: number | null,
): Promise<ProductMarketplace> {
  const payload: UpdateProductMarketplaceRequest = { practiced_price: practicedPrice }
  const { data } = await apiClient.patch<ApiResponse<ProductMarketplaceResource>>(
    `/products/${productId}/marketplaces/${productMarketplaceId}`,
    payload,
  )
  return toProductMarketplace(data.data)
}

// ---------------------------------------------------------------------------
// Tela de precificação (tarefa 76) — dado um `USER_MARKETPLACE` (a
// conexão, ex.: a conta Shopee do usuário), lista todos os
// `PRODUCT_MARKETPLACE` vinculados a ela já com o cálculo pronto
// (`ProductMarketplacePricingCalculator`, motor real informado pela
// planilha do usuário — nunca mais o `PricingCalculator` antigo, nunca
// conectado a rota nenhuma). Endpoint dedicado (não
// `listProductMarketplaces` acima) — é uma leitura ENRIQUECIDA
// (cálculo), não o CRUD do vínculo em si. Sem `search` — a API só aceita
// `sort`/`per_page` (`sort` só permite `created_at`), nenhum filtro de
// texto existe ainda.
// ---------------------------------------------------------------------------

export interface ListProductMarketplacePricingParams {
  page?: number
  perPage?: number
  productName?: string
  sort?: string
}

/**
 * `revenue`/`profit`/`averageMargin` continuam `string` (convenção Money
 * da API, seção 4 de `fundamentos-api.md`) — formatados na borda
 * (`formatMoney`/`formatPercent`) igual a qualquer outro valor
 * monetário, nunca convertidos aqui. Calculados pelo backend sobre TODO
 * o conjunto filtrado da conexão (respeitando `productName` quando
 * presente), não só a página atual — preço/lucro "ativo" por produto é
 * o mesmo critério de `resolveActivePricing()` (praticado quando existe,
 * senão sugerido). `averageMargin` é ponderada (lucro÷faturamento), não
 * média simples das margens — decisão do backend, evita que um produto
 * de R$10 pese igual a um de R$10.000 no portfólio.
 */
export interface ProductMarketplacePricingTotals {
  averageMargin: string
  productCount: number
  profit: string
  revenue: string
}

export interface ProductMarketplacePricingPage extends Paginated<ProductMarketplacePricing> {
  totals: ProductMarketplacePricingTotals
}

export async function listProductMarketplacePricing(
  userMarketplaceId: string,
  params: ListProductMarketplacePricingParams = {},
): Promise<ProductMarketplacePricingPage> {
  type ResponseData = Envelope<ProductMarketplacePricingResource> & {
    meta: {
      totals: {
        average_margin: string
        product_count: number
        profit: string
        revenue: string
      }
    }
  }

  const { data } = await apiClient.get<ApiResponse<ResponseData>>(
    `/user-marketplaces/${userMarketplaceId}/products`,
    {
      params: {
        'filter[product_name]': params.productName ?? undefined,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return {
    items: data.data.items.map(toProductMarketplacePricing),
    meta: data.data.meta,
    totals: {
      averageMargin: data.data.meta.totals.average_margin,
      productCount: data.data.meta.totals.product_count,
      profit: data.data.meta.totals.profit,
      revenue: data.data.meta.totals.revenue,
    },
  }
}

/**
 * Leitura mínima do nome do produto, só pro cabeçalho/breadcrumb de
 * `ProductMarketplacesView.vue` — `PRODUCT_MARKETPLACE` é do Bounded
 * Context Pricing (mesmo `Api/Pricing/ProductMarketplaceController` do
 * backend, apesar da URL aninhada sob `/products`), então este módulo
 * nunca importa `modules/catalog/types/product.type.ts`/`catalogApi.ts`
 * (regra de fronteira, seção 2 de
 * `docs/infra/convencoes-frontend-infra.md`) — só lê o campo que
 * realmente precisa do mesmo endpoint que Catalog já consome, sem
 * duplicar o tipo `Product`/`toProduct()` inteiro.
 */
export async function getProductName(productId: string): Promise<string> {
  const { data } = await apiClient.get<ApiResponse<{ name: string }>>(`/products/${productId}`)
  return data.data.name
}

// ---------------------------------------------------------------------------
// PRODUCT_CATEGORY — CRUD admin-only (`/admin/product-categories`), tarefa
// 64. Categoria simples, sem hierarquia/subcategoria (decisão do backend).
// ---------------------------------------------------------------------------

export interface ListAdminProductCategoriesParams {
  active?: boolean
  marketplaceId?: string
  page?: number
  perPage?: number
  sort?: string
}

export async function listAdminProductCategories(
  params: ListAdminProductCategoriesParams = {},
): Promise<Paginated<ProductCategory>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<ProductCategoryResource>>>(
    '/admin/product-categories',
    {
      params: {
        'filter[active]': params.active,
        'filter[marketplace_id]': params.marketplaceId,
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return { items: data.data.items.map(toProductCategory), meta: data.data.meta }
}

export async function createAdminProductCategory(
  payload: CreateProductCategoryRequest,
): Promise<ProductCategory> {
  const { data } = await apiClient.post<ApiResponse<ProductCategoryResource>>(
    '/admin/product-categories',
    payload,
  )
  return toProductCategory(data.data)
}

export async function updateAdminProductCategory(
  id: string,
  payload: UpdateProductCategoryRequest,
): Promise<ProductCategory> {
  const { data } = await apiClient.patch<ApiResponse<ProductCategoryResource>>(
    `/admin/product-categories/${id}`,
    payload,
  )
  return toProductCategory(data.data)
}

/**
 * Recusa com `errorMessageCategoryInUse` (422) se a categoria estiver
 * referenciada em algum `PRODUCT_MARKETPLACE.category_id` — o front não
 * tenta prever isso antes, só mostra o erro que vier (mesmo critério de
 * `deleteAdminMarketplace`/`errorMessageMarketplaceHasConnections`).
 */
export async function deleteAdminProductCategory(id: string): Promise<void> {
  await apiClient.delete(`/admin/product-categories/${id}`)
}

// ---------------------------------------------------------------------------
// CATEGORY_MARKETPLACE — comissão de uma `PRODUCT_CATEGORY` num
// `MARKETPLACE` específico, unique `(category_id, marketplace_id)`.
// Sempre aninhada a UM marketplace (mesmo padrão de `PRICING_RULE`),
// endereçada por `category_id` na URL, sem id próprio do vínculo em rota
// nenhuma. Leitura via endpoint COMPARTILHADO (`GET
// /marketplaces/{id}/categories`, `auth:sanctum` só — funciona pro admin
// igual pra qualquer usuário, mesmo raciocínio de `listPricingRules`);
// escrita só pelo admin.
// ---------------------------------------------------------------------------

export interface ListMarketplaceCategoriesParams {
  page?: number
  perPage?: number
  sort?: string
}

export async function listMarketplaceCategories(
  marketplaceId: string,
  params: ListMarketplaceCategoriesParams = {},
): Promise<Paginated<CategoryMarketplace>> {
  const { data } = await apiClient.get<ApiResponse<Envelope<CategoryMarketplaceResource>>>(
    `/marketplaces/${marketplaceId}/categories`,
    { params: { page: params.page, per_page: params.perPage, sort: params.sort } },
  )

  return { items: data.data.items.map(toCategoryMarketplace), meta: data.data.meta }
}

/**
 * Recusa com `errorMessageCategoryAlreadyLinkedToMarketplace` (422) numa
 * 2ª tentativa pra mesma `(category_id, marketplace_id)` — mesmo padrão
 * de `errorMessageMarketplaceAlreadyConnected`.
 */
export async function createAdminCategoryMarketplace(
  marketplaceId: string,
  payload: CreateCategoryMarketplaceRequest,
): Promise<CategoryMarketplace> {
  const { data } = await apiClient.post<ApiResponse<CategoryMarketplaceResource>>(
    `/admin/marketplaces/${marketplaceId}/categories`,
    payload,
  )
  return toCategoryMarketplace(data.data)
}

/**
 * Só `commission_percentage` é editável — `UpdateCategoryMarketplaceRequest`
 * real do backend nem aceita `category_id` (trocar de categoria é sempre
 * excluir e vincular outra, mesmo padrão de `PRODUCT_MARKETPLACE`).
 */
export async function updateAdminCategoryMarketplace(
  marketplaceId: string,
  categoryId: string,
  payload: UpdateCategoryMarketplaceRequest,
): Promise<CategoryMarketplace> {
  const { data } = await apiClient.patch<ApiResponse<CategoryMarketplaceResource>>(
    `/admin/marketplaces/${marketplaceId}/categories/${categoryId}`,
    payload,
  )
  return toCategoryMarketplace(data.data)
}

export async function deleteAdminCategoryMarketplace(
  marketplaceId: string,
  categoryId: string,
): Promise<void> {
  await apiClient.delete(`/admin/marketplaces/${marketplaceId}/categories/${categoryId}`)
}
