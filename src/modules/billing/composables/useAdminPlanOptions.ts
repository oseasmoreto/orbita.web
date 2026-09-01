import { ref } from 'vue'
import type { SelectOption } from '@/shared/components/ui/types/select.type'
import { listAdminPlans } from '../services/billingApi'

/**
 * Lista de planos pra popular o `Select` de filtro `plan_id`
 * (`AdminSubscriptionsView.vue`, Fase 9 — fechamento de gaps do
 * OpenAPI). Fica local a `modules/billing/` — diferente de
 * `useAdminUserOptions` (`core/composables/`), só ESTE módulo consome
 * plano como opção de filtro, sem motivo pra promover ainda (mesmo
 * critério de "sobe só com um segundo consumidor real").
 */
export function useAdminPlanOptions() {
  const options = ref<SelectOption[]>([])
  const isLoading = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      const result = await listAdminPlans({ perPage: 100, sort: 'name' })
      options.value = result.items.map((plan) => ({ label: plan.name, value: plan.id }))
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, load, options }
}
