<script setup lang="ts">
import { useRoute } from 'vue-router'
import { Bell, List, UserCircle } from '@/shared/components/icons/regular.generated'
import Icon from '@/shared/components/ui/Icon.vue'
import { useAppShell } from './useAppShell'

const route = useRoute()
const { hasUnreadNotifications, toggleMobileNav, toggleNotificationPanel } = useAppShell()
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <button
        aria-label="Abrir menu"
        class="app-header__icon-button app-header__menu-button"
        type="button"
        @click="toggleMobileNav"
      >
        <Icon :icon="List" :size="20" />
      </button>
      <h1 class="app-header__title">{{ route.meta.title ?? 'Orbita' }}</h1>
    </div>

    <div class="app-header__actions">
      <button
        aria-label="Notificações"
        class="app-header__icon-button app-header__notification-button"
        type="button"
        @click="toggleNotificationPanel"
      >
        <Icon :icon="Bell" :size="20" />
        <span
          v-if="hasUnreadNotifications"
          aria-label="Há notificações não lidas"
          class="app-header__unread-dot"
          role="status"
        />
      </button>
      <!-- Placeholder até Avatar.vue existir (Tier 3, ver catalogo-componentes.md) -->
      <button aria-label="Conta" class="app-header__icon-button" type="button">
        <Icon :icon="UserCircle" :size="20" />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-16 $spacing-24;
  background-color: $color-bg-1;
  border-bottom: 1px solid $color-ink-10;
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: $spacing-12;
}

.app-header__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.app-header__actions {
  display: flex;
  gap: $spacing-8;
}

.app-header__icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-8;
  color: $color-ink;
  background-color: transparent;
  border-radius: $radius-8;

  &:hover {
    background-color: $color-ink-4;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

// Grounded no padrão "Badge-Dot" do Figma (dot sobreposto a ícone de
// botão, ex.: sino de notificação) — cor exata do "Dot" do Figma não foi
// resolvível no dump em cache (rate limit), `{colors.accent-red}` é uma
// aproximação razoável e documentada (mesmo critério do
// `notification-item__unread-dot`, ver design-system.md).
.app-header__notification-button {
  position: relative;
}

.app-header__unread-dot {
  position: absolute;
  top: $spacing-4;
  right: $spacing-4;
  width: $spacing-8;
  height: $spacing-8;
  background-color: $color-accent-red;
  border: 1px solid $color-bg-1;
  border-radius: $radius-80;
}

// Depois de `.app-header__icon-button` de propósito: as duas classes têm
// especificidade igual (uma classe cada) e ficam no mesmo botão — com
// empate de especificidade, quem vem depois no CSS vence. Antes desta
// reordenação, `display: inline-flex` de `.app-header__icon-button`
// sempre ganhava de `display: none` daqui, e o hambúrguer nunca sumia no
// desktop (achado real, confirmado via computed style em browser real).
.app-header__menu-button {
  @media (min-width: $breakpoint-md) {
    display: none;
  }
}
</style>
