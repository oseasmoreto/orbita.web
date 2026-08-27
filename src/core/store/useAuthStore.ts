import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type UserRole = 'admin_master' | 'user'

export interface AuthUser {
  email: string
  emailVerifiedAt: string | null
  id: string
  name: string
  role: UserRole
  status: string
}

/**
 * Único estado genuinamente global de sessão (docs/infra/convencoes-frontend-infra.md
 * seção 5). Ações de rede (login/register/logout) moram no composable/service do
 * módulo Identity, não aqui — a store só guarda o resultado.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const requiresSubscription = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'admin_master')

  function setUser(newUser: AuthUser, options?: { requiresSubscription?: boolean }): void {
    user.value = newUser
    requiresSubscription.value = options?.requiresSubscription ?? false
  }

  function clear(): void {
    user.value = null
    requiresSubscription.value = false
  }

  return { clear, isAdmin, isAuthenticated, requiresSubscription, setUser, user }
})
