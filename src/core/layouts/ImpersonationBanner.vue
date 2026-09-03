<script setup lang="ts">
/**
 * Aviso visual persistente enquanto uma impersonation está ativa —
 * pedido explícito do plano de implementação (Fase 6). Vive em `core/`
 * (não em `modules/identity/`) pelo mesmo motivo de `AppHeader`/
 * `AppSidebar`: é chrome do shell, montado uma vez em `AppLayout.vue`,
 * visível em toda rota autenticada.
 *
 * `authStore.user.impersonatedBy` é a fonte de verdade — vem de `GET
 * /auth/me` (pedido pra sessão de backend em 2026-09-01, resolvido no
 * mesmo dia: a Session do servidor já sabia disso via
 * `impersonator_id`, só não estava exposta). Isso é o que faz o banner
 * sobreviver a um F5 — diferente de um estado client-side puro, que se
 * perderia no reload.
 *
 * `useImpersonation.ts` é de `modules/identity/` — `core/` pode importar
 * de qualquer módulo (mesma exceção já registrada em `useLogout.ts`:
 * sessão/Identity é infraestrutura cross-cutting).
 */
import { useAuthStore } from '@/core/store/useAuthStore'
import { useImpersonation } from '@/modules/identity/composables/useImpersonation'
import { UserSwitch } from '@/shared/components/icons/regular.generated'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'

const authStore = useAuthStore()
const { isProcessing, stopImpersonating } = useImpersonation()
</script>

<template>
  <div v-if="authStore.user?.impersonatedBy" class="impersonation-banner" role="status">
    <Icon :icon="UserSwitch" :size="16" />
    <span class="impersonation-banner__text">
      {{ $t('identity.admin.impersonation.bannerText', { name: authStore.user.name }) }}
    </span>
    <Button :disabled="isProcessing" size="medium" variant="outline" @click="stopImpersonating()">
      {{ $t('identity.admin.impersonation.stopCta') }}
    </Button>
  </div>
</template>

<style scoped lang="scss">

// Sem `position: sticky` de propósito — `AppHeader.vue` já é sticky em
// `top: 0`; empilhar 2 elementos sticky no mesmo `top` exigiria travar o
// header num offset calculado a partir da altura deste banner (frágil,
// muda no wrap mobile). O banner fica no fluxo normal, sempre visível ao
// carregar a página/trocar de rota — aceita rolar pra fora com o resto
// do conteúdo, o header continua fixo sozinho.
.impersonation-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: $spacing-12;
  padding: $spacing-8 $spacing-16;
  color: $color-paper-fixed;
  background-color: $color-accent-orange;
}

.impersonation-banner__text {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
}
</style>
