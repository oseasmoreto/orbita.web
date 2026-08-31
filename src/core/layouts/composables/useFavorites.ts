import { computed } from 'vue'
import { toFavoriteItem } from '@/core/store/types/auth.type'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { createFavorite, deleteFavorite } from '../services/favoriteApi'

/**
 * Favoritar/desfavoritar uma rota da sidebar (`USER_FAVORITE`, backend
 * `Platform`) — endpoint implementado em 2026-08-31 (mensagem da sessão
 * `backend-c5`), consumido aqui pela primeira vez. Lista em si já vem
 * pronta em `authStore.user.favorites` (`GET /auth/me`/`POST /auth/login`,
 * `toAuthUser()`) — este composable só cobre a ESCRITA (adicionar/remover),
 * mutando a store local depois da API confirmar, nunca antes: diferente
 * de `removeFavorite` (que já tem o `id` de verdade e pode reverter se a
 * chamada falhar), `addFavorite` não tem como atualizar otimisticamente
 * sem o `id` gerado pelo backend.
 *
 * Vive em `core/layouts/`, não em `modules/platform/` (onde `USER_FAVORITE`
 * mora no backend) — é consumido só por `AppHeader.vue`/
 * `AppSidebarContent.vue` (core), e "favoritar" aqui é puramente
 * conveniência de navegação da sidebar, não uma feature de negócio do
 * domínio de precificação (mesma leitura já registrada em
 * `docs/negocio/contexto-plataforma-precificacao.md` seção 2.5). Mesmo
 * critério já usado por `useAppShell().recordVisit()` (outra conveniência
 * de sidebar, "Recentes") — módulo nunca importa de outro módulo
 * diretamente, então subir pra `core/` (importável por qualquer um) evita
 * esse cruzamento em vez de forçar o dado a nascer num módulo só pra
 * satisfazer o espelhamento 1:1 com o Bounded Context do backend.
 */
export function useFavorites() {
  const authStore = useAuthStore()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const favorites = computed(() => authStore.user?.favorites ?? [])

  function isFavorite(routeName: string): boolean {
    return favorites.value.some((favorite) => favorite.routeName === routeName)
  }

  async function addFavorite(label: string, routeName: string): Promise<void> {
    if (!authStore.user || isFavorite(routeName)) {
      return
    }

    try {
      const resource = await createFavorite({ label, route_name: routeName })
      authStore.user.favorites = [...authStore.user.favorites, toFavoriteItem(resource)]
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    }
  }

  async function removeFavorite(routeName: string): Promise<void> {
    if (!authStore.user) {
      return
    }

    const favorite = authStore.user.favorites.find((item) => item.routeName === routeName)
    if (!favorite) {
      return
    }

    const previousFavorites = authStore.user.favorites
    authStore.user.favorites = previousFavorites.filter((item) => item.id !== favorite.id)

    try {
      await deleteFavorite(favorite.id)
    } catch (caughtError) {
      authStore.user.favorites = previousFavorites
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    }
  }

  async function toggleFavorite(label: string, routeName: string): Promise<void> {
    if (isFavorite(routeName)) {
      await removeFavorite(routeName)
    } else {
      await addFavorite(label, routeName)
    }
  }

  return { addFavorite, favorites, isFavorite, removeFavorite, toggleFavorite }
}
