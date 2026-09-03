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
 * Quebra da composição do preço em 7 parcelas (pedido ao backend,
 * 2026-09-03, pra desenhar a barra empilhada do mockup —
 * `PricingDashboardMockupView.vue` — com dado real). Soma sempre bate
 * com o preço correspondente: `costPrice + operationalCost + commission
 * + fixedFee + tax + ads + profit = price`. `profit` pode vir negativo
 * (prejuízo) se o preço praticado for baixo demais — nunca um segmento
 * de "comissão de campanha": `USER_MARKETPLACE.campaignDiscountPercentage`
 * não entra nessa fórmula (confirmado com o backend, campo só
 * armazenado, sem uso no cálculo ainda), diferente do mockup antigo
 * (100% especulado, sem API por trás) que tinha esse 8º segmento.
 */
export interface PricingBreakdown {
  ads: string
  commission: string
  costPrice: string
  fixedFee: string
  operationalCost: string
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
 */
export interface PricingEvaluation {
  isApproximated: boolean
  meetsTargetMargin: boolean | null
  practicedBreakdown: PricingBreakdown | null
  practicedMarginPercentage: string | null
  practicedProfit: string | null
  suggestedBreakdown: PricingBreakdown
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

function toPricingBreakdown(
  breakdown: ProductMarketplacePricingResource['pricing']['suggested_breakdown'],
): PricingBreakdown {
  return {
    ads: breakdown.ads,
    commission: breakdown.commission,
    costPrice: breakdown.cost_price,
    fixedFee: breakdown.fixed_fee,
    operationalCost: breakdown.operational_cost,
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
      practicedMarginPercentage: pricing.practiced_margin_percentage,
      practicedProfit: pricing.practiced_profit,
      suggestedBreakdown: toPricingBreakdown(resource.pricing.suggested_breakdown),
      suggestedPrice: pricing.suggested_price,
      suggestedProfit: pricing.suggested_profit,
    },
    productId: resource.product_id,
    productName: resource.product_name,
    userMarketplaceId: resource.user_marketplace_id,
  }
}
