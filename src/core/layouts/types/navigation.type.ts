import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

/**
 * Item de navegação da sidebar. `children` é opcional — quando presente,
 * o item vira expansível (chevron, sem `to` próprio) em vez de link direto.
 * Espelha o padrão real do Figma ("User Profile" com seta, revelando
 * sub-itens) — usado nesta rodada só como estrutura pronta, o Orbita ainda
 * não tem navegação aninhada de verdade (ver Tier 2 de
 * docs/design/catalogo-componentes.md).
 */
export interface NavItem {
  children?: NavItem[]
  /** Começa expandido no mount (ex.: "User Profile" na captura do Figma) — só faz sentido com `children`. */
  defaultExpanded?: boolean
  icon?: Component
  id: string
  label: string
  to?: RouteLocationRaw
}

/**
 * Grupo de itens com título de seção opcional — espelha "Dashboards"/"Pages"
 * do Sidebar do Figma. Grupo sem `title` renderiza só a lista, sem cabeçalho.
 */
export interface NavGroup {
  items: NavItem[]
  title?: string
}
