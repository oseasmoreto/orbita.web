import type { PlanLimits } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'
import {
  isPlanResourceLimitReached,
  usePlanResourceLimit,
} from '@/shared/composables/usePlanResourceLimit'

/**
 * Checagem PROATIVA de `PLAN.max_products` — wrapper fino sobre
 * `usePlanResourceLimit`/`isPlanResourceLimitReached`
 * (`shared/composables/`, generalizado em 2026-08-31 quando
 * `useMarketplaceLimit.ts` precisou do MESMO padrão pra
 * `max_marketplaces`, evitando um segundo arquivo quase idêntico). A
 * validação REAL continua sendo `CreateProductAction` (backend) — isso
 * só evita o usuário chegar a clicar "Salvar" pra descobrir via 422 que
 * já bateu o limite.
 */
export function isProductLimitReached(
  planLimits: PlanLimits | null,
  currentCount: number,
): boolean {
  return isPlanResourceLimitReached(planLimits?.maxProducts ?? null, currentCount)
}

export function usePlanLimit(currentCount: () => number) {
  const authStore = useAuthStore()

  const { isLimitReached, limit: maxProducts } = usePlanResourceLimit(
    () => authStore.user?.planLimits?.maxProducts ?? null,
    currentCount,
  )

  return { isLimitReached, maxProducts }
}
