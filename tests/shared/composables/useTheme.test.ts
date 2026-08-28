import { useTheme } from '@/shared/composables/useTheme'

describe('useTheme', () => {
  it('toggles the theme, applying data-theme on the root element and persisting to localStorage', () => {
    const { theme, toggleTheme } = useTheme()

    toggleTheme()
    const first = theme.value
    expect(['light', 'dark']).toContain(first)
    expect(document.documentElement.dataset.theme).toBe(first)
    expect(localStorage.getItem('orbita-theme')).toBe(first)

    toggleTheme()
    const second = theme.value
    expect(second).not.toBe(first)
    expect(document.documentElement.dataset.theme).toBe(second)
    expect(localStorage.getItem('orbita-theme')).toBe(second)
  })

  it('shares state across independent calls (singleton em nível de módulo)', () => {
    const first = useTheme()
    const second = useTheme()

    first.toggleTheme()
    expect(second.theme.value).toBe(first.theme.value)

    // limpa pra não vazar estado pro próximo teste (singleton em nível de módulo)
    first.toggleTheme()
  })
})
