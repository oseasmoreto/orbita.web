import type { components } from '@/core/api/schema'
import type { ActivePricing, PriceSegment, SegmentKey } from '../services/pricingBreakdown'
import type { ProductMarketplaceStatus } from './productMarketplace.type'

type ProductMarketplacePricingResource = components['schemas']['ProductMarketplacePricingResource']
type SimulateProductMarketplacePricingResource =
  components['schemas']['SimulateProductMarketplacePricingResource']

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
 *
 * `NonNullable<...>` (2026-09-11) — `pricing` virou `{...} | null` no
 * schema gerado (`docs/api/planejamento-shein.md` §4.2/§6); sem isso,
 * `Omit<A | null, K>` colapsa pra `{}` (keyof de uma união com `null`
 * é `never`), apagando todos os campos do tipo. A nulidade em si já é
 * tratada fora daqui (`toProductMarketplacePricing`, guard explícito em
 * `resource.pricing === null` antes de sequer chamar `toPricingEvaluation`).
 */
type PricingEvaluationResource = Omit<
  NonNullable<ProductMarketplacePricingResource['pricing']>,
  'is_approximated' | 'meets_target_margin'
> & {
  is_approximated: boolean
  meets_target_margin: boolean | null
}

/**
 * Quebra da composição do preço em 11 parcelas (pedido ao backend,
 * 2026-09-03, pra desenhar a barra empilhada do mockup —
 * `PricingDashboardMockupView.vue` — com dado real). Soma sempre bate
 * com o preço correspondente: `costPrice + shippingCost +
 * operationalCost + commission + fixedFee + tax + ads + affiliate +
 * coupon + individualFixedFee + profit = price`. `profit` pode vir
 * negativo (prejuízo) se o preço praticado for baixo demais.
 *
 * **Rename/colisão de nome, 2026-09-08 (pedido direto do usuário)** —
 * `PRODUCT.operational_cost` (custo FIXO em R$ do produto) virou
 * `PRODUCT.shipping_cost` ("Custos de envio"), porque
 * `COMPANY.operational_cost_percentage` (novo, percentual da EMPRESA —
 * achado real, mesmo dia: a 1ª versão desse campo tinha ido pra
 * `USER_MARKETPLACE`, por conexão; corrigido pelo backend logo em
 * seguida pra `COMPANY`, um valor só pra empresa toda) criou um segundo
 * conceito com o mesmo nome antigo. Efeito aqui: `shippingCost` é o
 * campo NOVO (mesmo valor que antes vivia em `operationalCost`);
 * `operationalCost` continua existindo nesta interface, mas agora vem
 * de uma fonte DIFERENTE — o percentual da EMPRESA, já convertido pro
 * valor em R$ deduzido do lucro. **Cuidado**: qualquer leitura antiga de
 * `breakdown.operationalCost` pra mostrar "o
 * custo operacional do PRODUTO" está lendo o valor ERRADO desde esta
 * mudança — o valor do produto agora mora em `breakdown.shippingCost`.
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
  calculatedFreight: string
  commission: string
  costPrice: string
  coupon: string
  fixedFee: string
  individualFixedFee: string
  operationalCost: string
  profit: string
  shippingCost: string
  tax: string
}

/**
 * `calculatedFreight` (`docs/api/planejamento-shein.md` §4.3, decisão
 * 2026-09-11) — frete calculado por peso (`ShippingRule`), somado ao
 * `shippingCost` já existente (custo de embalagem do próprio vendedor —
 * são custos DIFERENTES, nenhum substitui o outro). Sempre `"0.00"` pra
 * marketplace sem `requiresWeightAndDimensions` (Shopee/TikTok
 * inalterados, mesmo raciocínio de `individualFixedFee`).
 */
export interface PricingBreakdown {
  ads: string
  affiliate: string
  calculatedFreight: string
  commission: string
  costPrice: string
  coupon: string
  fixedFee: string
  individualFixedFee: string
  operationalCost: string
  percentageOfTotal: PricingBreakdownPercentages
  profit: string
  shippingCost: string
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
 * `docs/api/planejamento-shein.md` §4.2 ponto 3 / §6 item 3 — por que
 * `pricing` (abaixo) veio `null` pra esse vínculo: `category_required`
 * (marketplace usa `commissionStrategy=category` — `AdminMarketplace` —
 * e o vínculo ainda não tem `categoryId`, o caso comum de todo vínculo
 * AUTO-criado) ou `weight_and_dimensions_required` (marketplace exige
 * `requiresWeightAndDimensions` e o produto não tem peso/dimensão
 * preenchidos). A tela sinaliza isso INLINE na própria linha, nunca
 * trata como erro — é esperado, não uma falha.
 */
export type PricingUnavailableReason = 'category_required' | 'weight_and_dimensions_required'

/**
 * `id` aqui é o `PRODUCT_MARKETPLACE.id` (o vínculo) — é o que
 * `PATCH /products/{productId}/marketplaces/{productMarketplaceId}`
 * espera como segundo segmento da URL (`productId` vem de `productId`
 * neste mesmo objeto).
 *
 * `pricing`/`pricingUnavailableReason` (decisão 2026-09-11) — os dois
 * são mutuamente exclusivos: `pricing` vem `null` exatamente quando
 * `pricingUnavailableReason` vem preenchido, nunca os dois juntos nem os
 * dois `null`. Antes desta rodada `pricing` sempre existia (o motor
 * calculava pra qualquer vínculo) — passou a poder faltar com a
 * estratégia `category` (Shein) sem `categoryId` ainda escolhido.
 */
export interface ProductMarketplacePricing {
  categoryId: string | null
  createdAt: string | null
  id: string
  practicedPrice: string | null
  pricing: PricingEvaluation | null
  pricingUnavailableReason: PricingUnavailableReason | null
  productId: string
  productName: string
  status: ProductMarketplaceStatus
  userMarketplaceId: string
}

function toPricingBreakdownPercentages(
  percentages: NonNullable<
    ProductMarketplacePricingResource['pricing']
  >['suggested_breakdown']['percentage_of_total'],
): PricingBreakdownPercentages {
  return {
    ads: percentages.ads,
    affiliate: percentages.affiliate,
    calculatedFreight: percentages.calculated_freight,
    commission: percentages.commission,
    costPrice: percentages.cost_price,
    coupon: percentages.coupon,
    fixedFee: percentages.fixed_fee,
    individualFixedFee: percentages.individual_fixed_fee,
    operationalCost: percentages.operational_cost,
    profit: percentages.profit,
    shippingCost: percentages.shipping_cost,
    tax: percentages.tax,
  }
}

function toPricingBreakdown(
  breakdown: NonNullable<ProductMarketplacePricingResource['pricing']>['suggested_breakdown'],
): PricingBreakdown {
  return {
    ads: breakdown.ads,
    affiliate: breakdown.affiliate,
    calculatedFreight: breakdown.calculated_freight,
    commission: breakdown.commission,
    costPrice: breakdown.cost_price,
    coupon: breakdown.coupon,
    fixedFee: breakdown.fixed_fee,
    individualFixedFee: breakdown.individual_fixed_fee,
    operationalCost: breakdown.operational_cost,
    percentageOfTotal: toPricingBreakdownPercentages(breakdown.percentage_of_total),
    profit: breakdown.profit,
    shippingCost: breakdown.shipping_cost,
    tax: breakdown.tax,
  }
}

/**
 * Extraído de `toProductMarketplacePricing` em 2026-09-11 — o endpoint
 * novo de simulação (`GET .../simulate`, "testar um preço praticado
 * hipotético antes de aplicar de verdade") devolve o MESMO formato de
 * `pricing` (`SimulateProductMarketplacePricingResource`), só que os
 * booleanos já vêm certos de origem (não passa pela Action que anexa
 * `$evaluation` dinamicamente num Model — mesmo achado do comentário de
 * `PricingEvaluationResource` acima, que só se aplica ao endpoint de
 * listagem) — por isso aceita os 2 tipos sem precisar do cast
 * `as unknown as` de novo aqui dentro.
 */
function toPricingEvaluation(
  pricing: PricingEvaluationResource | SimulateProductMarketplacePricingResource,
): PricingEvaluation {
  return {
    isApproximated: pricing.is_approximated,
    meetsTargetMargin: pricing.meets_target_margin,
    practicedBreakdown: pricing.practiced_breakdown
      ? toPricingBreakdown(pricing.practiced_breakdown)
      : null,
    practicedCampaignPrice: pricing.practiced_campaign_price,
    practicedMarginPercentage: pricing.practiced_margin_percentage,
    practicedProfit: pricing.practiced_profit,
    suggestedBreakdown: toPricingBreakdown(pricing.suggested_breakdown),
    suggestedCampaignPrice: pricing.suggested_campaign_price,
    suggestedPrice: pricing.suggested_price,
    suggestedProfit: pricing.suggested_profit,
  }
}

/**
 * `resource.pricing`/`resource.pricing_unavailable_reason` — mesmo
 * achado do comentário de `PricingEvaluationResource` acima:
 * `pricing_unavailable_reason` sai do schema gerado como `string`
 * (nunca `string | null`), mas a fonte real
 * (`ListProductMarketplacePricingAction`, backend) manda `null` sempre
 * que `pricing` está presente — cast explícito aqui, mesmo padrão já
 * usado pros 2 booleanos.
 */
export function toProductMarketplacePricing(
  resource: ProductMarketplacePricingResource,
): ProductMarketplacePricing {
  const pricingUnavailableReason =
    resource.pricing_unavailable_reason as unknown as PricingUnavailableReason | null

  if (resource.pricing === null) {
    return {
      categoryId: resource.category_id,
      createdAt: resource.created_at,
      id: resource.id,
      practicedPrice: resource.practiced_price,
      pricing: null,
      pricingUnavailableReason,
      productId: resource.product_id,
      productName: resource.product_name,
      status: resource.status,
      userMarketplaceId: resource.user_marketplace_id,
    }
  }

  const pricing = resource.pricing as unknown as PricingEvaluationResource

  return {
    categoryId: resource.category_id,
    createdAt: resource.created_at,
    id: resource.id,
    practicedPrice: resource.practiced_price,
    pricing: toPricingEvaluation(pricing),
    pricingUnavailableReason: null,
    productId: resource.product_id,
    productName: resource.product_name,
    status: resource.status,
    userMarketplaceId: resource.user_marketplace_id,
  }
}

export function toSimulatedPricingEvaluation(
  resource: SimulateProductMarketplacePricingResource,
): PricingEvaluation {
  return toPricingEvaluation(resource)
}

/**
 * Alterna entre as 2 visões de `ProductMarketplacePricingView.vue` — sem
 * origem na API, estado de UI puro (mesma categoria de exemplo já citada
 * em `docs/infra/convencoes-frontend-infra.md` seção 6.1, "cria union
 * type manual pra algo que não existe no contrato da API"). Extraído pra
 * cá em 2026-09-10 (achado real reportado pelo usuário: `type`/`interface`
 * soltos dentro de um `.vue` é o único caso disso em todo o projeto —
 * toda outra tela/componente já mantinha tipo em `types/`, este arquivo
 * era a única exceção).
 */
export type PricingViewMode = 'bar' | 'table'

/**
 * Cada coluna de parcela da visão em tabela carrega valor + % (2026-09-04,
 * pedido direto do usuário — mesma % já exposta pelo backend,
 * `PriceSegment.percent`) — a célula mostra os dois juntos, mesmo par
 * `money (percent%)` já usado no preço principal da view.
 */
export type PricingTableSegmentCell = Pick<PriceSegment, 'percent' | 'value'>

/**
 * Linha achatada da visão em tabela de `ProductMarketplacePricingView.vue`
 * — praticado e sugerido viram COLUNAS separadas aqui (pedido direto do
 * usuário, 2026-09-03), diferente da visão em barra (só o preço "ativo",
 * `resolveActivePricing`). `practicedPrice`/`practicedMarginPercent`/
 * `practicedProfit` ficam `null` juntos quando ainda não há preço
 * praticado — os 3 sempre nascem/faltam em conjunto.
 */
/**
 * Linha pré-computada da visão em barra (`resolveActivePricing`/
 * `buildPriceSegments` rodados uma única vez por `displayRows`,
 * `ProductMarketplacePricingView.vue`) — extraído pra cá em 2026-09-11,
 * mesma componentização que gerou `PricingBarBreakdown.vue`
 * (`modules/pricing/components/blocks/`).
 *
 * `active`/`segments` viram `null`/`[]` (decisão 2026-09-11) quando
 * `row.pricing` é `null` — não dá pra resolver preço ativo/segmentos sem
 * cálculo nenhum vindo do backend. `PricingBarBreakdown.vue` mostra o
 * motivo (`row.pricingUnavailableReason`) no lugar do preço/barra nesse
 * caso.
 */
export interface PricingDisplayRow {
  active: ActivePricing | null
  row: ProductMarketplacePricing
  segments: PriceSegment[]
}

/**
 * `pricingUnavailableReason` (2026-09-11) — quando preenchido, os demais
 * campos numéricos/booleanos desta linha não têm significado nenhum
 * (mantidos com valor neutro só pra satisfazer o tipo — `0`/`'0.00'`/
 * `false` — nunca lidos: `PricingTableView.vue` sempre checa o motivo
 * ANTES de renderizar qualquer célula numérica).
 */
export type PricingTableRow = {
  id: string
  isApproximated: boolean
  meetsTargetMargin: boolean | null
  practicedCampaignPrice: string | null
  practicedMarginPercent: number | null
  practicedPrice: string | null
  practicedProfit: string | null
  pricingUnavailableReason: PricingUnavailableReason | null
  productId: string
  productName: string
  source: ProductMarketplacePricing
  status: ProductMarketplaceStatus
  suggestedCampaignPrice: string
  suggestedMarginPercent: number
  suggestedPrice: string
  suggestedProfit: string
} & Record<SegmentKey, PricingTableSegmentCell>
