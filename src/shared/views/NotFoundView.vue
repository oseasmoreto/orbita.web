<script setup lang="ts">
</script>

<template>
  <main class="not-found">
    <h1>404</h1>
    <p>Página não encontrada.</p>
  </main>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: $spacing-8;
  color: $color-ink;
  background-color: $color-bg-1;
}
</style>
