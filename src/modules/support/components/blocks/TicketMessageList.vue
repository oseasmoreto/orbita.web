<script setup lang="ts">
/**
 * Lista de mensagens de UM chamado — estrutura inspirada no frame
 * "Chats" do Figma "AiDEA – Smart SaaS Dashboard UI Kit"
 * (`node-id=17261-105108`, pedido direto do usuário em 2026-09-01: "vamos
 * repassar o layout antes... esse arquivo é só pra estrutura, DS
 * mantemos o nosso"). Bolha alinhada à direita quando `message.userId`
 * bate com `currentUserId` (mensagem própria), à esquerda quando é de
 * outra pessoa — mesmo padrão do frame de referência, só com os tokens
 * do design system Orbita (`{colors.bg-2}`/`{colors.primary}`, nunca os
 * valores do Figma de origem).
 *
 * **Separador de data ("Hoje"/data), pedido direto do usuário em
 * 2026-09-01** ("cade o pixel perfect?", comparando com a referência que
 * tem um divisor "Today" antes das mensagens do dia) — agrupa por dia
 * (`YYYY-MM-DD` local), rótulo "Hoje"/"Ontem"/`DD de mês` (`dayjs`,
 * mesma locale pt-BR já registrada em `shared/services/formatDate.ts`).
 *
 * Puramente de apresentação (seção 3.2 de
 * `docs/infra/convencoes-frontend-infra.md`) — não decide quem pode
 * responder nem o que "própria mensagem" significa em termos de negócio,
 * só recebe o `currentUserId` já resolvido pelo consumidor.
 */
import dayjs from 'dayjs'
import { computed } from 'vue'
import { formatRelativeTime } from '@/shared/services/formatDate'
import Avatar from '@/shared/components/ui/Avatar.vue'
import type { TicketMessage } from '../../types/ticketMessage.type'

const props = defineProps<{
  currentUserId: string
  messages: TicketMessage[]
}>()

interface MessageGroup {
  dateLabel: string
  messages: TicketMessage[]
}

function dateLabelFor(value: string | null): string {
  if (!value) {
    return ''
  }

  const date = dayjs(value)

  if (date.isSame(dayjs(), 'day')) {
    return 'Hoje'
  }

  if (date.isSame(dayjs().subtract(1, 'day'), 'day')) {
    return 'Ontem'
  }

  return date.format('D [de] MMMM')
}

const groups = computed<MessageGroup[]>(() => {
  const result: MessageGroup[] = []

  for (const message of props.messages) {
    const dateLabel = dateLabelFor(message.createdAt)
    const lastGroup = result.at(-1)

    if (lastGroup && lastGroup.dateLabel === dateLabel) {
      lastGroup.messages.push(message)
    } else {
      result.push({ dateLabel, messages: [message] })
    }
  }

  return result
})
</script>

<template>
  <div class="ticket-message-list">
    <div v-for="group in groups" :key="group.dateLabel" class="ticket-message-list__group">
      <div class="ticket-message-list__date-divider">
        <span>{{ group.dateLabel }}</span>
      </div>
      <ul class="ticket-message-list__items">
        <li
          v-for="message in group.messages"
          :key="message.id"
          class="ticket-message-list__item"
          :class="{ 'ticket-message-list__item--mine': message.userId === currentUserId }"
        >
          <Avatar :name="message.user.name" :size="28" />
          <div class="ticket-message-list__content">
            <span class="ticket-message-list__author">{{ message.user.name }}</span>
            <p class="ticket-message-list__bubble">{{ message.body }}</p>
            <span class="ticket-message-list__timestamp">{{
              formatRelativeTime(message.createdAt)
            }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ticket-message-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-16;
}

.ticket-message-list__date-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-16;
  font-size: $font-size-xs;
  color: $color-ink-40;

  &::before,
  &::after {
    flex: 1;
    height: 1px;
    margin: 0 $spacing-16;
    content: '';
    background-color: $color-ink-10;
  }
}

.ticket-message-list__items {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.ticket-message-list__item {
  display: flex;
  align-items: flex-start;
  gap: $spacing-8;
  max-width: 80%;
}

.ticket-message-list__item--mine {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ticket-message-list__content {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  min-width: 0;
}

.ticket-message-list__item--mine .ticket-message-list__content {
  align-items: flex-end;
}

.ticket-message-list__author {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-ink-40;
}

.ticket-message-list__bubble {
  padding: $spacing-8 $spacing-16;
  font-size: $font-size-md;
  color: $color-ink;
  white-space: pre-wrap;
  background-color: $color-bg-2;
  border-radius: $radius-16;
}

.ticket-message-list__item--mine .ticket-message-list__bubble {
  color: $color-paper;
  background-color: $color-primary;
}

.ticket-message-list__timestamp {
  font-size: $font-size-xs;
  color: $color-ink-40;
}
</style>
