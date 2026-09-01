import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  type CreateTicketFormValues,
  createTicketFormSchema,
} from '../schemas/createTicketFormSchema'
import { createTicket } from '../services/supportApi'
import type { Ticket } from '../types/ticket.type'

function emptyValues(): CreateTicketFormValues {
  return { message: '', subject: '' }
}

/**
 * Mesmo padrão de `useCreateAdminUserForm.ts` — só cria (`POST /tickets`),
 * `TicketsView.vue` abre o chamado recém-criado direto no
 * `TicketThreadPanel.vue` depois do `saved`, sem precisar de uma segunda
 * ação do usuário.
 */
export function useCreateTicketForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveFieldError, resolveMessage } = useApiMessage()

  const values = reactive<CreateTicketFormValues>(emptyValues())
  const errors = ref<Partial<Record<keyof CreateTicketFormValues, string>>>({})
  const isSubmitting = ref(false)

  function reset(): void {
    Object.assign(values, emptyValues())
    errors.value = {}
  }

  function validate(): boolean {
    const result = createTicketFormSchema(t).safeParse(values)

    if (result.success) {
      errors.value = {}
      return true
    }

    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    )
    return false
  }

  async function submit(): Promise<Ticket | null> {
    if (!validate()) {
      return null
    }

    isSubmitting.value = true

    try {
      const created = await createTicket({ message: values.message, subject: values.subject })
      toast.success(t('support.tickets.form.createSuccess'))
      return created
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        const fieldErrors = errors.value as Record<string, string>

        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          fieldErrors[field] = resolveFieldError(field, messages[0])
        }
      }

      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, reset, submit, values }
}
