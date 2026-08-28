<script setup lang="ts">
/**
 * Reconstruído em 2026-08-28, pedido direto do usuário com captura real
 * (header claro + escuro lado a lado): botão de ocultar sidebar,
 * favorito, breadcrumb, tema, histórico de navegação, notificações — sem
 * busca (`search não precisa`, dito explicitamente) e sem o botão de
 * conta (`UserCircle`) que existia antes — o usuário logado já mora no
 * topo da sidebar (`AppSidebarContent.vue`), duplicar aqui seria
 * redundante.
 *
 * A captura tinha um 4º ícone à direita (tipo livro/painel dividido) não
 * mencionado no pedido em texto — não implementado: sem função definida
 * no Orbita hoje (nenhuma feature de "painel direito"/layout alternativo
 * existe), mesmo critério de não inventar affordance sem propósito já
 * usado no resto do design system.
 */
import { useMediaQuery } from '@vueuse/core'
import { useRouter } from 'vue-router'
import {
  Bell,
  ClockCounterClockwise,
  SidebarSimple,
  Star,
  Sun,
} from '@/shared/components/icons/regular.generated'
import Breadcrumb from '@/shared/components/ui/Breadcrumb.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import { useTheme } from '@/shared/composables/useTheme'
import { useAppShell } from './useAppShell'
import { useBreadcrumb } from './useBreadcrumb'

const router = useRouter()
const { items: breadcrumbItems } = useBreadcrumb()
const { toggleTheme } = useTheme()
const { hasUnreadNotifications, toggleDesktopSidebar, toggleMobileNav, toggleNotificationPanel } =
  useAppShell()

// Mesmo breakpoint md (1023px/64rem) já usado pelo Drawer.vue — abaixo
// dele a sidebar é um drawer (isMobileNavOpen), acima é a coluna estática
// (isDesktopSidebarCollapsed). Um botão só, comportamento por viewport.
const isMobileViewport = useMediaQuery('(max-width: 1023px)')

function toggleSidebar(): void {
  if (isMobileViewport.value) {
    toggleMobileNav()
  } else {
    toggleDesktopSidebar()
  }
}
</script>

<template>
  <header class="app-header">
    <div class="app-header__left">
      <button
        aria-label="Ocultar/exibir menu"
        class="app-header__icon-button"
        type="button"
        @click="toggleSidebar"
      >
        <Icon :icon="SidebarSimple" :size="20" />
      </button>
      <!-- Sem dado real por trás ainda (não existe "favoritar página" no
      domínio do Orbita) — casca pronta, mesmo critério do AppFooter. -->
      <button aria-label="Favoritar" class="app-header__icon-button" type="button">
        <Icon :icon="Star" :size="20" />
      </button>
      <Breadcrumb :items="breadcrumbItems" />
    </div>

    <div class="app-header__actions">
      <button aria-label="Alternar tema" class="app-header__icon-button" type="button" @click="toggleTheme">
        <Icon :icon="Sun" :size="20" />
      </button>
      <button
        aria-label="Voltar"
        class="app-header__icon-button"
        type="button"
        @click="router.back()"
      >
        <Icon :icon="ClockCounterClockwise" :size="20" />
      </button>
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
  min-width: 0;
}

.app-header__actions {
  display: flex;
  flex-shrink: 0;
  gap: $spacing-8;
}

.app-header__icon-button {
  display: inline-flex;
  flex-shrink: 0;
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
</style>
