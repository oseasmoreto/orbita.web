import { firstActiveConnectionId } from '@/core/composables/useFirstActiveMarketplaceConnection'
import type { UserMarketplace } from '@/modules/pricing/types/userMarketplace.type'

function buildConnection(id: string): UserMarketplace {
  return {
    active: true,
    adsPercentage: null,
    affiliatePercentage: null,
    campaignDiscountPercentage: null,
    couponValue: null,
    createdAt: null,
    id,
    marketplaceId: `mkt-${id}`,
    storeDocumentType: null,
    storeName: `Loja ${id}`,
  }
}

describe('firstActiveConnectionId', () => {
  it('returns the id of the first connection in the list', () => {
    const connections = [buildConnection('conn-1'), buildConnection('conn-2')]

    expect(firstActiveConnectionId(connections)).toBe('conn-1')
  })

  it('returns null when there are no active connections', () => {
    expect(firstActiveConnectionId([])).toBeNull()
  })
})
