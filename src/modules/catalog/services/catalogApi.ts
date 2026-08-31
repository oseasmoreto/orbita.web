import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type Product, toProduct } from '../types/product.type'
import { type ProductLaunch, toProductLaunch } from '../types/productLaunch.type'

type ProductResource = components['schemas']['ProductResource']
type CreateProductRequest = components['schemas']['CreateProductRequest']
type UpdateProductRequest = components['schemas']['UpdateProductRequest']
type ProductLaunchResource = components['schemas']['ProductLaunchResource']
type CreateProductLaunchRequest = components['schemas']['CreateProductLaunchRequest']
type UpdateProductLaunchRequest = components['schemas']['UpdateProductLaunchRequest']

interface ProductsEnvelope {
  items: ProductResource[]
  meta: { current_page: number; per_page: number; total: number }
}

interface ProductLaunchesEnvelope {
  items: ProductLaunchResource[]
  meta: { current_page: number; per_page: number; total: number }
}

export interface ListProductsParams {
  page?: number
  perPage?: number
  /** Filtro exato por SKU — `GET /products` só aceita match exato, não busca parcial (`core/api/schema.d.ts`, `product.index`). */
  sku?: string
  /** Um de `name`/`full_sale_price`/`created_at`, prefixo `-` inverte pra desc — mesma limitação da API real. */
  sort?: string
}

/**
 * Chama o endpoint real `/products` (Catalog, já implementado no
 * backend — `core/api/schema.d.ts` tem `ProductResource`/
 * `CreateProductRequest`/`UpdateProductRequest` reais, gerados do
 * OpenAPI). `useProductList.ts`/`useProductForm.ts` são os únicos
 * consumidores — nunca chamar `apiClient` direto de um componente ou
 * composable de UI (seção 4 de `docs/infra/convencoes-frontend-infra.md`).
 */
export async function listProducts(params: ListProductsParams = {}): Promise<Paginated<Product>> {
  const { data } = await apiClient.get<ApiResponse<ProductsEnvelope>>('/products', {
    params: {
      'filter[sku]': params.sku,
      page: params.page,
      per_page: params.perPage,
      sort: params.sort,
    },
  })

  return {
    items: data.data.items.map(toProduct),
    meta: data.data.meta,
  }
}

/**
 * `GET /products/{product}` (`ShowProductAction`) — usado por
 * `ProductsView.vue` pra abrir o Drawer de edição via URL direta
 * (`/products/:id/edit`, deep link/F5) quando o produto ainda não está
 * na página da listagem já carregada.
 */
export async function getProduct(id: string): Promise<Product> {
  const { data } = await apiClient.get<ApiResponse<ProductResource>>(`/products/${id}`)
  return toProduct(data.data)
}

export async function createProduct(payload: CreateProductRequest): Promise<Product> {
  const { data } = await apiClient.post<ApiResponse<ProductResource>>('/products', payload)
  return toProduct(data.data)
}

export async function updateProduct(id: string, payload: UpdateProductRequest): Promise<Product> {
  const { data } = await apiClient.patch<ApiResponse<ProductResource>>(`/products/${id}`, payload)
  return toProduct(data.data)
}

export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`)
}

export interface ListProductLaunchesParams {
  page?: number
  perPage?: number
  /** Um de `date`/`quantity`/`purchase_price`/`created_at`, prefixo `-` inverte pra desc (`core/api/schema.d.ts`, `productLaunch.index`). */
  sort?: string
}

/**
 * `PRODUCT_LAUNCH` é sempre aninhado a um `PRODUCT` próprio
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 2.3) — as 4
 * funções abaixo recebem `productId` explícito, nunca implícito via
 * estado global. Backend já escopa `{launch}` através da posse do
 * `{product}` (nenhuma checagem extra de posse aqui, mesmo raciocínio já
 * documentado na rota `catalog.php`).
 */
export async function listProductLaunches(
  productId: string,
  params: ListProductLaunchesParams = {},
): Promise<Paginated<ProductLaunch>> {
  const { data } = await apiClient.get<ApiResponse<ProductLaunchesEnvelope>>(
    `/products/${productId}/launches`,
    {
      params: {
        page: params.page,
        per_page: params.perPage,
        sort: params.sort,
      },
    },
  )

  return {
    items: data.data.items.map(toProductLaunch),
    meta: data.data.meta,
  }
}

export async function createProductLaunch(
  productId: string,
  payload: CreateProductLaunchRequest,
): Promise<ProductLaunch> {
  const { data } = await apiClient.post<ApiResponse<ProductLaunchResource>>(
    `/products/${productId}/launches`,
    payload,
  )
  return toProductLaunch(data.data)
}

export async function updateProductLaunch(
  productId: string,
  launchId: string,
  payload: UpdateProductLaunchRequest,
): Promise<ProductLaunch> {
  const { data } = await apiClient.patch<ApiResponse<ProductLaunchResource>>(
    `/products/${productId}/launches/${launchId}`,
    payload,
  )
  return toProductLaunch(data.data)
}

export async function deleteProductLaunch(productId: string, launchId: string): Promise<void> {
  await apiClient.delete(`/products/${productId}/launches/${launchId}`)
}
