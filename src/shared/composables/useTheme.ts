import { ref } from 'vue'

const STORAGE_KEY = 'orbita-theme'

export type Theme = 'dark' | 'light'

function isTheme(value: string | null): value is Theme {
  return value === 'light' || value === 'dark'
}

function readStoredTheme(): Theme | undefined {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isTheme(stored) ? stored : undefined
}

function applyTheme(value: Theme | undefined): void {
  if (value) {
    document.documentElement.dataset.theme = value
  } else {
    delete document.documentElement.dataset.theme
  }
}

/**
 * Singleton em nível de módulo (mesmo padrão de `useAppShell.ts`) — é UM
 * tema por app, todo consumidor precisa enxergar o mesmo estado. Sem
 * preferência salva, o tema não é forçado: `_tokens.scss` já resolve
 * sozinho via `prefers-color-scheme` (ver `docs/design/design-system.md`,
 * "Known Gaps" — o par `SnowUI-Dark` já estava cabeado em
 * `:root[data-theme='dark']`, só faltava um jeito de o usuário LIGAR
 * explicitamente; esta é essa primeira peça, não uma mudança nos tokens).
 * Preferência explícita (depois de um toggle) persiste via
 * `localStorage`, sobrepõe o SO até o usuário trocar de novo.
 */
const theme = ref<Theme | undefined>(readStoredTheme())
applyTheme(theme.value)

export function useTheme() {
  function toggleTheme(): void {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    theme.value = next
    localStorage.setItem(STORAGE_KEY, next)
    applyTheme(next)
  }

  return { theme, toggleTheme }
}
