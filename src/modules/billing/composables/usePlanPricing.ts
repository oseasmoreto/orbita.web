import type { Plan } from '../types/plan.type'

/**
 * Regra de negócio real (não decoração): quanto esse plano custa por mês,
 * pra poder comparar um plano anual contra um mensal lado a lado — mesmo
 * padrão da referência visual mandada pelo usuário ("R$37,50/mês* Valor
 * equivalente pra comparação"). Anual não guarda um preço mensal
 * separado no backend (`PLAN.price` é o valor cobrado POR CICLO,
 * `docs/negocio/contexto-plataforma-precificacao.md` seção 2.2) — dividir
 * por 12 é a única forma honesta de chegar nesse número, sem inventar
 * campo novo.
 */
export function getMonthlyEquivalent(plan: Plan): number {
  const price = Number(plan.price)
  return plan.billingCycle === 'yearly' ? price / 12 : price
}

/**
 * Quanto o usuário economiza por ano escolhendo `yearlyPlan` em vez do
 * plano mensal mais barato disponível — `null` quando não há nenhum
 * plano mensal pra comparar, ou quando a conta não dá economia real
 * nenhuma (nunca mostra um "economize" negativo/zero na UI).
 */
export function getYearlySavings(yearlyPlan: Plan, plans: Plan[]): number | null {
  const monthlyPlans = plans.filter((plan) => plan.billingCycle === 'monthly')

  if (monthlyPlans.length === 0) {
    return null
  }

  const cheapestMonthly = monthlyPlans.reduce((cheapest, plan) =>
    Number(plan.price) < Number(cheapest.price) ? plan : cheapest,
  )

  const savings = Number(cheapestMonthly.price) * 12 - Number(yearlyPlan.price)

  return savings > 0 ? savings : null
}

/**
 * Qual plano ganha o badge de destaque ("Mais econômico") — sempre o de
 * menor equivalente mensal entre os listados, nunca um plano fixo por
 * nome/id: se a lista de planos mudar (admin cadastra um novo), o badge
 * segue o preço de verdade, não uma suposição hardcoded.
 *
 * Trial (`isTrial`) é excluído do comparativo — `PLAN.price = 0` o
 * tornaria trivialmente "o mais econômico" sempre que aparecesse na
 * lista (aparece em toda listagem pra quem nunca assinou,
 * `docs/negocio/contexto-plataforma-precificacao.md` seção 6), o que não
 * comunica nada útil: o badge existe pra destacar o melhor plano PAGO,
 * não pra apontar o óbvio de um teste grátis.
 */
export function findMostEconomicalPlan(plans: Plan[]): Plan | null {
  const eligiblePlans = plans.filter((plan) => !plan.isTrial)

  if (eligiblePlans.length === 0) {
    return null
  }

  return eligiblePlans.reduce((cheapest, plan) =>
    getMonthlyEquivalent(plan) < getMonthlyEquivalent(cheapest) ? plan : cheapest,
  )
}
