<script setup lang="ts">
/**
 * Grounded no `COMPONENT_SET "Status"` do frame "Widget" do Figma
 * (`#4113:41876`, `Type=A`/`Type=B`) — label `14 Semibold`, valor
 * `24 Semibold` (`{typography.title}`), fundo tintado (`Primary/Blue`,
 * mesma aproximação `{colors.tint-1}`/`{colors.tint-2}` já usada no
 * `NotificationItem`), `{radius.16}`, padding `{spacing.24}`.
 *
 * Casca pronta pra Fase 4 (dashboard de precificação) — o conteúdo real
 * (preço sugerido, margem) segue bloqueado pelo gap de backend já
 * registrado (`PricingCalculator` nunca exposto em rota,
 * docs/planejamento/plano-implementacao.md). Este componente não decide
 * nada de negócio: só recebe `label`/`value`/`trend` já calculados.
 *
 * **Ícone de tendência**: o Figma usa "ArrowRise" pro exemplo positivo
 * (`+11.01%`), que não existe no export gerado (mesma classe de gap já
 * registrada pro `CaretUpDown`/`ArrowLineUpDown` do Select) — `TrendUp`/
 * `TrendDown` são os ícones mais próximos disponíveis, com o par completo
 * (o Figma só mostrou o caso positivo).
 */
import { TrendDown, TrendUp } from '@/shared/components/icons/regular.generated'
import Badge from '../ui/Badge.vue'

withDefaults(
  defineProps<{
    label: string
    value: string
    tint?: 'blue' | 'purple'
    trend?: { direction: 'up' | 'down'; value: string }
  }>(),
  {
    tint: 'blue',
    trend: undefined,
  },
)
</script>

<template>
  <div :class="['stat-card', `stat-card--${tint}`]">
    <p class="stat-card__label">{{ label }}</p>
    <div class="stat-card__value-row">
      <p class="stat-card__value">{{ value }}</p>
      <Badge v-if="trend" :icon-before="trend.direction === 'up' ? TrendUp : TrendDown">
        {{ trend.value }}
      </Badge>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.stat-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
  padding: $spacing-24;
  border-radius: $radius-16;
}

// Primeiro uso de tint-1/tint-2 como fundo de card inteiro (não só tile de
// ícone, ver NotificationItem) — mesma aproximação de "Primary/Blue"/
// "Primary/Purple" do Figma.
.stat-card--blue {
  background-color: $color-tint-1;
}

.stat-card--purple {
  background-color: $color-tint-2;
}

.stat-card__label {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.stat-card__value-row {
  display: flex;
  align-items: center;
  gap: $spacing-8;
}

.stat-card__value {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}
</style>
