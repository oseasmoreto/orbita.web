<script setup lang="ts">
/**
 * Painel lateral — mesma mecânica de drawer já usada em
 * `core/layouts/AppSidebar.vue` (`vaul-vue`), aqui exposto como componente
 * genérico reutilizável pra qualquer módulo. Sem frame próprio no Figma
 * pro comportamento desktop (mesmo gap do `Modal.vue`) — os 3 tamanhos
 * (`sm`/`md`/`lg`) são decisão nossa, não medida do Figma.
 *
 * **Responsivo, pedido direto do usuário em 2026-08-27** (com referência
 * visual de outro produto, não do Figma do design system): abaixo do
 * breakpoint md vira bottom sheet (slide de baixo pra cima, `DrawerHandle`
 * pra arrastar/fechar, sempre 100% de largura — os 3 tamanhos só se
 * aplicam no desktop). Acima do breakpoint continua painel lateral
 * direito (`top:0`/`right:0`/`height:100vh`, largura conforme `size`).
 * A troca de `direction` do `vaul-vue` (`bottom` vs `right`) é reativa via
 * `useMediaQuery` — não é só CSS, porque a mecânica de arrasto/animação
 * do vaul depende de qual eixo o `direction` usa.
 */
import { useMediaQuery } from '@vueuse/core'
import { VisuallyHidden } from 'reka-ui'
import { computed } from 'vue'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHandle,
  DrawerOverlay,
  DrawerPortal,
  DrawerRoot,
  DrawerTitle,
} from 'vaul-vue'
import { X } from '@/shared/components/icons/regular.generated'
import Icon from './Icon.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
    size?: 'sm' | 'md' | 'lg'
  }>(),
  {
    description: undefined,
    size: 'md',
  },
)

const open = defineModel<boolean>({ default: false })

// Mesmo breakpoint md (64rem/1024px) já usado pra alternar sidebar/header
// entre mobile e desktop (core/layouts) — abaixo dele o Drawer vira bottom
// sheet.
const isMobile = useMediaQuery('(max-width: 1023px)')
const direction = computed(() => (isMobile.value ? 'bottom' : 'right'))
</script>

<template>
  <DrawerRoot v-model:open="open" :direction="direction">
    <DrawerPortal>
      <DrawerOverlay class="ui-drawer-overlay" />
      <DrawerContent :class="['ui-drawer-content', `ui-drawer-content--${size}`]">
        <!-- Só visível no mobile (bottom sheet) — escondida no desktop via
        CSS, mesmo elemento em ambos os casos pra não duplicar markup. -->
        <DrawerHandle class="ui-drawer-handle" />

        <DrawerTitle class="ui-drawer-title">{{ title }}</DrawerTitle>

        <DrawerDescription v-if="description" class="ui-drawer-description">
          {{ description }}
        </DrawerDescription>
        <!-- Sem `description`, o Reka UI (que o vaul-vue usa por baixo)
        ainda exige uma pra a11y (mesmo achado do Modal.vue e do drawer da
        sidebar) — escondida via VisuallyHidden, nunca display:none. -->
        <VisuallyHidden v-else as-child>
          <DrawerDescription>Painel lateral</DrawerDescription>
        </VisuallyHidden>

        <div v-if="$slots.default" class="ui-drawer-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="ui-drawer-footer">
          <slot name="footer" />
        </div>

        <DrawerClose aria-label="Fechar" class="ui-drawer-close">
          <Icon :icon="X" :size="20" />
        </DrawerClose>
      </DrawerContent>
    </DrawerPortal>
  </DrawerRoot>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

// `DrawerPortal` teletransporta pro fim do <body>, mesmo achado já
// documentado pro Select/Tooltip/Modal/AppSidebar — seletores sempre
// "planos" dentro do `:global(...)`, nunca `&` aninhado.
:global(.ui-drawer-overlay) {
  position: fixed;
  inset: 0;
  z-index: 100;
  background-color: $color-ink-40;
}

// Mobile-first: bottom sheet é o layout padrão (sem media query), o
// painel lateral de desktop entra depois via `min-width` — mesma
// convenção mobile-first já usada no resto do projeto.
:global(.ui-drawer-content) {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 101;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 90vh;
  padding: $spacing-24;
  background-color: $color-bg-1;
  border-radius: $radius-16 $radius-16 0 0;

  @media (min-width: $breakpoint-md) {
    top: 0;
    right: 0;
    bottom: auto;
    left: auto;
    width: auto;
    height: 100vh;
    max-height: none;
    border-radius: 0;
  }
}

:global(.ui-drawer-content:focus-visible) {
  outline: none;
}

// Larguras só valem no desktop (painel lateral) — no mobile (bottom
// sheet) o painel é sempre 100% de largura, os 3 tamanhos não se aplicam.
// Sem grounding no Figma (mesmo caso do max-width do Modal) — decisão
// nossa, revisar se um frame real de painel lateral aparecer.
:global(.ui-drawer-content--sm) {
  @media (min-width: $breakpoint-md) {
    width: 320px;
  }
}

:global(.ui-drawer-content--md) {
  @media (min-width: $breakpoint-md) {
    width: 480px;
  }
}

:global(.ui-drawer-content--lg) {
  @media (min-width: $breakpoint-md) {
    width: 640px;
  }
}

// Alça de arrastar do bottom sheet (mobile) — mesmo padrão visual de
// outros apps com bottom sheet (barra curta arredondada, cor neutra).
// Escondida no desktop, onde o Drawer volta a ser um painel lateral sem
// gesto de arrasto vertical.
:global(.ui-drawer-handle) {
  display: block;
  width: 40px;
  height: 4px;
  margin: 0 auto $spacing-16;
  background-color: $color-ink-20;
  border-radius: $radius-80;

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

:global(.ui-drawer-title) {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  padding-right: $spacing-40;
  color: $color-ink;
}

:global(.ui-drawer-description) {
  margin-top: $spacing-4;
  font-size: $font-size-md;
  color: $color-ink-40;
}

:global(.ui-drawer-body) {
  flex: 1;
  margin-top: $spacing-16;
  overflow-y: auto;
  color: $color-ink;
}

:global(.ui-drawer-footer) {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-8;
  padding-top: $spacing-24;
  margin-top: auto;
}

:global(.ui-drawer-close) {
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

:global(.ui-drawer-close:hover) {
  color: $color-ink;
  background-color: $color-ink-4;
}

:global(.ui-drawer-close:focus-visible) {
  @include focus-ring;
}
</style>
