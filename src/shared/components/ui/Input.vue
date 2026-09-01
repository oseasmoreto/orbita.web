<script setup lang="ts">
import type { Component } from 'vue'
import { computed, ref, useId } from 'vue'
import { Eye, EyeClosed } from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    type?: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    /**
     * Label renderizada dentro da própria caixa do campo — variante
     * "Input-B" do Figma (padding maior, altura por conteúdo). Sem
     * `label`, é a variante "Input-A" (campo isolado, altura fixa).
     */
    label?: string
    /**
     * Ícone fixo à esquerda (16px, `$color-ink-40` — mesmo tamanho/cor do
     * ícone de apoio já usado em `Search.vue`/`Select.vue`). Puramente
     * decorativo/semântico (ex.: envelope num campo de e-mail), nunca
     * clicável — pedido direto do usuário, 2026-08-28, telas de
     * Identity (login/cadastro), primeiro consumidor real.
     */
    iconBefore?: Component
  }>(),
  {
    disabled: false,
    iconBefore: undefined,
    invalid: false,
    label: undefined,
    placeholder: undefined,
    type: 'text',
  },
)

const model = defineModel<string>({ default: '' })

const inputId = useId()

/**
 * **Achado real, 2026-09-01** — `step` nativo do `<input type="number">`
 * sem esse atributo é `1` por padrão; o `CrudFormActions` do rodapé de
 * todo form de CRUD usa `type="submit"` de verdade, então a validação de
 * constraint NATIVA do browser (`step mismatch`) bloqueia o `submit`
 * ANTES do `@submit.prevent` do form sequer rodar — silencioso, sem
 * toast/erro nenhum, só o browser mostra um tooltip nativo ("Please
 * enter a valid value..."). Descoberto testando `AdminPlanForm.vue`
 * (campo `price`, `79.90`) em browser real — mas afeta QUALQUER campo
 * `type="number"` decimal do app (`ProductForm.vue` — `purchasePrice`/
 * `fullSalePrice`/`targetMargin`/`weight` etc., `AdminPricingRuleForm.vue`),
 * provavelmente nunca pego antes porque o dado de teste desses forms
 * sempre foi seedado via tinker, não digitado e submetido de verdade
 * pelo browser. `step="any"` remove a restrição nativa sem enfraquecer
 * validação real nenhuma — o Zod de cada form (`createProductFormSchema`
 * etc.) já é quem decide inteiro vs. decimal de verdade, o `step` do
 * HTML nunca foi a fonte de verdade.
 */

// `type="password"` sempre ganha o botão de revelar/ocultar — não é opt-in
// por prop porque a UX (mostrar a senha digitada sob demanda) é esperada
// em praticamente todo campo de senha, sem exceção real no produto até
// agora (primeiro uso: Identity). Estado interno é puramente de UI (igual
// o `Modal` saber se está aberto) — nunca vaza pro `v-model`.
const isRevealed = ref(false)
const resolvedType = computed(() => {
  if (props.type !== 'password') {
    return props.type
  }
  return isRevealed.value ? 'text' : 'password'
})

function toggleReveal(): void {
  isRevealed.value = !isRevealed.value
}
</script>

<template>
  <div :class="['ui-input-wrapper', { 'ui-input-wrapper--labeled': label }]">
    <label v-if="label" :for="inputId" class="ui-input-label">{{ label }}</label>
    <div class="ui-input-row">
      <Icon v-if="iconBefore" class="ui-input-icon" :icon="iconBefore" :size="16" />
      <input
        :id="label ? inputId : undefined"
        v-model="model"
        :class="['ui-input', { 'ui-input--invalid': invalid }]"
        :disabled="disabled"
        :placeholder="placeholder"
        :step="type === 'number' ? 'any' : undefined"
        :type="resolvedType"
      />
      <button
        v-if="type === 'password'"
        :aria-label="isRevealed ? $t('common.actions.hidePassword') : $t('common.actions.showPassword')"
        class="ui-input-reveal"
        type="button"
        @click="toggleReveal"
      >
        <Icon :icon="isRevealed ? EyeClosed : Eye" :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.ui-input-wrapper {
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-input:focus-visible) {
    @include focus-ring;
  }

  &:has(.ui-input:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--labeled {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    padding: $spacing-16 $spacing-20;
  }
}

.ui-input-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

// Linha interna que agrupa ícone opcional + campo + botão de revelar —
// existe pra caber os 3 elementos sem quebrar o `:has()` de foco/invalid
// já aplicado no `.ui-input-wrapper` (continua vendo o `.ui-input`
// descendente normalmente, `:has()` não para no primeiro nível).
.ui-input-row {
  display: flex;
  align-items: center;
  gap: $spacing-8;
}

.ui-input-icon {
  flex-shrink: 0;
  color: $color-ink-40;
}

.ui-input {
  width: 100%;
  font-size: $font-size-md;
  color: $color-ink;
  background-color: transparent;
  border: none;

  &:focus-visible {
    outline: none;
  }
}

.ui-input-reveal {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: $color-ink-40;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: $color-ink;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

.ui-input-wrapper:has(.ui-input--invalid) {
  border-color: $color-accent-red;
}
</style>
