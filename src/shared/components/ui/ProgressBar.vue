<script setup lang="ts">
/**
 * Grounded na captura real do usuário do frame "Widget → Info" do Figma
 * (`Status-1`/`Status-2`, antes marcado fora de escopo em
 * `docs/design/catalogo-componentes.md` como "conteúdo genérico sem caso
 * de uso" — revertido depois do pedido direto do usuário com captura).
 * Construído sobre `ProgressRoot`/`ProgressIndicator` da Reka UI (mesmo
 * caminho de "não reinventar primitivo acessível do zero" do resto do
 * design system) — o preenchimento não vem de nenhum estilo pronto do
 * primitivo (ele só expõe `data-state`/`data-value`/`data-max`), a
 * largura é calculada aqui (`value / max`) e aplicada via `:style`.
 *
 * Duas variantes vistas na captura, cobertas pela mesma prop `label`:
 * - Com `label` ("In Progress"): texto fica dentro do preenchimento
 *   colorido, alinhado à esquerda — a porcentagem (se precisar aparecer)
 *   é responsabilidade do consumidor, fora do átomo (é assim que a
 *   captura mostra: "51%" ao lado da barra, não dentro).
 * - Sem `label`, com `showPercentage`: porcentagem centralizada na barra
 *   inteira (`position: absolute`), independente da largura do
 *   preenchimento — é o padrão da barra "Profile Completion" da captura.
 */
import { ProgressIndicator, ProgressRoot } from 'reka-ui'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    max?: number
    /** Texto dentro do preenchimento colorido, alinhado à esquerda — ex.: "In Progress". */
    label?: string
    /** Porcentagem centralizada na barra inteira — ex.: "Profile Completion". */
    showPercentage?: boolean
  }>(),
  {
    label: undefined,
    max: 100,
    showPercentage: false,
  },
)

const percentage = computed(() => Math.round((props.value / props.max) * 100))
</script>

<template>
  <ProgressRoot class="ui-progress-bar" :max="max" :model-value="value">
    <ProgressIndicator class="ui-progress-bar__fill" :style="{ width: `${percentage}%` }">
      <span v-if="label" class="ui-progress-bar__label">{{ label }}</span>
    </ProgressIndicator>
    <span v-if="showPercentage" class="ui-progress-bar__percentage">{{ percentage }}%</span>
  </ProgressRoot>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ui-progress-bar {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: $size-32;
  overflow: hidden;
  background-color: $color-ink-4;
  border-radius: $radius-8;
}

.ui-progress-bar__fill {
  display: flex;
  align-items: center;
  height: 100%;
  background-color: $color-accent-indigo;
  border-radius: inherit;
  transition: width 0.2s ease;
}

.ui-progress-bar__label {
  padding-left: $spacing-12;
  overflow: hidden;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-ink;
  white-space: nowrap;
}

.ui-progress-bar__percentage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}
</style>
