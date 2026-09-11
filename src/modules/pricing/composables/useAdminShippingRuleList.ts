import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listShippingRules } from '../services/pricingApi'
import type { ShippingRule } from '../types/shippingRule.type'

/**
 * `GET /marketplaces/{id}/shipping-rules` só ordena por essas colunas
 * (`core/api/schema.d.ts`, `shippingRule.index`) — mirror de
 * `buildPricingRuleSortParam`.
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  order: 'order',
  weightMin: 'weight_min',
}

export function buildShippingRuleSortParam(
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
 * Wrapper de `useResourceList` pra `ShippingRule` de UM marketplace —
 * mirror exato de `useAdminPricingRuleList.ts`. Leitura via endpoint
 * COMPARTILHADO, escrita exclusiva do admin
 * (`useAdminShippingRuleForm.ts`).
 */
export function useAdminShippingRuleList(marketplaceId: string) {
  return useResourceList<ShippingRule>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listShippingRules(marketplaceId, {
        page,
        perPage,
        sort: buildShippingRuleSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })
}
