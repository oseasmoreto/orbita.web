<script setup lang="ts">
/**
 * Composição de Modal.vue + 2 Button — confirmação de ação (cancelar
 * assinatura, excluir produto, desconectar marketplace...). Nunca decide
 * o que a confirmação faz de verdade: só emite `confirm`/`cancel`, quem
 * chama decide a ação (seção 3.2 de docs/infra/convencoes-frontend-infra.md
 * — bloco nunca tem regra de negócio).
 *
 * Sem variante "destrutiva"/vermelha de propósito: `Button.vue` não tem
 * `variant="danger"` (removido na reimplementação da Tier 0, o Figma não
 * define essa variante) e o design system só permite `{colors.primary}`
 * como cor de ação — reintroduzir vermelho aqui contradiria as duas
 * decisões já tomadas. O botão de confirmar é sempre `variant="primary"`.
 */
import Button from '../ui/Button.vue'
import Modal from '../ui/Modal.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
  }>(),
  {
    cancelLabel: 'Cancelar',
    confirmLabel: 'Confirmar',
    description: undefined,
  },
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const open = defineModel<boolean>({ default: false })

function handleConfirm(): void {
  emit('confirm')
  open.value = false
}

function handleCancel(): void {
  emit('cancel')
  open.value = false
}
</script>

<template>
  <Modal v-model="open" :description="description" :title="title">
    <template #footer>
      <Button variant="outline" @click="handleCancel">{{ cancelLabel }}</Button>
      <Button variant="primary" @click="handleConfirm">{{ confirmLabel }}</Button>
    </template>
  </Modal>
</template>
