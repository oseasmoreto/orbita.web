<script setup lang="ts">
import {
  DrawerContent,
  DrawerDescription,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
} from 'vaul-vue'
import AppSidebarContent from './AppSidebarContent.vue'
import { useAppShell } from './composables/useAppShell'

const { closeMobileNav, isDesktopSidebarCollapsed, isMobileNavOpen } = useAppShell()
</script>

<template>
  <!-- Desktop: coluna fixa, escondida abaixo do breakpoint md via CSS
       (ou pelo botão de ocultar do AppHeader, via isDesktopSidebarCollapsed). -->
  <aside
    :class="['app-sidebar-desktop', { 'app-sidebar-desktop--collapsed': isDesktopSidebarCollapsed }]"
  >
    <AppSidebarContent />
  </aside>

  <!-- Mobile: drawer (vaul-vue) controlado por useAppShell — o hambúrguer
       do AppHeader chama toggleMobileNav(), não há estado duplicado. -->
  <DrawerRoot
    direction="left"
    :open="isMobileNavOpen"
    @update:open="(open) => !open && closeMobileNav()"
  >
    <DrawerPortal>
      <DrawerOverlay class="app-sidebar-overlay" />
      <DrawerContent class="app-sidebar-drawer">
        <!-- Visualmente escondido, mas obrigatório pra leitor de tela — o
             Reka UI (que o vaul-vue usa por baixo) avisa em runtime se
             faltar (achado real, ver console do browser). -->
        <DrawerTitle class="app-sidebar-drawer__sr-only">Menu de navegação</DrawerTitle>
        <DrawerDescription class="app-sidebar-drawer__sr-only">
          Navegação principal do Orbita
        </DrawerDescription>
        <AppSidebarContent />
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style scoped lang="scss">

// Largura não confirmada pixel a pixel no Figma (ver AppLayout.vue) —
// repetida aqui porque o desktop (coluna estática) e o mobile (drawer)
// precisam do mesmo valor, mas cada um é um bloco de CSS fisicamente
// separado (scoped style não compartilha entre arquivos).
$sidebar-width: 260px;

// `height: 100vh` + `position: sticky` (pedido direto pelo usuário,
// 2026-08-28) — sem isso, o `<aside>` só herdava a altura esticada da
// linha flex de `.app-layout` (`min-height: 100vh`, não um teto real):
// se o conteúdo da sidebar crescesse mais que a viewport, o `<aside>`
// crescia junto, o `overflow-y: auto` interno de
// `AppSidebarContent.vue` nunca entrava em ação, e o rodapé com a marca
// Orbita saía da tela rolando junto com o resto da página. Com o teto
// de 100vh + `sticky`, a sidebar inteira fica sempre do tamanho exato da
// viewport (rolando internamente se precisar), o rodapé sempre visível.
.app-sidebar-desktop {
  position: sticky;
  top: 0;
  display: none;
  flex-shrink: 0;
  width: $sidebar-width;
  height: 100vh;
  background-color: $color-bg-2;
  border-right: 1px solid $color-ink-10;

  @media (min-width: $breakpoint-md) {
    display: flex;
    flex-direction: column;
  }
}

// Botão "ocultar sidebar" do AppHeader (pedido direto do usuário,
// 2026-08-28) — `!important` de propósito: precisa vencer a regra de
// `display: flex` da media query acima, que tem a mesma especificidade
// (mesmo seletor `.app-sidebar-desktop`) e viria depois no cascade se não
// fosse forçado.
.app-sidebar-desktop--collapsed {
  display: none !important;
}

// `:global()` a partir daqui: DrawerPortal teletransporta esse conteúdo pra
// fora da árvore do componente (mesmo achado real do Select.vue, ver
// design-system.md seção Components → Select) — sem isso o drawer mobile
// renderiza sem overlay/posicionamento nenhum.
:global(.app-sidebar-overlay) {
  position: fixed;
  inset: 0;
  z-index: 40;
  background-color: rgb(0 0 0 / 40%);
}

// `$color-bg-1`, não `$color-bg-2` — achado real, reportado pelo usuário
// (fundo do drawer mobile aparecia transparente): `--color-bg-2` no tema
// escuro é um branco a 4% de opacidade (valor real do token de origem,
// pensado pra ser composto POR CIMA de uma superfície `bg-1` opaca dentro
// da mesma pilha de camadas do Figma — não um fundo sólido isolado). O
// drawer é `position: fixed` num portal, sem `bg-1` garantido logo atrás
// dele na pilha de pintura (só o overlay semitransparente + o que estiver
// por trás) — a composição fica "suja"/translúcida em vez de um cinza
// escuro sólido. `$color-bg-1` é opaco nos dois temas (mesmo critério já
// usado por `Modal.vue`/`Drawer.vue`, os outros dois componentes que
// também são superfície isolada em portal) — a coluna estática do
// desktop continua em `$color-bg-2` (funciona ali porque tem `bg-1`
// sólido do body imediatamente atrás, mesma pilha de pintura).
:global(.app-sidebar-drawer) {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  width: $sidebar-width;
  background-color: $color-bg-1;

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

// Padrão "sr-only": presente pra leitor de tela, removido visualmente sem
// usar display:none (que apagaria da árvore de acessibilidade também).
:global(.app-sidebar-drawer__sr-only) {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  clip-path: inset(50%);
  border: 0;
}
</style>
