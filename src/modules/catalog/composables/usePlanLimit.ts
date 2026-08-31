import { computed } from 'vue'
import type { PlanLimits } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'

/**
 * Checagem PROATIVA (antes de submeter) do limite de produtos do plano —
 * complementa, não substitui, a validação real e reativa do backend
 * (`CreateProductAction`, `ProductLimitReachedException` →
 * `errorMessageProductLimitReached`, já registrada em `pt-BR.ts`). Esta
 * função só evita o usuário chegar a clicar "Salvar" pra descobrir via
 * 422 que já bateu o limite — a fonte de verdade do LIMITE em si continua
 * sendo `PLAN.max_products`, lido aqui via `authStore.user.planLimits`
 * (denormalizado em `LoginResultResource`, pedido pra sessão de backend em
 * 2026-08-31 especificamente pra `usePlanLimit` nunca precisar importar
 * `modules/billing` — `modules/catalog` não pode importar de outro módulo
 * direto, `docs/infra/convencoes-frontend-infra.md` seção 2).
 *
 * `planLimits: null` cobre `admin_master` (sem assinatura própria) e
 * qualquer estado transitório de sessão ainda não carregada — nesses
 * casos não há limite conhecido pra aplicar, então nunca bloqueia (o
 * backend continua a única trava real pra esse usuário, que de qualquer
 * forma nunca teria produto próprio pra contar). `maxProducts: null`
 * dentro de um `PlanLimits` real significa plano sem limite nesse
 * recurso — mesma convenção já usada em `PLAN.max_products` (backend).
 */
export function isProductLimitReached(
  planLimits: PlanLimits | null,
  currentCount: number,
): boolean {
  const maxProducts = planLimits?.maxProducts

  if (maxProducts === undefined || maxProducts === null) {
    return false
  }

  return currentCount >= maxProducts
}

/**
 * Wrapper reativo pra `ProductsView.vue` — lê o limite da store de auth e
 * recebe a contagem atual como parâmetro (não busca sozinho: quem já tem
 * o total carregado é `useProductList` via `list.total`, duplicar essa
 * busca aqui seria uma segunda fonte de verdade pro mesmo número).
 */
export function usePlanLimit(currentCount: () => number) {
  const authStore = useAuthStore()

  const maxProducts = computed(() => authStore.user?.planLimits?.maxProducts ?? null)

  const isLimitReached = computed(() =>
    isProductLimitReached(authStore.user?.planLimits ?? null, currentCount()),
  )

  return { isLimitReached, maxProducts }
}
