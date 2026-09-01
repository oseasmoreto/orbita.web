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
import { onMounted, watch } from 'vue'
import { useAppShell } from '@/core/layouts/composables/useAppShell'
import { Bell } from '@/shared/components/icons/regular.generated'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import { useNotificationFeed } from '../composables/useNotificationFeed'
import NotificationItem from './NotificationItem.vue'
import type { Notification } from '../types/notification.type'

const { closeNotificationPanel, isNotificationPanelOpen } = useAppShell()
const { items, markAsRead, refresh, refreshUnreadCount } = useNotificationFeed()

onMounted(refreshUnreadCount)

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
@use '@/core/styles/variables' as *;

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
