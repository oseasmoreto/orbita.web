import { ref } from 'vue'
import { listPlans } from '../services/billingApi'
import type { Plan } from '../types/plan.type'

/**
 * Sem paginação/busca/ordenação de UI — a tela de escolha de plano
 * mostra todos os planos ativos de uma vez (`useResourceList` seria
 * over-engineering aqui, esse composable não tem paginação/filtro pra
 * orquestrar). Zero ramificação de negócio — o cálculo de preço/economia
 * mora em `usePlanPricing.ts`, testado à parte.
 */
export function useChoosePlan() {
  const plans = ref<Plan[]>([])
  const isLoading = ref(false)
  const hasError = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true
    hasError.value = false

    try {
      const result = await listPlans()
      plans.value = result.items
    } catch {
      hasError.value = true
    } finally {
      isLoading.value = false
    }
  }

  return { hasError, isLoading, load, plans }
}
