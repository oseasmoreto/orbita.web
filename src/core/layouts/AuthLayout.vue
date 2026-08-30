<script setup lang="ts">
/**
 * Shell compartilhado das 4 telas de Identity (login/cadastro/esqueci a
 * senha/redefinir senha) — pedido direto do usuário, 2026-08-28, com
 * capturas de referência de um outro produto ("AiDEA"): split screen,
 * painel esquerdo branco com marca + card de formulário, painel direito
 * decorativo em fundo neutro. Instrução explícita: "pegue como referência
 * só a estrutura" — a ilustração 3D da referência não existe no design
 * system do Orbita (sem asset de marca/logo pronto, ver design-system.md
 * "Known Gaps"), então o painel direito usa só os tokens já existentes:
 * um círculo com glow suave em `{colors.accent-indigo}` e um ícone grande
 * do próprio conjunto de ícones (`icon`, escolhido por tela — cadeado no
 * login, pessoa no cadastro, escudo em esqueci/redefinir senha).
 *
 * Mobile-first: painel decorativo (`__illustration`) é `display: none`
 * abaixo de `$breakpoint-md` — a referência é desktop-only, e não faz
 * sentido gastar metade da tela só com decoração num viewport pequeno;
 * o formulário ocupa a largura toda.
 */
import type { Component } from 'vue'
import Icon from '@/shared/components/ui/Icon.vue'

defineProps<{
  illustrationIcon: Component
}>()
</script>

<template>
  <div class="auth-layout">
    <div class="auth-layout__panel">
      <div class="auth-layout__brand">Orbita</div>
      <div class="auth-layout__card">
        <slot />
      </div>
    </div>

    <div class="auth-layout__illustration">
      <div class="auth-layout__illustration-glow">
        <Icon class="auth-layout__illustration-icon" :icon="illustrationIcon" :size="80" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.auth-layout {
  display: flex;
  min-height: 100vh;
  background-color: $color-bg-1;
}

.auth-layout__panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: $spacing-40;
  padding: $spacing-24 $spacing-24 $spacing-48;

  @media (min-width: $breakpoint-md) {
    flex: 0 0 480px;
    padding: $spacing-48;
  }
}

.auth-layout__brand {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.auth-layout__card {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

// Só existe a partir do breakpoint md — abaixo disso o formulário ocupa
// a tela inteira (decoração não é essencial num viewport pequeno).
.auth-layout__illustration {
  display: none;

  @media (min-width: $breakpoint-md) {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: $color-bg-2;
  }
}

// Círculo/glow fora da escala de tamanho (maior valor do token é
// `{size.80}`) de propósito — é uma peça decorativa única desta tela, não
// um controle/ícone reaproveitável em outro lugar do design system (mesma
// categoria de exceção já documentada pra Badge/Search/AppFooter: valor
// medido pro próprio componente, não a escala geral).
.auth-layout__illustration-glow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 240px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, $color-accent-indigo 24%, transparent) 0%,
    color-mix(in srgb, $color-accent-indigo 8%, transparent) 60%,
    transparent 100%
  );
  border-radius: $radius-80;
}

.auth-layout__illustration-icon {
  color: $color-accent-indigo;
}
</style>
