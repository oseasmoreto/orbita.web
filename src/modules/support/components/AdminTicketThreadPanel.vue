<script setup lang="ts">
/**
 * Painel de conversa de UM chamado, lado do admin — mesma estrutura de
 * `TicketThreadPanel.vue` (frame "Chats" do Figma "AiDEA" como
 * referência de layout), com 2 diferenças reais: mostra quem abriu
 * (`ticket.user.name`, já que aqui não é sempre o próprio usuário) e
 * nunca contesta/reabre (`useAdminTicketThread.ts` sempre manda a mesma
 * chamada de resposta, reabrir é sempre iniciativa de quem abriu).
 */
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/core/store/useAuthStore'
import Button from '@/shared/components/ui/Button.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import Textarea from '@/shared/components/ui/Textarea.vue'
import { PaperPlaneTilt } from '@/shared/components/icons/regular.generated'
import { useAdminTicketThread } from '../composables/useAdminTicketThread'
import { ticketStatusColor } from '../types/ticket.type'
import TicketMessageList from './blocks/TicketMessageList.vue'
import type { AdminTicket } from '../types/ticket.type'

const props = defineProps<{
  ticket: AdminTicket
}>()

const emit = defineEmits<{ updated: [ticket: AdminTicket] }>()

const { t } = useI18n()
const authStore = useAuthStore()

const thread = useAdminTicketThread(props.ticket)
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
  <div class="admin-ticket-thread-panel">
    <div class="admin-ticket-thread-panel__header">
      <div>
        <h2 class="admin-ticket-thread-panel__subject">{{ thread.ticket.value.subject }}</h2>
        <p class="admin-ticket-thread-panel__opened-by">
          {{ $t('support.admin.tickets.thread.openedBy', { name: thread.ticket.value.user.name }) }}
        </p>
        <StatusDot :color="ticketStatusColor(thread.ticket.value.status)">
          {{ $t(`support.tickets.status.${thread.ticket.value.status}`) }}
        </StatusDot>
      </div>
      <Button
        v-if="!isResolved"
        :disabled="thread.isResolving.value"
        variant="outline"
        @click="handleResolve()"
      >
        {{ $t('support.tickets.thread.resolveButton') }}
      </Button>
    </div>

    <TicketMessageList
      :current-user-id="authStore.user?.id ?? ''"
      :messages="thread.messages.value"
    />

    <div class="admin-ticket-thread-panel__composer-bar">
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
</template>

<style scoped lang="scss">

.admin-ticket-thread-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.admin-ticket-thread-panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: $spacing-16;
  padding-bottom: $spacing-16;
  border-bottom: 1px solid $color-ink-10;
}

.admin-ticket-thread-panel__subject {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.admin-ticket-thread-panel__opened-by {
  margin: $spacing-4 0 $spacing-8;
  font-size: $font-size-xs;
  color: $color-ink-40;
}

.admin-ticket-thread-panel__composer-bar {
  display: flex;
  align-items: flex-end;
  gap: $spacing-8;
  padding: $spacing-8;
  margin-top: $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

.admin-ticket-thread-panel__composer-bar :deep(.ui-textarea-wrapper) {
  flex: 1;
  padding: $spacing-8 $spacing-4;
  background-color: transparent;
  border: none;
}
</style>
