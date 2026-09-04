import { buildMarketplaceConnectionCards } from '@/modules/pricing/composables/useMarketplaceConnections'
import type { Marketplace } from '@/modules/pricing/types/marketplace.type'
import type { UserMarketplace } from '@/modules/pricing/types/userMarketplace.type'

const shopee: Marketplace = {
  comingSoon: false,
  description: null,
  id: 'mkt-1',
  logoUrl: null,
  name: 'Shopee',
  requiresStoreDocumentType: false,
  tags: null,
  websiteUrl: null,
}
const amazon: Marketplace = {
  comingSoon: false,
  description: null,
  id: 'mkt-2',
  logoUrl: null,
  name: 'Amazon',
  requiresStoreDocumentType: false,
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

describe('buildMarketplaceConnectionCards', () => {
  it('returns one card per marketplace, connection null when not connected', () => {
    const cards = buildMarketplaceConnectionCards([shopee, amazon], [])

    expect(cards).toEqual([
      { connection: null, marketplace: shopee },
      { connection: null, marketplace: amazon },
    ])
  })

  it('matches the connection to its marketplace by marketplaceId', () => {
    const cards = buildMarketplaceConnectionCards([shopee, amazon], [shopeeConnection])

    expect(cards).toEqual([
      { connection: shopeeConnection, marketplace: shopee },
      { connection: null, marketplace: amazon },
    ])
  })

  it('ignores a connection whose marketplace is not in the list (edge case: paginated/stale data)', () => {
    const orphanConnection: UserMarketplace = { ...shopeeConnection, marketplaceId: 'mkt-999' }

    const cards = buildMarketplaceConnectionCards([shopee], [orphanConnection])

    expect(cards).toEqual([{ connection: null, marketplace: shopee }])
  })
})
