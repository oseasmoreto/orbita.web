<script setup lang="ts">
/**
 * `password` fica sempre opcional aqui — `UserResource` não expõe se a
 * conta tem senha cadastrada (conta só-SSO não tem), então a UI não tem
 * como decidir se o campo é obrigatório. Manda o que foi digitado (ou
 * nada) e deixa `DeleteUserAccountAction` (backend) decidir — só cobra
 * de verdade quem tem senha.
 */
import { ref, watch } from 'vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'

defineProps<{ isSubmitting?: boolean }>()
const emit = defineEmits<{ confirm: [password: string] }>()

const open = defineModel<boolean>({ default: false })
const password = ref('')

function handleConfirm(): void {
  emit('confirm', password.value)
}

watch(open, (isOpen) => {
  if (!isOpen) {
    password.value = ''
  }
})
</script>

<template>
  <Modal
    v-model="open"
    :description="$t('identity.account.deleteAccount.description')"
    :title="$t('identity.account.deleteAccount.title')"
  >
    <FormGroup :label="$t('identity.account.deleteAccount.passwordLabel')">
      <Input
        v-model="password"
        :placeholder="$t('identity.account.deleteAccount.passwordPlaceholder')"
        type="password"
        @keyup.enter="handleConfirm"
      />
    </FormGroup>

    <template #footer>
      <Button variant="outline" @click="open = false">
        {{ $t('common.actions.cancel') }}
      </Button>
      <Button :disabled="isSubmitting" variant="primary" @click="handleConfirm">
        {{ $t('identity.account.deleteAccount.confirm') }}
      </Button>
    </template>
  </Modal>
</template>
