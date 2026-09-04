import { useInstallPrompt } from '@/core/pwa/composables/useInstallPrompt'

function dispatchBeforeInstallPrompt(userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>) {
  const event = new Event('beforeinstallprompt', { cancelable: true }) as Event & {
    prompt: () => Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
  event.prompt = vi.fn().mockResolvedValue(undefined)
  event.userChoice = userChoice

  window.dispatchEvent(event)

  return event
}

/**
 * `useInstallPrompt` é um singleton em nível de módulo (mesmo padrão de
 * `useTheme.ts`) — `isInstalled` é uma transição de mão única no mundo
 * real (uma vez instalado, não desinstala sozinho), então os testes que
 * levam `isInstalled` a `true` ficam por último de propósito, na ordem
 * declarada abaixo, pra não vazar estado pros testes anteriores.
 */
describe('useInstallPrompt', () => {
  it('starts with canInstall false when no beforeinstallprompt fired yet', () => {
    const { canInstall, isInstalled } = useInstallPrompt()

    expect(canInstall.value).toBe(false)
    expect(isInstalled.value).toBe(false)
  })

  it('becomes installable once beforeinstallprompt fires', () => {
    dispatchBeforeInstallPrompt(Promise.resolve({ outcome: 'dismissed' }))
    const { canInstall } = useInstallPrompt()

    expect(canInstall.value).toBe(true)
  })

  it('clears the captured event without marking installed when the user dismisses the prompt', async () => {
    dispatchBeforeInstallPrompt(Promise.resolve({ outcome: 'dismissed' }))
    const { canInstall, isInstalled, promptInstall } = useInstallPrompt()

    await promptInstall()

    expect(isInstalled.value).toBe(false)
    expect(canInstall.value).toBe(false)
  })

  it('shares state across independent calls (singleton em nível de módulo)', () => {
    dispatchBeforeInstallPrompt(Promise.resolve({ outcome: 'dismissed' }))

    const first = useInstallPrompt()
    const second = useInstallPrompt()

    expect(second.canInstall.value).toBe(first.canInstall.value)
  })

  it('prompts the captured event and marks installed when the user accepts', async () => {
    const event = dispatchBeforeInstallPrompt(Promise.resolve({ outcome: 'accepted' }))
    const { canInstall, isInstalled, promptInstall } = useInstallPrompt()

    await promptInstall()

    expect(event.prompt).toHaveBeenCalledOnce()
    expect(isInstalled.value).toBe(true)
    expect(canInstall.value).toBe(false)
  })

  it('stays installed (and uninstallable) when appinstalled fires', () => {
    const { canInstall, isInstalled } = useInstallPrompt()

    window.dispatchEvent(new Event('appinstalled'))

    expect(isInstalled.value).toBe(true)
    expect(canInstall.value).toBe(false)
  })
})
