import { computed, type Ref, ref } from 'vue'
import type { DataTableSortDirection } from '@/shared/components/ui/types/dataTable.type'

export interface ResourceListParams {
  page: number
  perPage: number
  search: string
  sortDirection: DataTableSortDirection
  sortKey: string | undefined
}

export interface ResourceListPage<T> {
  items: T[]
  total: number
}

export interface UseResourceListOptions<T> {
  fetchPage: (params: ResourceListParams) => Promise<ResourceListPage<T>>
  perPage?: number
}

/**
 * Motor genérico de listagem paginada/ordenável/pesquisável — pedido
 * direto do usuário, 2026-08-28: "um padrão pra reutilizarmos nos cruds,
 * tudo abstraído". Não sabe nada de domínio (`T` genérico) nem de
 * `services/`/API — recebe uma função `fetchPage` (o único ponto de
 * acoplamento com o backend de verdade) e só orquestra estado reativo em
 * cima dela. `modules/catalog/composables/useProductList.ts` é o
 * primeiro consumidor concreto — qualquer CRUD novo reaproveita este
 * composable, só troca o `fetchPage`.
 *
 * Deliberadamente sem debounce embutido: quem decide COMO/QUANDO chamar
 * `setSearch` (ex.: debounced via `refDebounced` do `@vueuse/core`) é o
 * componente consumidor — mantém este composable síncrono na chamada
 * (chama `refresh()` direto, sem watcher/timer escondido), o que também
 * é o que torna ele testável sem fake timers.
 */
export function useResourceList<T>(options: UseResourceListOptions<T>) {
  const perPage = options.perPage ?? 15

  const items = ref<T[]>([]) as Ref<T[]>
  const total = ref(0)
  const currentPage = ref(1)
  const search = ref('')
  const sortKey = ref<string | undefined>(undefined)
  const sortDirection = ref<DataTableSortDirection>(null)
  const isLoading = ref(false)
  const error = ref<unknown>(null)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / perPage)))

  /**
   * Achado real, 2026-09-10 (reportado pelo usuário — tela de
   * precificação com 2+ marketplaces, trocar de aba rápido "não ocultava
   * o conteúdo da aba anterior"): sem essa trava, um `refresh()` mais
   * LENTO que terminasse DEPOIS de um mais novo (ex.: resposta da aba que
   * o usuário acabou de sair chegando depois da resposta da aba em que
   * ele já está) sobrescrevia `items`/`total` com dado da requisição
   * ERRADA — corrida clássica de resposta fora de ordem. `latestRequestId`
   * marca qual chamada é a mais recente; ao resolver, só aplica o
   * resultado se ainda for essa mesma chamada — qualquer `refresh()`
   * (inclusive `setPage`/`setSearch`/`setSort`, que só chamam `refresh()`
   * por baixo) já fica protegido, não só o caso de trocar de aba.
   */
  let latestRequestId = 0

  async function refresh(): Promise<void> {
    latestRequestId += 1
    const requestId = latestRequestId
    isLoading.value = true

    try {
      const result = await options.fetchPage({
        page: currentPage.value,
        perPage,
        search: search.value,
        sortDirection: sortDirection.value,
        sortKey: sortKey.value,
      })

      if (requestId !== latestRequestId) {
        return
      }

      items.value = result.items
      total.value = result.total
      error.value = null
    } catch (caughtError) {
      if (requestId !== latestRequestId) {
        return
      }

      error.value = caughtError
    } finally {
      if (requestId === latestRequestId) {
        isLoading.value = false
      }
    }
  }

  /**
   * Achado real, 2026-09-10, mesmo dia — a trava de `latestRequestId`
   * acima resolve resposta fora de ordem DENTRO do mesmo contexto
   * (mesma conexão/aba), mas não cobre trocar pra um contexto TOTALMENTE
   * diferente (aba nova): o `fetchPage` que falha na conexão nova (ex.:
   * `422 errorMessageTargetMarginUnreachable`) cai no `catch`, que só seta
   * `error.value` — nunca limpou `items`/`total`, decisão original pra
   * não sumir com dado válido numa falha transitória do MESMO contexto.
   * Reportado pelo usuário via captura real: trocar de aba (Shein →
   * Shopee → Shein de novo) deixava a tabela/`Margem média` da aba
   * anterior visíveis por baixo do banner de erro da aba nova. `reset()`
   * é pro CONSUMIDOR chamar explicitamente ao trocar de contexto (nunca
   * automático dentro de `refresh()`, que continua preservando dado
   * válido numa falha transitória de verdade) — `ProductMarketplacePricingView.vue`
   * chama isso no `watch(activeConnectionId)`, antes de `refresh()`.
   * Também invalida qualquer `refresh()` já em voo (mesmo mecanismo de
   * `latestRequestId`) — sem isso, uma resposta lenta da aba anterior
   * ainda poderia resssuscitar dado velho depois do `reset()`.
   */
  function reset(): void {
    latestRequestId += 1
    items.value = []
    total.value = 0
    currentPage.value = 1
    error.value = null
  }

  async function setPage(page: number): Promise<void> {
    currentPage.value = page
    await refresh()
  }

  async function setSearch(value: string): Promise<void> {
    search.value = value
    currentPage.value = 1
    await refresh()
  }

  async function setSort(key: string, direction: DataTableSortDirection): Promise<void> {
    sortKey.value = direction ? key : undefined
    sortDirection.value = direction
    currentPage.value = 1
    await refresh()
  }

  return {
    currentPage,
    error,
    isLoading,
    items,
    perPage,
    refresh,
    reset,
    search,
    setPage,
    setSearch,
    setSort,
    sortDirection,
    sortKey,
    total,
    totalPages,
  }
}
