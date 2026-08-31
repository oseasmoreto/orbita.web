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
    isSubmitting?: boolean
    /** Só relevante pra `billingCycle === 'yearly'` — preço/mês pra comparação (`usePlanPricing.getMonthlyEquivalent`). */
    monthlyEquivalent?: number | null
    /** Só relevante pra `billingCycle === 'yearly'` — `usePlanPricing.getYearlySavings`, `null` quando não há o que economizar. */
    yearlySavings?: number | null
  }>(),
  {
    highlighted: false,
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

const ctaLabel = computed(() =>
  props.highlighted
    ? t('billing.choosePlan.card.ctaHighlighted')
    : t('billing.choosePlan.card.cta'),
)

const description = computed(() =>
  isYearly.value
    ? t('billing.choosePlan.card.yearlyDescription')
    : t('billing.choosePlan.card.monthlyDescription'),
)
</script>

<template>
  <div class="plan-card" :class="{ 'plan-card--highlighted': highlighted }">
    <span v-if="highlighted" class="plan-card__badge">
      {{ $t('billing.choosePlan.card.mostEconomical') }}
    </span>

    <h3 class="plan-card__name">{{ plan.name }}</h3>

    <div class="plan-card__price">
      <span class="plan-card__price-value">{{ displayPrice }}</span>
      <span class="plan-card__price-suffix">{{ $t('billing.choosePlan.card.perMonth') }}</span>
    </div>

    <p v-if="isYearly" class="plan-card__price-note">
      {{ $t('billing.choosePlan.card.equivalentNote') }}
      <strong>{{ $t('billing.choosePlan.card.payUpfront', { price: formatMoney(plan.price) }) }}</strong>
    </p>

    <p v-if="isYearly && yearlySavings" class="plan-card__savings">
      {{ $t('billing.choosePlan.card.savings', { amount: formatMoney(yearlySavings) }) }}
    </p>

    <p class="plan-card__description">{{ description }}</p>

    <Button
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
