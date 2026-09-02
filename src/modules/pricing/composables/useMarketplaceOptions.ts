import { ref } from 'vue'
import type { SelectOption } from '@/shared/components/ui/types/select.type'
import { listMarketplaces } from '../services/pricingApi'

/**
 * Lista de marketplaces pra popular o `Select` de filtro `marketplace_id`
 * em `AdminProductCategoriesView.vue` ("categorias já vinculadas a esse
 * marketplace"). Mesmo padrão de `useAdminPlanOptions.ts`
 * (`modules/billing/`) — local ao módulo, sobe pra `core/` só com um
 * segundo consumidor real.
 */
export function useMarketplaceOptions() {
  const options = ref<SelectOption[]>([])
  const isLoading = ref(false)

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      const result = await listMarketplaces({ perPage: 100, sort: 'name' })
      options.value = result.items.map((marketplace) => ({
        label: marketplace.name,
        value: marketplace.id,
      }))
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, load, options }
}
