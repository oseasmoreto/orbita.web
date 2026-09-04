/**
 * Formatação de moeda/percentual — `Intl.NumberFormat` nativo, sem lib
 * externa (seção 15.2 de `docs/infra/convencoes-frontend-infra.md`).
 * Aceita `string | number` porque a API sempre devolve decimal como
 * string (`fundamentos-api.md` §4, ex.: `ProductResource.full_sale_price`)
 * — converter aqui, não em cada consumidor.
 */
const moneyFormatter = new Intl.NumberFormat('pt-BR', { currency: 'BRL', style: 'currency' })

export function formatMoney(value: number | string): string {
  const numeric = typeof value === 'string' ? Number(value) : value
  return moneyFormatter.format(numeric)
}

/**
 * Mesmo valor de `formatMoney`, sem o símbolo "R$" — pedido direto do
 * usuário, 2026-09-04 ("copiar o preço sugerido... só mandar o numero
 * não mandar o R$ junto"): pro botão de copiar preço
 * (`ProductMarketplacePricingView.vue`), o vendedor cola o valor direto
 * num campo de preço do marketplace, que não aceita o símbolo de moeda
 * junto. Continua no formato decimal pt-BR (vírgula, ex.: `"75,47"`) —
 * é o que um campo de preço brasileiro espera, só sem `style: 'currency'`.
 */
const decimalFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
})

export function formatDecimal(value: number | string): string {
  const numeric = typeof value === 'string' ? Number(value) : value
  return decimalFormatter.format(numeric)
}

/**
 * `value` já vem na escala 0-100 (ex.: `PRODUCT.target_margin = "20.00"`
 * significa 20%, não 0.20) — dividido por 100 antes do `Intl`, que
 * espera a FRAÇÃO pro `style: 'percent'`.
 */
export function formatPercent(value: number | string, fractionDigits = 0): string {
  const numeric = typeof value === 'string' ? Number(value) : value
  const formatter = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
    style: 'percent',
  })
  return formatter.format(numeric / 100)
}
