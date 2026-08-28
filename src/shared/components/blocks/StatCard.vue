<script setup lang="ts">
/**
 * Grounded no `COMPONENT_SET "Status"` do frame "Widget" do Figma
 * (`#4113:41876`, `Type=A`/`Type=B`) — fundo tintado (`Primary/Blue`,
 * mesma aproximação `{colors.tint-1}`/`{colors.tint-2}` já usada no
 * `NotificationItem`), `{radius.16}`, padding `{spacing.24}`.
 *
 * **Revisão pixel-perfect em 2026-08-28, com captura real do usuário**
 * (a primeira versão foi construída sem essa captura, só com a régua
 * geral de "label + valor grande + badge de tendência"). Achados:
 * `Type=B` (ícone no canto superior direito, sem tendência) nunca tinha
 * sido implementado de verdade — só `Type=A` existia, apesar do
 * comentário antigo dizer que os dois estavam cobertos. Corrigido com a
 * prop `icon` opcional. Ver mais correções nos comentários abaixo.
 *
 * Casca pronta pra Fase 4 (dashboard de precificação) — o conteúdo real
 * (preço sugerido, margem) segue bloqueado pelo gap de backend já
 * registrado (`PricingCalculator` nunca exposto em rota,
 * docs/planejamento/plano-implementacao.md). Este componente não decide
 * nada de negócio: só recebe `label`/`value`/`trend`/`icon` já calculados.
 *
 * **Ícone de tendência**: o Figma usa "ArrowRise" pro exemplo positivo
 * (`+11.01%`), que não existe no export gerado (mesma classe de gap já
 * registrada pro `CaretUpDown`/`ArrowLineUpDown` do Select) — `TrendUp`/
 * `TrendDown` são os ícones mais próximos disponíveis, com o par completo
 * (o Figma só mostrou o caso positivo).
 */
import type { Component } from 'vue'
import { TrendDown, TrendUp } from '@/shared/components/icons/regular.generated'
import Icon from '../ui/Icon.vue'

withDefaults(
  defineProps<{
    label: string
    value: string
    tint?: 'blue' | 'purple'
    trend?: { direction: 'up' | 'down'; value: string }
    /** Ícone no canto superior direito, ao lado do label — variante "Type=B" do Figma. */
    icon?: Component
  }>(),
  {
    icon: undefined,
    tint: 'blue',
    trend: undefined,
  },
)
</script>

<template>
  <div :class="['stat-card', `stat-card--${tint}`]">
    <div class="stat-card__header">
      <p class="stat-card__label">{{ label }}</p>
      <Icon v-if="icon" :icon="icon" :size="16" />
    </div>
    <div class="stat-card__value-row">
      <p class="stat-card__value">{{ value }}</p>
      <span
        v-if="trend"
        :class="['stat-card__trend', `stat-card__trend--${trend.direction}`]"
      >
        {{ trend.value }}
        <Icon :icon="trend.direction === 'up' ? TrendUp : TrendDown" :size="12" />
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.stat-card {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
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

.stat-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: $color-ink;
}

// Peso corrigido na revisão pixel-perfect: a captura real mostra "Views"
// visivelmente mais fino que o valor grande abaixo — a primeira versão
// usava Semibold nos dois, sem grounding real (só a régua geral do
// catálogo, "label + valor grande").
.stat-card__label {
  font-size: $font-size-md;
  font-weight: $font-weight-regular;
  color: $color-ink;
}

// Gap aumentado (8px → 16px) na revisão pixel-perfect — a captura real
// mostra bem mais respiro entre o valor e o indicador de tendência do
// que a primeira versão tinha.
.stat-card__value-row {
  display: flex;
  align-items: center;
  gap: $spacing-16;
}

.stat-card__value {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

// Reescrito na revisão pixel-perfect: a primeira versão reaproveitava
// `Badge.vue` (ícone antes do texto, sem cor própria — sempre
// `{colors.ink}`, preto). A captura real mostra 2 diferenças: o ícone vem
// DEPOIS do texto (`+11.01% ↗`, não `↗ +11.01%`), e o texto/ícone inteiro
// é colorido (verde pra alta, não preto) — sem essa segunda parte,
// `Badge.vue` não tem prop de cor própria pra oferecer, então virou
// markup próprio do StatCard em vez de composição.
.stat-card__trend {
  display: inline-flex;
  align-items: center;
  gap: $spacing-4;
  font-size: $font-size-sm;
}

.stat-card__trend--up {
  color: $color-accent-green;
}

.stat-card__trend--down {
  color: $color-accent-red;
}
</style>
