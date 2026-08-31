import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { UserRole } from '@/core/store/types/auth.type'

/**
 * Item de navegação da sidebar. `children` é opcional — quando presente,
 * o item vira expansível (chevron, sem `to` próprio) em vez de link direto.
 *
 * `to` ausente é INTENCIONAL pra itens de módulo ainda não implementado
 * no frontend (ex.: Fase 4/5/6 do plano — o backend já tem o endpoint,
 * a tela ainda não existe) — um botão sem `to` e sem `children` não
 * navega a lugar nenhum quando clicado, diferente de um link quebrado
 * apontando pra uma rota inexistente (regra não-negociável do CLAUDE.md
 * raiz). Substituir por `to` real conforme cada fase de
 * docs/planejamento/plano-implementacao.md for entregando a tela.
 */
export interface NavItem {
  children?: NavItem[]
  /** Começa expandido no mount — só faz sentido com `children`. */
  defaultExpanded?: boolean
  icon?: Component
  id: string
  label: string
  /**
   * Nomes de rota que são deep link pro MESMO item (ex.: `/products/new`/
   * `/products/:id/edit`, que abrem o mesmo Drawer da página de
   * "Produtos", `to.name: 'products'`) — achado real, 2026-08-31: sem
   * isso, `useBreadcrumb.ts` não achava o item na árvore pra essas rotas
   * (`route.name` diferente de `to.name`) e o breadcrumb perdia o grupo
   * inteiro, caindo só no título da rota sozinho. Nunca usado pra
   * destacar item ativo na sidebar — isso continua sendo só `to`, via
   * `router-link-exact-active` (`AppSidebarNavItem.vue`).
   */
  relatedRouteNames?: string[]
  to?: RouteLocationRaw
}

/**
 * Grupo de itens com título de seção opcional. `roles` restringe a
 * VISIBILIDADE do grupo inteiro — sem essa chave, todo `role`
 * autenticado vê o grupo (ex.: Catálogo/Marketplaces/Assinatura, comuns
 * a `user` e `admin_master`); com `roles: ['admin_master']`, só
 * admin_master enxerga (ex.: grupo "Administração") — mesma régua de
 * controle de acesso do resto do projeto (só `USER.role`, sem
 * granularidade extra, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 6).
 */
export interface NavGroup {
  items: NavItem[]
  roles?: UserRole[]
  title?: string
}
