<script setup lang="ts">
// Placeholder — formulário real (Zod schema, useLoginForm composable,
// ensureCsrfCookie + identityApi.login) entra na implementação do módulo
// Identity (fluxo de cadastro/login completo), ainda não feita nesta rodada.
import Icon from '@/shared/components/ui/Icon.vue'
import { LockKey } from '@/shared/components/icons/regular.generated'
</script>

<template>
  <main class="login-view">
    <Icon :icon="LockKey" :size="40" />
    <h1>Entrar</h1>
    <p>Formulário de login ainda não implementado.</p>
  </main>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.login-view {
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
