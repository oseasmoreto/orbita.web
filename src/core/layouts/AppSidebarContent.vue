<script setup lang="ts">
/**
 * Seção "Favorites/Recently" grounded na captura real do usuário
 * (2026-08-28) — 2 abas simples (texto, sem pill/sublinhado) + lista com
 * marcador de ponto (não ícone) pros favoritos.
 *
 * **Favoritos e Recentes com dado real, 2026-08-31** (pedido direto do
 * usuário — "hoje tá cheio de dado mockado"):
 * - Recentes vem de `useAppShell().recentPages` — rastreado de verdade a
 *   cada navegação (`core/router/guards.ts`, `router.afterEach`),
 *   persistido em `localStorage` (conveniência por dispositivo, não dado
 *   de conta).
 * - Favoritos vem de `authStore.user.favorites` — dado de CONTA. **Endpoint
 *   implementado pela sessão `backend-c5` em 2026-08-31** (`POST /favorites`,
 *   `DELETE /favorites/{id}`, lista incluída em `/auth/me`/`/auth/login`).
 *   Adicionar acontece pelo botão de estrela do `AppHeader.vue` (favorita a
 *   PÁGINA ATUAL); remover também pode ser feito aqui direto na lista, via
 *   `useFavorites().removeFavorite()` — conveniente pra desfavoritar uma
 *   página em que não se está navegando no momento.
 *
 * Usuário logado no topo (`Avatar` + nome) — dado real de `useAuthStore`
 * (`docs/infra/convencoes-frontend-infra.md` seção 5, único estado
 * genuinamente global de sessão). `Avatar.vue` já resolve sozinho o
 * fallback de iniciais — `USER` não tem campo de foto no modelo de dados
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 2.1), então
 * não tem `src` nenhum pra passar aqui.
 *
 * Botão de logout — `POST /auth/logout`. Colocado aqui, ao lado do
 * usuário logado, por ser o lugar mais natural: mesma linha de quem está
 * logado, sempre visível (não depende de abrir nenhum menu). `useLogout()`
 * vem de `modules/identity/composables` — ver justificativa de fronteira
 * no próprio arquivo.
 *
 * `navGroups` filtrado por `authStore.user.role` (`visibleNavGroups`) —
 * grupo "Administração" (`roles: ['admin_master']`) só aparece pra quem
 * tem esse role, mesma régua de controle de acesso do resto do projeto
 * (só `USER.role`, sem granularidade extra).
 */
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SignOut, X } from '@/shared/components/icons/regular.generated'
import { useAuthStore } from '@/core/store/useAuthStore'
import Avatar from '@/shared/components/ui/Avatar.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import { useLogout } from '@/modules/identity/composables/useLogout'
import { useAppShell } from './composables/useAppShell'
import { useFavorites } from './composables/useFavorites'
import AppSidebarNavItem from './AppSidebarNavItem.vue'
import { navGroups } from './config/navigation'

const authStore = useAuthStore()
const router = useRouter()
const { isLoggingOut, logout } = useLogout()
const { recentPages } = useAppShell()
const { removeFavorite } = useFavorites()
const activeFavoritesTab = ref<'favorites' | 'recently'>('favorites')

/**
 * Defesa contra um favorito já persistido pra uma rota com segmento
 * dinâmico (`products-edit`, `product-marketplaces`) — `UserFavoriteResource`
 * só guarda `route_name`, sem `params` (achado real, mesma causa do bug
 * já corrigido em `recordVisit()`/"Recentes", `core/router/guards.ts`).
 * `AppHeader.vue` já impede CRIAR um favorito assim
 * (`isCurrentRouteFavoritable`); isto cobre um registro que já existisse
 * de antes dessa correção — sem esse filtro, o `RouterLink` quebraria com
 * "Missing required param" ao tentar resolver a rota sem o `id` que ela
 * exige.
 */
function routeRequiresParams(routeName: string): boolean {
  const record = router.getRoutes().find((route) => route.name === routeName)
  return Boolean(record?.path.includes(':'))
}

const safeFavorites = computed(
  () => authStore.user?.favorites.filter((item) => !routeRequiresParams(item.routeName)) ?? [],
)

const visibleNavGroups = computed(() =>
  navGroups.filter(
    (group) => !group.roles || (authStore.user && group.roles.includes(authStore.user.role)),
  ),
)
</script>

<template>
  <div class="app-sidebar-content">
    <div class="app-sidebar-content__scroll">
      <div v-if="authStore.user" class="app-sidebar-content__user">
        <RouterLink class="app-sidebar-content__user-info" :to="{ name: 'account' }">
          <Avatar :name="authStore.user.name" :size="32" />
          <span class="app-sidebar-content__user-name">{{ authStore.user.name }}</span>
        </RouterLink>
        <Button
          :aria-label="$t('common.actions.logout')"
          :disabled="isLoggingOut"
          :icon-before="SignOut"
          variant="ghost"
          @click="logout"
        />
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
            {{ $t('sidebar.favoritesTab') }}
          </button>
          <button
            :class="[
              'app-sidebar-content__favorites-tab',
              { 'app-sidebar-content__favorites-tab--active': activeFavoritesTab === 'recently' },
            ]"
            type="button"
            @click="activeFavoritesTab = 'recently'"
          >
            {{ $t('sidebar.recentTab') }}
          </button>
        </div>

        <template v-if="activeFavoritesTab === 'favorites'">
          <ul v-if="safeFavorites.length > 0" class="app-sidebar-content__favorites-list">
            <li
              v-for="item in safeFavorites"
              :key="item.id"
              class="app-sidebar-content__favorite-item"
            >
              <RouterLink class="app-sidebar-content__favorite-link" :to="{ name: item.routeName }">
                <span class="app-sidebar-content__favorite-dot" />
                {{ item.label }}
              </RouterLink>
              <button
                :aria-label="$t('common.actions.unfavorite')"
                class="app-sidebar-content__favorite-remove"
                type="button"
                @click="removeFavorite(item.routeName)"
              >
                <Icon :icon="X" :size="14" />
              </button>
            </li>
          </ul>
          <p v-else class="app-sidebar-content__favorites-empty">{{ $t('sidebar.noFavorites') }}</p>
        </template>

        <template v-else>
          <ul v-if="recentPages.length > 0" class="app-sidebar-content__favorites-list">
            <li v-for="item in recentPages" :key="item.id">
              <RouterLink v-if="item.to" class="app-sidebar-content__favorite-link" :to="item.to">
                <span class="app-sidebar-content__favorite-dot" />
                {{ item.label }}
              </RouterLink>
            </li>
          </ul>
          <p v-else class="app-sidebar-content__favorites-empty">{{ $t('sidebar.noRecent') }}</p>
        </template>
      </div>

      <nav v-for="(group, index) in visibleNavGroups" :key="index" class="app-sidebar-content__group">
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
  justify-content: space-between;
  gap: $spacing-8;
  padding: $spacing-8;
}

.app-sidebar-content__user-info {
  display: flex;
  flex: 1;
  align-items: center;
  gap: $spacing-12;
  min-width: 0;
  color: inherit;
  text-decoration: none;
  border-radius: $radius-8;

  &:hover {
    background-color: $color-ink-4;
  }

  &:focus-visible {
    @include focus-ring;
  }
}

.app-sidebar-content__user-name {
  overflow: hidden;
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.app-sidebar-content__favorite-item {
  display: flex;
  align-items: center;
  gap: $spacing-4;
}

.app-sidebar-content__favorite-link {
  display: flex;
  flex: 1;
  align-items: center;
  min-width: 0;
  gap: $spacing-12;
  padding: $spacing-4 0;
  font-size: $font-size-sm;
  color: $color-ink;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: $color-ink-40;
  }
}

// Só aparece no hover da linha (mesmo affordance de "revela ação
// secundária ao passar o mouse" já comum em listas do design system) —
// sempre acessível via foco de teclado independente do hover.
.app-sidebar-content__favorite-item:has(.app-sidebar-content__favorite-remove:focus-visible),
.app-sidebar-content__favorite-item:hover {
  .app-sidebar-content__favorite-remove {
    opacity: 1;
  }
}

.app-sidebar-content__favorite-remove {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $spacing-4;
  color: $color-ink-40;
  background: none;
  border: none;
  border-radius: $radius-8;
  opacity: 0;
  transition: opacity 0.1s ease;

  &:hover {
    color: $color-ink;
    background-color: $color-ink-4;
  }

  &:focus-visible {
    @include focus-ring;
    opacity: 1;
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
