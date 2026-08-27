<script setup lang="ts">
</script>

<template>
  <main class="forbidden">
    <h1>403</h1>
    <p>Você não tem permissão para acessar esta página.</p>
  </main>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.forbidden {
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
