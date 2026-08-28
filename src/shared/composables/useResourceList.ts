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

  async function refresh(): Promise<void> {
    isLoading.value = true

    try {
      const result = await options.fetchPage({
        page: currentPage.value,
        perPage,
        search: search.value,
        sortDirection: sortDirection.value,
        sortKey: sortKey.value,
      })
      items.value = result.items
      total.value = result.total
      error.value = null
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
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
