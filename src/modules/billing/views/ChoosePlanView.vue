<script setup lang="ts">
/**
 * Casca mínima — Fase 2 (Billing) ainda não começou de verdade
 * (`docs/planejamento/plano-implementacao.md`): não existe `PLAN`
 * listado, `Select Plan Action`, checkout Mercado Pago nem nada disso
 * ainda. Essa tela existe agora só porque o REDIRECT pra ela já precisa
 * funcionar antes da Fase 2 começar — cadastro novo (normal ou SSO) e
 * login com `requires_subscription: true` (`LoginResultResource`) caem
 * aqui em vez de seguir pro dashboard. Conteúdo real (lista de planos,
 * preço, ciclo de cobrança) entra quando a Fase 2 for implementada — não
 * adiantar UI de plano sem o `PLAN`/`SUBSCRIPTION` real por trás.
 */
import { ShieldCheck } from '@/shared/components/icons/regular.generated'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
</script>

<template>
  <AuthLayout :illustration-icon="ShieldCheck">
    <h1 class="choose-plan-view__title">{{ $t('billing.choosePlan.title') }}</h1>
    <p class="choose-plan-view__subtitle">{{ $t('billing.choosePlan.subtitle') }}</p>
    <p class="choose-plan-view__pending">{{ $t('billing.choosePlan.pendingDescription') }}</p>
  </AuthLayout>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.choose-plan-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.choose-plan-view__subtitle {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.choose-plan-view__pending {
  padding: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
  background-color: $color-bg-2;
  border-radius: $radius-8;
}
</style>
