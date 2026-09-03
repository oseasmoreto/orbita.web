<script setup lang="ts">
/**
 * Grounded na seção "Notifications" do `RightBar` do Figma (`#4113:42432`)
 * — decisão 2026-08-27 (ver docs/design/catalogo-componentes.md): só essa
 * seção vira painel de verdade, "Activities" (admin-only) e "Contacts"
 * (Orbita não tem conceito de time) ficam fora.
 *
 * Reaproveita `Drawer.vue` (painel lateral direito, já com o efeito de
 * bottom sheet no mobile) em vez de construir um painel novo do zero — o
 * `RightBar` do Figma é uma coluna fixa de 280px, aproximada aqui pelo
 * tamanho `sm` (320px) do Drawer já existente.
 *
 * Aberto/fechado pelo sino do `AppHeader` via `useAppShell` (estado de UI
 * do shell, não de domínio — mesmo padrão já usado pro menu mobile).
 *
 * **Ligado a dado real, Fase 5 (2026-09-01)** — `useNotificationFeed()`
 * substitui a lista placeholder que existia desde a Fase 0. Contador de
 * não lidas (`useNotificationStore`) é buscado uma vez no MOUNT deste
 * componente (montado uma vez em `App.vue`, então roda uma vez por
 * carregamento do app — barato, `per_page: 1`, `countUnreadNotifications`).
 * A LISTA em si só é buscada quando o painel de fato ABRE
 * (`watch(isNotificationPanelOpen)`) — abrir o painel raramente acontece
 * toda sessão, não vale buscar 10 notificações à toa em todo carregamento
 * só pra alimentar um painel que pode nunca abrir.
 */
import { watch } from 'vue'
import { useAppShell } from '@/core/layouts/composables/useAppShell'
import { useAuthStore } from '@/core/store/useAuthStore'
import { useNotificationStore } from '@/core/store/useNotificationStore'
import { Bell } from '@/shared/components/icons/regular.generated'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import { useNotificationFeed } from '../composables/useNotificationFeed'
import NotificationItem from './NotificationItem.vue'
import type { Notification } from '../types/notification.type'

const { closeNotificationPanel, isNotificationPanelOpen } = useAppShell()
const { items, markAsRead, refresh, refreshUnreadCount } = useNotificationFeed()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

/**
 * `NotificationPanel` é montado uma vez em `App.vue`, pra TODA rota —
 * inclusive as de guest (`/login`, `/reset-password`...), onde o
 * `AppHeader`/sino nem existe pra abrir este painel. Achado real,
 * reportado pelo usuário em 2026-09-03: `onMounted(refreshUnreadCount)`
 * disparava `GET /notifications` incondicionalmente no boot do app —
 * sem sessão, a API devolve 401, o que dispara o `UNAUTHORIZED_EVENT`
 * global (`core/api/client.ts`) e força `router.push({ name: 'login' })`
 * em `main.ts`, atropelando o guard e a própria rota que o usuário
 * estava tentando abrir (`/reset-password?token=...`, sempre acessada
 * deslogado — o clássico "abrir o link do e-mail te manda pro login").
 * Corrigido trocando `onMounted` por um `watch` em
 * `authStore.isAuthenticated` (`immediate: true`, cobre o boot já
 * logado): só busca o contador quando HÁ sessão, e zera o contador
 * (`setUnreadCount(0)`) quando ela deixa de existir (login em outra aba
 * expirando, logout) — sem isso o badge do sino ficaria com o número
 * antigo até o próximo reload.
 */
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      void refreshUnreadCount()
    } else {
      notificationStore.setUnreadCount(0)
    }
  },
  { immediate: true },
)

watch(isNotificationPanelOpen, (isOpen) => {
  if (isOpen) {
    void refresh()
  }
})

function handleSelect(notification: Notification): void {
  void markAsRead(notification)
}
</script>

<template>
  <Drawer
    :model-value="isNotificationPanelOpen"
    size="sm"
    :title="$t('platform.notifications.title')"
    @update:model-value="(value) => !value && closeNotificationPanel()"
  >
    <div v-if="items.length === 0" class="notification-panel__empty">
      <Icon :icon="Bell" :size="32" />
      <p>{{ $t('platform.notifications.empty') }}</p>
    </div>
    <ul v-else class="notification-panel__list">
      <li v-for="notification in items" :key="notification.id">
        <NotificationItem :notification="notification" @select="handleSelect" />
      </li>
    </ul>
  </Drawer>
</template>

<style scoped lang="scss">

.notification-panel__list {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
  padding: 0;
  margin: 0;
  list-style: none;
}

.notification-panel__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-8;
  padding: $spacing-24;
  color: $color-ink-40;
  text-align: center;
}
</style>
