<script setup lang="ts">
/**
 * Rodapé Cancelar/Salvar repetido em todo form de CRUD (`ProductForm.vue`/
 * `ProductLaunchForm.vue` tinham a mesma marcação+CSS duplicados,
 * `docs/planejamento/plano-implementacao.md` — refactor pedido pelo
 * usuário em 2026-08-31, "vamos ter composables e componentes
 * abstraídos"). Puramente de apresentação, sem estado interno — só emite
 * `cancel` (o `submit` já é o próprio `@submit.prevent` do `<form>` pai,
 * este bloco não precisa saber disso) e recebe os 2 textos já traduzidos
 * pelo consumidor (bloco nunca decide texto de UI).
 */
import Button from '../ui/Button.vue'

withDefaults(
  defineProps<{
    cancelLabel: string
    isSubmitting?: boolean
    submitLabel: string
  }>(),
  { isSubmitting: false },
)

const emit = defineEmits<{ cancel: [] }>()
</script>

<template>
  <div class="crud-form-actions">
    <Button type="button" variant="outline" @click="emit('cancel')">
      {{ cancelLabel }}
    </Button>
    <Button :disabled="isSubmitting" type="submit" variant="primary">
      {{ submitLabel }}
    </Button>
  </div>
</template>

<style scoped lang="scss">

.crud-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-8;
  padding-top: $spacing-16;
}
</style>
