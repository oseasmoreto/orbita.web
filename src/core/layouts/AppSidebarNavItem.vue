<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { CaretRight } from '@/shared/components/icons/regular.generated'
import Icon from '@/shared/components/ui/Icon.vue'
import type { NavItem } from './types/navigation.type'
import { useAppShell } from './useAppShell'

defineOptions({ name: 'AppSidebarNavItem' })

const props = defineProps<{ item: NavItem }>()

const { expandItem, isItemExpanded, toggleItem } = useAppShell()

const hasChildren = computed(() => Boolean(props.item.children?.length))
const expanded = computed(() => hasChildren.value && isItemExpanded(props.item.id))

// `expandItem` (idempotente), não `toggleItem` — um item "por padrão
// expandido" (ex.: "User Profile" na captura) não pode fechar de novo só
// porque o componente remontou (drawer mobile fechando/abrindo).
onMounted(() => {
  if (props.item.defaultExpanded && hasChildren.value) {
    expandItem(props.item.id)
  }
})

function handleClick(): void {
  if (hasChildren.value) {
    toggleItem(props.item.id)
  }
}
</script>

<template>
  <div class="app-sidebar-nav-item">
    <RouterLink
      v-if="item.to && !hasChildren"
      class="app-sidebar-nav-item__link"
      :to="item.to"
    >
      <Icon v-if="item.icon" :icon="item.icon" :size="20" />
      <span>{{ item.label }}</span>
    </RouterLink>

    <button
      v-else
      class="app-sidebar-nav-item__link"
      type="button"
      @click="handleClick"
    >
      <Icon v-if="item.icon" :icon="item.icon" :size="20" />
      <span>{{ item.label }}</span>
      <Icon
        v-if="hasChildren"
        :class="['app-sidebar-nav-item__chevron', { 'app-sidebar-nav-item__chevron--expanded': expanded }]"
        :icon="CaretRight"
        :size="16"
      />
    </button>

    <div v-if="expanded" class="app-sidebar-nav-item__children">
      <AppSidebarNavItem v-for="child in item.children" :key="child.id" :item="child" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.app-sidebar-nav-item__link {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  gap: $spacing-12;
  padding: $spacing-12;
  font-size: $font-size-md;
  color: $color-ink;
  text-align: left;
  text-decoration: none;
  border-radius: $radius-8;

  &:hover {
    background-color: $color-ink-4;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &.router-link-active {
    font-weight: $font-weight-semibold;
    background-color: $color-ink-4;

    // Correção, reportada pelo usuário em 2026-08-28: a versão anterior
    // sangrava até a borda real da sidebar (`left: -$spacing-16`,
    // cancelando o padding do ancestral) — ficava flutuando solta no
    // espaço vazio à esquerda, sem tocar a pill ativa, em vez de parecer
    // um acento grudado nela. Corrigido pra `left: 0`, grudada na borda
    // do próprio item — sempre visualmente conectada à pill, sem
    // depender do padding exato de um ancestral pra calcular offset.
    &::before {
      position: absolute;
      top: $spacing-4;
      bottom: $spacing-4;
      left: 0;
      width: 3px;
      content: '';
      background-color: $color-accent-indigo;
      border-radius: $radius-4;
    }
  }
}

.app-sidebar-nav-item__chevron {
  margin-left: auto;
  transition: transform 0.15s ease;

  // `CaretRight` em repouso (fechado), gira 90° pra apontar pra baixo
  // quando expandido — mesma convenção "seta de disclosure" da captura
  // (não era um `CaretDown` girando 180°, que apontaria pra cima).
  &--expanded {
    transform: rotate(90deg);
  }
}

.app-sidebar-nav-item__children {
  display: flex;
  flex-direction: column;
  padding-left: $spacing-16;
}
</style>
