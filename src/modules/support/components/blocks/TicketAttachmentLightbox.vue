<script setup lang="ts">
/**
 * Expande uma imagem anexada de mensagem de chamado em tela cheia —
 * pedido direto do usuário em 2026-09-08, corrigindo a 1ª versão da
 * feature (que abria a imagem em nova aba, decisão registrada como "sem
 * lightbox no design system ainda, sem inventar componente sem pedido").
 * Com o pedido explícito, constrói em cima do MESMO primitivo `Dialog*`
 * da Reka UI que `Modal.vue` já usa (nunca reinventar overlay/foco/Esc —
 * seção 3.1 de `docs/infra/convencoes-frontend-infra.md`), mas com perfil
 * visual próprio: não reaproveita `Modal.vue` porque ele exige `title`
 * visível e trava `max-width: 480px` — errado pra "expandir uma imagem",
 * que precisa ocupar o máximo de tela possível, sem título/rodapé.
 *
 * Model é `string | null` (não um `open` boolean separado) — `null`
 * fechado, a própria URL da imagem quando aberto; só existe 1 imagem
 * aberta por vez, então um único valor nulável já é a fonte de verdade
 * completa, sem 2 refs pra manter sincronizados.
 *
 * `z-index: 100/101`, mesmo valor de `Modal.vue`/`Drawer.vue` — testado
 * com precedente real (`ProductLaunchForm.vue` já abre um `Modal` dentro
 * de um `Drawer` com esses mesmos valores e funciona: portal recém-
 * montado entra depois no DOM, pinta por cima mesmo com z-index igual).
 * `TicketMessageList.vue` é sempre renderizado dentro de um `Drawer`
 * (`TicketsView.vue`/`AdminTicketsView.vue`), então este componente
 * também precisa funcionar aninhado.
 */
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { X } from '@/shared/components/icons/regular.generated'

const { t } = useI18n()

const imageUrl = defineModel<string | null>({ default: null })

const isOpen = computed<boolean>({
  get: () => imageUrl.value !== null,
  set: (value) => {
    if (!value) {
      imageUrl.value = null
    }
  },
})
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogPortal>
      <DialogOverlay class="ticket-attachment-lightbox-overlay" />
      <DialogContent class="ticket-attachment-lightbox-content">
        <!-- Sem título/descrição visíveis de propósito (é uma imagem em
        tela cheia, não um diálogo de formulário) — Reka UI ainda exige
        os dois pra a11y, escondidos via VisuallyHidden, mesma técnica já
        usada em `Modal.vue`/`Drawer.vue` quando `description` falta. -->
        <VisuallyHidden as-child>
          <DialogTitle>{{ t('support.tickets.attachments.imageAlt') }}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden as-child>
          <DialogDescription>{{ t('support.tickets.attachments.imageAlt') }}</DialogDescription>
        </VisuallyHidden>

        <img
          v-if="imageUrl"
          :alt="t('support.tickets.attachments.imageAlt')"
          class="ticket-attachment-lightbox-image"
          :src="imageUrl"
        />

        <DialogClose :aria-label="t('common.actions.close')" class="ticket-attachment-lightbox-close">
          <X :size="20" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped lang="scss">

// `DialogPortal` teletransporta pro fim do <body> — mesmo achado já
// documentado pro Select/Tooltip/Modal, seletores sempre "planos" dentro
// do `:global(...)`.
:global(.ticket-attachment-lightbox-overlay) {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: $color-ink-80;
}

:global(.ticket-attachment-lightbox-content) {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 101;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 90vh;
  transform: translate(-50%, -50%);
}

:global(.ticket-attachment-lightbox-content:focus-visible) {
  outline: none;
}

:global(.ticket-attachment-lightbox-image) {
  display: block;
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: $radius-8;
}

:global(.ticket-attachment-lightbox-close) {
  position: fixed;
  top: $spacing-16;
  right: $spacing-16;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: $size-40;
  height: $size-40;
  color: $color-paper-fixed;
  cursor: pointer;
  background-color: $color-ink-80;
  border: none;
  border-radius: $radius-80;
}

:global(.ticket-attachment-lightbox-close:hover) {
  background-color: $color-ink;
}

:global(.ticket-attachment-lightbox-close:focus-visible) {
  @include focus-ring;
}
</style>
