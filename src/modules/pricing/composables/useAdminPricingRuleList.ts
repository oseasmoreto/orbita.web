import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'
import { useResourceList } from '@/shared/composables/useResourceList'
import { listPricingRules } from '../services/pricingApi'
import type { PricingRule } from '../types/pricingRule.type'

/**
 * `GET /marketplaces/{id}/pricing-rules` só ordena por essas 3 colunas
 * (`core/api/schema.d.ts`, `pricingRule.index`).
 */
const SORT_PARAM: Record<string, string> = {
  createdAt: 'created_at',
  order: 'order',
  rangeMin: 'range_min',
}

export function buildPricingRuleSortParam(
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
 * Wrapper de `useResourceList` pra `PricingRule` de UM marketplace —
 * `marketplaceId` fixo pra uma instância (mesmo padrão de
 * `useProductLaunchList.ts`). Leitura via endpoint COMPARTILHADO
 * (`listPricingRules`, `auth:sanctum` só) — funciona pro admin igual
 * pra qualquer usuário, só a escrita (`useAdminPricingRuleForm.ts`) é
 * exclusiva do admin.
 */
export function useAdminPricingRuleList(marketplaceId: string) {
  return useResourceList<PricingRule>({
    fetchPage: async ({ page, perPage, sortDirection, sortKey }) => {
      const result = await listPricingRules(marketplaceId, {
        page,
        perPage,
        sort: buildPricingRuleSortParam(sortKey, sortDirection),
      })
      return { items: result.items, total: result.meta.total }
    },
    perPage: 10,
  })
}
