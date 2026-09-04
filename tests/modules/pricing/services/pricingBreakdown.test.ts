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
  coupon: '1.00',
  fixedFee: '4.00',
  individualFixedFee: '0.00',
  operationalCost: '3.00',
  // Aproximação de `value ÷ 69.91 × 100` pra cada parcela — não precisa
  // fechar 100% exato nem bater com precisão de casas decimais, o que
  // este teste verifica é que `buildPriceSegments` REPASSA esses valores
  // (nunca recalcula divisão localmente, ver comentário do fixture
  // `lossBreakdown` abaixo pra prova disso).
  percentageOfTotal: {
    ads: '5.01',
    affiliate: '2.86',
    commission: '20.00',
    costPrice: '28.61',
    coupon: '1.43',
    fixedFee: '5.72',
    individualFixedFee: '0.00',
    operationalCost: '4.29',
    profit: '12.07',
    tax: '10.00',
  },
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

  it('still resolves to the practiced price when practicedCampaignPrice is null (bug real, 2026-09-04 — backend sends null on purpose when the margin target is not met, not "no practiced price")', () => {
    const practicedBreakdown: PricingBreakdown = { ...breakdown, profit: '5.44' }
    const row: ProductMarketplacePricing = {
      ...baseRow,
      practicedPrice: '69.90',
      pricing: {
        ...baseRow.pricing,
        meetsTargetMargin: false,
        practicedBreakdown,
        practicedCampaignPrice: null,
        practicedMarginPercentage: '7.78',
        practicedProfit: '5.44',
      },
    }

    const result = resolveActivePricing(row)

    expect(result.isPracticed).toBe(true)
    expect(result.price).toBe('69.90')
    expect(result.profit).toBe('5.44')
    expect(result.breakdown).toBe(practicedBreakdown)
    expect(result.campaignPrice).toBeNull()
  })
})

describe('buildPriceSegments', () => {
  it('uses the backend-provided percentage for both the width and the display percent, in visual order', () => {
    const segments = buildPriceSegments(breakdown)

    expect(segments.map((segment) => segment.key)).toEqual([
      'costPrice',
      'commission',
      'fixedFee',
      'operationalCost',
      'tax',
      'ads',
      'affiliate',
      'coupon',
      'individualFixedFee',
      'profit',
    ])
    expect(segments[0]).toEqual({
      key: 'costPrice',
      percent: '28.61',
      value: '20.00',
      widthPercent: 28.61,
    })
  })

  it('never recomputes the percentage locally — a value/price mismatch on the fixture still trusts the backend percentage', () => {
    // `coupon` vale 1.00 (só ~1.4% de 69.91), mas o breakdown afirma
    // 40% — se a função ainda dividisse localmente, o teste abaixo
    // falharia. Prova de que `buildPriceSegments` só repassa
    // `percentageOfTotal`, nunca deriva de `value`.
    const skewedBreakdown: PricingBreakdown = {
      ...breakdown,
      percentageOfTotal: { ...breakdown.percentageOfTotal, coupon: '40.00' },
    }

    const segments = buildPriceSegments(skewedBreakdown)
    const couponSegment = segments.find((segment) => segment.key === 'coupon')

    expect(couponSegment?.widthPercent).toBe(40)
    expect(couponSegment?.percent).toBe('40.00')
  })

  it('reflects a real individualFixedFee (PF connection) as its own segment', () => {
    // `individualFixedFee` só vem diferente de "0.00" quando a conexão é
    // PF (`storeDocumentType: 'individual'`, regra do backend) — o
    // frontend não decide isso, só exibe o que veio no breakdown.
    const pfBreakdown: PricingBreakdown = {
      ...breakdown,
      individualFixedFee: '3.00',
      percentageOfTotal: { ...breakdown.percentageOfTotal, individualFixedFee: '4.29' },
    }

    const segments = buildPriceSegments(pfBreakdown)
    const feeSegment = segments.find((segment) => segment.key === 'individualFixedFee')

    expect(feeSegment).toEqual({
      key: 'individualFixedFee',
      percent: '4.29',
      value: '3.00',
      widthPercent: 4.29,
    })
  })

  it('clamps a negative segment (prejuízo) to 0 width instead of a negative flex-basis, but keeps the real negative % for display', () => {
    const lossBreakdown: PricingBreakdown = {
      ...breakdown,
      percentageOfTotal: { ...breakdown.percentageOfTotal, profit: '-10.00' },
      profit: '-5.00',
    }

    const segments = buildPriceSegments(lossBreakdown)
    const profitSegment = segments.find((segment) => segment.key === 'profit')

    expect(profitSegment?.widthPercent).toBe(0)
    expect(profitSegment?.percent).toBe('-10.00')
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

  it('returns false when the campaign price is null (backend did not compute one, e.g. practiced price below target margin)', () => {
    expect(hasCampaignMarkup(null, '69.91')).toBe(false)
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

  it('returns neutral when there is real profit but it does not meet the target margin (bug real, 2026-09-04)', () => {
    expect(outcomeTone('8.44', false)).toBe('neutral')
  })

  it('returns positive when there is real profit and it meets the target margin', () => {
    expect(outcomeTone('8.44', true)).toBe('positive')
  })

  it('stays negative on a loss even when meetsTargetMargin is explicitly false — loss always wins', () => {
    expect(outcomeTone('-5.00', false)).toBe('negative')
  })

  it('ignores meetsTargetMargin when null/undefined (suggested price never carries it)', () => {
    expect(outcomeTone('8.44', null)).toBe('positive')
    expect(outcomeTone('8.44', undefined)).toBe('positive')
  })
})
