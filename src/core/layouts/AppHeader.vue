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

/**
 * `router.back()` chama `window.history.go(-1)` por baixo — sem guarda,
 * "voltar" com a SPA aberta numa aba nova (sem navegação interna ainda)
 * sai do próprio app pra QUALQUER entrada anterior do histórico real do
 * browser, incluindo uma origem/porta completamente diferente (achado
 * real, reportado pelo usuário: caía em `localhost:5175`, sobra de uma
 * aba que já tinha navegado por outra porta do Vite em algum momento).
 * `history.state.back` é o próprio Vue Router quem escreve (`createWebHistory`
 * grava `{ back, current, forward, ... }` a cada navegação da SPA) — só
 * chama `router.back()` quando existe uma entrada de verdade dentro da
 * navegação da SPA; sem isso, "Voltar" simplesmente não faz nada, nunca
 * escapa pra fora do app.
 */
function goBack(): void {
  if (window.history.state?.back) {
    router.back()
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
    </div>

    <!-- Sub-bar no mobile (abaixo de $breakpoint-md): quebra pra própria
    linha, colada no mesmo header — ver CSS `.app-header__breadcrumb`. -->
    <Breadcrumb class="app-header__breadcrumb" :items="breadcrumbItems" />

    <div class="app-header__actions">
      <button aria-label="Alternar tema" class="app-header__icon-button" type="button" @click="toggleTheme">
        <Icon :icon="Sun" :size="20" />
      </button>
      <button aria-label="Voltar" class="app-header__icon-button" type="button" @click="goBack">
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

// Sticky no topo (pedido direto do usuário, 2026-08-28) — sem isso o
// header rolava junto com `.app-layout__content` feito qualquer elemento
// normal do fluxo. `z-index` acima do conteúdo da página, mas abaixo do
// overlay/drawer mobile (40/50) e do Modal (100) — sticky não deve
// competir com eles quando abertos.
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-8 $spacing-12;
  padding: $spacing-12 $spacing-16;
  background-color: $color-bg-1;
  border-bottom: 1px solid $color-ink-10;

  @media (min-width: $breakpoint-md) {
    flex-wrap: nowrap;
    padding: $spacing-16 $spacing-24;
  }
}

.app-header__left {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: $spacing-12;
}

.app-header__actions {
  display: flex;
  flex-shrink: 0;
  order: 1;
  gap: $spacing-8;
  // Empurra o grupo de ações pro fim da linha em que estiver — no mobile
  // é a linha 1 (junto de `__left`, antes do breadcrumb quebrar pra
  // linha própria); no desktop é a única linha (depois do breadcrumb,
  // que volta a ficar inline — ver `.app-header__breadcrumb` abaixo).
  margin-left: auto;

  @media (min-width: $breakpoint-md) {
    // Volta pra ordem natural do DOM (depois do breadcrumb) — no desktop
    // as 3 partes ficam numa linha só: esquerda, breadcrumb, ações.
    order: 0;
  }
}

// Achado real, reportado pelo usuário: no mobile a linha ficava
// "encavalada" (ícones de ocultar sidebar/favoritar disputando espaço
// com o breadcrumb E os ícones de ação, tudo na mesma linha estreita).
// Abaixo de `$breakpoint-md`, o breadcrumb quebra pra própria linha —
// `flex-basis: 100%` força o wrap (não cabe ao lado do que já ocupou a
// linha 1) — colado embaixo da linha de ícones, mesmo `.app-header`
// (mesmo fundo/padding, não é um componente separado), uma "sub-bar". No
// desktop, os resets (`order`/`flex-basis` de volta ao padrão) devolvem o
// breadcrumb pra posição original, inline ao lado dos ícones da esquerda.
.app-header__breadcrumb {
  order: 2;
  flex-basis: 100%;
  min-width: 0;
  overflow: hidden;

  @media (min-width: $breakpoint-md) {
    order: 0;
    flex-basis: auto;
  }
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
