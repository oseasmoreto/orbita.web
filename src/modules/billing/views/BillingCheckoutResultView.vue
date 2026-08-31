<script setup lang="ts">
/**
 * Uma view só pras 3 `back_urls` do Checkout Pro do Mercado Pago
 * (`MercadoPagoGateway::createCheckout`, backend — `${FRONTEND_URL}/billing/success`
 * `/pending`/`/failure`) — sem isso, o usuário completava o pagamento e
 * caía num 404 real ao voltar do checkout hospedado. `route.meta.checkoutResult`
 * decide a variante ORIGINAL (ícone/cor/texto/CTA); as 3 rotas
 * (`modules/billing/routes.ts`) só diferem nesse meta, mesmo componente —
 * nada de duplicar 3 views quase idênticas.
 *
 * **Refresh em tempo real ligado em 2026-08-31** — pedido direto do
 * usuário ("vamos seguir com o gap 1"), fechando a última pendência real
 * da Fase 2. `useSubscriptionConfirmationPoll` (testado, mesmo módulo)
 * pega um snapshot da assinatura no mount e faz poll de
 * `GET /subscriptions` até detectar que o webhook do Mercado Pago
 * confirmou (`SubscribeToPlanAction`/`ChangeSubscriptionPlanAction` já
 * deixam a assinatura num estado "pendente" ANTES do redirect — `status:
 * pending` pra assinatura nova, `pending_plan_id` setado pra troca de
 * plano —, o webhook resolve os dois de forma assíncrona). Só liga nas
 * variantes `success`/`pending` — `failure` já é um resultado definitivo,
 * não tem nada a esperar. `displayVariant` (não `variant`) é o que o
 * template usa: assim que confirma, a tela troca sozinha pra `success`
 * (ícone/cor/texto), sem precisar de F5 — ficou possível resolver isso de
 * verdade só depois do backend expor `pending_plan_id` em
 * `SubscriptionResource` (gap fechado antes deste, mesmo dia).
 */
import { onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  CheckCircle,
  HourglassMedium,
  WarningCircle,
} from '@/shared/components/icons/regular.generated'
import AuthLayout from '@/core/layouts/AuthLayout.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import { useSubscriptionConfirmationPoll } from '../composables/useSubscriptionConfirmationPoll'

const route = useRoute()
const router = useRouter()
const variant = computed(() => route.meta.checkoutResult ?? 'pending')

const { isConfirmed, isPolling, pause, start } = useSubscriptionConfirmationPoll()

onMounted(() => {
  if (variant.value !== 'failure') {
    void start()
  }
})
onUnmounted(pause)

const displayVariant = computed(() => (isConfirmed.value ? 'success' : variant.value))

const ICONS = {
  failure: WarningCircle,
  pending: HourglassMedium,
  success: CheckCircle,
} as const

function handleCta(): void {
  const target = displayVariant.value === 'failure' ? { name: 'choose-plan' } : { name: 'home' }
  void router.push(target)
}
</script>

<template>
  <AuthLayout :illustration-icon="ICONS[displayVariant]">
    <div class="checkout-result-view">
      <Icon
        class="checkout-result-view__icon"
        :class="`checkout-result-view__icon--${displayVariant}`"
        :icon="ICONS[displayVariant]"
        :size="48"
      />
      <h1 class="checkout-result-view__title">
        {{ $t(`billing.checkoutResult.${displayVariant}.title`) }}
      </h1>
      <p class="checkout-result-view__description">
        {{ $t(`billing.checkoutResult.${displayVariant}.description`) }}
      </p>

      <Button size="large" variant="primary" @click="handleCta">
        {{ $t(`billing.checkoutResult.${displayVariant}.cta`) }}
      </Button>

      <!-- Só na variante ORIGINAL pending (não a exibida) — se já
      nasceu/virou success, "verificando" não faz sentido mais. -->
      <p v-if="variant === 'pending' && isPolling" class="checkout-result-view__checking">
        <Spinner :size="14" />
        {{ $t('billing.checkoutResult.pending.checking') }}
      </p>
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

.checkout-result-view__checking {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  margin-top: $spacing-16;
  font-size: $font-size-xs;
  color: $color-ink-40;
}
</style>
