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
 *
 * **Fix de contraste em tema escuro, 2026-08-28** — reportado pelo
 * usuário testando o toggle de tema recém-implementado (`AppHeader`):
 * header/label/valor usavam `$color-ink`, que vira branco no tema
 * escuro — mas o fundo (`{colors.tint-1}`/`{colors.tint-2}`) não tem
 * variante escura, continua o mesmo pastel claro nos dois temas, então o
 * texto sumia (branco sobre claro). Trocado por `$color-ink-fixed`,
 * token novo em `_tokens.scss` que nunca flips com o tema (sempre
 * `#000000`) — feito pra exatamente esse padrão, texto sobre um fundo
 * tint que não acompanha o tema.
 */
import type { Component } from 'vue'
import { TrendDown, TrendUp } from '@/shared/components/icons/regular.generated'
import Icon from '../ui/Icon.vue'

withDefaults(
  defineProps<{
    label: string
    value: string
    /**
     * `blue`/`purple`: fundo `{colors.tint-1}`/`{colors.tint-2}`, fixo
     * (não acompanha o tema — ver `$color-ink-fixed`) — reservado pro
     * card "em destaque" (referência real do usuário, 2026-08-28:
     * captura em tema escuro mostrando só 2 dos 4 `StatCard` com esse
     * acento, os outros 2 em superfície neutra que acompanha o tema).
     * `neutral` (default): fundo `{colors.bg-2}`, acompanha claro/escuro
     * normalmente — pro card sem destaque especial.
     */
    tint?: 'blue' | 'neutral' | 'purple'
    trend?: { direction: 'up' | 'down'; value: string }
    /** Ícone no canto superior direito, ao lado do label — variante "Type=B" do Figma. */
    icon?: Component
  }>(),
  {
    icon: undefined,
    tint: 'neutral',
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

// Achado real, captura do usuário em tema escuro (2026-08-28): dos 4
// `StatCard` de referência, só 2 mantêm o acento tint (fixo, não
// acompanha o tema) — os outros 2 viram superfície neutra que ESCURECE
// junto com o resto da página. `{colors.bg-2}` (não `bg-1`, que seria
// igual ao fundo da página por trás e sumiria o card) resolve isso nos
// dois temas sem token novo.
.stat-card--neutral {
  background-color: $color-bg-2;
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

// `$color-ink` sozinho (acima) já resolve certo pro card `--neutral`
// (fundo acompanha o tema). Só `--blue`/`--purple` (fundo FIXO, nunca
// escurece) precisam do texto também fixo — sem isso o texto viraria
// branco no tema escuro sobre um fundo que continua claro (mesmo achado
// já documentado no design-system.md pra este componente).
.stat-card--blue,
.stat-card--purple {
  .stat-card__header,
  .stat-card__label,
  .stat-card__value {
    color: $color-ink-fixed;
  }
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
