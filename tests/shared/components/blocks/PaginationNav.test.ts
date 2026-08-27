import { mount } from '@vue/test-utils'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'

function pageButtons(wrapper: ReturnType<typeof mount>) {
  return wrapper.findAll('[data-testid="pagination-page"]')
}

describe('PaginationNav', () => {
  it('renders every page number when totalPages fits the visible window', () => {
    const wrapper = mount(PaginationNav, { props: { currentPage: 1, totalPages: 5 } })

    const labels = pageButtons(wrapper).map((button) => button.text())
    expect(labels).toEqual(['1', '2', '3', '4', '5'])
  })

  it('marks the current page button', () => {
    const wrapper = mount(PaginationNav, { props: { currentPage: 3, totalPages: 5 } })

    const current = wrapper.find('[data-testid="pagination-page"][aria-current="page"]')
    expect(current.text()).toBe('3')
  })

  it('windows the visible pages around the current page when totalPages exceeds the window', () => {
    const wrapper = mount(PaginationNav, { props: { currentPage: 5, totalPages: 10 } })

    const labels = pageButtons(wrapper).map((button) => button.text())
    expect(labels).toEqual(['3', '4', '5', '6', '7'])
  })

  it('clamps the window at the start and end of the range', () => {
    const atStart = mount(PaginationNav, { props: { currentPage: 1, totalPages: 10 } })
    expect(pageButtons(atStart).map((button) => button.text())).toEqual(['1', '2', '3', '4', '5'])

    const atEnd = mount(PaginationNav, { props: { currentPage: 10, totalPages: 10 } })
    expect(pageButtons(atEnd).map((button) => button.text())).toEqual(['6', '7', '8', '9', '10'])
  })

  it('emits update:currentPage when a page number is clicked', async () => {
    const wrapper = mount(PaginationNav, { props: { currentPage: 1, totalPages: 5 } })

    await pageButtons(wrapper)[2]?.trigger('click')

    expect(wrapper.emitted('update:currentPage')).toEqual([[3]])
  })

  it('emits the next/previous page and disables at the boundaries', async () => {
    const wrapper = mount(PaginationNav, { props: { currentPage: 1, totalPages: 3 } })

    const prev = wrapper.find('[data-testid="pagination-prev"]')
    const next = wrapper.find('[data-testid="pagination-next"]')

    expect(prev.attributes('disabled')).toBeDefined()
    expect(next.attributes('disabled')).toBeUndefined()

    await next.trigger('click')
    expect(wrapper.emitted('update:currentPage')).toEqual([[2]])

    await wrapper.setProps({ currentPage: 3 })
    expect(next.attributes('disabled')).toBeDefined()
  })
})
