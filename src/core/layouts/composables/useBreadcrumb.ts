import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { BreadcrumbItem } from '@/shared/components/ui/types/breadcrumb.type'
import { navGroups } from '../config/navigation'
import type { NavGroup, NavItem } from '../types/navigation.type'

interface ActiveTrail {
  group: NavGroup
  item: NavItem
}

function routeNameOf(item: NavItem): unknown {
  return item.to && typeof item.to === 'object' && 'name' in item.to ? item.to.name : undefined
}

function findFirstTo(items: NavItem[]): NavItem['to'] {
  for (const item of items) {
    if (item.to) {
      return item.to
    }
    if (item.children) {
      const childTo = findFirstTo(item.children)
      if (childTo) {
        return childTo
      }
    }
  }
  return undefined
}

function findActiveTrail(groups: NavGroup[], routeName: unknown): ActiveTrail | undefined {
  for (const group of groups) {
    for (const item of group.items) {
      if (routeNameOf(item) === routeName) {
        return { group, item }
      }
      const child = item.children?.find((candidate) => routeNameOf(candidate) === routeName)
      if (child) {
        return { group, item: child }
      }
    }
  }
  return undefined
}

/**
 * Lógica pura, sem `useRoute()` — testável isoladamente sem precisar de
 * um router de verdade (nenhum outro teste do projeto monta um
 * `createRouter`/`createMemoryHistory` ainda). A rota ativa é achada por
 * `to.name` dentro de `navGroups` (mesma árvore que já alimenta a
 * sidebar — não é uma trilha digitada à mão nem um `meta` novo
 * duplicando essa informação): o breadcrumb é [grupo, item]. O grupo vira
 * link (aponta pro primeiro item navegável dele, já que grupos não têm
 * rota própria) — é isso que `Breadcrumb.vue` usa pra decidir "ancestral
 * apagado" (com `to`) vs. "página atual" (sem `to`, sempre o último).
 *
 * Rota sem correspondência em `navGroups` (ainda vai acontecer bastante,
 * a árvore de exemplo cobre só "Default" com rota real) cai pro
 * `fallbackTitle` sozinho, mesmo texto que o header mostrava antes desta
 * mudança — nunca quebra por falta de entrada na árvore.
 */
export function resolveBreadcrumbItems(
  groups: NavGroup[],
  routeName: unknown,
  fallbackTitle: string,
): BreadcrumbItem[] {
  const trail = findActiveTrail(groups, routeName)

  if (!trail) {
    return [{ label: fallbackTitle }]
  }

  const breadcrumb: BreadcrumbItem[] = []

  if (trail.group.title) {
    breadcrumb.push({ label: trail.group.title, to: findFirstTo(trail.group.items) })
  }

  breadcrumb.push({ label: trail.item.label })

  return breadcrumb
}

/** Breadcrumb do `AppHeader` (pedido direto do usuário, 2026-08-28, captura "Dashboards / Default"). */
export function useBreadcrumb() {
  const route = useRoute()

  const items = computed<BreadcrumbItem[]>(() =>
    resolveBreadcrumbItems(navGroups, route.name, route.meta.title ?? 'Orbita'),
  )

  return { items }
}
