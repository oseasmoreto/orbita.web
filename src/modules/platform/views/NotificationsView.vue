<script setup lang="ts">
/**
 * `/notifications` — lista completa e paginada, complementar ao painel
 * curto do sino (`NotificationPanel.vue`, `AppHeader`). Mesmo
 * `useNotificationFeed()` das duas telas — aqui só se usa a parte de
 * paginação/erro que o painel (Drawer estreito) não expõe.
 */
import { computed, onMounted } from 'vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { parseApiError } from '@/shared/services/parseApiError'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import { Bell } from '@/shared/components/icons/regular.generated'
import NotificationItem from '../components/NotificationItem.vue'
import { useNotificationFeed } from '../composables/useNotificationFeed'
import type { Notification } from '../types/notification.type'

const { resolveMessage } = useApiMessage()
const feed = useNotificationFeed()

onMounted(feed.refresh)

const errorMessage = computed(() =>
  feed.error.value ? resolveMessage(parseApiError(feed.error.value).messageKey) : null,
)

function handleSelect(notification: Notification): void {
  void feed.markAsRead(notification)
}
</script>

<template>
  <div class="notifications-view">
    <h1 class="notifications-view__title">{{ $t('platform.notifications.title') }}</h1>

    <p v-if="errorMessage" class="notifications-view__error" role="alert">
      {{ errorMessage }}
    </p>

    <div v-else-if="feed.items.value.length === 0" class="notifications-view__empty">
      <Icon :icon="Bell" :size="32" />
      <p>{{ $t('platform.notifications.empty') }}</p>
    </div>

    <ul v-else class="notifications-view__list">
      <li v-for="notification in feed.items.value" :key="notification.id">
        <NotificationItem :notification="notification" @select="handleSelect" />
      </li>
    </ul>

    <PaginationNav
      :current-page="feed.currentPage.value"
      :total-pages="feed.totalPages.value"
      @update:current-page="(page) => feed.setPage(page)"
    />
  </div>
</template>

<style scoped lang="scss">

.notifications-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  max-width: 640px;
  padding: $spacing-24;
}

.notifications-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.notifications-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}

.notifications-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-8;
  padding: $spacing-48 0;
  color: $color-ink-40;
  text-align: center;
}

.notifications-view__list {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
