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

  it('shares state across independent calls (singleton em nível de módulo)', () => {
    const first = useAppShell()
    const second = useAppShell()

    first.openMobileNav()
    expect(second.isMobileNavOpen.value).toBe(true)

    first.closeMobileNav()
  })
})
