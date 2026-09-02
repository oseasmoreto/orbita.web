<script setup lang="ts">
/**
 * Composição de Label + controle de formulário + mensagem de erro (seção
 * 3.2 de docs/infra/convencoes-frontend-infra.md) — sem frame próprio no
 * Figma (o "Form" do Figma só define Input/Select/Date/Switch/Tags/Checkbox
 * isolados, sem um padrão de erro — confirmado na leitura da página de
 * componentes). Nunca decide regra de validação: `error` é só uma string
 * já resolvida, o composable `use<Recurso>Form` do módulo é quem decide.
 *
 * O label envolve o controle (`<label>` ao redor do `<slot />`, não
 * `for`/`id`) de propósito: `Input.vue`/`Select.vue`/`Checkbox.vue` não
 * expõem um `id` externo (cada um gera o próprio via `useId()` interno),
 * então a associação por atributo não alcançaria o elemento real por
 * dentro. Envolver funciona porque `<label>` foca automaticamente o
 * primeiro elemento focável descendente (`<input>`, `<button>`...) —
 * cobre o `<input>` nativo do Input.vue e o `<button>` do Reka UI por
 * trás de Select/Checkbox sem precisar de nenhum id compartilhado.
 *
 * `labelTooltip` (opcional, 2026-09-02, primeiro consumidor:
 * `ProductForm.vue` — "preço de custo") explica o CAMPO em si, não a
 * mensagem de erro — ícone de apoio ao lado do texto do label, mesmo
 * padrão de trigger não-Button já usado no header de "Dimensões da
 * embalagem" (`<span tabindex="0">`, seção Tooltip de
 * `docs/design/design-system.md`). `@click.stop` no trigger evita que o
 * clique borbulhe pro `<label>` e foque o controle por engano — o
 * `<label>` já foca o primeiro descendente focável de propósito (ver
 * acima), e o ícone de tooltip não deveria contar como esse descendente.
 */
import { Info } from '@/shared/components/icons/regular.generated'
import Icon from '@/shared/components/ui/Icon.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'

withDefaults(
  defineProps<{
    label?: string
    labelTooltip?: string
    error?: string
  }>(),
  {
    error: undefined,
    label: undefined,
    labelTooltip: undefined,
  },
)
</script>

<template>
  <div class="form-group">
    <label v-if="label" class="form-group__label">
      <span class="form-group__label-row">
        <span class="form-group__label-text">{{ label }}</span>
        <Tooltip v-if="labelTooltip" :text="labelTooltip">
          <span class="form-group__label-tooltip-trigger" tabindex="0" @click.stop>
            <Icon :icon="Info" :size="14" />
          </span>
        </Tooltip>
      </span>
      <slot />
    </label>
    <slot v-else />
    <p v-if="error" class="form-group__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.form-group {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.form-group__label {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
}

.form-group__label-row {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.form-group__label-text {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.form-group__label-tooltip-trigger {
  display: inline-flex;
  color: $color-ink-40;
  cursor: default;

  &:focus-visible {
    @include focus-ring;
  }
}

.form-group__error {
  font-size: $font-size-sm;
  color: $color-accent-red;
}
</style>
