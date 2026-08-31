<script setup lang="ts">
/**
 * Inspirado na estrutura da referência visual mandada pelo usuário
 * (2026-08-30): heading + subtítulo, linha de selos de confiança, grid
 * de cards de plano. Sem seletor de marketplace (Mercado Livre/Shopee/
 * Amazon) nem plano "combo" limitado a canal — `PLAN` não tem esse
 * conceito (`docs/negocio/contexto-plataforma-precificacao.md` seção
 * 2.2), pedido explícito do usuário pra não replicar isso.
 *
 * Dados reais via `GET /plans` (`useChoosePlan`) — nunca mockados. Preço/
 * economia calculados em `usePlanPricing.ts` (testado, `tests/modules/billing/`),
 * nunca aqui. O card em si (`PlanCard.vue`) é o componente reutilizável
 * pedido pelo usuário — "dentro da dashboard também vamos ter algo
 * semelhante" (oferta de upgrade ao bater limite de plano,
 * `docs/negocio/jornada-usuario.mmd`) reaproveita o MESMO componente
 * quando esse fluxo existir, sem duplicar UI de card de plano.
 */
import { computed, onMounted } from 'vue'
import { ArrowsClockwise, Headset, ShieldCheck } from '@/shared/components/icons/regular.generated'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import DocumentPromptModal from '../components/blocks/DocumentPromptModal.vue'
import PlanCard from '../components/blocks/PlanCard.vue'
import { useChoosePlan } from '../composables/useChoosePlan'
import {
  findMostEconomicalPlan,
  getMonthlyEquivalent,
  getYearlySavings,
} from '../composables/usePlanPricing'
import { useSubscribeToPlan } from '../composables/useSubscribeToPlan'
import type { Plan } from '../types/plan.type'

const { hasError, isLoading, load, plans } = useChoosePlan()
const { confirmDocument, isDocumentPromptOpen, isSubscribing, subscribe } = useSubscribeToPlan()

onMounted(load)

// Badge "Mais econômico" só faz sentido comparando 2+ planos — com um só
// na lista, destacar ele mesmo não informa nada.
const mostEconomicalPlanId = computed(() =>
  plans.value.length > 1 ? (findMostEconomicalPlan(plans.value)?.id ?? null) : null,
)

function monthlyEquivalentFor(plan: Plan): number {
  return getMonthlyEquivalent(plan)
}

function savingsFor(plan: Plan): number | null {
  return getYearlySavings(plan, plans.value)
}
</script>

<template>
  <div class="choose-plan-view">
    <div class="choose-plan-view__brand">Orbita</div>

    <header class="choose-plan-view__header">
      <h1 class="choose-plan-view__title">{{ $t('billing.choosePlan.heading') }}</h1>
      <p class="choose-plan-view__subtitle">{{ $t('billing.choosePlan.pageDescription') }}</p>

      <div class="choose-plan-view__trust">
        <span class="choose-plan-view__trust-item">
          <Icon :icon="ShieldCheck" :size="16" />
          {{ $t('billing.choosePlan.trust.secureCheckout') }}
        </span>
        <span class="choose-plan-view__trust-item">
          <Icon :icon="ArrowsClockwise" :size="16" />
          {{ $t('billing.choosePlan.trust.recurringBilling') }}
        </span>
        <span class="choose-plan-view__trust-item">
          <Icon :icon="Headset" :size="16" />
          {{ $t('billing.choosePlan.trust.humanSupport') }}
        </span>
      </div>
    </header>

    <div v-if="isLoading" class="choose-plan-view__state">
      <Spinner :size="32" />
    </div>

    <div v-else-if="hasError" class="choose-plan-view__state">
      <p>{{ $t('billing.choosePlan.error') }}</p>
      <Button variant="outline" @click="load">{{ $t('billing.choosePlan.retry') }}</Button>
    </div>

    <p v-else-if="plans.length === 0" class="choose-plan-view__state">
      {{ $t('billing.choosePlan.empty') }}
    </p>

    <div v-else class="choose-plan-view__grid">
      <PlanCard
        v-for="plan in plans"
        :key="plan.id"
        :highlighted="plan.id === mostEconomicalPlanId"
        :is-submitting="isSubscribing"
        :monthly-equivalent="monthlyEquivalentFor(plan)"
        :plan="plan"
        :yearly-savings="savingsFor(plan)"
        @select="subscribe"
      />
    </div>

    <DocumentPromptModal
      v-model="isDocumentPromptOpen"
      :is-submitting="isSubscribing"
      @confirm="confirmDocument"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.choose-plan-view {
  min-height: 100vh;
  padding: $spacing-24 $spacing-24 $spacing-48;
  background-color: $color-bg-1;
}

.choose-plan-view__brand {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.choose-plan-view__header {
  max-width: 640px;
  padding: $spacing-48 0 $spacing-24;
  margin: 0 auto;
  text-align: center;
}

.choose-plan-view__title {
  font-size: $font-size-2xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.choose-plan-view__subtitle {
  margin-top: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink-40;
}

.choose-plan-view__trust {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-24;
  justify-content: center;
  margin-top: $spacing-24;
}

.choose-plan-view__trust-item {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.choose-plan-view__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-16;
  padding: $spacing-48 0;
  text-align: center;
}

.choose-plan-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  max-width: 1200px;
  gap: $spacing-24;
  margin: $spacing-24 auto 0;
}
</style>
