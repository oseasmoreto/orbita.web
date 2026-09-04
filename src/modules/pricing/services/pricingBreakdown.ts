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
  'individualFixedFee',
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
  /**
   * `null` quando o preço praticado não bate a `target_margin` do
   * produto — o backend deliberadamente não calcula "preço a anunciar"
   * em cima de um preço que nem bate a meta (`meetsTargetMargin: false`,
   * ver achado real documentado em `resolveActivePricing` abaixo). O
   * sugerido nunca é `null` aqui (sempre bate a meta, por construção).
   */
  campaignPrice: string | null
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
 *
 * **Achado real, 2026-09-04, reportado pelo usuário ("por que não
 * mostra mais o preço praticado?")** — a checagem de "existe preço
 * praticado" exigia `practicedCampaignPrice !== null` junto dos outros
 * 3 campos, mas o backend passou a mandar `practiced_campaign_price:
 * null` de propósito quando `meetsTargetMargin` é `false` (decisão
 * real do backend, não bug: "não faz sentido sugerir preço de anúncio
 * em cima de um preço que nem bate a margem", comentário no código do
 * `ProductMarketplacePricingCalculator`) — então qualquer produto com
 * preço praticado ABAIXO da meta caía inteiro pro ramo do SUGERIDO,
 * escondendo o preço praticado real. `practicedCampaignPrice` saiu da
 * condição — só `practicedPrice`/`practicedBreakdown`/`practicedProfit`
 * (que o backend sempre manda juntos, sem exceção) decidem se há preço
 * praticado; `campaignPrice` virou `string | null` pra carregar esse
 * "não aplicável" sem mentir que é o preço sugerido.
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
 * Só mostra o preço de campanha quando há desconto de campanha
 * configurado de verdade nesta conexão
 * (`USER_MARKETPLACE.campaignDiscountPercentage`) — sem desconto (`null`
 * ou `0`), o backend devolve o preço de campanha IGUAL ao preço de venda
 * (divisão por `1 - 0%`), e repetir o mesmo número com um rótulo a mais
 * seria ruído, não informação (nem todo vendedor roda campanha com
 * desconto, seção 2.4 de `docs/infra/convencoes-frontend-infra.md`).
 *
 * `campaignPrice` aceita `null` (2026-09-04) — o backend manda
 * `practiced_campaign_price: null` de propósito quando o preço
 * praticado não bate a meta (`ActivePricing.campaignPrice`, ver
 * `resolveActivePricing`); sem preço de campanha nenhum pra comparar,
 * não há markup a mostrar. Type predicate (`campaignPrice is string`),
 * não `boolean` solto — deixa o `v-if` do template
 * (`ProductMarketplacePricingView.vue`) estreitar `string | null` pra
 * `string` sozinho dentro do bloco, sem precisar de `as string` no
 * `formatMoney()` logo depois.
 */
export function hasCampaignMarkup(
  campaignPrice: string | null,
  price: string,
): campaignPrice is string {
  return campaignPrice !== null && Number(campaignPrice) > Number(price)
}

/**
 * Tom de cor pro resultado financeiro de uma linha. Base (2026-09-03,
 * pedido direto do usuário): verde quando dá lucro de verdade
 * (`profit > 0`), amarelo no empate exato ("0x0", `profit === 0`),
 * vermelho no prejuízo (`profit < 0`) — leitura direta do sinal do
 * lucro, mesma história em qualquer coluna (praticado ou sugerido).
 *
 * **Correção, 2026-09-04, reportada pelo usuário com bug real**: o
 * preço PRATICADO podia mostrar verde mesmo abaixo da `target_margin`
 * cadastrada do produto — a regra original só olhava o SINAL do lucro,
 * então um preço com lucro pequeno mas insuficiente pra bater a margem
 * alvo (`meetsTargetMargin: false`, já calculado pelo backend,
 * `PricingEvaluation`) ainda pintava verde, lendo como "tudo certo"
 * quando não estava. `meetsTargetMargin` (2º parâmetro, opcional) força
 * `neutral` (amarelo — "não é prejuízo, mas não bate a meta") quando
 * `false`, SEM sobrepor o vermelho de um prejuízo de verdade (prejuízo
 * é sempre pior que "só não bate meta", checado primeiro). Só se aplica
 * ao preço PRATICADO — o SUGERIDO é construído pra sempre bater a meta
 * (`ProductMarketplacePricingCalculator`), então nunca tem
 * `meetsTargetMargin` de verdade; chamadores do sugerido continuam sem
 * passar o 2º argumento, mesmo comportamento de antes (`undefined`/`null`
 * = regra antiga, só sinal do lucro).
 */
export function outcomeTone(profit: string, meetsTargetMargin?: boolean | null): OutcomeTone {
  const profitNumber = Number(profit)

  if (profitNumber < 0) {
    return 'negative'
  }

  if (meetsTargetMargin === false) {
    return 'neutral'
  }

  if (profitNumber > 0) {
    return 'positive'
  }

  return 'neutral'
}
