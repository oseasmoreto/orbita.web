<script setup lang="ts">
/**
 * Só criação (`POST /tickets`) — não existe "editar" chamado depois de
 * aberto, só responder/resolver/disputar (`TicketThreadPanel.vue`).
 * Renderizado dentro do `Drawer.vue` por `TicketsView.vue`, mesmo padrão
 * visual de `CreateAdminUserForm.vue`.
 */
import { useCreateTicketForm } from '../composables/useCreateTicketForm'
import type { CreateTicketFormValues } from '../schemas/createTicketFormSchema'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'
import Textarea from '@/shared/components/ui/Textarea.vue'
import type { Ticket } from '../types/ticket.type'

const emit = defineEmits<{
  cancel: []
  saved: [ticket: Ticket]
}>()

const { errors, isSubmitting, reset, submit, values } = useCreateTicketForm()

reset()

function fieldError(key: keyof CreateTicketFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const created = await submit()

  if (created) {
    emit('saved', created)
  }
}
</script>

<template>
  <form class="create-ticket-form" @submit.prevent="handleSubmit">
    <div class="create-ticket-form__fields">
      <FormGroup :error="fieldError('subject')" :label="$t('support.tickets.form.fields.subject')">
        <Input v-model="values.subject" :invalid="Boolean(fieldError('subject'))" />
      </FormGroup>

      <FormGroup :error="fieldError('message')" :label="$t('support.tickets.form.fields.message')">
        <Textarea v-model="values.message" :invalid="Boolean(fieldError('message'))" :rows="5" />
      </FormGroup>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="$t('support.tickets.form.submit')"
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.create-ticket-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  margin-bottom: $spacing-24;
}
</style>
