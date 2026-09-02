import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthUser } from './types/auth.type'

/**
 * Único estado genuinamente global de sessão (docs/infra/convencoes-frontend-infra.md
 * seção 5). Ações de rede (login/register/logout) moram no composable/service do
 * módulo Identity, não aqui — a store só guarda o resultado.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const requiresSubscription = ref(false)
  const requiresCompany = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin_master')

  function setUser(
    newUser: AuthUser,
    options?: { requiresSubscription?: boolean; requiresCompany?: boolean },
  ): void {
    user.value = newUser
    requiresSubscription.value = options?.requiresSubscription ?? false
    requiresCompany.value = options?.requiresCompany ?? false
  }

  function clear(): void {
    user.value = null
    requiresSubscription.value = false
    requiresCompany.value = false
  }

  return { clear, isAdmin, isAuthenticated, requiresCompany, requiresSubscription, setUser, user }
})
