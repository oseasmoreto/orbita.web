import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/core/store/useAuthStore'
import { logout as logoutRequest } from '../services/identityApi'

/**
 * Consumido direto do topo do `AppSidebar` (`core/layouts/AppSidebarContent.vue`)
 * — mesma exceção já usada em `core/router/guards.ts` (`fetchCurrentUser`):
 * sessão/Identity é infraestrutura cross-cutting, não um módulo de negócio
 * comum (Catalog/Platform), então `core/` pode depender dele pra
 * login/logout/bootstrap de sessão sem violar a regra de fronteira entre
 * módulos de domínio (`docs/infra/convencoes-frontend-infra.md` seção 2).
 *
 * Um 401 na chamada de logout (sessão já invalidada no backend — 2 abas,
 * token expirado) não deve travar o usuário "logado" na tela: a store é
 * limpa e o redirect acontece de qualquer forma, sucesso ou falha da
 * requisição.
 */
export function useLogout() {
  const router = useRouter()
  const authStore = useAuthStore()
  const isLoggingOut = ref(false)

  async function logout(): Promise<void> {
    isLoggingOut.value = true

    try {
      await logoutRequest()
    } catch {
      // sessão já pode estar inválida no backend — segue o logout local mesmo assim
    } finally {
      authStore.clear()
      isLoggingOut.value = false
      await router.push({ name: 'login' })
    }
  }

  return { isLoggingOut, logout }
}
