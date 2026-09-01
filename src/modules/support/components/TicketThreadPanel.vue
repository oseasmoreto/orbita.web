<script setup lang="ts">
/**
 * Painel de conversa de UM chamado, lado do PRÓPRIO usuário — estrutura
 * inspirada no frame "Chats" (Figma "AiDEA", pedido direto do usuário em
 * 2026-09-01: painel único de mensagens + composer embaixo, em vez de
 * uma tela própria; aqui vive dentro do `Drawer.vue` de `TicketsView.vue`,
 * não uma view roteada). `useTicketThread.ts` concentra a lógica
 * (buscar mensagens, responder — que também decide sozinho se é resposta
 * comum ou contestação via `shouldDisputeOnReply` —, resolver); este
 * componente só monta a UI em cima do composable.
 */
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/core/store/useAuthStore'
import Button from '@/shared/components/ui/Button.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import Textarea from '@/shared/components/ui/Textarea.vue'
import { PaperPlaneTilt } from '@/shared/components/icons/regular.generated'
import { useTicketThread } from '../composables/useTicketThread'
import { ticketStatusColor } from '../types/ticket.type'
import TicketMessageList from './blocks/TicketMessageList.vue'
import type { Ticket } from '../types/ticket.type'

const props = defineProps<{
  ticket: Ticket
}>()

const emit = defineEmits<{ updated: [ticket: Ticket] }>()

const { t } = useI18n()
const authStore = useAuthStore()

const thread = useTicketThread(props.ticket)
onMounted(thread.refresh)

const replyBody = ref('')

async function handleSend(): Promise<void> {
  if (!replyBody.value.trim()) {
    return
  }

  const sent = await thread.sendMessage(replyBody.value)

  if (sent) {
    replyBody.value = ''
    emit('updated', thread.ticket.value)
  }
}

async function handleResolve(): Promise<void> {
  await thread.resolve()
  emit('updated', thread.ticket.value)
}

const isResolved = computed(() => thread.ticket.value.status === 'resolved')
</script>

<template>
  <div class="ticket-thread-panel">
    <div class="ticket-thread-panel__header">
      <div>
        <h2 class="ticket-thread-panel__subject">{{ thread.ticket.value.subject }}</h2>
        <StatusDot :color="ticketStatusColor(thread.ticket.value.status)">
          {{ $t(`support.tickets.status.${thread.ticket.value.status}`) }}
        </StatusDot>
      </div>
      <Button v-if="!isResolved" :disabled="thread.isResolving.value" variant="outline" @click="handleResolve()">
        {{ $t('support.tickets.thread.resolveButton') }}
      </Button>
    </div>

    <TicketMessageList
      :current-user-id="authStore.user?.id ?? ''"
      :messages="thread.messages.value"
    />

    <div class="ticket-thread-panel__composer">
      <p v-if="isResolved" class="ticket-thread-panel__reopen-notice">
        {{ $t('support.tickets.thread.reopenNotice') }}
      </p>
      <div class="ticket-thread-panel__composer-bar">
        <Textarea
          v-model="replyBody"
          :max-rows="6"
          :placeholder="$t('support.tickets.thread.replyPlaceholder')"
          :rows="1"
          @keydown.enter.exact.prevent="handleSend()"
        />
        <Button
          :aria-label="t('common.actions.send')"
          :disabled="thread.isSending.value"
          :icon-before="PaperPlaneTilt"
          variant="primary"
          @click="handleSend()"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ticket-thread-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ticket-thread-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-16;
  padding-bottom: $spacing-16;
  border-bottom: 1px solid $color-ink-10;
}

.ticket-thread-panel__subject {
  margin-bottom: $spacing-8;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.ticket-thread-panel__composer {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
  padding-top: $spacing-16;
  border-top: 1px solid $color-ink-10;
}

// Barra única (input + botão de enviar), não um `Input`/`Button` soltos
// lado a lado — pedido direto do usuário, 2026-09-01, comparando com a
// referência real do frame "Chats" (composer é uma única forma
// arredondada, não 2 elementos separados). `Textarea.vue` cede a própria
// borda/fundo/padding pra essa barra assumir (mesma técnica de
// `.ui-toolbar__filters :deep(.ui-select-wrapper)` já usada no
// `ListToolbar.vue`).
.ticket-thread-panel__composer-bar {
  display: flex;
  align-items: flex-end;
  gap: $spacing-8;
  padding: $spacing-8;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

// `Textarea.vue` cede a própria borda/fundo pra essa barra — o próprio
// componente continua responsável pelo próprio anel de foco (regra
// `:has(.ui-textarea:focus-visible)` já dentro do seu style, `outline`
// não depende de border/background removidos aqui).
.ticket-thread-panel__composer-bar :deep(.ui-textarea-wrapper) {
  flex: 1;
  padding: $spacing-8 $spacing-4;
  background-color: transparent;
  border: none;
}

.ticket-thread-panel__reopen-notice {
  font-size: $font-size-xs;
  color: $color-accent-yellow;
}
</style>
