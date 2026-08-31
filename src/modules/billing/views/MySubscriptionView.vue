<script setup lang="ts">
/**
 * "Meu plano" — pendência real da Fase 2 (`docs/planejamento/plano-implementacao.md`):
 * cancelamento (`DELETE /subscriptions/{id}`) e troca de plano
 * (`PATCH /subscriptions/{id}`), os dois endpoints já prontos no backend,
 * telas ainda não construídas até aqui.
 *
 * `useSubscription()` (assinatura atual) + `useChoosePlan()` (lista de
 * planos, reaproveitado — já existia pra `ChoosePlanView.vue`) resolvem o
 * plano atual (`currentPlan`, por `plan_id`) e alimentam a grade de troca
 * de plano, reaproveitando `PlanCard.vue` (mesmo componente da Fase 2
 * original, agora com a prop `isCurrent` nova) — sem duplicar UI de card
 * de plano, mesma régua já documentada em `PlanCard.vue`.
 *
 * Sem `ConfirmDialog` antes de trocar de plano — mesma consistência do
 * fluxo de assinatura original (`ChoosePlanView.vue`): clicar já redireciona
 * pro checkout do Mercado Pago, onde o usuário revisa o valor prorata
 * antes de pagar; o checkout hospedado já É a confirmação. Cancelamento
 * usa `ConfirmDialog` porque não tem esse passo intermediário — o clique
 * age direto.
 */
import { computed, onMounted, ref } from 'vue'
import { CalendarBlank, Tag, Warning } from '@/shared/components/icons/regular.generated'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import { formatMoney } from '@/shared/services/formatNumber'
import dayjs from 'dayjs'
import PlanCard from '../components/blocks/PlanCard.vue'
import { useChoosePlan } from '../composables/useChoosePlan'
import { getMonthlyEquivalent, getYearlySavings } from '../composables/usePlanPricing'
import { canChangeToPlan, useSubscription } from '../composables/useSubscription'
import { subscriptionStatusColor } from '../types/subscription.type'
import type { Plan } from '../types/plan.type'

const {
  cancel,
  changePlan,
  hasError,
  isCancelling,
  isChangingPlan,
  isLoading,
  load,
  subscription,
} = useSubscription()
const plans = useChoosePlan()

onMounted(() => {
  void load()
  void plans.load()
})

const currentPlan = computed<Plan | undefined>(() =>
  plans.plans.value.find((plan) => plan.id === subscription.value?.planId),
)

/**
 * `pending_plan_id` — resolvido pra sessão de backend em 2026-08-31
 * (`SubscriptionResource` não expunha esse campo antes, achado real ao
 * fechar a Fase 2: quem voltava nessa tela num carregamento novo de
 * página não tinha nenhum sinal de "troca já a caminho"). Enquanto
 * existe uma troca pendente, a seção "Trocar de plano" inteira fica
 * escondida (`otherPlans`/`v-if` abaixo) — evita deixar o usuário clicar
 * de novo só pra bater no 422 `errorMessagePlanChangeAlreadyPending`.
 */
const pendingPlan = computed<Plan | undefined>(() =>
  plans.plans.value.find((plan) => plan.id === subscription.value?.pendingPlanId),
)

const otherPlans = computed(() => {
  if (subscription.value?.pendingPlanId) {
    return []
  }

  return plans.plans.value.filter((plan) => canChangeToPlan(subscription.value, plan.id))
})

function formatDate(value: string | null): string {
  return value ? dayjs(value).format('DD/MM/YYYY') : '—'
}

const isCancelConfirmOpen = ref(false)

async function handleCancelConfirm(): Promise<void> {
  isCancelConfirmOpen.value = false
  await cancel()
}
</script>

<template>
  <div class="my-subscription-view">
    <h1 class="my-subscription-view__title">{{ $t('billing.mySubscription.title') }}</h1>

    <div v-if="isLoading" class="my-subscription-view__state">
      <Spinner :size="32" />
    </div>

    <div v-else-if="hasError" class="my-subscription-view__state">
      <p>{{ $t('billing.mySubscription.error') }}</p>
      <Button variant="outline" @click="load">{{ $t('billing.mySubscription.retry') }}</Button>
    </div>

    <p v-else-if="!subscription" class="my-subscription-view__state">
      {{ $t('billing.mySubscription.empty') }}
    </p>

    <template v-else>
      <section class="my-subscription-view__section">
        <div class="my-subscription-view__summary">
          <div class="my-subscription-view__field">
            <span class="my-subscription-view__field-label">
              {{ $t('billing.mySubscription.fields.plan') }}
            </span>
            <span class="my-subscription-view__field-value">
              {{ currentPlan?.name ?? '—' }}
            </span>
          </div>

          <div class="my-subscription-view__field">
            <span class="my-subscription-view__field-label">
              {{ $t('billing.mySubscription.fields.status') }}
            </span>
            <StatusDot :color="subscriptionStatusColor(subscription.status)">
              {{ $t(`billing.mySubscription.status.${subscription.status}`) }}
            </StatusDot>
          </div>

          <div class="my-subscription-view__field">
            <span class="my-subscription-view__field-label">
              {{ $t('billing.mySubscription.fields.cycle') }}
            </span>
            <span class="my-subscription-view__field-value">
              {{ currentPlan ? formatMoney(currentPlan.price) : '—' }}
            </span>
          </div>

          <div class="my-subscription-view__field">
            <span class="my-subscription-view__field-label">
              {{ $t('billing.mySubscription.fields.startDate') }}
            </span>
            <span class="my-subscription-view__field-value">
              <Icon :icon="CalendarBlank" :size="14" />
              {{ formatDate(subscription.startDate) }}
            </span>
          </div>

          <div class="my-subscription-view__field">
            <span class="my-subscription-view__field-label">
              {{ $t('billing.mySubscription.fields.endDate') }}
            </span>
            <span class="my-subscription-view__field-value">
              <Icon :icon="CalendarBlank" :size="14" />
              {{ formatDate(subscription.endDate) }}
            </span>
          </div>
        </div>

        <p v-if="pendingPlan" class="my-subscription-view__notice">
          <Icon :icon="Warning" :size="16" />
          {{ $t('billing.mySubscription.pendingPlanChange', { plan: pendingPlan.name }) }}
        </p>

        <p v-if="subscription.cancelAtPeriodEnd" class="my-subscription-view__notice">
          <Icon :icon="Warning" :size="16" />
          {{ $t('billing.mySubscription.cancelled', { date: formatDate(subscription.endDate) }) }}
        </p>

        <Button
          v-if="!subscription.cancelAtPeriodEnd"
          :disabled="isCancelling"
          variant="outline"
          @click="isCancelConfirmOpen = true"
        >
          {{ $t('billing.mySubscription.cancel.cta') }}
        </Button>
      </section>

      <section v-if="otherPlans.length > 0" class="my-subscription-view__section">
        <h2 class="my-subscription-view__section-title">
          <Icon :icon="Tag" :size="20" />
          {{ $t('billing.mySubscription.changePlan.title') }}
        </h2>
        <p class="my-subscription-view__section-description">
          {{ $t('billing.mySubscription.changePlan.description') }}
        </p>

        <div class="my-subscription-view__grid">
          <PlanCard
            v-for="plan in otherPlans"
            :key="plan.id"
            :cta-label-override="$t('billing.mySubscription.changePlan.cta')"
            :is-submitting="isChangingPlan"
            :monthly-equivalent="getMonthlyEquivalent(plan)"
            :plan="plan"
            :yearly-savings="getYearlySavings(plan, plans.plans.value)"
            @select="changePlan"
          />
        </div>
      </section>
    </template>

    <ConfirmDialog
      v-model:open="isCancelConfirmOpen"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('billing.mySubscription.cancel.cta')"
      :description="$t('billing.mySubscription.cancel.description')"
      :title="$t('billing.mySubscription.cancel.title')"
      @confirm="handleCancelConfirm()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.my-subscription-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-24;
  padding: $spacing-24;
}

.my-subscription-view__title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.my-subscription-view__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-16;
  padding: $spacing-48 0;
  text-align: center;
}

.my-subscription-view__section {
  padding: $spacing-24;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

.my-subscription-view__section-title {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  margin-bottom: $spacing-8;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.my-subscription-view__section-description {
  margin-bottom: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.my-subscription-view__summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: $spacing-16;
  margin-bottom: $spacing-16;
}

.my-subscription-view__field {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.my-subscription-view__field-label {
  font-size: $font-size-xs;
  color: $color-ink-40;
}

.my-subscription-view__field-value {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

// Genérico o bastante pra cobrir os 2 avisos possíveis (cancelamento
// agendado, troca de plano pendente) — os 2 podem aparecer ao mesmo
// tempo (são estados independentes: `cancel_at_period_end` e
// `pending_plan_id` não se excluem), por isso `margin-bottom` em vez de
// depender de `gap` de um container flex.
.my-subscription-view__notice {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  padding: $spacing-12 $spacing-16;
  margin-bottom: $spacing-12;
  font-size: $font-size-sm;
  color: $color-accent-yellow;
  background-color: color-mix(in srgb, $color-accent-yellow 12%, transparent);
  border-radius: $radius-8;
}

.my-subscription-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: $spacing-24;
}
</style>
