import type { components } from '@/core/api/schema'
import type { Paginated } from '@/shared/types/api.type'
import type { Product } from '../types/product.type'
import type { ListProductsParams } from './catalogApi'

type CreateProductRequest = components['schemas']['CreateProductRequest']
type UpdateProductRequest = components['schemas']['UpdateProductRequest']

/**
 * MOCK TEMPORÁRIO, pedido direto do usuário em 2026-08-28 — "é a api,
 * desativa a chamada da api e mock uma lista pra eu ver". `GET /products`
 * real devolve 401 (sem sessão — Fase 1/Identity/login ainda não existe),
 * e o interceptor global de 401 (`core/api/client.ts`,
 * `UNAUTHORIZED_EVENT`) redireciona pro login incondicionalmente, mesmo a
 * rota não exigindo auth (`meta.requiresAuth: false` no `AppLayout`) — não
 * dava pra ver o CRUD sem isso.
 *
 * Mesma assinatura/shape de retorno de `catalogApi.ts` (drop-in) — reverter
 * é só trocar o import de volta pra `./catalogApi` em `useProductList.ts`/
 * `useProductForm.ts`/`ProductsView.vue` quando a Fase 1 existir de
 * verdade (ver `docs/planejamento/plano-implementacao.md`, Fase 3).
 * `catalogApi.ts` (o service real) continua intacto, só não é chamado
 * enquanto este mock estiver plugado.
 *
 * Estado em memória (module-level `let`) — reseta a cada reload da
 * página, não é persistência de verdade, só o suficiente pra create/
 * edit/delete refletirem na listagem durante a demonstração.
 */
let mockProducts: Product[] = [
  {
    createdAt: '2026-08-12T10:00:00.000000Z',
    ean: '4006381333931',
    fullSalePrice: '59.90',
    height: null,
    id: '1',
    length: null,
    name: 'Camiseta azul',
    ncm: '61091000',
    purchasePrice: '30.00',
    sku: 'SKU-001',
    targetMargin: '20.00',
    weight: null,
    width: null,
  },
  {
    createdAt: '2026-08-10T09:30:00.000000Z',
    ean: '4006381333932',
    fullSalePrice: '199.90',
    height: null,
    id: '2',
    length: null,
    name: 'Tênis esportivo',
    ncm: '64041100',
    purchasePrice: '120.00',
    sku: 'SKU-002',
    targetMargin: '15.00',
    weight: '0.8',
    width: null,
  },
  {
    createdAt: '2026-08-05T14:15:00.000000Z',
    ean: '4006381333933',
    fullSalePrice: '89.90',
    height: null,
    id: '3',
    length: null,
    name: 'Fone de ouvido bluetooth',
    ncm: '85183000',
    purchasePrice: '45.00',
    sku: 'SKU-003',
    targetMargin: '25.00',
    weight: '0.15',
    width: null,
  },
]
let nextId = mockProducts.length + 1

function generateId(): string {
  const id = String(nextId)
  nextId += 1
  return id
}

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 200))
}

function sortValue(product: Product, key: 'createdAt' | 'fullSalePrice' | 'name'): number | string {
  if (key === 'fullSalePrice') {
    return Number(product.fullSalePrice)
  }
  return key === 'name' ? product.name : (product.createdAt ?? '')
}

/** `number | null | undefined` do payload -> `string | null` do domínio (decimal sempre como string, ver `product.type.ts`). */
function toNullableDecimalString(
  value: number | null | undefined,
  fallback: string | null,
): string | null {
  if (value === undefined) {
    return fallback
  }
  return value === null ? null : String(value)
}

export async function listProducts(params: ListProductsParams = {}): Promise<Paginated<Product>> {
  let items = [...mockProducts]

  if (params.sku) {
    const term = params.sku.toLowerCase()
    items = items.filter((product) => product.sku.toLowerCase().includes(term))
  }

  if (params.sort) {
    const isDesc = params.sort.startsWith('-')
    const key = (isDesc ? params.sort.slice(1) : params.sort) as
      | 'createdAt'
      | 'fullSalePrice'
      | 'name'
    items = [...items].sort((a, b) => {
      const [av, bv] = [sortValue(a, key), sortValue(b, key)]
      let compared = 0
      if (av < bv) {
        compared = -1
      } else if (av > bv) {
        compared = 1
      }
      return isDesc ? -compared : compared
    })
  }

  const perPage = params.perPage ?? 10
  const page = params.page ?? 1
  const start = (page - 1) * perPage

  return delay({
    items: items.slice(start, start + perPage),
    meta: { current_page: page, per_page: perPage, total: items.length },
  })
}

export async function createProduct(payload: CreateProductRequest): Promise<Product> {
  const product: Product = {
    createdAt: new Date().toISOString(),
    ean: payload.ean,
    fullSalePrice: String(payload.full_sale_price),
    height: toNullableDecimalString(payload.height, null),
    id: generateId(),
    length: toNullableDecimalString(payload.length, null),
    name: payload.name,
    ncm: payload.ncm,
    purchasePrice: String(payload.purchase_price),
    sku: payload.sku,
    targetMargin: String(payload.target_margin),
    weight: toNullableDecimalString(payload.weight, null),
    width: toNullableDecimalString(payload.width, null),
  }

  mockProducts = [product, ...mockProducts]
  return delay(product)
}

export async function updateProduct(id: string, payload: UpdateProductRequest): Promise<Product> {
  const existing = mockProducts.find((product) => product.id === id)

  if (!existing) {
    throw new Error(`Mock product not found: ${id}`)
  }

  const updated: Product = {
    ...existing,
    ean: payload.ean ?? existing.ean,
    fullSalePrice:
      payload.full_sale_price === undefined
        ? existing.fullSalePrice
        : String(payload.full_sale_price),
    height: toNullableDecimalString(payload.height, existing.height),
    length: toNullableDecimalString(payload.length, existing.length),
    name: payload.name ?? existing.name,
    ncm: payload.ncm ?? existing.ncm,
    purchasePrice:
      payload.purchase_price === undefined
        ? existing.purchasePrice
        : String(payload.purchase_price),
    sku: payload.sku ?? existing.sku,
    targetMargin:
      payload.target_margin === undefined ? existing.targetMargin : String(payload.target_margin),
    weight: toNullableDecimalString(payload.weight, existing.weight),
    width: toNullableDecimalString(payload.width, existing.width),
  }

  mockProducts = mockProducts.map((product) => (product.id === id ? updated : product))
  return delay(updated)
}

export async function deleteProduct(id: string): Promise<void> {
  mockProducts = mockProducts.filter((product) => product.id !== id)
  await delay(undefined)
}
