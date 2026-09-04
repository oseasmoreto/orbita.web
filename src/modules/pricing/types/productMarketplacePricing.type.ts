import type { components } from '@/core/api/schema'

type ProductMarketplacePricingResource = components['schemas']['ProductMarketplacePricingResource']

/**
 * Achado real, 2026-09-03 — o schema OpenAPI gerado (`schema.d.ts`) infere
 * `meets_target_margin`/`is_approximated` como `string`, não `boolean`:
 * o Scramble não consegue seguir estaticamente o tipo através de
 * `$evaluation->meetsTargetMargin` (propriedade dinâmica anexada ao Model
 * pela Action, `ListProductMarketplacePricingAction`, nunca uma coluna
 * real). Conferido contra a fonte de verdade real —
 * `Domain/Pricing/ValueObjects/PricingEvaluation.php`, backend — os dois
 * campos são `bool`/`?bool` de verdade, e o PHP serializa isso como
 * booleano JSON nativo (`true`/`false`), não string. Corrigido aqui com
 * `Omit` + override, mesmo padrão já usado quando o schema gerado diverge
 * do runtime real — nunca redigitar o resource inteiro à mão.
 */
type PricingEvaluationResource = Omit<
  ProductMarketplacePricingResource['pricing'],
  'is_approximated' | 'meets_target_margin'
> & {
  is_approximated: boolean
  meets_target_margin: boolean | null
}

/**
 * Quebra da composição do preço em 10 parcelas (pedido ao backend,
 * 2026-09-03, pra desenhar a barra empilhada do mockup —
 * `PricingDashboardMockupView.vue` — com dado real). Soma sempre bate
 * com o preço correspondente: `costPrice + operationalCost + commission
 * + fixedFee + tax + ads + affiliate + coupon + individualFixedFee +
 * profit = price`. `profit` pode vir negativo (prejuízo) se o preço
 * praticado for baixo demais.
 *
 * `affiliate` entrou em 2026-09-03 (mesma planilha real, confirmado com
 * o usuário antes de codar pelo backend) — mesmo tratamento de `ads`
 * (deduzido do lucro na resolução do preço sugerido). Continua sem
 * segmento de "comissão de campanha" na SOMA — o desconto de campanha
 * (`USER_MARKETPLACE.campaignDiscountPercentage`) não reduz o lucro
 * aqui, ele só define o preço de ANÚNCIO maior via
 * `suggestedCampaignPrice`/`practicedCampaignPrice` (`PricingEvaluation`
 * abaixo) — são conceitos diferentes: este breakdown é "de que o preço
 * de VENDA é composto", aquele é "que preço anunciar pra, depois do
 * desconto, chegar nesse preço de venda".
 *
 * `coupon` entrou em 2026-09-04 — deduz `USER_MARKETPLACE.couponValue`
 * (valor FIXO em R$, não percentual, diferente de `ads`/`affiliate`)
 * direto do lucro, mesmo tratamento dos outros dois.
 *
 * `individualFixedFee` entrou em 2026-09-04 (tarefa 90, aviso cross-
 * session) — deduz `MARKETPLACE.individualFixedFee` ("taxa fixa para
 * PF"), valor FIXO em R$ como `coupon`, mas com uma regra a mais: só
 * vem diferente de `"0.00"` quando a CONEXÃO
 * (`UserMarketplace.storeDocumentType`) é `'individual'` (PF) — PJ ou
 * sem tipo definido sempre mostra `"0.00"` aqui, mesmo que o
 * marketplace tenha a taxa cadastrada. Efeito colateral esperado (não
 * bug): lucro/margem sugeridos e praticados de uma mesma conexão podem
 * mudar só por trocar `storeDocumentType` entre PF/PJ.
 *
 * `percentageOfTotal` (2026-09-04, pedido direto do usuário — "quantos %
 * o preço de custo vale sobre o valor final e afins") — quanto cada
 * parcela acima representa em % sobre o preço de venda TOTAL
 * correspondente (não sobre o lucro nem sobre outra parcela). Calculado
 * no backend a partir dos MESMOS valores já arredondados exibidos acima
 * (`ProductMarketplacePricingCalculator::percentageOf`) — usar direto em
 * vez de recalcular no cliente evita qualquer discrepância entre o %
 * mostrado e a largura visual da barra (`buildPriceSegments`,
 * `pricingBreakdown.ts`, passou a usar esse valor em vez de dividir
 * `value ÷ price` localmente).
 */
export interface PricingBreakdownPercentages {
  ads: string
  affiliate: string
  commission: string
  costPrice: string
  coupon: string
  fixedFee: string
  individualFixedFee: string
  operationalCost: string
  profit: string
  tax: string
}

export interface PricingBreakdown {
  ads: string
  affiliate: string
  commission: string
  costPrice: string
  coupon: string
  fixedFee: string
  individualFixedFee: string
  operationalCost: string
  percentageOfTotal: PricingBreakdownPercentages
  profit: string
  tax: string
}

/**
 * Cálculo de precificação de UM vínculo produto↔marketplace — motor real
 * (`ProductMarketplacePricingCalculator`, baseado na planilha do usuário,
 * tarefa 76), não mais o `PricingCalculator` antigo nunca conectado a
 * rota nenhuma. `practicedProfit`/`practicedMarginPercentage`/
 * `practicedBreakdown` vêm `null` quando o vínculo ainda não tem
 * `practicedPrice` definido — não dá pra calcular lucro/margem/quebra de
 * um preço que não existe. `suggestedPrice`/`suggestedProfit`/
 * `suggestedBreakdown` sempre vêm calculados (preço que bateria a
 * `target_margin` do produto). `isApproximated` avisa quando nenhuma
 * faixa de comissão fechou exata (faixas contíguas, caso raro).
 *
 * `suggestedCampaignPrice`/`practicedCampaignPrice` (2026-09-03, "VALOR DO
 * ANÚNCIO PARA DESCONTO" da planilha real) — o preço MAIOR que o vendedor
 * precisa listar no anúncio pra, depois de aplicar o desconto de campanha
 * configurado (`USER_MARKETPLACE.campaignDiscountPercentage`), ainda
 * receber o preço sugerido/praticado de verdade. **Nunca é o preço já com
 * desconto aplicado** — é o inverso: `precoAtivo ÷ (1 − desconto%)`,
 * sempre MAIOR que o preço de venda correspondente. `practicedCampaignPrice`
 * só existe junto de `practicedPrice` (mesma regra do resto do par
 * praticado/sugerido).
 */
export interface PricingEvaluation {
  isApproximated: boolean
  meetsTargetMargin: boolean | null
  practicedBreakdown: PricingBreakdown | null
  practicedCampaignPrice: string | null
  practicedMarginPercentage: string | null
  practicedProfit: string | null
  suggestedBreakdown: PricingBreakdown
  suggestedCampaignPrice: string
  suggestedPrice: string
  suggestedProfit: string
}

/**
 * `id` aqui é o `PRODUCT_MARKETPLACE.id` (o vínculo) — é o que
 * `PATCH /products/{productId}/marketplaces/{productMarketplaceId}`
 * espera como segundo segmento da URL (`productId` vem de `productId`
 * neste mesmo objeto).
 */
export interface ProductMarketplacePricing {
  categoryId: string | null
  createdAt: string | null
  id: string
  practicedPrice: string | null
  pricing: PricingEvaluation
  productId: string
  productName: string
  userMarketplaceId: string
}

function toPricingBreakdownPercentages(
  percentages: ProductMarketplacePricingResource['pricing']['suggested_breakdown']['percentage_of_total'],
): PricingBreakdownPercentages {
  return {
    ads: percentages.ads,
    affiliate: percentages.affiliate,
    commission: percentages.commission,
    costPrice: percentages.cost_price,
    coupon: percentages.coupon,
    fixedFee: percentages.fixed_fee,
    individualFixedFee: percentages.individual_fixed_fee,
    operationalCost: percentages.operational_cost,
    profit: percentages.profit,
    tax: percentages.tax,
  }
}

function toPricingBreakdown(
  breakdown: ProductMarketplacePricingResource['pricing']['suggested_breakdown'],
): PricingBreakdown {
  return {
    ads: breakdown.ads,
    affiliate: breakdown.affiliate,
    commission: breakdown.commission,
    costPrice: breakdown.cost_price,
    coupon: breakdown.coupon,
    fixedFee: breakdown.fixed_fee,
    individualFixedFee: breakdown.individual_fixed_fee,
    operationalCost: breakdown.operational_cost,
    percentageOfTotal: toPricingBreakdownPercentages(breakdown.percentage_of_total),
    profit: breakdown.profit,
    tax: breakdown.tax,
  }
}

export function toProductMarketplacePricing(
  resource: ProductMarketplacePricingResource,
): ProductMarketplacePricing {
  const pricing = resource.pricing as unknown as PricingEvaluationResource

  return {
    categoryId: resource.category_id,
    createdAt: resource.created_at,
    id: resource.id,
    practicedPrice: resource.practiced_price,
    pricing: {
      isApproximated: pricing.is_approximated,
      meetsTargetMargin: pricing.meets_target_margin,
      practicedBreakdown: resource.pricing.practiced_breakdown
        ? toPricingBreakdown(resource.pricing.practiced_breakdown)
        : null,
      practicedCampaignPrice: pricing.practiced_campaign_price,
      practicedMarginPercentage: pricing.practiced_margin_percentage,
      practicedProfit: pricing.practiced_profit,
      suggestedBreakdown: toPricingBreakdown(resource.pricing.suggested_breakdown),
      suggestedCampaignPrice: pricing.suggested_campaign_price,
      suggestedPrice: pricing.suggested_price,
      suggestedProfit: pricing.suggested_profit,
    },
    productId: resource.product_id,
    productName: resource.product_name,
    userMarketplaceId: resource.user_marketplace_id,
  }
}
