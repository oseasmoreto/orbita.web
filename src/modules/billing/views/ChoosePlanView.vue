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
 *
 * **Botão de logout, pedido direto pelo usuário em 2026-09-01**: esta
 * view é fora do `AppLayout` (sem `AppSidebar`/`AppHeader`, é o passo de
 * onboarding entre cadastro e pagamento — `skipOnboardingChecks`), então
 * não tem o botão de logout que já existe no topo da sidebar
 * (`AppSidebarContent.vue`) — sem saída visível, quem chegasse aqui numa
 * conta errada (ou só quisesse desistir do onboarding) ficaria preso.
 * Mesmo `useLogout()` (`modules/identity/composables`), mesmo ícone
 * (`SignOut`) e mesma chave de tradução (`common.actions.logout`) já
 * usados no botão da sidebar — mas com o texto visível ao lado do ícone
 * (`variant="ghost"`), não ícone-só, porque aqui não há nenhum outro
 * indício visual de "isso é sair" (sem avatar/nome ao lado, como na
 * sidebar).
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  ArrowsClockwise,
  Headset,
  ShieldCheck,
  SignOut,
} from '@/shared/components/icons/regular.generated'
import { useLogout } from '@/modules/identity/composables/useLogout'
import BlockTab from '@/shared/components/ui/BlockTab.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import PlanCard from '../components/blocks/PlanCard.vue'
import { useChoosePlan } from '../composables/useChoosePlan'
import {
  findMostEconomicalPlan,
  getMonthlyEquivalent,
  getYearlySavings,
} from '../composables/usePlanPricing'
import { useSubscribeToPlan } from '../composables/useSubscribeToPlan'
import type { BillingCycle, Plan } from '../types/plan.type'
import type { BlockTabOption } from '@/shared/components/ui/types/blockTab.type'

const { t } = useI18n()
const { billingCycle, hasError, isLoading, load, plans, setBillingCycle, visiblePlans } =
  useChoosePlan()
const { isSubscribing, subscribe } = useSubscribeToPlan()
const { isLoggingOut, logout } = useLogout()

onMounted(load)

const billingCycleOptions = computed<BlockTabOption[]>(() => [
  { key: 'monthly', label: t('billing.billingCycleFilter.monthly') },
  { key: 'yearly', label: t('billing.billingCycleFilter.yearly') },
])

// Badge "Mais econômico" compara só entre o que está VISÍVEL agora (o
// ciclo selecionado) — comparar contra a lista completa destacaria um
// plano de outro ciclo, que não aparece em nenhum card da grade atual.
const mostEconomicalPlanId = computed(() =>
  visiblePlans.value.length > 1 ? (findMostEconomicalPlan(visiblePlans.value)?.id ?? null) : null,
)

function monthlyEquivalentFor(plan: Plan): number {
  return getMonthlyEquivalent(plan)
}

// `plans` (não `visiblePlans`) de propósito — precisa enxergar os 2
// ciclos pra comparar um plano anual contra o mensal mais barato, mesmo
// com o usuário filtrando a exibição só pra "Anual" (`useChoosePlan.ts`).
function savingsFor(plan: Plan): number | null {
  return getYearlySavings(plan, plans.value)
}
</script>

<template>
  <div class="choose-plan-view">
    <div class="choose-plan-view__topbar">
      <div class="choose-plan-view__brand">Orbita</div>
      <Button
        :disabled="isLoggingOut"
        :icon-before="SignOut"
        variant="ghost"
        @click="logout"
      >
        {{ $t('common.actions.logout') }}
      </Button>
    </div>

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

    <div class="choose-plan-view__billing-cycle">
      <BlockTab
        :model-value="billingCycle"
        :options="billingCycleOptions"
        @update:model-value="(key) => setBillingCycle(key as BillingCycle)"
      />
    </div>

    <div v-if="isLoading" class="choose-plan-view__state">
      <Spinner :size="32" />
    </div>

    <div v-else-if="hasError" class="choose-plan-view__state">
      <p>{{ $t('billing.choosePlan.error') }}</p>
      <Button variant="outline" @click="load">{{ $t('billing.choosePlan.retry') }}</Button>
    </div>

    <p v-else-if="visiblePlans.length === 0" class="choose-plan-view__state">
      {{ $t('billing.choosePlan.empty') }}
    </p>

    <div v-else class="choose-plan-view__grid">
      <PlanCard
        v-for="plan in visiblePlans"
        :key="plan.id"
        :highlighted="plan.id === mostEconomicalPlanId"
        :is-submitting="isSubscribing"
        :monthly-equivalent="monthlyEquivalentFor(plan)"
        :plan="plan"
        :yearly-savings="savingsFor(plan)"
        @select="subscribe"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.choose-plan-view {
  min-height: 100vh;
  padding: $spacing-24 $spacing-24 $spacing-48;
  background-color: $color-bg-1;
}

.choose-plan-view__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.choose-plan-view__billing-cycle {
  display: flex;
  justify-content: center;
  margin-top: $spacing-24;
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
