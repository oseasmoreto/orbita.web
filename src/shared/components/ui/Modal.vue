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
  }>(),
  {
    description: undefined,
  },
)

const open = defineModel<boolean>({ default: false })
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="ui-modal-overlay" />
      <DialogContent class="ui-modal-content">
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
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

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

:global(.ui-modal-body) {
  margin-top: $spacing-16;
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
