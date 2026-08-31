<script setup lang="ts">
/**
 * Aberto quando `useSubscribeToPlan.subscribe()` recebe
 * `errorMessageDocumentRequired` do backend — usuário ainda não tem
 * CPF/CNPJ cadastrado, e "o próprio checkout de assinatura é o ponto de
 * coleta" no MVP (comentário real de `SubscribeToPlanAction`, backend —
 * não existe tela de perfil dedicada ainda). Bloco sem regra de negócio:
 * só valida formato (`useDocumentPromptForm`) e emite `confirm` com o
 * valor — quem decide reenviar a assinatura é o consumidor
 * (`ChoosePlanView.vue`, via `useSubscribeToPlan.confirmDocument`).
 */
import { watch } from 'vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import { useDocumentPromptForm } from '../../composables/useDocumentPromptForm'

defineProps<{ isSubmitting?: boolean }>()
const emit = defineEmits<{ confirm: [document: string] }>()

const open = defineModel<boolean>({ default: false })
const { errors, reset, validate, values } = useDocumentPromptForm()

function handleConfirm(): void {
  if (!validate()) {
    return
  }

  emit('confirm', values.document)
}

// Reabrir depois de fechar (sucesso ou cancelamento) nunca deve mostrar o
// CPF/CNPJ ou erro da tentativa anterior.
watch(open, (isOpen) => {
  if (!isOpen) {
    reset()
  }
})
</script>

<template>
  <Modal
    v-model="open"
    :description="$t('billing.documentPrompt.description')"
    :title="$t('billing.documentPrompt.title')"
  >
    <FormGroup :error="errors.document" :label="$t('billing.documentPrompt.fields.document')">
      <Input
        v-model="values.document"
        :invalid="Boolean(errors.document)"
        :placeholder="$t('billing.documentPrompt.placeholders.document')"
        @keyup.enter="handleConfirm"
      />
    </FormGroup>

    <template #footer>
      <Button variant="outline" @click="open = false">
        {{ $t('common.actions.cancel') }}
      </Button>
      <Button :disabled="isSubmitting" variant="primary" @click="handleConfirm">
        {{ $t('billing.documentPrompt.submit') }}
      </Button>
    </template>
  </Modal>
</template>
