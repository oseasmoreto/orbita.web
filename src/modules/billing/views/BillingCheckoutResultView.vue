<script setup lang="ts">
/**
 * Uma view só pras 3 `back_urls` do Checkout Pro do Mercado Pago
 * (`MercadoPagoGateway::createCheckout`, backend — `${FRONTEND_URL}/billing/success`
 * `/pending`/`/failure`) — sem isso, o usuário completava o pagamento e
 * caía num 404 real ao voltar do checkout hospedado. `route.meta.checkoutResult`
 * decide a variante (ícone/cor/texto/CTA); as 3 rotas (`modules/billing/routes.ts`)
 * só diferem nesse meta, mesmo componente — nada de duplicar 3 views
 * quase idênticas.
 *
 * Sem polling de status aqui de propósito: o webhook
 * (`billing.webhooks.mercadopago`) já confirma o pagamento no backend de
 * forma assíncrona, independente de o usuário estar olhando essa tela ou
 * não — refresh de status em tempo real (`useSubscriptionStatus`) é
 * escopo maior, ainda não implementado (ver `docs/planejamento/plano-implementacao.md`).
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CheckCircle,
  HourglassMedium,
  WarningCircle,
} from '@/shared/components/icons/regular.generated'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'

const route = useRoute()
const router = useRouter()
const variant = computed(() => route.meta.checkoutResult ?? 'pending')

const ICONS = {
  failure: WarningCircle,
  pending: HourglassMedium,
  success: CheckCircle,
} as const

function handleCta(): void {
  const target = variant.value === 'failure' ? { name: 'choose-plan' } : { name: 'home' }
  void router.push(target)
}
</script>

<template>
  <AuthLayout :illustration-icon="ICONS[variant]">
    <div class="checkout-result-view">
      <Icon
        class="checkout-result-view__icon"
        :class="`checkout-result-view__icon--${variant}`"
        :icon="ICONS[variant]"
        :size="48"
      />
      <h1 class="checkout-result-view__title">
        {{ $t(`billing.checkoutResult.${variant}.title`) }}
      </h1>
      <p class="checkout-result-view__description">
        {{ $t(`billing.checkoutResult.${variant}.description`) }}
      </p>

      <Button size="large" variant="primary" @click="handleCta">
        {{ $t(`billing.checkoutResult.${variant}.cta`) }}
      </Button>
    </div>
  </AuthLayout>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.checkout-result-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.checkout-result-view__icon {
  margin-bottom: $spacing-16;
}

.checkout-result-view__icon--success {
  color: $color-accent-green;
}

.checkout-result-view__icon--pending {
  color: $color-accent-yellow;
}

.checkout-result-view__icon--failure {
  color: $color-accent-red;
}

.checkout-result-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.checkout-result-view__description {
  margin-bottom: $spacing-24;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
