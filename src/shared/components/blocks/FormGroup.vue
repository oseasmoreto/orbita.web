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
 */
withDefaults(
  defineProps<{
    label?: string
    error?: string
  }>(),
  {
    error: undefined,
    label: undefined,
  },
)
</script>

<template>
  <div class="form-group">
    <label v-if="label" class="form-group__label">
      <span class="form-group__label-text">{{ label }}</span>
      <slot />
    </label>
    <slot v-else />
    <p v-if="error" class="form-group__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

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

.form-group__label-text {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.form-group__error {
  font-size: $font-size-sm;
  color: $color-accent-red;
}
</style>
