import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import {
  type AdminMarketplace,
  type Marketplace,
  toAdminMarketplace,
  toMarketplace,
} from '../types/marketplace.type'
import { type PricingRule, toPricingRule } from '../types/pricingRule.type'
import { type ProductMarketplace, toProductMarketplace } from '../types/productMarketplace.type'
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

// ---------------------------------------------------------------------------
// PRODUCT_MARKETPLACE — vínculo puro, sempre aninhado a UM produto
// próprio. Sem PATCH/update (sem `suggested_price`/`is_approximated` não
// sobra campo mutável — trocar de canal é sempre DELETE + POST de novo,
// `pricing.php`).
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
