import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { deleteAccount } from '../services/identityApi'

/**
 * `password` é sempre opcional na UI — o `UserResource` não expõe se a
 * conta tem senha cadastrada (conta só-SSO não tem), então não dá pra
 * decidir client-side se o campo é obrigatório. Manda o que foi digitado
 * (ou nada) e deixa o backend decidir: `DeleteUserAccountAction` só cobra
 * de verdade quando o usuário tem senha, e recusa com
 * `errorMessageIncorrectPassword` se estiver errada.
 */
export function useDeleteAccount() {
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const isDeleting = ref(false)

  async function confirmDelete(password: string): Promise<boolean> {
    isDeleting.value = true

    try {
      await deleteAccount(password || undefined)
      authStore.clear()
      await router.push({ name: 'login' })
      return true
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
      return false
    } finally {
      isDeleting.value = false
    }
  }

  return { confirmDelete, isDeleting }
}
