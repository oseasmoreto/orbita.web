<script setup lang="ts">
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

/**
 * Casca autenticada — orquestra `AppSidebar`/`AppHeader`/`AppFooter`,
 * pré-requisito de infra que faltava desde a Fase 0 (ver
 * docs/design/catalogo-componentes.md, Tier 2). Sidebar/header/footer são
 * componentes próprios (não inline aqui) pra caberem grupos de nav, itens
 * expansíveis e a versão mobile (drawer) sem inchar este arquivo — ver
 * `AppSidebar.vue`/`useAppShell.ts`.
 *
 * `AppFooter` movido pra cá em 2026-08-28 (pedido direto do usuário: "footer
 * fixo no bottom", igual o `AppHeader`) — antes vivia solto dentro de
 * `ProductsView.vue` (única tela que o usava), o que fazia ele aparecer no
 * meio da página com espaço em branco embaixo em conteúdo curto, sem
 * comportamento de rodapé de verdade. Montado uma vez aqui, como o header,
 * ele agora é chrome persistente do shell — nenhuma view precisa lembrar de
 * incluir seu próprio footer.
 */
</script>

<template>
  <div class="app-layout">
    <AppSidebar />

    <div class="app-layout__main">
      <AppHeader />

      <main class="app-layout__content">
        <RouterView />
      </main>

      <AppFooter />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.app-layout {
  display: flex;
  min-height: 100vh;
}

.app-layout__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.app-layout__content {
  flex: 1;
  padding: $spacing-24;
}
</style>
