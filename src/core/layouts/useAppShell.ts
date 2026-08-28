import { ref } from 'vue'

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
const hasUnreadNotifications = ref(false)
const isDesktopSidebarCollapsed = ref(false)

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

  /**
   * O `AppHeader` (core) só exibe o indicador — quem decide se há
   * notificação não lida é o módulo Platform (`NotificationPanel`), que
   * conhece os dados de verdade. Nunca mutar `hasUnreadNotifications`
   * direto de fora, sempre por aqui (mesmo padrão das outras flags).
   */
  function setHasUnreadNotifications(value: boolean): void {
    hasUnreadNotifications.value = value
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

  return {
    closeMobileNav,
    closeNotificationPanel,
    expandItem,
    hasUnreadNotifications,
    isDesktopSidebarCollapsed,
    isItemExpanded,
    isMobileNavOpen,
    isNotificationPanelOpen,
    openMobileNav,
    openNotificationPanel,
    setHasUnreadNotifications,
    toggleDesktopSidebar,
    toggleItem,
    toggleMobileNav,
    toggleNotificationPanel,
  }
}
