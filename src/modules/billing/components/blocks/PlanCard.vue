<script setup lang="ts">
/**
 * Inspirado na estrutura da referência visual mandada pelo usuário
 * (card de preço + checklist + CTA + destaque "Mais econômico") — sem os
 * pedaços que não se aplicam ao domínio do Orbita: nada de seletor de
 * marketplace nem plano "combo" limitado a canal X/Y (`PLAN` não tem
 * esse conceito, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.2). A checklist usa só os 2 limites REAIS do plano
 * (`max_products`/`max_marketplaces`) — nunca uma lista de features
 * inventada sem campo nenhum por trás.
 *
 * Bloco puramente de apresentação (seção 3.2 de
 * `docs/infra/convencoes-frontend-infra.md`): não decide preço/economia
 * (isso é `usePlanPricing.ts`, testado à parte) nem chama a API — só
 * recebe os números já calculados e emite `select`.
 *
 * Vive em `modules/billing/components/blocks/` por enquanto, não em
 * `shared/` — só tem 1 consumidor real até aqui (`ChoosePlanView.vue`).
 * Promover pra `shared/components/blocks/` quando o segundo consumidor
 * real aparecer (ex.: oferta de upgrade no dashboard ao bater limite de
 * plano, `docs/negocio/jornada-usuario.mmd` nó "Upgrade") — critério de
 * promoção já estabelecido na seção 2 do doc de convenções, não
 * antecipado agora.
 *
 * **Plano trial (`Plan.isTrial`/`trialDays`), 2026-09-01** — sobrescreve
 * CTA/descrição/sufixo de preço com texto próprio ("Testar grátis"/"Acesso
 * completo por N dias, sem cobrança no cartão"/"por N dias" em vez de
 * "/mês") em vez de cair no texto genérico mensal (`billingCycle` do
 * trial já não é nem 'monthly' nem 'yearly', mas o preço R$0,00 sozinho
 * não comunica "é um teste, não um plano pago de graça"). O badge "Mais
 * econômico" nunca aponta pro trial mesmo que ele apareça na lista —
 * `findMostEconomicalPlan` (`usePlanPricing.ts`) já exclui plano trial do
 * comparativo, R$0 sempre venceria trivialmente sem comunicar nada útil.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Check } from '@/shared/components/icons/regular.generated'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import { formatMoney } from '@/shared/services/formatNumber'
import type { Plan } from '../../types/plan.type'

const props = withDefaults(
  defineProps<{
    plan: Plan
    highlighted?: boolean
    /** Sobrescreve o texto do CTA — sem isso, "Começar agora"/"Assinar com desconto" (cópia de assinatura nova) não fazem sentido no contexto de TROCA de plano (`MySubscriptionView.vue` passa `$t('billing.mySubscription.changePlan.cta')`). */
    ctaLabelOverride?: string | null
    /** Card representa o plano que o usuário JÁ tem hoje (`modules/billing/views/MySubscriptionView.vue`, troca de plano) — troca o CTA por um badge "Plano atual" em vez de um botão, nunca oferece selecionar o próprio plano de novo (o backend recusaria com `errorMessageSamePlan`). */
    isCurrent?: boolean
    isSubmitting?: boolean
    /** Só relevante pra `billingCycle === 'yearly'` — preço/mês pra comparação (`usePlanPricing.getMonthlyEquivalent`). */
    monthlyEquivalent?: number | null
    /** Só relevante pra `billingCycle === 'yearly'` — `usePlanPricing.getYearlySavings`, `null` quando não há o que economizar. */
    yearlySavings?: number | null
  }>(),
  {
    ctaLabelOverride: null,
    highlighted: false,
    isCurrent: false,
    isSubmitting: false,
    monthlyEquivalent: null,
    yearlySavings: null,
  },
)

const emit = defineEmits<{ select: [planId: string] }>()

const { t } = useI18n()

const isYearly = computed(() => props.plan.billingCycle === 'yearly')

const displayPrice = computed(() =>
  formatMoney(isYearly.value ? (props.monthlyEquivalent ?? 0) : props.plan.price),
)

// Trial (`Plan.isTrial`) sobrescreve CTA/descrição/sufixo de preço — nunca
// entra nos ramos mensal/anual abaixo, mesmo que `billingCycle` também
// distinga o caso (nem 'monthly' nem 'yearly', ver `plan.type.ts`).
const priceSuffix = computed(() =>
  props.plan.isTrial
    ? t('billing.choosePlan.card.trialSuffix', { days: props.plan.trialDays })
    : t('billing.choosePlan.card.perMonth'),
)

const ctaLabel = computed(() => {
  if (props.ctaLabelOverride) {
    return props.ctaLabelOverride
  }

  if (props.plan.isTrial) {
    return t('billing.choosePlan.card.ctaTrial')
  }

  return props.highlighted
    ? t('billing.choosePlan.card.ctaHighlighted')
    : t('billing.choosePlan.card.cta')
})

const description = computed(() => {
  if (props.plan.isTrial) {
    return t('billing.choosePlan.card.trialDescription', { days: props.plan.trialDays })
  }

  return isYearly.value
    ? t('billing.choosePlan.card.yearlyDescription')
    : t('billing.choosePlan.card.monthlyDescription')
})
</script>

<template>
  <div class="plan-card" :class="{ 'plan-card--highlighted': highlighted }">
    <span v-if="highlighted" class="plan-card__badge">
      {{ $t('billing.choosePlan.card.mostEconomical') }}
    </span>

    <h3 class="plan-card__name">{{ plan.name }}</h3>

    <div class="plan-card__price">
      <span class="plan-card__price-value">{{ displayPrice }}</span>
      <span class="plan-card__price-suffix">{{ priceSuffix }}</span>
    </div>

    <p v-if="isYearly" class="plan-card__price-note">
      {{ $t('billing.choosePlan.card.equivalentNote') }}
      <strong>{{ $t('billing.choosePlan.card.payUpfront', { price: formatMoney(plan.price) }) }}</strong>
    </p>

    <p v-if="isYearly && yearlySavings" class="plan-card__savings">
      {{ $t('billing.choosePlan.card.savings', { amount: formatMoney(yearlySavings) }) }}
    </p>

    <p class="plan-card__description">{{ description }}</p>

    <span v-if="isCurrent" class="plan-card__current-badge">
      {{ $t('billing.mySubscription.changePlan.currentPlanBadge') }}
    </span>
    <Button
      v-else
      class="plan-card__cta"
      :disabled="isSubmitting"
      :variant="highlighted ? 'primary' : 'outline'"
      @click="emit('select', plan.id)"
    >
      {{ ctaLabel }}
    </Button>

    <ul class="plan-card__features">
      <li class="plan-card__feature">
        <Icon :icon="Check" :size="16" />
        {{ $t('billing.choosePlan.card.maxProducts', { count: plan.maxProducts }) }}
      </li>
      <li class="plan-card__feature">
        <Icon :icon="Check" :size="16" />
        {{ $t('billing.choosePlan.card.maxMarketplaces', { count: plan.maxMarketplaces }) }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: $spacing-24;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

.plan-card--highlighted {
  border-color: $color-accent-blue;
  border-width: 2px;
}

.plan-card__badge {
  position: absolute;
  top: -$spacing-12;
  right: $spacing-16;
  padding: $spacing-4 $spacing-12;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-paper-fixed;
  background-color: $color-accent-blue;
  border-radius: $radius-80;
}

.plan-card__name {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.plan-card__price {
  display: flex;
  align-items: baseline;
  gap: $spacing-4;
  margin-top: $spacing-16;
}

.plan-card__price-value {
  font-size: $font-size-3xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.plan-card__price-suffix {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.plan-card__price-note {
  margin-top: $spacing-4;
  font-size: $font-size-xs;
  color: $color-ink-40;

  strong {
    font-weight: $font-weight-semibold;
    color: $color-ink;
  }
}

.plan-card__savings {
  margin-top: $spacing-4;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-accent-green;
}

.plan-card__description {
  margin-top: $spacing-16;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.plan-card__cta {
  margin-top: $spacing-16;
  width: 100%;
}

.plan-card__current-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-8 $spacing-16;
  margin-top: $spacing-16;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-ink-40;
  background-color: $color-ink-4;
  border-radius: $radius-8;
}

.plan-card__features {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
  padding: 0;
  margin: $spacing-24 0 0;
  list-style: none;
}

.plan-card__feature {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink;

  svg {
    flex-shrink: 0;
    color: $color-accent-blue;
  }
}
</style>
