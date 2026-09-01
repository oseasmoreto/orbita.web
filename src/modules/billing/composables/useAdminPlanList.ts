import { ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listAdminPlans } from '../services/billingApi'
import type { AdminPlan } from '../types/plan.type'

/**
 * `GET /admin/plans` só ordena por essas 3 colunas
 * (`core/api/schema.d.ts`, `adminPlan.index`) — mesmo critério de
 * `buildAdminMarketplaceSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  name: 'name',
  price: 'price',
}

export function buildAdminPlanSortParam(
  key: string | undefined,
  direction: DataTableSortDirection,
): string | undefined {
  if (!(key && direction)) {
    return undefined
  }

  const param = SORT_PARAM[key]

  if (!param) {
    return undefined
  }

  return direction === 'desc' ? `-${param}` : param
}

/**
 * Wrapper de `useResourceList` pra `AdminPlan`. Filtro de
 * `billing_cycle` (`ListToolbar` `#filters`, 2026-09-01, pedido direto
 * do usuário) — aplicado imediatamente na troca do `Select`, mesmo
 * padrão de `useAdminMarketplaceList.ts` (inclusive o sentinel `'all'`
 * pra "limpar filtro" — `SelectItem` da Reka UI rejeita `value=""`).
 * Não confundir com o `BlockTab`
 * de `useChoosePlan.ts`/`MySubscriptionView.vue` (billing DO USUÁRIO,
 * dualidade `plans`/`visiblePlans` pra comparar ciclos entre si) — este
 * é o CRUD de admin, sem essa necessidade.
 */
export function useAdminPlanList() {
  const billingCycleFilter = ref('all')

  const list = useResourceList<AdminPlan>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listAdminPlans({
        billingCycle: billingCycleFilter.value === 'all' ? undefined : billingCycleFilter.value,
        page,
        perPage,
        sort: buildAdminPlanSortParam(sortKey, sortDirection) ?? '-created_at',
      })
      return { items: result.items, total: result.meta.total }
    },
  })

  async function setBillingCycleFilter(value: string): Promise<void> {
    billingCycleFilter.value = value
    await list.setPage(1)
  }

  return { ...list, billingCycleFilter, setBillingCycleFilter }
}
