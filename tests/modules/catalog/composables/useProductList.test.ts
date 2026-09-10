import {
  buildProductMarketplaceColumns,
  buildProductSortParam,
} from '@/modules/catalog/composables/useProductList'
import type { Product } from '@/modules/catalog/types/product.type'

function makeProduct(marketplaces: Product['marketplaces']): Product {
  return {
    costPrice: '10.00',
    createdAt: null,
    ean: null,
    height: null,
    id: 'prod-1',
    length: null,
    marketplaces,
    name: 'Produto',
    ncm: null,
    shippingCost: null,
    sku: 'SKU-1',
    targetMargin: '10.00',
    weight: null,
    width: null,
  }
}

describe('buildProductMarketplaceColumns', () => {
  it('returns one column per distinct marketplace across all products', () => {
    const products = [
      makeProduct([
        {
          id: 'link-1',
          marketplaceId: 'mkt-1',
          marketplaceLogoUrl: 'https://example.com/shopee.png',
          marketplaceName: 'Shopee',
          status: 'sent',
        },
      ]),
      makeProduct([
        {
          id: 'link-2',
          marketplaceId: 'mkt-2',
          marketplaceLogoUrl: null,
          marketplaceName: 'Shein',
          status: 'not_sent',
        },
      ]),
    ]

    expect(buildProductMarketplaceColumns(products)).toEqual([
      { id: 'mkt-1', logoUrl: 'https://example.com/shopee.png', name: 'Shopee' },
      { id: 'mkt-2', logoUrl: null, name: 'Shein' },
    ])
  })

  it('deduplicates the same marketplace appearing across multiple products (the common case)', () => {
    const products = [
      makeProduct([
        {
          id: 'link-1',
          marketplaceId: 'mkt-1',
          marketplaceLogoUrl: 'https://example.com/shopee.png',
          marketplaceName: 'Shopee',
          status: 'sent',
        },
      ]),
      makeProduct([
        {
          id: 'link-2',
          marketplaceId: 'mkt-1',
          marketplaceLogoUrl: 'https://example.com/shopee.png',
          marketplaceName: 'Shopee',
          status: 'not_sent',
        },
      ]),
    ]

    expect(buildProductMarketplaceColumns(products)).toEqual([
      { id: 'mkt-1', logoUrl: 'https://example.com/shopee.png', name: 'Shopee' },
    ])
  })

  it('returns an empty list when no product has any linked marketplace', () => {
    expect(buildProductMarketplaceColumns([makeProduct([])])).toEqual([])
  })
})

describe('buildProductSortParam', () => {
  it('returns undefined when there is no sort key', () => {
    expect(buildProductSortParam(undefined, 'asc')).toBeUndefined()
  })

  it('returns undefined when direction is null (column sort cleared)', () => {
    expect(buildProductSortParam('name', null)).toBeUndefined()
  })

  it('maps a known column to the real API sort param, ascending', () => {
    expect(buildProductSortParam('name', 'asc')).toBe('name')
    expect(buildProductSortParam('costPrice', 'asc')).toBe('cost_price')
    expect(buildProductSortParam('createdAt', 'asc')).toBe('created_at')
  })

  it('prefixes with "-" for descending', () => {
    expect(buildProductSortParam('name', 'desc')).toBe('-name')
    expect(buildProductSortParam('createdAt', 'desc')).toBe('-created_at')
  })

  it('returns undefined for a column the real API cannot sort by', () => {
    expect(buildProductSortParam('margin', 'asc')).toBeUndefined()
  })
})
