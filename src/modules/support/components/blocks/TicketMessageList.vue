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
import { computed, ref } from 'vue'
import { formatRelativeTime } from '@/shared/services/formatDate'
import Avatar from '@/shared/components/ui/Avatar.vue'
import TicketAttachmentLightbox from './TicketAttachmentLightbox.vue'
import type { TicketMessage } from '../../types/ticketMessage.type'

const props = defineProps<{
  currentUserId: string
  messages: TicketMessage[]
}>()

// Estado de UI puro (qual anexo está expandido agora, se algum) — mora
// aqui em vez de subir pros 2 painéis consumidores (`TicketThreadPanel`/
// `AdminTicketThreadPanel`) porque só existe 1 lightbox por lista de
// mensagens, e é este componente que já renderiza as miniaturas.
const expandedImageUrl = ref<string | null>(null)

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
          <Avatar class="ticket-message-list__avatar" :name="message.user.name" :size="28" />
          <div class="ticket-message-list__content">
            <span class="ticket-message-list__author">{{ message.user.name }}</span>
            <p v-if="message.body" class="ticket-message-list__bubble">{{ message.body }}</p>
            <ul v-if="message.attachments.length > 0" class="ticket-message-list__attachments">
              <li v-for="attachment in message.attachments" :key="attachment.id">
                <button
                  :aria-label="$t('support.tickets.attachments.imageAlt')"
                  class="ticket-message-list__attachment-trigger"
                  type="button"
                  @click="expandedImageUrl = attachment.url"
                >
                  <img
                    :alt="$t('support.tickets.attachments.imageAlt')"
                    class="ticket-message-list__attachment-image"
                    :src="attachment.url"
                  />
                </button>
              </li>
            </ul>
            <span class="ticket-message-list__timestamp">{{
              formatRelativeTime(message.createdAt)
            }}</span>
          </div>
        </li>
      </ul>
    </div>

    <TicketAttachmentLightbox v-model="expandedImageUrl" />
  </div>
</template>

<style scoped lang="scss">

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

// Achado real, reportado pelo usuário com print (avatar "achatado" numa
// mensagem longa) — sem `flex-shrink: 0`, o padrão do flexbox É encolher
// TODO item flex proporcionalmente quando o conteúdo junto não cabe no
// espaço disponível (`max-width: 80%` acima). O texto da bolha
// (`.ticket-message-list__bubble`) tem um "mínimo" real (a palavra mais
// longa sem quebrar), mas o Avatar não tem nenhum conteúdo intrínseco
// grande o bastante pra resistir — ele "perde a disputa" e encolhe até
// quase 0px de largura enquanto mantém a altura (medido em browser real:
// `width: 1.9px, height: 28px`, exatamente a distorção "oval achatada"
// do print). `flex-shrink: 0` trava o Avatar no tamanho fixo que a prop
// `size` já define, deixando só a bolha de texto encolher.
.ticket-message-list__avatar {
  flex-shrink: 0;
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

.ticket-message-list__attachments {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-4;
  max-width: 100%;
}

// Reset de botão nativo — o gatilho precisa parecer só a miniatura
// (mesma técnica de "botão sem cara de botão" já usada em
// `CopyablePrice.vue`), com cursor de clique e o próprio `focus-ring`
// pra navegação por teclado.
.ticket-message-list__attachment-trigger {
  display: block;
  padding: 0;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: $radius-8;

  &:focus-visible {
    @include focus-ring;
  }
}

.ticket-message-list__attachment-image {
  display: block;
  width: $size-64;
  height: $size-64;
  object-fit: cover;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;
}

.ticket-message-list__timestamp {
  font-size: $font-size-xs;
  color: $color-ink-40;
}
</style>
