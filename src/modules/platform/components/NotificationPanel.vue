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
 * Dados abaixo são placeholder: não existe endpoint de notificação ainda
 * (Fase 5, `docs/planejamento/plano-implementacao.md`) — quando existir,
 * isso vira um composable (`useNotifications`) buscando de verdade, essa
 * lista fixa sai.
 */
import { computed, watchEffect } from 'vue'
import { useAppShell } from '@/core/layouts/useAppShell'
import { Bell, Broadcast, BugBeetle, User } from '@/shared/components/icons/regular.generated'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import NotificationItem from './NotificationItem.vue'
import type { NotificationItemData } from '../types/notification.type'

const { closeNotificationPanel, isNotificationPanelOpen, setHasUnreadNotifications } = useAppShell()

const notifications: NotificationItemData[] = [
  {
    icon: BugBeetle,
    read: false,
    timestamp: 'Just now',
    tint: 'blue',
    title: 'You have a bug that needs to be fixed.',
  },
  {
    icon: User,
    read: false,
    timestamp: '59 minutes ago',
    tint: 'purple',
    title: 'New user registered.',
  },
  {
    icon: BugBeetle,
    read: true,
    timestamp: '12 hours ago',
    tint: 'blue',
    title: 'You have a bug that needs to be fixed.',
  },
  {
    icon: Broadcast,
    read: true,
    timestamp: 'Feb 2, 2025',
    tint: 'purple',
    title: 'Andi Lane subscribed to you.',
  },
]

// `watchEffect` (não só uma chamada única) porque `notifications` ainda é
// placeholder estático — quando virar um composable buscando de verdade
// (Fase 5), a lista passa a ser reativa e isso continua correto sem
// mudar nada aqui.
const hasUnread = computed(() => notifications.some((notification) => !notification.read))
watchEffect(() => setHasUnreadNotifications(hasUnread.value))
</script>

<template>
  <Drawer
    :model-value="isNotificationPanelOpen"
    size="sm"
    title="Notificações"
    @update:model-value="(value) => !value && closeNotificationPanel()"
  >
    <div v-if="notifications.length === 0" class="notification-panel__empty">
      <Icon :icon="Bell" :size="32" />
      <p>Nenhuma notificação por enquanto.</p>
    </div>
    <ul v-else class="notification-panel__list">
      <li v-for="(notification, index) in notifications" :key="index">
        <NotificationItem :notification="notification" />
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
