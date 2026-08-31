import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { fetchCurrentUser, resendEmailVerification } from '../services/identityApi'
import { toAuthUser } from '../types/user.type'

/**
 * O clique no link do e-mail é uma navegação de browser real que acontece
 * FORA desta SPA (o backend redireciona direto pra `/choose-plan` ou
 * `/login?error=...` — `EmailVerificationController::verify`, sem
 * `auth:sanctum`, resolve o usuário pelo `{id}` assinado na própria URL,
 * não pela sessão). Não tem como esta tela reagir a esse clique sozinha
 * quando ele acontece numa aba/dispositivo diferente — por isso
 * `checkVerification()` existe: um jeito manual de "já verifiquei,
 * continuar" que confere `/auth/me` de novo antes de avançar, sem
 * depender de polling automático (fora de escopo aqui).
 */
export function useVerifyEmail() {
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()
  const { t } = useI18n()

  const isResending = ref(false)
  const isChecking = ref(false)

  async function resend(): Promise<void> {
    isResending.value = true

    try {
      await resendEmailVerification()
      toast.success(t('identity.verifyEmail.resendSuccess'))
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isResending.value = false
    }
  }

  async function checkVerification(): Promise<void> {
    isChecking.value = true

    try {
      const result = await fetchCurrentUser()
      authStore.setUser(toAuthUser(result.user), {
        requiresSubscription: result.requires_subscription,
      })

      if (result.user.email_verified_at) {
        await router.push({ name: 'choose-plan' })
        return
      }

      toast.info(t('identity.verifyEmail.stillNotVerified'))
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isChecking.value = false
    }
  }

  return { checkVerification, isChecking, isResending, resend }
}
