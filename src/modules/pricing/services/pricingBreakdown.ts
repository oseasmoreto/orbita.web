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
  'affiliate',
  'coupon',
  'profit',
] as const

export type SegmentKey = (typeof SEGMENT_KEYS)[number]

export interface PriceSegment {
  key: SegmentKey
  /**
   * String crua de `breakdown.percentageOfTotal[key]` (2026-09-04, pedido
   * direto do usuário), ex.: `"28.60"` — SEM clamp, ao contrário de
   * `widthPercent`: um `profit` negativo (prejuízo) mostra a % negativa de
   * verdade no texto (`-7.20`), informação real que o usuário pediu pra
   * ver ("quantos % o preço de custo vale sobre o valor final e afins").
   */
  percent: string
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
 *
 * **Achado real, 2026-09-04**: até aqui `widthPercent` era recalculado no
 * cliente (`value ÷ price × 100`) — divergia sutilmente da % que o
 * backend agora expõe em `breakdown.percentageOfTotal` (arredondamento
 * próprio, `bcround` de 2 casas em cima dos MESMOS valores já
 * arredondados exibidos no breakdown). Usar a % do backend direto pra
 * `widthPercent` elimina essa divergência — a largura visual da barra e
 * o texto do rótulo/tooltip agora vêm sempre do mesmo número, nunca dois
 * cálculos ligeiramente diferentes pra mesma coisa. `price` saiu da
 * assinatura — não é mais usado (nenhuma divisão acontece aqui).
 */
export function buildPriceSegments(breakdown: PricingBreakdown): PriceSegment[] {
  return SEGMENT_KEYS.map((key) => {
    const value = breakdown[key]
    const percent = breakdown.percentageOfTotal[key]
    const widthPercent = Math.max(Number(percent), 0)

    return { key, percent, value, widthPercent }
  })
}

export interface ActivePricing {
  breakdown: PricingBreakdown
  campaignPrice: string
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
    pricing.practicedProfit !== null &&
    pricing.practicedCampaignPrice !== null
  ) {
    return {
      breakdown: pricing.practicedBreakdown,
      campaignPrice: pricing.practicedCampaignPrice,
      isPracticed: true,
      marginPercent: Number(pricing.practicedMarginPercentage ?? '0'),
      price: row.practicedPrice,
      profit: pricing.practicedProfit,
    }
  }

  return {
    breakdown: pricing.suggestedBreakdown,
    campaignPrice: pricing.suggestedCampaignPrice,
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
/**
 * Só mostra o preço de campanha quando há desconto de campanha
 * configurado de verdade nesta conexão
 * (`USER_MARKETPLACE.campaignDiscountPercentage`) — sem desconto (`null`
 * ou `0`), o backend devolve o preço de campanha IGUAL ao preço de venda
 * (divisão por `1 - 0%`), e repetir o mesmo número com um rótulo a mais
 * seria ruído, não informação (nem todo vendedor roda campanha com
 * desconto, seção 2.4 de `docs/negocio/contexto-plataforma-precificacao.md`).
 */
export function hasCampaignMarkup(campaignPrice: string, price: string): boolean {
  return Number(campaignPrice) > Number(price)
}

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
