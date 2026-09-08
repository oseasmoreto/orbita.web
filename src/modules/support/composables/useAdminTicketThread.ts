import { ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  createAdminTicketMessage,
  getAdminTicket,
  listAdminTicketMessages,
  resolveAdminTicket,
} from '../services/supportApi'
import type { AdminTicket } from '../types/ticket.type'
import type { TicketMessage } from '../types/ticketMessage.type'

/**
 * Thread de UM chamado, lado do admin — `AdminReplyToTicketAction`
 * (backend) nunca checa status (admin pode responder um chamado já
 * resolvido sem reabrir, ex.: nota de encerramento) — sem o branch
 * `shouldDisputeOnReply` de `useTicketThread.ts`, sempre a mesma chamada.
 * Reabrir é sempre iniciativa de quem abriu o chamado (`dispute`), nunca
 * do admin.
 */
export function useAdminTicketThread(initialTicket: AdminTicket) {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const ticket = shallowRef<AdminTicket>(initialTicket)
  const messages = ref<TicketMessage[]>([])
  const isLoading = ref(false)
  const isSending = ref(false)
  const isResolving = ref(false)
  const error = ref<unknown>(null)

  async function refresh(): Promise<void> {
    isLoading.value = true

    try {
      messages.value = await listAdminTicketMessages(ticket.value.id)
      error.value = null
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(body: string, attachments: string[] = []): Promise<boolean> {
    isSending.value = true

    try {
      await createAdminTicketMessage(ticket.value.id, body, attachments)
      // É a resposta do PRÓPRIO admin que dispara `open`→`in_progress`
      // no backend (`AdminReplyToTicketAction`, pedido novo em
      // 2026-09-08) — `createAdminTicketMessage` só devolve a
      // `TicketMessage`, busca o `Ticket` de novo pra refletir a
      // mudança de status sem precisar de reload manual.
      ticket.value = await getAdminTicket(ticket.value.id)
      await refresh()
      return true
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
      return false
    } finally {
      isSending.value = false
    }
  }

  async function resolve(): Promise<void> {
    isResolving.value = true

    try {
      ticket.value = await resolveAdminTicket(ticket.value.id)
      toast.success(t('support.tickets.thread.resolveSuccess'))
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))
    } finally {
      isResolving.value = false
    }
  }

  return {
    error,
    isLoading,
    isResolving,
    isSending,
    messages,
    refresh,
    resolve,
    sendMessage,
    ticket,
  }
}
