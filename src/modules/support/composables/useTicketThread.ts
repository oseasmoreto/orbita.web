import { ref, shallowRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import {
  createTicketMessage,
  disputeTicket,
  listTicketMessages,
  resolveTicket,
} from '../services/supportApi'
import type { Ticket, TicketStatus } from '../types/ticket.type'
import type { TicketMessage } from '../types/ticketMessage.type'

/**
 * Decide qual endpoint uma nova mensagem do PRÓPRIO usuário dispara —
 * regra de negócio real, por isso testada isoladamente (seção 11.2 de
 * `docs/infra/convencoes-frontend-infra.md`). Chamado `resolved`: enviar
 * mensagem É a contestação (`POST /tickets/{id}/dispute`,
 * `DisputeTicketAction` reabre e já registra a mensagem no histórico —
 * sem 3º status, decisão 2026-09-01 do backend). Chamado `open`: resposta
 * comum (`POST /tickets/{id}/messages`), nunca muda status.
 */
export function shouldDisputeOnReply(status: TicketStatus): boolean {
  return status === 'resolved'
}

/**
 * Thread de UM chamado, lado do PRÓPRIO usuário — busca mensagens,
 * envia resposta (via `shouldDisputeOnReply`), resolve. `ticket` é
 * `shallowRef` (mesma decisão de `useCrudDrawer.ts`: entidade de domínio
 * externa, só precisa da referência, `ref()` quebraria igualdade).
 */
export function useTicketThread(initialTicket: Ticket) {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const ticket = shallowRef<Ticket>(initialTicket)
  const messages = ref<TicketMessage[]>([])
  const isLoading = ref(false)
  const isSending = ref(false)
  const isResolving = ref(false)
  const error = ref<unknown>(null)

  async function refresh(): Promise<void> {
    isLoading.value = true

    try {
      messages.value = await listTicketMessages(ticket.value.id)
      error.value = null
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  async function sendMessage(body: string): Promise<boolean> {
    isSending.value = true

    try {
      if (shouldDisputeOnReply(ticket.value.status)) {
        ticket.value = await disputeTicket(ticket.value.id, body)
        toast.success(t('support.tickets.thread.disputeSuccess'))
      } else {
        await createTicketMessage(ticket.value.id, body)
      }

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
      ticket.value = await resolveTicket(ticket.value.id)
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
