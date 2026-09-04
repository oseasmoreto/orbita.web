import { computed, ref } from 'vue'

/**
 * `beforeinstallprompt` só existe em navegadores Chromium (Chrome/Edge/
 * Android) — Firefox desktop e Safari/iOS não têm API programática de
 * instalação de PWA, então o `lib.dom.ts` do TypeScript não declara esse
 * evento/interface. Tipado aqui à mão, mínimo necessário.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function isRunningStandalone(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  const isDisplayModeStandalone = window.matchMedia?.('(display-mode: standalone)').matches ?? false
  // `navigator.standalone` é a única forma de detectar isso no iOS/Safari,
  // que não dispara `beforeinstallprompt`/`appinstalled` — não existe no
  // `lib.dom.ts` padrão, daí o cast.
  const isIosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true

  return isDisplayModeStandalone || isIosStandalone
}

/**
 * Singleton em nível de módulo (mesmo padrão de `useTheme.ts`/`useAppShell.ts`)
 * — `beforeinstallprompt` dispara UMA vez só, cedo no carregamento da
 * página; se o listener fosse registrado dentro de `useInstallPrompt()`
 * (chamado só quando `AccountView.vue`, uma rota lazy-loaded, monta), o
 * evento já teria disparado e sido perdido antes do listener existir.
 * Registrar aqui, em código de nível de módulo, garante que o listener já
 * está ativo assim que este arquivo é importado pela primeira vez — desde
 * que essa importação aconteça cedo (`App.vue`, ver `useAppUpdatePrompt`
 * pro mesmo precedente).
 */
const deferredEvent = ref<BeforeInstallPromptEvent | null>(null)
const isInstalled = ref(isRunningStandalone())

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredEvent.value = event as BeforeInstallPromptEvent
  })

  window.addEventListener('appinstalled', () => {
    deferredEvent.value = null
    isInstalled.value = true
  })
}

export function useInstallPrompt() {
  const canInstall = computed(() => deferredEvent.value !== null && !isInstalled.value)

  async function promptInstall(): Promise<void> {
    const event = deferredEvent.value
    if (!event) {
      return
    }

    await event.prompt()
    const choice = await event.userChoice

    if (choice.outcome === 'accepted') {
      isInstalled.value = true
    }

    deferredEvent.value = null
  }

  return { canInstall, isInstalled, promptInstall }
}
