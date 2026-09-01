import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/**
 * Estado genuinamente global (seção 5 de `docs/infra/convencoes-frontend-infra.md`):
 * o contador de notificações não lidas precisa ser visto pelo `AppHeader`
 * (badge no sino) independente de o painel/lista de notificações estar
 * montado ou não — mesmo critério de `useAuthStore`. A LISTA paginada de
 * notificações em si não mora aqui, fica no composable da tela
 * (`modules/platform/composables/useNotificationFeed.ts`) — só o contador
 * é "estado compartilhado entre telas", o resto é dado de uma página
 * específica.
 *
 * Ações de rede (buscar o contador real, marcar como lida) moram no
 * composable/service do módulo Platform — a store só guarda o resultado,
 * mesmo padrão de `useAuthStore`.
 */
export const useNotificationStore = defineStore('notification', () => {
  const unreadCount = ref(0)

  const hasUnread = computed(() => unreadCount.value > 0)

  function setUnreadCount(count: number): void {
    unreadCount.value = count
  }

  function decrementUnread(): void {
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  return { decrementUnread, hasUnread, setUnreadCount, unreadCount }
})
