import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { disconnectSsoAccount, listSsoAccounts } from '../services/identityApi'
import type { SsoAccount } from '../types/ssoAccount.type'

/**
 * "Quais provedores conectei" — parte da tela de perfil
 * (`mapeamento-cruds-perfil.md`, P6/P7, backend). Desconectar pode ser
 * recusado (`errorMessageCannotDisconnectLastAccessMethod`, se for o
 * único jeito de acessar a conta) — não tenta prever isso no cliente
 * (não temos como saber se o usuário tem senha), só mostra o erro que
 * vier.
 */
export function useSsoAccounts() {
  const accounts = ref<SsoAccount[]>([])
  const isLoading = ref(false)
  const disconnectingId = ref<string | null>(null)
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const { t } = useI18n()

  async function load(): Promise<void> {
    isLoading.value = true

    try {
      accounts.value = await listSsoAccounts()
    } catch {
      toast.error(t('errors.unknown'))
    } finally {
      isLoading.value = false
    }
  }

  async function disconnect(ssoAccountId: string): Promise<void> {
    disconnectingId.value = ssoAccountId

    try {
      await disconnectSsoAccount(ssoAccountId)
      accounts.value = accounts.value.filter((account) => account.id !== ssoAccountId)
      toast.success(t('identity.account.sso.disconnectSuccess'))
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      disconnectingId.value = null
    }
  }

  return { accounts, disconnect, disconnectingId, isLoading, load }
}
