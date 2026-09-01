import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { refreshCurrentUser } from '@/core/router/guards'
import { useAuthStore } from '@/core/store/useAuthStore'
import type { AdminUser } from '@/core/types/adminUser.type'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  impersonateUser,
  stopImpersonation as stopImpersonationRequest,
} from '../services/identityApi'

/**
 * Só usuários com role `user` podem ser impersonados
 * (`CannotImpersonateAdminException`, backend) — e nunca a própria linha
 * do admin logado (`AdminUsersView.vue` já esconde o botão, mesma
 * checagem que o backend faria de qualquer forma se o front não
 * bloqueasse antes).
 */
export function canImpersonate(currentUserId: string, target: AdminUser): boolean {
  return target.id !== currentUserId && target.role === 'user'
}

/**
 * "Editar" aqui é só role/status (`UpdateUserByAdminRequest`) — o backend
 * recusa (`errorMessageCannotModifyOwnAccount`) qualquer admin tentando
 * editar a própria conta por este caminho; checado proativamente aqui
 * pra nem oferecer a ação, mesmo critério de `canImpersonate`.
 */
export function canEditUser(currentUserId: string, target: AdminUser): boolean {
  return target.id !== currentUserId
}

/**
 * Orquestra os 2 lados da impersonation — trocar a sessão pro usuário
 * alvo e voltar a ser admin. As 2 chamadas (`impersonateUser`/
 * `stopImpersonationRequest`) trocam a sessão no backend, mas a resposta
 * delas (`UserResource` cru, sem `favorites`/`planLimits`/
 * `impersonated_by`) nunca é usada pra popular a store direto — sempre
 * `refreshCurrentUser()` (`core/router/guards.ts`, mesmo composable
 * reaproveitado da Fase 5 pro mesmo problema: qualquer troca de sessão
 * sem sair da SPA precisa refazer `/auth/me` pra store ficar correta).
 */
export function useImpersonation() {
  const router = useRouter()
  const authStore = useAuthStore()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const isProcessing = ref(false)

  async function startImpersonation(target: AdminUser): Promise<void> {
    if (!(authStore.user && canImpersonate(authStore.user.id, target))) {
      return
    }

    isProcessing.value = true

    try {
      await impersonateUser(target.id)
      await refreshCurrentUser()
      await router.push({ name: 'home' })
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isProcessing.value = false
    }
  }

  async function stopImpersonating(): Promise<void> {
    isProcessing.value = true

    try {
      await stopImpersonationRequest()
      await refreshCurrentUser()
      await router.push({ name: 'admin-users' })
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isProcessing.value = false
    }
  }

  return { isProcessing, startImpersonation, stopImpersonating }
}
