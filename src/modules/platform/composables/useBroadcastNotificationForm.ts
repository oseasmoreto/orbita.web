import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { broadcastNotification } from '../services/platformApi'

export interface BroadcastNotificationFormValues {
  message: string
  title: string
}

/**
 * Fora do motor genérico `useResourceForm` de propósito — broadcast é uma
 * ação "fire-and-forget" (nunca edita um recurso persistido depois,
 * sempre um envio novo), não o par create/update que `useResourceForm`
 * modela. `title`/`message` são opcionais no backend
 * (`BroadcastNotificationRequest`, `sometimes`) — sem Zod aqui: os únicos
 * 2 campos não têm regra client-side que valha a pena adiantar (mesmo
 * critério já usado em `useDeleteAccount.ts`, onde a senha também é
 * opcional sem validação própria), `title` tem `maxlength="255"` no
 * próprio `Input` como guarda leve.
 */
export function useBroadcastNotificationForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const values = reactive<BroadcastNotificationFormValues>({ message: '', title: '' })
  const isSubmitting = ref(false)

  function reset(): void {
    values.message = ''
    values.title = ''
  }

  async function submit(): Promise<boolean> {
    isSubmitting.value = true

    try {
      await broadcastNotification({
        message: values.message || undefined,
        title: values.title || undefined,
      })
      toast.success(t('platform.admin.notifications.broadcastModal.success'))
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
