import type { PlanLimits } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'
import {
  isPlanResourceLimitReached,
  usePlanResourceLimit,
} from '@/shared/composables/usePlanResourceLimit'

/**
 * Checagem PROATIVA de `PLAN.max_marketplaces` — mesmo padrão de
 * `modules/catalog/composables/usePlanLimit.ts`, ambos em cima de
 * `usePlanResourceLimit` (`shared/composables/`). A validação REAL
 * continua sendo `CreateUserMarketplaceAction` (backend,
 * `MarketplaceLimitReachedException`) — isso só evita o usuário chegar a
 * clicar "Conectar" pra descobrir via 422 que já bateu o limite.
 */
export function isMarketplaceLimitReached(
  planLimits: PlanLimits | null,
  currentCount: number,
): boolean {
  return isPlanResourceLimitReached(planLimits?.maxMarketplaces ?? null, currentCount)
}

export function useMarketplaceLimit(currentCount: () => number) {
  const authStore = useAuthStore()

  const { isLimitReached, limit: maxMarketplaces } = usePlanResourceLimit(
    () => authStore.user?.planLimits?.maxMarketplaces ?? null,
    currentCount,
  )

  return { isLimitReached, maxMarketplaces }
}
