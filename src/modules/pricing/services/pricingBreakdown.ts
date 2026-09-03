import type {
  PricingBreakdown,
  ProductMarketplacePricing,
} from '../types/productMarketplacePricing.type'

/**
 * Não é `services/<recurso>Api.ts` de verdade (sem chamada de API aqui) —
 * mora em `services/` mesmo assim porque não é composable (sem estado
 * reativo, `ref`/`reactive` nenhum) nem tipo — é lógica de decisão pura,
 * mesma categoria de `buildProductSortParam` (`useProductList.ts`), só
 * grande o bastante (2 funções + a ordem visual dos segmentos) pra
 * merecer arquivo próprio em vez de viver dentro do composable de
 * listagem.
 */

/** Ordem = ordem visual da legenda e das barras, esquerda pra direita. */
export const SEGMENT_KEYS = [
  'costPrice',
  'commission',
  'fixedFee',
  'operationalCost',
  'tax',
  'ads',
  'profit',
] as const

export type SegmentKey = (typeof SEGMENT_KEYS)[number]

export interface PriceSegment {
  key: SegmentKey
  value: string
  widthPercent: number
}

/**
 * `widthPercent` nunca fica negativo — `profit` pode vir negativo de
 * verdade (prejuízo, preço praticado baixo demais), mas `flex-basis`
 * negativo é inválido em CSS (o browser trata como `0`, não como
 * "encolhe"). Sem clamp, as OUTRAS parcelas (sempre positivas) somariam
 * mais que 100% do preço — o `overflow: hidden` do container
 * (`.pricing-dashboard-mockup__bar`, reaproveitado) já corta o excesso
 * visualmente, resultado é uma barra "cheia" sem nenhum verde de lucro
 * visível, comunicação razoável de "esse preço não cobre nem os
 * custos" sem quebrar o layout.
 */
export function buildPriceSegments(breakdown: PricingBreakdown, price: string): PriceSegment[] {
  const priceNumber = Number(price)

  return SEGMENT_KEYS.map((key) => {
    const value = breakdown[key]
    const widthPercent = priceNumber === 0 ? 0 : (Number(value) / priceNumber) * 100

    return { key, value, widthPercent: Math.max(widthPercent, 0) }
  })
}

export interface ActivePricing {
  breakdown: PricingBreakdown
  isPracticed: boolean
  marginPercent: number
  price: string
  profit: string
}

/** `profit ÷ price × 100`, mesma fórmula que o backend documenta pro cálculo de margem. */
export function computeMarginPercent(profit: string, price: string): number {
  const priceNumber = Number(price)

  return priceNumber === 0 ? 0 : (Number(profit) / priceNumber) * 100
}

/**
 * Qual preço vira a barra/preço principal da linha: o PRATICADO quando
 * existe (é a situação real — "quanto estou ganhando de verdade nesse
 * preço"), senão o SUGERIDO (não há nada real ainda, mostra a
 * recomendação). `marginPercent` do sugerido não vem pronto da API
 * (só `practicedMarginPercentage` existe) — calculado via
 * `computeMarginPercent`.
 */
export function resolveActivePricing(row: ProductMarketplacePricing): ActivePricing {
  const { pricing } = row

  if (
    row.practicedPrice !== null &&
    pricing.practicedBreakdown &&
    pricing.practicedProfit !== null
  ) {
    return {
      breakdown: pricing.practicedBreakdown,
      isPracticed: true,
      marginPercent: Number(pricing.practicedMarginPercentage ?? '0'),
      price: row.practicedPrice,
      profit: pricing.practicedProfit,
    }
  }

  return {
    breakdown: pricing.suggestedBreakdown,
    isPracticed: false,
    marginPercent: computeMarginPercent(pricing.suggestedProfit, pricing.suggestedPrice),
    price: pricing.suggestedPrice,
    profit: pricing.suggestedProfit,
  }
}

export type OutcomeTone = 'negative' | 'neutral' | 'positive'

/**
 * Tom de cor pro resultado financeiro de uma linha — verde quando dá
 * lucro de verdade (`profit > 0`), amarelo no empate exato ("0x0",
 * `profit === 0`), vermelho no prejuízo (`profit < 0`). Pedido direto do
 * usuário em 2026-09-03, substitui a regra anterior (que misturava sinal
 * de margem com `meetsTargetMargin`) por uma leitura direta do sinal do
 * lucro — mais simples e mais honesta: a cor conta a mesma história em
 * qualquer coluna (praticado ou sugerido), sem precisar saber se é a
 * "ativa" ou não.
 */
export function outcomeTone(profit: string): OutcomeTone {
  const profitNumber = Number(profit)

  if (profitNumber > 0) {
    return 'positive'
  }

  if (profitNumber < 0) {
    return 'negative'
  }

  return 'neutral'
}
