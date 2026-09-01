import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { sendNotificationToUser } from '../services/platformApi'

export interface SendNotificationToUserFormValues {
  message: string
  title: string
  userId: string
}

/**
 * Fecha o gap real do OpenAPI — `POST /admin/notifications`
 * (`SendNotificationToUserRequest`) já tinha service function
 * (`sendNotificationToUser`) desde sempre, nunca chamada de lugar
 * nenhum (Fase 9, 2026-09-01). Mesma categoria de
 * `useBroadcastNotificationForm.ts` (fora do `useResourceForm`, ação
 * fire-and-forget) — só ganha o campo `userId` a mais, também sem Zod
 * (mesmo critério: `title`/`message` opcionais no backend, `userId` é
 * sempre um valor de `Select` controlado, nunca texto livre pra validar).
 */
export function useSendNotificationToUserForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const values = reactive<SendNotificationToUserFormValues>({
    message: '',
    title: '',
    userId: '',
  })
  const isSubmitting = ref(false)

  function reset(): void {
    values.message = ''
    values.title = ''
    values.userId = ''
  }

  async function submit(): Promise<boolean> {
    if (!values.userId) {
      return false
    }

    isSubmitting.value = true

    try {
      await sendNotificationToUser({
        message: values.message || undefined,
        title: values.title || undefined,
        userId: values.userId,
      })
      toast.success(t('platform.admin.notifications.sendToUserModal.success'))
      reset()
      return true
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return { isSubmitting, reset, submit, values }
}
