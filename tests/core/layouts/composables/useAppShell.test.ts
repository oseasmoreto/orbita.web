import { useAppShell } from '@/core/layouts/composables/useAppShell'

describe('useAppShell', () => {
  it('starts with the mobile nav closed', () => {
    const { isMobileNavOpen } = useAppShell()
    expect(isMobileNavOpen.value).toBe(false)
  })

  it('opens, closes and toggles the mobile nav', () => {
    const { closeMobileNav, isMobileNavOpen, openMobileNav, toggleMobileNav } = useAppShell()

    openMobileNav()
    expect(isMobileNavOpen.value).toBe(true)

    closeMobileNav()
    expect(isMobileNavOpen.value).toBe(false)

    toggleMobileNav()
    expect(isMobileNavOpen.value).toBe(true)
    toggleMobileNav()
    expect(isMobileNavOpen.value).toBe(false)
  })

  it('expands and collapses a nav item by id, independently of other ids', () => {
    const { isItemExpanded, toggleItem } = useAppShell()

    expect(isItemExpanded('billing')).toBe(false)

    toggleItem('billing')
    expect(isItemExpanded('billing')).toBe(true)
    expect(isItemExpanded('catalog')).toBe(false)

    toggleItem('catalog')
    expect(isItemExpanded('billing')).toBe(true)
    expect(isItemExpanded('catalog')).toBe(true)

    toggleItem('billing')
    expect(isItemExpanded('billing')).toBe(false)
    expect(isItemExpanded('catalog')).toBe(true)

    // limpa pra não vazar estado pro próximo teste (singleton em nível de módulo)
    toggleItem('catalog')
  })

  it('expands an item idempotently, never collapsing it back (unlike toggleItem)', () => {
    const { expandItem, isItemExpanded, toggleItem } = useAppShell()

    expect(isItemExpanded('reports')).toBe(false)

    expandItem('reports')
    expect(isItemExpanded('reports')).toBe(true)

    // chamar de novo não fecha (diferente de toggleItem) — precisa ser
    // seguro remontar um componente que expande por padrão sem reverter
    // uma expansão já em andamento.
    expandItem('reports')
    expect(isItemExpanded('reports')).toBe(true)

    // limpa pra não vazar estado pro próximo teste (singleton em nível de módulo)
    toggleItem('reports')
  })

  it('shares state across independent calls (singleton em nível de módulo)', () => {
    const first = useAppShell()
    const second = useAppShell()

    first.openMobileNav()
    expect(second.isMobileNavOpen.value).toBe(true)

    first.closeMobileNav()
  })

  it('starts with the notification panel closed', () => {
    const { isNotificationPanelOpen } = useAppShell()
    expect(isNotificationPanelOpen.value).toBe(false)
  })

  it('opens, closes and toggles the notification panel', () => {
    const {
      closeNotificationPanel,
      isNotificationPanelOpen,
      openNotificationPanel,
      toggleNotificationPanel,
    } = useAppShell()

    openNotificationPanel()
    expect(isNotificationPanelOpen.value).toBe(true)

    closeNotificationPanel()
    expect(isNotificationPanelOpen.value).toBe(false)

    toggleNotificationPanel()
    expect(isNotificationPanelOpen.value).toBe(true)
    toggleNotificationPanel()
    expect(isNotificationPanelOpen.value).toBe(false)
  })

  it('starts with the desktop sidebar expanded (not collapsed)', () => {
    const { isDesktopSidebarCollapsed } = useAppShell()
    expect(isDesktopSidebarCollapsed.value).toBe(false)
  })

  it('toggles the desktop sidebar collapsed state', () => {
    const { isDesktopSidebarCollapsed, toggleDesktopSidebar } = useAppShell()

    toggleDesktopSidebar()
    expect(isDesktopSidebarCollapsed.value).toBe(true)

    toggleDesktopSidebar()
    expect(isDesktopSidebarCollapsed.value).toBe(false)
  })

  it('starts with no recent pages', () => {
    localStorage.clear()
    const { recentPages } = useAppShell()
    expect(recentPages.value).toEqual([])
  })

  it('records a visited page, most recent first', () => {
    localStorage.clear()
    const { recentPages, recordVisit } = useAppShell()

    recordVisit({ id: 'home', label: 'Dashboard', to: { name: 'home' } })
    recordVisit({ id: 'products', label: 'Produtos', to: { name: 'products' } })

    expect(recentPages.value.map((page) => page.id)).toEqual(['products', 'home'])
  })

  it('moves a repeated visit back to the front instead of duplicating it', () => {
    localStorage.clear()
    const { recentPages, recordVisit } = useAppShell()

    recordVisit({ id: 'home', label: 'Dashboard', to: { name: 'home' } })
    recordVisit({ id: 'products', label: 'Produtos', to: { name: 'products' } })
    recordVisit({ id: 'home', label: 'Dashboard', to: { name: 'home' } })

    expect(recentPages.value.map((page) => page.id)).toEqual(['home', 'products'])
  })

  it('caps the list at the 5 most recent pages', () => {
    localStorage.clear()
    const { recentPages, recordVisit } = useAppShell()

    for (let index = 0; index < 7; index += 1) {
      recordVisit({ id: `page-${index}`, label: `Page ${index}`, to: { name: `page-${index}` } })
    }

    expect(recentPages.value).toHaveLength(5)
    expect(recentPages.value.map((page) => page.id)).toEqual([
      'page-6',
      'page-5',
      'page-4',
      'page-3',
      'page-2',
    ])
  })

  it('persists recent pages across composable instances (localStorage-backed singleton)', () => {
    const first = useAppShell()
    first.recordVisit({
      id: 'persist-check',
      label: 'Persist Check',
      to: { name: 'persist-check' },
    })

    const stored = JSON.parse(localStorage.getItem('orbita-recent-pages') ?? '[]')
    expect(stored[0]?.id).toBe('persist-check')

    // outra chamada de `useAppShell()` enxerga o MESMO estado (singleton),
    // e o localStorage reflete exatamente o `ref` em memória.
    const second = useAppShell()
    expect(second.recentPages.value[0]?.id).toBe('persist-check')
    expect(second.recentPages.value).toEqual(stored)
  })
})
