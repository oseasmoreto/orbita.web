<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CaretRight } from '@/shared/components/icons/regular.generated'
import Icon from '@/shared/components/ui/Icon.vue'
import { useAppShell } from './composables/useAppShell'
import { matchesRoute } from './composables/useBreadcrumb'
import type { NavItem } from './types/navigation.type'

defineOptions({ name: 'AppSidebarNavItem' })

const props = defineProps<{ item: NavItem }>()

const route = useRoute()
const { expandItem, isItemExpanded, toggleItem } = useAppShell()

const hasChildren = computed(() => Boolean(props.item.children?.length))
const expanded = computed(() => hasChildren.value && isItemExpanded(props.item.id))

/**
 * Nunca a classe automática `router-link-exact-active` do `RouterLink`
 * sozinha — achado real, reportado pelo usuário em 2026-09-08: ela só
 * compara o `to` EXATO do item contra a rota atual, sem NENHUMA
 * consciência de `relatedRouteNames` (rota related SEMPRE deixava a
 * sidebar sem nenhum item destacado, mesmo o breadcrumb mostrando a
 * trilha certa). `matchesRoute` (extraída de `useBreadcrumb.ts`, mesma
 * função que já resolve isso pro breadcrumb) cobre os 2 casos com o
 * mesmo critério — nunca duas fontes de verdade divergentes pra "essa
 * rota pertence a este item".
 */
const isActive = computed(() => Boolean(props.item.to) && matchesRoute(props.item, route.name))

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
      :class="{ 'app-sidebar-nav-item__link--active': isActive }"
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

  // Classe PRÓPRIA (`--active`, controlada por `isActive` no script),
  // não mais a automática `router-link-exact-active` do `RouterLink` —
  // trocada em 2026-09-08 (ver achado real no `<script setup>`: a
  // automática não considera `relatedRouteNames`). Continua com a MESMA
  // régua de fundo que motivou usar exact-active em vez de active no
  // primeiro lugar (achado real, 2026-08-31: o item "Padrão" — Dashboard,
  // `to: { name: 'home' }`, path `/`, ancestral de toda rota do app —
  // ficava marcado ativo em QUALQUER rota com a classe não-exata) —
  // `matchesRoute` só compara IGUALDADE de nome de rota (exato ou via
  // `relatedRouteNames`), nunca prefixo de path, então a mesma pegadinha
  // não se repete aqui.
  &.app-sidebar-nav-item__link--active {
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
