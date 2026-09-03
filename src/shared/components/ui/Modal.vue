<script setup lang="ts">
/**
 * Sem frame próprio no Figma (confirmado lendo a página inteira de
 * componentes) — construído direto sobre o primitivo `Dialog*` da Reka UI
 * + tokens do design system, mesmo caminho já usado por Select/Tooltip.
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
import { X } from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    /**
     * Variante de "resultado" (ex.: sucesso de reset de senha) — ícone
     * (slot `#icon`)/título/descrição centralizados e botão(ões) do
     * footer esticados pra largura total, em vez do padrão de diálogo
     * (título à esquerda, footer alinhado à direita) usado por
     * `ConfirmDialog`. Sem grounding de frame próprio no Figma pro Modal
     * em si — variante estrutural pra bater com o padrão real visto num
     * modal de sucesso (ícone em círculo tintado acima do título).
     */
    centered?: boolean
  }>(),
  {
    centered: false,
    description: undefined,
  },
)

const open = defineModel<boolean>({ default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="ui-modal-overlay" />
      <DialogContent :class="['ui-modal-content', { 'ui-modal-content--centered': centered }]">
        <div v-if="$slots.icon" class="ui-modal-icon">
          <slot name="icon" />
        </div>

        <DialogTitle class="ui-modal-title">{{ title }}</DialogTitle>

        <DialogDescription v-if="description" class="ui-modal-description">
          {{ description }}
        </DialogDescription>
        <!-- Sem `description`, o Reka UI ainda exige um pra a11y (mesmo
        achado do DrawerTitle/Description do AppSidebar) — escondido
        visualmente via VisuallyHidden, não removido da árvore de a11y. -->
        <VisuallyHidden v-else as-child>
          <DialogDescription>Janela de diálogo</DialogDescription>
        </VisuallyHidden>

        <div v-if="$slots.default" class="ui-modal-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="ui-modal-footer">
          <slot name="footer" />
        </div>

        <DialogClose aria-label="Fechar" class="ui-modal-close">
          <Icon :icon="X" :size="20" />
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped lang="scss">

// `DialogPortal` teletransporta pro fim do <body>, mesma classe de achado
// já documentada pro Select/Tooltip — seletores sempre "planos" dentro do
// `:global(...)`, nunca `&` aninhado (bug real já corrigido no Select).
:global(.ui-modal-overlay) {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: $color-ink-40;
}

:global(.ui-modal-content) {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 101;
  display: flex;
  flex-direction: column;
  width: calc(100vw - #{$spacing-40});
  max-width: 480px;
  max-height: calc(100vh - #{$spacing-40});
  padding: $spacing-24;
  background-color: $color-bg-1;
  border-radius: $radius-16;
  transform: translate(-50%, -50%);
}

:global(.ui-modal-content:focus-visible) {
  outline: none;
}

:global(.ui-modal-icon) {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: $spacing-16;
}

:global(.ui-modal-title) {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

:global(.ui-modal-description) {
  margin-top: $spacing-4;
  font-size: $font-size-md;
  color: $color-ink-40;
}

:global(.ui-modal-content--centered .ui-modal-title),
:global(.ui-modal-content--centered .ui-modal-description) {
  text-align: center;
}

:global(.ui-modal-content--centered .ui-modal-footer) {
  flex-direction: column;
}

:global(.ui-modal-content--centered .ui-modal-footer > *) {
  width: 100%;
}

// `padding: $spacing-4` — mesmo achado real do `Drawer.vue`
// (`.ui-drawer-body`): sem esse respiro, o anel de foco de qualquer
// campo encostado na borda deste container ficava cortado pelo próprio
// `overflow-y: auto`. `margin` negativo compensa o padding novo (mesma
// técnica do Drawer) — conteúdo visível fica onde estava, só a área de
// clipping do `overflow` cresce.
:global(.ui-modal-body) {
  padding: $spacing-4;
  margin: calc(#{$spacing-16} - #{$spacing-4}) calc(-1 * #{$spacing-4}) calc(-1 * #{$spacing-4});
  overflow-y: auto;
  color: $color-ink;
}

:global(.ui-modal-footer) {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-8;
  margin-top: $spacing-24;
}

:global(.ui-modal-close) {
  position: absolute;
  top: $spacing-16;
  right: $spacing-16;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $color-ink-40;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: $radius-8;
}

:global(.ui-modal-close:hover) {
  color: $color-ink;
  background-color: $color-ink-4;
}

:global(.ui-modal-close:focus-visible) {
  @include focus-ring;
}
</style>
