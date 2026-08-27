<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'

/**
 * Casca autenticada — orquestra `AppSidebar`/`AppHeader`, pré-requisito de
 * infra que faltava desde a Fase 0 (ver docs/design/catalogo-componentes.md,
 * Tier 2). Sidebar/header são componentes próprios (não inline aqui) pra
 * caberem grupos de nav, itens expansíveis e a versão mobile (drawer) sem
 * inchar este arquivo — ver `AppSidebar.vue`/`useAppShell.ts`.
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
