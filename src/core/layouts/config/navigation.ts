import { i18n } from '@/core/i18n'
import {
  Bell,
  ChartPieSlice,
  Clipboard,
  Gear,
  Package,
  Receipt,
  ShoppingBagOpen,
  Storefront,
  Tag,
  UsersThree,
  Wallet,
} from '@/shared/components/icons/regular.generated'
import type { NavGroup } from '../types/navigation.type'

const { t } = i18n.global

/**
 * Estrutura real do Orbita, pedido direto do usuário em 2026-08-31
 * ("organização do menu, hoje tá cheio de dado mockado") — substitui os
 * grupos de exemplo do Figma (eCommerce/Online Courses/Corporate/Blog/
 * Social etc., sem relação nenhuma com o domínio) pelos Bounded Contexts
 * reais (`CLAUDE.md` raiz): Catálogo, Marketplaces (Pricing), Assinatura
 * (Billing), e um grupo só pra `admin_master` (Administração).
 *
 * A maioria dos itens abaixo ainda não tem `to` — o BACKEND já tem os
 * endpoints prontos (conferido em `../backend/routes/api/v1/*.php`:
 * Marketplace/UserMarketplace/PricingRule, Notification, AuditLog,
 * Settings, e o namespace `/admin/*` inteiro já existem), mas a TELA
 * ainda não foi construída no frontend (Fases 4/5/6 do plano). Isso é
 * "planejar a rota" no sentido pedido — a estrutura/agrupamento já
 * reflete o app final, só falta trocar `to: undefined` por `to: {name:
 * '...'}` conforme cada fase entrega a view real. Nunca inventar uma
 * rota que não existe (`to` apontando pra um `name` sem `component`) —
 * isso sim seria link quebrado.
 *
 * `label`/`title` resolvidos via `i18n.global.t()` no MÓDULO (não
 * `useI18n()`, que exige contexto de componente) — mesmo padrão já usado
 * em `core/router/guards.ts` pro `document.title`. Só funciona porque o
 * produto é pt-BR only no MVP (`docs/infra/convencoes-frontend-infra.md`
 * seção 6.3) — resolvido uma vez no load do módulo, sem reatividade de
 * locale (não existe seletor de idioma pra trocar em runtime).
 */
/**
 * Achado real, reportado pelo usuário em 2026-08-31: a rewrite anterior
 * (mesma data) esqueceu o grupo de Dashboard — a rota `home` continuava
 * acessível pelo logo/breadcrumb, mas sem entrada própria na sidebar.
 * Por hora só o dashboard padrão (`home`, a única view que existe) —
 * "Dashboards" no plural porque o nome do grupo já antecipa que outros
 * dashboards nomeados podem entrar aqui no futuro (mesmo padrão dos
 * outros grupos: título de bounded context/área, item(ns) específico(s)
 * dentro), sem forçar isso agora.
 */
export const dashboardGroup: NavGroup = {
  items: [
    {
      icon: ChartPieSlice,
      id: 'dashboard-default',
      label: t('sidebar.nav.dashboardDefault'),
      to: { name: 'home' },
    },
  ],
  title: t('sidebar.nav.dashboards'),
}

export const catalogGroup: NavGroup = {
  items: [
    {
      icon: Package,
      id: 'catalog-products',
      label: t('sidebar.nav.products'),
      to: { name: 'products' },
    },
    // Lançamentos (PRODUCT_LAUNCH) não é item de topo — é sempre uma aba
    // dentro do detalhe de UM produto (`products/{id}/launches`, backend
    // já pronto), não uma listagem própria que mereça entrada na sidebar.
  ],
  title: t('sidebar.nav.catalog'),
}

/**
 * Pricing (Bounded Context) — backend 100% pronto (`pricing.php`:
 * `GET /marketplaces`, `GET/POST/PATCH/DELETE /user-marketplaces`,
 * `GET /marketplaces/{id}/pricing-rules`), telas da Fase 4 ainda não
 * construídas no frontend.
 */
export const marketplacesGroup: NavGroup = {
  items: [
    {
      icon: Storefront,
      id: 'marketplaces-available',
      label: t('sidebar.nav.marketplacesAvailable'),
    },
    {
      icon: ShoppingBagOpen,
      id: 'marketplaces-connected',
      label: t('sidebar.nav.marketplacesConnected'),
    },
  ],
  title: t('sidebar.nav.marketplaces'),
}

/**
 * Billing (Bounded Context) — endpoints de assinatura já existem
 * (`GET /subscriptions`, `GET /transactions`), telas de gestão (troca de
 * plano, cancelamento, histórico) são pendência real da Fase 2
 * (`docs/planejamento/plano-implementacao.md`). `/choose-plan` (Fase 2,
 * já implementada) não entra aqui — é rota de onboarding, fora do shell
 * principal, não faz sentido como item de sidebar.
 */
export const billingGroup: NavGroup = {
  items: [
    { icon: Tag, id: 'billing-subscription', label: t('sidebar.nav.myPlan') },
    { icon: Receipt, id: 'billing-transactions', label: t('sidebar.nav.invoices') },
  ],
  title: t('sidebar.nav.subscription'),
}

/**
 * Só `admin_master` (`NavGroup.roles`) — namespace `/v1/admin/*` inteiro
 * já implementado no backend (Identity/Billing/Pricing/Platform), Fase 6
 * (`docs/planejamento/plano-implementacao.md`) ainda não construída no
 * frontend. Notificações do admin (`AdminNotificationController`) é
 * gerenciamento/broadcast — diferente do sino do `AppHeader`, que é
 * sempre a caixa de entrada do PRÓPRIO usuário, comum a todo mundo.
 */
export const adminGroup: NavGroup = {
  items: [
    { icon: UsersThree, id: 'admin-users', label: t('sidebar.nav.adminUsers') },
    { icon: Tag, id: 'admin-plans', label: t('sidebar.nav.adminPlans') },
    { icon: Storefront, id: 'admin-marketplaces', label: t('sidebar.nav.adminMarketplaces') },
    { icon: Wallet, id: 'admin-subscriptions', label: t('sidebar.nav.adminSubscriptions') },
    { icon: Receipt, id: 'admin-transactions', label: t('sidebar.nav.adminTransactions') },
    { icon: Bell, id: 'admin-notifications', label: t('sidebar.nav.adminNotifications') },
    { icon: Gear, id: 'admin-settings', label: t('sidebar.nav.adminSettings') },
    { icon: Clipboard, id: 'admin-audit-logs', label: t('sidebar.nav.adminAuditLogs') },
  ],
  roles: ['admin_master'],
  title: t('sidebar.nav.admin'),
}

export const navGroups: NavGroup[] = [
  dashboardGroup,
  catalogGroup,
  marketplacesGroup,
  billingGroup,
  adminGroup,
]
