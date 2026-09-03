import {
  buildPriceSegments,
  computeMarginPercent,
  hasCampaignMarkup,
  outcomeTone,
  resolveActivePricing,
} from '@/modules/pricing/services/pricingBreakdown'
import type {
  PricingBreakdown,
  ProductMarketplacePricing,
} from '@/modules/pricing/types/productMarketplacePricing.type'

const breakdown: PricingBreakdown = {
  ads: '3.50',
  affiliate: '2.00',
  commission: '13.98',
  costPrice: '20.00',
  fixedFee: '4.00',
  operationalCost: '3.00',
  profit: '8.44',
  tax: '6.99',
}

const baseRow: ProductMarketplacePricing = {
  categoryId: null,
  createdAt: null,
  id: 'link-1',
  practicedPrice: null,
  pricing: {
    isApproximated: false,
    meetsTargetMargin: null,
    practicedBreakdown: null,
    practicedCampaignPrice: null,
    practicedMarginPercentage: null,
    practicedProfit: null,
    suggestedBreakdown: breakdown,
    suggestedCampaignPrice: '87.39',
    suggestedPrice: '69.91',
    suggestedProfit: '8.44',
  },
  productId: 'prod-1',
  productName: 'Produto Teste',
  userMarketplaceId: 'um-1',
}

describe('resolveActivePricing', () => {
  it('falls back to the suggested price when no practiced price exists', () => {
    const result = resolveActivePricing(baseRow)

    expect(result.isPracticed).toBe(false)
    expect(result.price).toBe('69.91')
    expect(result.breakdown).toBe(breakdown)
    expect(result.marginPercent).toBeCloseTo((8.44 / 69.91) * 100, 5)
    expect(result.campaignPrice).toBe('87.39')
  })

  it('prefers the practiced price when it exists', () => {
    const practicedBreakdown: PricingBreakdown = { ...breakdown, profit: '15.00' }
    const row: ProductMarketplacePricing = {
      ...baseRow,
      practicedPrice: '89.90',
      pricing: {
        ...baseRow.pricing,
        meetsTargetMargin: true,
        practicedBreakdown,
        practicedCampaignPrice: '112.38',
        practicedMarginPercentage: '16.68',
        practicedProfit: '15.00',
      },
    }

    const result = resolveActivePricing(row)

    expect(result.isPracticed).toBe(true)
    expect(result.price).toBe('89.90')
    expect(result.profit).toBe('15.00')
    expect(result.marginPercent).toBe(16.68)
    expect(result.breakdown).toBe(practicedBreakdown)
    expect(result.campaignPrice).toBe('112.38')
  })
})

describe('buildPriceSegments', () => {
  it('computes each segment width as a percentage of the price, in visual order', () => {
    const segments = buildPriceSegments(breakdown, '69.91')

    expect(segments.map((segment) => segment.key)).toEqual([
      'costPrice',
      'commission',
      'fixedFee',
      'operationalCost',
      'tax',
      'ads',
      'affiliate',
      'profit',
    ])
    expect(segments[0]).toEqual({
      key: 'costPrice',
      value: '20.00',
      widthPercent: (20 / 69.91) * 100,
    })
  })

  it('clamps a negative segment (prejuízo) to 0 width instead of a negative flex-basis', () => {
    const lossBreakdown: PricingBreakdown = { ...breakdown, profit: '-5.00' }

    const segments = buildPriceSegments(lossBreakdown, '50.00')
    const profitSegment = segments.find((segment) => segment.key === 'profit')

    expect(profitSegment?.widthPercent).toBe(0)
  })

  it('returns 0 width for every segment when the price is 0 (avoids division by zero)', () => {
    const segments = buildPriceSegments(breakdown, '0')

    expect(segments.every((segment) => segment.widthPercent === 0)).toBe(true)
  })
})

describe('computeMarginPercent', () => {
  it('computes profit as a percentage of price', () => {
    expect(computeMarginPercent('8.44', '69.91')).toBeCloseTo((8.44 / 69.91) * 100, 5)
  })

  it('returns 0 when price is 0 (avoids division by zero)', () => {
    expect(computeMarginPercent('8.44', '0')).toBe(0)
  })
})

describe('hasCampaignMarkup', () => {
  it('returns true when the campaign price is higher than the price (real discount configured)', () => {
    expect(hasCampaignMarkup('87.39', '69.91')).toBe(true)
  })

  it('returns false when the campaign price equals the price (no campaign discount configured)', () => {
    expect(hasCampaignMarkup('69.91', '69.91')).toBe(false)
  })
})

describe('outcomeTone', () => {
  it('returns positive when there is real profit', () => {
    expect(outcomeTone('8.44')).toBe('positive')
  })

  it('returns neutral on an exact break-even (0x0)', () => {
    expect(outcomeTone('0')).toBe('neutral')
  })

  it('returns negative on a loss', () => {
    expect(outcomeTone('-5.00')).toBe('negative')
  })
})
