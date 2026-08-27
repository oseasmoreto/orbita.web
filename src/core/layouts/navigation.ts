import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { ChartPieSlice } from '@/shared/components/icons/regular.generated'

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

/**
 * Nav real do Orbita — só "Dashboard" por enquanto. Mais grupos/itens
 * entram aqui conforme cada fase de docs/planejamento/plano-implementacao.md
 * ganhar rota real; nunca link morto pra rota que ainda não existe.
 */
export const navGroups: NavGroup[] = [
  {
    items: [{ icon: ChartPieSlice, id: 'dashboard', label: 'Dashboard', to: { name: 'home' } }],
  },
]
