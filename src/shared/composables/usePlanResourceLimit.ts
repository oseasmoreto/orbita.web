import { computed } from 'vue'

/**
 * Checagem PROATIVA (antes de submeter) de um limite numérico do plano —
 * generalização de `modules/catalog/composables/usePlanLimit.ts`
 * (`max_products`), extraída em 2026-08-31 ao precisar do MESMO padrão
 * pra `max_marketplaces` (`modules/pricing/composables/useMarketplaceLimit.ts`)
 * — evita recriar o mesmo par função-pura/wrapper-reativo pela segunda
 * vez (mesmo espírito do `useResourceForm`/`useNumberFieldModel`,
 * `.ai/rules/crud-pattern.md`). Complementa, nunca substitui, a
 * validação REAL e reativa do backend (a Action correspondente continua
 * a trava de verdade) — só evita o usuário chegar a clicar "Salvar" pra
 * descobrir via 422 que já bateu o limite.
 *
 * `limit: null` cobre `admin_master` (sem assinatura própria) e plano
 * sem limite nesse recurso — nesses casos nunca bloqueia.
 */
export function isPlanResourceLimitReached(limit: number | null, currentCount: number): boolean {
  if (limit === null) {
    return false
  }

  return currentCount >= limit
}

/**
 * Wrapper reativo — recebe o limite e a contagem atual já resolvidos
 * pelo consumidor (`() => authStore.user?.planLimits?.maxProducts ?? null`,
 * `() => list.total.value`) — não sabe nada de `authStore`/domínio, só
 * orquestra a checagem reativa em cima do que já foi decidido de fora.
 */
export function usePlanResourceLimit(limit: () => number | null, currentCount: () => number) {
  const isLimitReached = computed(() => isPlanResourceLimitReached(limit(), currentCount()))

  return { isLimitReached, limit: computed(limit) }
}
