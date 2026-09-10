<script setup lang="ts">
/**
 * Rodapé Cancelar/Salvar repetido em todo form de CRUD (`ProductForm.vue`
 * e o form de outro CRUD que já existia na época tinham a mesma
 * marcação+CSS duplicados, `docs/planejamento/plano-implementacao.md` —
 * refactor pedido pelo usuário em 2026-08-31, "vamos ter composables e
 * componentes abstraídos"). Puramente de apresentação, sem estado interno — só emite
 * `cancel` (o `submit` já é o próprio `@submit.prevent` do `<form>` pai,
 * este bloco não precisa saber disso) e recebe os 2 textos já traduzidos
 * pelo consumidor (bloco nunca decide texto de UI).
 *
 * Slot `leading` (2026-09-10, pedido direto do usuário — atalho pra
 * marketplaces do produto dentro do próprio Drawer de edição, ver
 * `ProductForm.vue`): conteúdo opcional alinhado à esquerda, antes dos
 * botões Cancelar/Salvar. Vazio por padrão — `justify-content:
 * space-between` com o slot sem conteúdo empurra os botões pro canto
 * direito exatamente como antes, sem afetar nenhum outro consumidor deste
 * bloco.
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
    <div class="crud-form-actions__leading">
      <slot name="leading" />
    </div>
    <div class="crud-form-actions__buttons">
      <Button type="button" variant="outline" @click="emit('cancel')">
        {{ cancelLabel }}
      </Button>
      <Button :disabled="isSubmitting" type="submit" variant="primary">
        {{ submitLabel }}
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">

.crud-form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $spacing-8;
  padding-top: $spacing-16;
}

.crud-form-actions__buttons {
  display: flex;
  gap: $spacing-8;
}
</style>
