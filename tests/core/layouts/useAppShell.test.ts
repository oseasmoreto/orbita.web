import { useAppShell } from '@/core/layouts/useAppShell'

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

  it('starts with no unread notifications', () => {
    const { hasUnreadNotifications } = useAppShell()
    expect(hasUnreadNotifications.value).toBe(false)
  })

  it('lets the notification module report unread notifications', () => {
    const { hasUnreadNotifications, setHasUnreadNotifications } = useAppShell()

    setHasUnreadNotifications(true)
    expect(hasUnreadNotifications.value).toBe(true)

    setHasUnreadNotifications(false)
    expect(hasUnreadNotifications.value).toBe(false)
  })
})
