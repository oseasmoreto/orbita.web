import { useResourceList } from '@/shared/composables/useResourceList'

interface Row {
  id: string
  name: string
}

function createFetchPage(total: number) {
  const calls: unknown[] = []
  async function fetchPage(params: {
    page: number
    perPage: number
    search: string
    sortDirection: 'asc' | 'desc' | null
    sortKey: string | undefined
  }) {
    calls.push(params)
    const items: Row[] = Array.from({ length: Math.min(params.perPage, total) }, (_, i) => ({
      id: String(i),
      name: `Row ${i}`,
    }))
    return { items, total }
  }
  return { calls, fetchPage }
}

describe('useResourceList', () => {
  it('starts empty, not loading, on page 1', () => {
    const { fetchPage } = createFetchPage(0)
    const list = useResourceList({ fetchPage })

    expect(list.items.value).toEqual([])
    expect(list.total.value).toBe(0)
    expect(list.currentPage.value).toBe(1)
    expect(list.isLoading.value).toBe(false)
  })

  it('refresh() populates items/total and toggles isLoading around the call', async () => {
    const { fetchPage } = createFetchPage(42)
    const list = useResourceList({ fetchPage, perPage: 10 })

    const pending = list.refresh()
    expect(list.isLoading.value).toBe(true)
    await pending
    expect(list.isLoading.value).toBe(false)
    expect(list.items.value).toHaveLength(10)
    expect(list.total.value).toBe(42)
  })

  it('computes totalPages from total/perPage, minimum 1', async () => {
    const { fetchPage } = createFetchPage(21)
    const list = useResourceList({ fetchPage, perPage: 10 })

    await list.refresh()
    expect(list.totalPages.value).toBe(3)
  })

  it('totalPages stays 1 when there is no data yet', () => {
    const { fetchPage } = createFetchPage(0)
    const list = useResourceList({ fetchPage })

    expect(list.totalPages.value).toBe(1)
  })

  it('setPage updates currentPage and re-fetches with the new page', async () => {
    const { calls, fetchPage } = createFetchPage(100)
    const list = useResourceList({ fetchPage, perPage: 10 })

    await list.setPage(3)
    expect(list.currentPage.value).toBe(3)
    expect(calls.at(-1)).toMatchObject({ page: 3 })
  })

  it('setSearch resets currentPage to 1 and re-fetches with the search term', async () => {
    const { calls, fetchPage } = createFetchPage(100)
    const list = useResourceList({ fetchPage, perPage: 10 })

    await list.setPage(3)
    await list.setSearch('camiseta')
    expect(list.currentPage.value).toBe(1)
    expect(calls.at(-1)).toMatchObject({ page: 1, search: 'camiseta' })
  })

  it('setSort updates sortKey/sortDirection, resets currentPage, and clears the key when direction is null', async () => {
    const { calls, fetchPage } = createFetchPage(100)
    const list = useResourceList({ fetchPage, perPage: 10 })

    await list.setPage(2)
    await list.setSort('name', 'asc')
    expect(list.sortKey.value).toBe('name')
    expect(list.sortDirection.value).toBe('asc')
    expect(list.currentPage.value).toBe(1)
    expect(calls.at(-1)).toMatchObject({ page: 1, sortDirection: 'asc', sortKey: 'name' })

    await list.setSort('name', null)
    expect(list.sortKey.value).toBeUndefined()
    expect(list.sortDirection.value).toBeNull()
  })

  it('sets error and stops loading when fetchPage rejects, without touching existing items', async () => {
    const boom = new Error('network down')
    async function failingFetch() {
      throw boom
    }
    const list = useResourceList({ fetchPage: failingFetch })

    await list.refresh()
    expect(list.error.value).toBe(boom)
    expect(list.isLoading.value).toBe(false)
    expect(list.items.value).toEqual([])
  })

  it('discards a stale refresh() that resolves after a newer one was already applied (out-of-order race)', async () => {
    const resolvers: Array<(value: { items: Row[]; total: number }) => void> = []
    async function fetchPage() {
      return new Promise<{ items: Row[]; total: number }>((resolve) => {
        resolvers.push(resolve)
      })
    }
    const list = useResourceList({ fetchPage })

    const first = list.refresh()
    const second = list.refresh()

    // Resolve OUT OF ORDER — the newer call finishes first (2nd request in
    // flight), then the older one finishes last. Mirrors switching pricing
    // tabs quickly: the response for the tab the user LEFT can still land
    // after the response for the tab they're now ON.
    resolvers[1]?.({ items: [{ id: 'b', name: 'Row B' }], total: 1 })
    await second
    resolvers[0]?.({ items: [{ id: 'a', name: 'Row A' }], total: 1 })
    await first

    expect(list.items.value).toEqual([{ id: 'b', name: 'Row B' }])
    expect(list.total.value).toBe(1)
  })

  it('reset() clears items/total/error/page — needed when the caller switches to an unrelated context (e.g. pricing tab)', async () => {
    const { fetchPage } = createFetchPage(1)
    const list = useResourceList({ fetchPage })

    await list.refresh()
    await list.setPage(1)
    expect(list.items.value).toHaveLength(1)

    list.reset()

    expect(list.items.value).toEqual([])
    expect(list.total.value).toBe(0)
    expect(list.currentPage.value).toBe(1)
    expect(list.error.value).toBeNull()
  })

  it('reset() invalidates any refresh() already in flight — a stale response landing after reset() must not resurrect old data', async () => {
    let resolveSlow: ((value: { items: Row[]; total: number }) => void) | null = null
    async function slowFetch() {
      return new Promise<{ items: Row[]; total: number }>((resolve) => {
        resolveSlow = resolve
      })
    }
    const list = useResourceList({ fetchPage: slowFetch })

    const pending = list.refresh()
    list.reset()
    resolveSlow?.({ items: [{ id: 'x', name: 'Stale' }], total: 1 })
    await pending

    expect(list.items.value).toEqual([])
    expect(list.total.value).toBe(0)
  })

  it('clears a previous error on a successful refresh', async () => {
    const state: { shouldFail: boolean } = { shouldFail: true }
    async function flakyFetch() {
      if (state.shouldFail) {
        throw new Error('temporary')
      }
      return { items: [{ id: '1', name: 'Row 0' }], total: 1 }
    }
    const list = useResourceList({ fetchPage: flakyFetch })

    await list.refresh()
    expect(list.error.value).not.toBeNull()

    state.shouldFail = false
    await list.refresh()
    expect(list.error.value).toBeNull()
    expect(list.items.value).toHaveLength(1)
  })
})
