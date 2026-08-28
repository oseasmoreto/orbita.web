<script setup lang="ts">
/**
 * Seção "Favorites/Recently" grounded na captura real do usuário
 * (2026-08-28) — 2 abas simples (texto, sem pill/sublinhado) + lista com
 * marcador de ponto (não ícone) pros favoritos. "Recently" não tem dado
 * nenhum por trás ainda (o Orbita não rastreia histórico de navegação) —
 * em vez de inventar itens falsos, mostra um estado vazio honesto.
 *
 * Usuário logado no topo (`Avatar` + nome), pedido em seguida com nova
 * captura ("ByeWind" no topo do Figma) — dado real de `useAuthStore`
 * (`docs/infra/convencoes-frontend-infra.md` seção 5, único estado
 * genuinamente global de sessão), nunca um nome hardcoded: primeiro
 * consumidor de `useAuthStore` fora de `main.ts`. `Avatar.vue` já
 * resolve sozinho o fallback de iniciais — `USER` não tem campo de foto
 * no modelo de dados (`docs/negocio/contexto-plataforma-precificacao.md`
 * seção 2.1), então não tem `src` nenhum pra passar aqui.
 */
import { ref } from 'vue'
import { useAuthStore } from '@/core/store/useAuthStore'
import Avatar from '@/shared/components/ui/Avatar.vue'
import AppSidebarNavItem from './AppSidebarNavItem.vue'
import { favoriteItems, navGroups } from './config/navigation'

const authStore = useAuthStore()
const activeFavoritesTab = ref<'favorites' | 'recently'>('favorites')
</script>

<template>
  <div class="app-sidebar-content">
    <div class="app-sidebar-content__scroll">
      <div v-if="authStore.user" class="app-sidebar-content__user">
        <Avatar :name="authStore.user.name" :size="32" />
        <span class="app-sidebar-content__user-name">{{ authStore.user.name }}</span>
      </div>

      <div class="app-sidebar-content__favorites">
        <div class="app-sidebar-content__favorites-tabs">
          <button
            :class="[
              'app-sidebar-content__favorites-tab',
              { 'app-sidebar-content__favorites-tab--active': activeFavoritesTab === 'favorites' },
            ]"
            type="button"
            @click="activeFavoritesTab = 'favorites'"
          >
            Favoritos
          </button>
          <button
            :class="[
              'app-sidebar-content__favorites-tab',
              { 'app-sidebar-content__favorites-tab--active': activeFavoritesTab === 'recently' },
            ]"
            type="button"
            @click="activeFavoritesTab = 'recently'"
          >
            Recentes
          </button>
        </div>

        <ul v-if="activeFavoritesTab === 'favorites'" class="app-sidebar-content__favorites-list">
          <li v-for="item in favoriteItems" :key="item.id">
            <RouterLink v-if="item.to" class="app-sidebar-content__favorite-link" :to="item.to">
              <span class="app-sidebar-content__favorite-dot" />
              {{ item.label }}
            </RouterLink>
            <span v-else class="app-sidebar-content__favorite-link app-sidebar-content__favorite-link--inert">
              <span class="app-sidebar-content__favorite-dot" />
              {{ item.label }}
            </span>
          </li>
        </ul>
        <p v-else class="app-sidebar-content__favorites-empty">Nenhum item visitado recentemente ainda.</p>
      </div>

      <nav v-for="(group, index) in navGroups" :key="index" class="app-sidebar-content__group">
        <p v-if="group.title" class="app-sidebar-content__group-title">{{ group.title }}</p>
        <AppSidebarNavItem v-for="item in group.items" :key="item.id" :item="item" />
      </nav>
    </div>

    <div class="app-sidebar-content__footer">
      <span class="app-sidebar-content__brand">Orbita</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

// Container em coluna com altura total travada no pai (que por sua vez
// trava em 100vh — ver AppSidebar.vue) — `__scroll` é o único filho que
// rola (`flex: 1` + `min-height: 0`, obrigatório pra overflow funcionar
// dentro de item flex), `__footer` fica de fora do scroll, sempre
// visível, mesmo com uma lista de navegação grande o suficiente pra
// nunca caber inteira na tela.
.app-sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.app-sidebar-content__scroll {
  flex: 1;
  min-height: 0;
  padding: $spacing-16;
  overflow-y: auto;
}

.app-sidebar-content__footer {
  flex-shrink: 0;
  padding: $spacing-16;
  border-top: 1px solid $color-ink-10;
}

.app-sidebar-content__brand {
  padding: $spacing-8;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.app-sidebar-content__user {
  display: flex;
  align-items: center;
  gap: $spacing-12;
  padding: $spacing-8;
}

.app-sidebar-content__user-name {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.app-sidebar-content__favorites {
  padding: $spacing-8;
  margin-top: $spacing-8;
}

.app-sidebar-content__favorites-tabs {
  display: flex;
  gap: $spacing-16;
  margin-bottom: $spacing-8;
}

.app-sidebar-content__favorites-tab {
  padding: 0;
  font-size: $font-size-sm;
  color: $color-ink-40;
  background: none;
  border: none;

  &:hover {
    color: $color-ink;
  }

  &:focus-visible {
    @include focus-ring;
  }

  &--active {
    font-weight: $font-weight-semibold;
    color: $color-ink;
  }
}

.app-sidebar-content__favorites-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  padding: 0;
  margin: 0;
  list-style: none;
}

.app-sidebar-content__favorite-link {
  display: flex;
  align-items: center;
  gap: $spacing-12;
  padding: $spacing-4 0;
  font-size: $font-size-sm;
  color: $color-ink;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: $color-ink-40;
  }

  &--inert {
    cursor: default;

    &:hover {
      color: $color-ink;
    }
  }
}

.app-sidebar-content__favorite-dot {
  flex-shrink: 0;
  width: $spacing-4;
  height: $spacing-4;
  margin-left: $spacing-4;
  background-color: currentColor;
  border-radius: $radius-80;
}

.app-sidebar-content__favorites-empty {
  margin: 0;
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.app-sidebar-content__group {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  margin-top: $spacing-16;
}

.app-sidebar-content__group-title {
  padding: $spacing-8;
  font-size: $font-size-sm;
  color: $color-ink-40;
}
</style>
