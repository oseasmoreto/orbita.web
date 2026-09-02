import {
  buildAvailableConnectionOptions,
  buildProductMarketplaceRows,
} from '@/modules/pricing/composables/useProductMarketplaces'
import type { CategoryMarketplace } from '@/modules/pricing/types/categoryMarketplace.type'
import type { Marketplace } from '@/modules/pricing/types/marketplace.type'
import type { ProductMarketplace } from '@/modules/pricing/types/productMarketplace.type'
import type { UserMarketplace } from '@/modules/pricing/types/userMarketplace.type'

const shopee: Marketplace = {
  description: null,
  id: 'mkt-1',
  logoUrl: 'https://example.com/shopee-logo.png',
  name: 'Shopee',
  tags: null,
  websiteUrl: null,
}
const amazon: Marketplace = {
  description: null,
  id: 'mkt-2',
  logoUrl: null,
  name: 'Amazon',
  tags: null,
  websiteUrl: null,
}

const shopeeConnection: UserMarketplace = {
  active: true,
  createdAt: '2026-01-01T00:00:00Z',
  id: 'conn-1',
  marketplaceId: 'mkt-1',
  storeName: 'Minha Loja Shopee',
}

const amazonConnection: UserMarketplace = {
  active: true,
  createdAt: '2026-01-01T00:00:00Z',
  id: 'conn-2',
  marketplaceId: 'mkt-2',
  storeName: 'Minha Loja Amazon',
}

const inactiveConnection: UserMarketplace = {
  active: false,
  createdAt: '2026-01-01T00:00:00Z',
  id: 'conn-3',
  marketplaceId: 'mkt-2',
  storeName: 'Loja Pausada',
}

const link: ProductMarketplace = {
  categoryId: null,
  createdAt: '2026-02-01T00:00:00Z',
  id: 'link-1',
  productId: 'prod-1',
  userMarketplaceId: 'conn-1',
}

const linkWithCategory: ProductMarketplace = {
  categoryId: 'cat-1',
  createdAt: '2026-02-01T00:00:00Z',
  id: 'link-2',
  productId: 'prod-1',
  userMarketplaceId: 'conn-1',
}

const shopeeElectronicsLink: CategoryMarketplace = {
  category: { active: true, createdAt: null, id: 'cat-1', title: 'Eletrônicos' },
  categoryId: 'cat-1',
  commissionPercentage: '12.00',
  createdAt: '2026-01-15T00:00:00Z',
  id: 'catmkt-1',
  marketplaceId: 'mkt-1',
}

describe('buildProductMarketplaceRows', () => {
  it('resolves the marketplace name, logo and store name for each link', () => {
    const rows = buildProductMarketplaceRows(
      [link],
      [shopeeConnection, amazonConnection],
      [shopee, amazon],
      new Map(),
    )

    expect(rows).toEqual([
      {
        categoryTitle: null,
        createdAt: '2026-02-01T00:00:00Z',
        id: 'link-1',
        marketplaceLogoUrl: 'https://example.com/shopee-logo.png',
        marketplaceName: 'Shopee',
        storeName: 'Minha Loja Shopee',
        userMarketplaceId: 'conn-1',
      },
    ])
  })

  it('falls back gracefully when the connection is missing (edge case: stale data)', () => {
    const rows = buildProductMarketplaceRows([link], [], [], new Map())

    expect(rows[0]?.marketplaceName).toBe('—')
    expect(rows[0]?.marketplaceLogoUrl).toBeNull()
    expect(rows[0]?.storeName).toBe('—')
    expect(rows[0]?.categoryTitle).toBeNull()
  })

  it('resolves the category title from the marketplace it was linked in', () => {
    const rows = buildProductMarketplaceRows(
      [linkWithCategory],
      [shopeeConnection],
      [shopee],
      new Map([['mkt-1', [shopeeElectronicsLink]]]),
    )

    expect(rows[0]?.categoryTitle).toBe('Eletrônicos')
  })

  it('is null when the link has no category (marketplace does not charge by category)', () => {
    const rows = buildProductMarketplaceRows(
      [link],
      [shopeeConnection],
      [shopee],
      new Map([['mkt-1', [shopeeElectronicsLink]]]),
    )

    expect(rows[0]?.categoryTitle).toBeNull()
  })
})

describe('buildAvailableConnectionOptions', () => {
  it('offers only active connections not yet linked to this product', () => {
    const options = buildAvailableConnectionOptions(
      [shopeeConnection, amazonConnection],
      [shopee, amazon],
      [link],
    )

    expect(options).toEqual([{ label: 'Amazon — Minha Loja Amazon', value: 'conn-2' }])
  })

  it('excludes inactive connections — never offer a paused connection to link', () => {
    const options = buildAvailableConnectionOptions(
      [shopeeConnection, inactiveConnection],
      [shopee, amazon],
      [],
    )

    expect(options).toEqual([{ label: 'Shopee — Minha Loja Shopee', value: 'conn-1' }])
  })

  it('returns an empty list when every active connection is already linked', () => {
    const options = buildAvailableConnectionOptions([shopeeConnection], [shopee], [link])

    expect(options).toEqual([])
  })
})
