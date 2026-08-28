<script setup lang="ts">
/**
 * Resolve o gap "Label" do catálogo (`docs/design/catalogo-componentes.md`
 * seção 2) — em aberto desde a Tier 1 como "prop de Badge ou componente
 * próprio StatusBadge.vue, decidir na hora de implementar". A primeira
 * captura do usuário resolveu a dúvida pra variante `dot` (default): não
 * é pill com fundo — é ponto colorido + texto na mesma cor, sem fundo
 * nenhum. **2ª captura, 2026-08-28**: o Figma tinha as duas variantes
 * lado a lado (ponto pulsante E pill com fundo) — adicionada a variante
 * `pill` (prop `variant`), pulsante continua intocado.
 *
 * `color` é só uma paleta de acentos genérica — o átomo não sabe o que
 * "In Progress"/"Approved"/"Rejected" significam, quem decide o mapeamento
 * status→cor é o consumidor (mesma régua de "componente nunca tem regra de
 * negócio", `docs/infra/convencoes-frontend-infra.md` seção 3).
 */
withDefaults(
  defineProps<{
    color?:
      | 'purple'
      | 'indigo'
      | 'blue'
      | 'cyan'
      | 'mint'
      | 'green'
      | 'yellow'
      | 'orange'
      | 'red'
      | 'gray'
    /** `dot` (default) = ponto pulsante sem fundo; `pill` = cápsula com fundo tingido. */
    variant?: 'dot' | 'pill'
  }>(),
  {
    color: 'gray',
    variant: 'dot',
  },
)
</script>

<template>
  <span :class="['ui-status-dot', `ui-status-dot--${color}`, `ui-status-dot--${variant}`]">
    <span v-if="variant === 'dot'" class="ui-status-dot__marker" />
    <slot />
  </span>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ui-status-dot {
  display: inline-flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-sm;
}

// Marcador herda `currentColor` do texto — uma declaração de cor só por
// variante cobre ponto + texto ao mesmo tempo (a captura do usuário mostra
// os dois na mesma cor, nunca ponto colorido com texto neutro).
//
// Pulsante a pedido do usuário (2026-08-28): o ponto sólido fica parado,
// um `::before` absoluto do mesmo tamanho/cor expande e desaparece em
// loop por baixo dele — mesmo efeito "ping" de indicador ao vivo já
// comum em outros design systems, sem precisar de um segundo elemento no
// template (pseudo-elemento resolve sozinho).
.ui-status-dot__marker {
  position: relative;
  flex-shrink: 0;
  width: $spacing-8;
  height: $spacing-8;
  background-color: currentColor;
  border-radius: $radius-80;

  &::before {
    position: absolute;
    inset: 0;
    content: '';
    background-color: currentColor;
    border-radius: inherit;
    animation: ui-status-dot-pulse 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
}

@keyframes ui-status-dot-pulse {
  0% {
    opacity: 0.6;
    transform: scale(1);
  }

  75%,
  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}

// Fundo tingido derivado da própria `currentColor` da variante de cor
// (`color-mix`, não um segundo token por acento) — reaproveita a mesma
// declaração de cor já usada pro texto/ponto, sem precisar de 10 tokens
// novos de "acento claro" que não existem na escala de origem.
.ui-status-dot--pill {
  padding: $spacing-4 $spacing-12;
  font-weight: $font-weight-semibold;
  background-color: color-mix(in srgb, currentColor 16%, transparent);
  border-radius: $radius-80;
}

.ui-status-dot--purple {
  color: $color-accent-purple;
}

.ui-status-dot--indigo {
  color: $color-accent-indigo;
}

.ui-status-dot--blue {
  color: $color-accent-blue;
}

.ui-status-dot--cyan {
  color: $color-accent-cyan;
}

.ui-status-dot--mint {
  color: $color-accent-mint;
}

.ui-status-dot--green {
  color: $color-accent-green;
}

.ui-status-dot--yellow {
  color: $color-accent-yellow;
}

.ui-status-dot--orange {
  color: $color-accent-orange;
}

.ui-status-dot--red {
  color: $color-accent-red;
}

// Sem token de acento neutro — "Rejected" na captura do usuário é cinza,
// não vermelho, então reaproveita a rampa de opacidade de `ink` em vez de
// um acento novo (mesmo critério de "nunca invente um valor fora da
// escala" já usado no resto do design system).
.ui-status-dot--gray {
  color: $color-ink-40;
}
</style>
