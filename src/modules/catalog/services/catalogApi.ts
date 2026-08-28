import { apiClient } from '@/core/api/client'
import type { components } from '@/core/api/schema'
import type { ApiResponse, Paginated } from '@/shared/types/api.type'
import { type Product, toProduct } from '../types/product.type'

type ProductResource = components['schemas']['ProductResource']
type CreateProductRequest = components['schemas']['CreateProductRequest']
type UpdateProductRequest = components['schemas']['UpdateProductRequest']

interface ProductsEnvelope {
  items: ProductResource[]
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
