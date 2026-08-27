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

  return {
    closeMobileNav,
    isItemExpanded,
    isMobileNavOpen,
    openMobileNav,
    toggleItem,
    toggleMobileNav,
  }
}
