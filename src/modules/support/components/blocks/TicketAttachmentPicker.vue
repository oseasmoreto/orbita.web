<script setup lang="ts">
/**
 * Picker de imagens do composer de mensagem de chamado — botão de anexar
 * (input nativo escondido, mesma técnica de `AdminMarketplaceForm.vue`
 * pro logo de marketplace, só que aqui aceita múltiplos arquivos) +
 * tira de miniaturas dos anexos ainda não enviados, cada uma com um "×"
 * pra remover antes de enviar. Puramente de apresentação (seção 3.2 de
 * `docs/infra/convencoes-frontend-infra.md`) — nunca decide se um
 * arquivo é válido nem converte pra base64, isso é
 * `useTicketAttachments.ts`; aqui só emite o `FileList` cru escolhido e
 * o `id` a remover, o composable do consumidor decide o resto.
 *
 * 3º consumidor real (`CreateTicketForm.vue`, `TicketThreadPanel.vue`,
 * `AdminTicketThreadPanel.vue`) — mesmo critério de promoção já usado em
 * `TicketMessageList.vue`, extraído pra não copiar a mesma marcação/CSS
 * 3 vezes.
 */
import { useTemplateRef } from 'vue'
import { Paperclip, X } from '@/shared/components/icons/regular.generated'
import Button from '@/shared/components/ui/Button.vue'
import type { TicketAttachmentDraft } from '../../composables/useTicketAttachments'

const props = defineProps<{
  disabled?: boolean
  drafts: TicketAttachmentDraft[]
}>()

const emit = defineEmits<{
  add: [files: FileList]
  remove: [id: string]
}>()

const fileInput = useTemplateRef('fileInput')

function openFilePicker(): void {
  fileInput.value?.click()
}

function handleFileChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const files = input.files

  if (files && files.length > 0) {
    emit('add', files)
  }

  // Reseta o input — sem isso, escolher o MESMO arquivo duas vezes
  // seguidas (ex.: remover um anexo e re-adicioná-lo) não dispara
  // `change` de novo, o browser considera "o mesmo valor".
  input.value = ''
}
</script>

<template>
  <div class="ticket-attachment-picker">
    <ul v-if="drafts.length > 0" class="ticket-attachment-picker__drafts">
      <li v-for="draft in drafts" :key="draft.id" class="ticket-attachment-picker__draft">
        <img :alt="draft.name" class="ticket-attachment-picker__draft-image" :src="draft.dataUrl" />
        <button
          :aria-label="$t('support.tickets.attachments.removeButton')"
          class="ticket-attachment-picker__draft-remove"
          type="button"
          @click="emit('remove', draft.id)"
        >
          <X :size="10" />
        </button>
      </li>
    </ul>

    <input
      ref="fileInput"
      accept="image/png,image/jpeg,image/webp,image/svg+xml"
      class="ticket-attachment-picker__file-input"
      multiple
      type="file"
      @change="handleFileChange"
    />
    <Button
      :aria-label="$t('support.tickets.attachments.attachButton')"
      :disabled="props.disabled"
      :icon-before="Paperclip"
      type="button"
      variant="ghost"
      @click="openFilePicker"
    />
  </div>
</template>

<style scoped lang="scss">

.ticket-attachment-picker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-8;
}

.ticket-attachment-picker__drafts {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-8;
}

.ticket-attachment-picker__draft {
  position: relative;
  width: $size-40;
  height: $size-40;
}

.ticket-attachment-picker__draft-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;
}

.ticket-attachment-picker__draft-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: $size-16;
  height: $size-16;
  padding: 0;
  color: $color-paper;
  cursor: pointer;
  background-color: $color-ink-80;
  border: none;
  border-radius: $radius-80;

  &:focus-visible {
    @include focus-ring;
  }
}

.ticket-attachment-picker__file-input {
  // "Visually hidden" — não `display:none`, que tiraria do fluxo de
  // tab/foco de teclado (mesma técnica de `AdminMarketplaceForm.vue`).
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip: rect(0, 0, 0, 0);
}
</style>
