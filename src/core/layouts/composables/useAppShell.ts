import { ref } from 'vue'
import type { NavItem } from '../types/navigation.type'

/**
 * Estado do shell autenticado (menu mobile aberto/fechado, itens de nav
 * expandidos) — singleton em nível de módulo, não por chamada: existe UM
 * shell por app, então `AppHeader` (botão hambúrguer) e `AppSidebar`
 * (drawer) precisam enxergar o mesmo estado, nunca uma cópia isolada cada
 * um. Mesmo padrão que o Vue recomenda pra estado compartilhado sem
 * precisar de Pinia (não é estado de domínio, é puramente de UI do shell).
 */
const isMobileNavOpen = ref(false)
const expandedItemIds = ref(new Set<string>())
const isNotificationPanelOpen = ref(false)
const isDesktopSidebarCollapsed = ref(false)

/**
 * "Recentes" da sidebar (`AppSidebarContent.vue`) — pedido direto do
 * usuário, 2026-08-31: rastrear de verdade as páginas que o usuário
 * navegou dentro da SPA, em vez do estado vazio hardcoded que existia
 * antes. Persistido em `localStorage` (não Pinia/backend) — é
 * conveniência de navegação por DISPOSITIVO, não dado de domínio do
 * usuário (diferente de favoritos, que são por CONTA e vêm do backend);
 * sobrevive a um F5 mas não precisa de round-trip nenhum pra isso.
 */
const RECENT_PAGES_STORAGE_KEY = 'orbita-recent-pages'
const MAX_RECENT_PAGES = 5

function loadRecentPages(): NavItem[] {
  try {
    const raw = localStorage.getItem(RECENT_PAGES_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as NavItem[]) : []
  } catch {
    // localStorage indisponível (aba privada, quota) — degrada pra lista
    // vazia, "recentes" é conveniência, nunca motivo de travar o app.
    return []
  }
}

const recentPages = ref<NavItem[]>(loadRecentPages())

export function useAppShell() {
  function openMobileNav(): void {
    isMobileNavOpen.value = true
  }

  function closeMobileNav(): void {
    isMobileNavOpen.value = false
  }

  function toggleMobileNav(): void {
    isMobileNavOpen.value = !isMobileNavOpen.value
  }

  function openNotificationPanel(): void {
    isNotificationPanelOpen.value = true
  }

  function closeNotificationPanel(): void {
    isNotificationPanelOpen.value = false
  }

  function toggleNotificationPanel(): void {
    isNotificationPanelOpen.value = !isNotificationPanelOpen.value
  }

  function isItemExpanded(id: string): boolean {
    return expandedItemIds.value.has(id)
  }

  function toggleItem(id: string): void {
    const next = new Set(expandedItemIds.value)

    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }

    expandedItemIds.value = next
  }

  /**
   * Idempotente, nunca fecha — diferente de `toggleItem`. Usado por
   * `AppSidebarNavItem.vue` pra expandir um item "por padrão"
   * (`NavItem.defaultExpanded`) no mount: como `expandedItemIds` é
   * singleton (sobrevive a remontagem do componente), um `toggleItem` no
   * mount fecharia de novo um item que o usuário já tinha aberto e
   * depois o componente remontou (ex.: abrir/fechar o drawer mobile).
   */
  function expandItem(id: string): void {
    if (expandedItemIds.value.has(id)) {
      return
    }

    expandedItemIds.value = new Set(expandedItemIds.value).add(id)
  }

  /**
   * Ocultar/exibir a coluna estática da sidebar no desktop — botão pedido
   * no `AppHeader` (ícone `SidebarSimple`). Estado independente de
   * `isMobileNavOpen`: no mobile a sidebar já é um drawer fechado por
   * padrão, então "ocultar" não se aplica; o próprio `AppHeader` decide
   * qual dos dois toggles chamar conforme o viewport (`useMediaQuery`).
   */
  function toggleDesktopSidebar(): void {
    isDesktopSidebarCollapsed.value = !isDesktopSidebarCollapsed.value
  }

  /**
   * Chamado do `router.afterEach` (`core/router/guards.ts`) a cada
   * navegação que vale a pena lembrar. Move pro topo em vez de duplicar
   * quando a página já estava na lista (revisitar não deveria empurrar
   * ela pro meio) e trava em `MAX_RECENT_PAGES` — mais que isso vira
   * ruído, não "recente" de verdade.
   */
  function recordVisit(page: NavItem): void {
    const withoutDuplicate = recentPages.value.filter((item) => item.id !== page.id)
    recentPages.value = [page, ...withoutDuplicate].slice(0, MAX_RECENT_PAGES)

    try {
      localStorage.setItem(RECENT_PAGES_STORAGE_KEY, JSON.stringify(recentPages.value))
    } catch {
      // idem loadRecentPages — falha de storage não pode travar a navegação
    }
  }

  return {
    closeMobileNav,
    closeNotificationPanel,
    expandItem,
    isDesktopSidebarCollapsed,
    isItemExpanded,
    isMobileNavOpen,
    isNotificationPanelOpen,
    openMobileNav,
    openNotificationPanel,
    recentPages,
    recordVisit,
    toggleDesktopSidebar,
    toggleItem,
    toggleMobileNav,
    toggleNotificationPanel,
  }
}
