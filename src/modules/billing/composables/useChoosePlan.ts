import { ref } from 'vue'
import { listPlans } from '../services/billingApi'
import type { BillingCycle, Plan } from '../types/plan.type'

/**
 * Sem paginação/busca/ordenação de UI — a tela de escolha de plano
 * mostra todos os planos ativos de uma vez (`useResourceList` seria
 * over-engineering aqui, esse composable não tem paginação/filtro pra
 * orquestrar além do ciclo de cobrança). Zero ramificação de negócio — o
 * cálculo de preço/economia mora em `usePlanPricing.ts`, testado à parte.
 *
 * **Seletor de ciclo de cobrança, pedido direto do usuário em 2026-08-31**
 * ("adicione o filtro por ?filter[billing_cycle]=monthly... pro usuário
 * poder filtrar e ver") — `ChoosePlanView.vue`/`MySubscriptionView.vue`
 * reaproveitam este MESMO composable, então o seletor entra aqui uma
 * única vez em vez de duplicado nas duas telas.
 *
 * **Duas listas, de propósito, não uma só filtrada**:
 * - `plans` — SEMPRE a lista completa (`listPlans()` sem filtro), nunca
 *   muda com o seletor. Necessária pra 3 cálculos que precisam enxergar
 *   os DOIS ciclos ao mesmo tempo, mesmo com o usuário filtrando a
 *   exibição: `getYearlySavings` (compara um plano anual contra o mensal
 *   mais barato — se `plans` já viesse filtrada só pra "anual", nunca
 *   encontraria um mensal pra comparar e a badge "economize" sumiria
 *   sempre que o filtro estivesse em "Anual"); e, em
 *   `MySubscriptionView.vue`, resolver `currentPlan`/`pendingPlan` por
 *   `plan_id` — o plano ATUAL do usuário pode ser de um ciclo diferente
 *   do que ele está filtrando pra OLHAR agora, e sumir do resumo da
 *   assinatura seria um bug real, não um filtro funcionando.
 * - `visiblePlans` — a lista que a grade de cards realmente renderiza,
 *   refeita via `GET /plans?filter[billing_cycle]=...` de verdade
 *   (`setBillingCycle`) toda vez que o seletor muda — não um filtro
 *   client-side em cima de `plans`, o pedido foi explicitamente pelo
 *   parâmetro real da API.
 */
export function useChoosePlan() {
  const plans = ref<Plan[]>([])
  const visiblePlans = ref<Plan[]>([])
  const billingCycle = ref<BillingCycle>('monthly')
  const isLoading = ref(false)
  const hasError = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      const [allResult, visibleResult] = await Promise.all([
        listPlans(),
        listPlans({ billingCycle: billingCycle.value }),
      ])
      plans.value = allResult.items
      visiblePlans.value = visibleResult.items
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function setBillingCycle(cycle: BillingCycle): Promise<void> {
    if (billingCycle.value === cycle) {
      return
    }

    billingCycle.value = cycle
    isLoading.value = true
    hasError.value = false

    try {
      const result = await listPlans({ billingCycle: cycle })
      visiblePlans.value = result.items
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return { billingCycle, hasError, isLoading, load, plans, setBillingCycle, visiblePlans }
}
