import { i18n } from '@/core/i18n'
import {
  Bell,
  ChartPieSlice,
  Clipboard,
  Gear,
  Lifebuoy,
  Package,
  Receipt,
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

/**
 * **"Operação" — grupo novo, 2026-09-01, pedido direto do usuário**
 * ("ficou um item por grupo... veja uma organização q fique pelo menos
 * 2 itens por grupo, menos a dashboard") — `catalogGroup`/
 * `marketplacesGroup`/`supportGroup` existiam como 3 grupos SEPARADOS,
 * cada um com 1 item só, sem nenhuma restrição de `roles` (visíveis pra
 * `user` E `admin_master`) — union óbvia, mesma visibilidade nos 3.
 * Fundidos aqui num grupo só, sem forçar um Bounded Context 1:1 no
 * título (Catalog/Pricing/Support são 3 contextos técnicos distintos) —
 * "Operação" é a ÁREA que cobre o dia a dia do vendedor fora de
 * cobrança/administração, mesmo critério de nome-por-área já usado nos
 * 3 grupos admin (`adminUsersGroup`/`adminFinanceGroup`/
 * `adminPlatformGroup` abaixo). Nenhum item mudou de `to`/ícone/rota —
 * só reagrupados, mesma técnica da segmentação admin anterior.
 */
export const operationGroup: NavGroup = {
  items: [
    {
      icon: Package,
      id: 'catalog-products',
      label: t('sidebar.nav.products'),
      // `products-new`/`products-edit` são deep link pro MESMO Drawer
      // desta página (`routes.ts`); `product-marketplaces` (Pricing,
      // alcançada só pela ação de linha "Marketplaces" desta listagem,
      // nunca um item de sidebar próprio) é uma rota FILHA de verdade —
      // sem os 3 aqui, o breadcrumb (`useBreadcrumb.ts`) não achava
      // nenhum deles na árvore e caía só no título da própria rota
      // ("Marketplaces do produto" sozinho, sem "Catálogo / Produtos /").
      // Achado real, reportado pelo usuário em 2026-08-31 — mesmo bug já
      // corrigido uma vez pras 2 primeiras, repetido aqui por esquecer de
      // extender a lista pra rota nova de outro módulo. Regra geral pra
      // toda tela nova: `.ai/rules/app-shell.md`.
      relatedRouteNames: ['products-new', 'products-edit', 'product-marketplaces'],
      to: { name: 'products' },
    },
    // Lançamentos (PRODUCT_LAUNCH) não é item de topo — é sempre uma aba
    // dentro do detalhe de UM produto (`products/{id}/launches`, backend
    // já pronto), não uma listagem própria que mereça entrada na sidebar.
    {
      icon: Storefront,
      id: 'marketplaces',
      label: t('sidebar.nav.salesChannels'),
      to: { name: 'marketplaces' },
    },
    {
      icon: Lifebuoy,
      id: 'support-tickets',
      label: t('sidebar.nav.myTickets'),
      to: { name: 'support-tickets' },
    },
  ],
  title: t('sidebar.nav.operation'),
}

/**
 * Billing (Bounded Context) — "Meu plano" (`billing-subscription`, troca
 * de plano + cancelamento) e "Faturas" (`billing-transactions`, histórico
 * de transações) implementados em 2026-08-31, fechando as últimas
 * pendências reais da Fase 2 (`docs/planejamento/plano-implementacao.md`).
 * `/choose-plan` não entra aqui — é rota de onboarding, fora do shell
 * principal, não faz sentido como item de sidebar.
 *
 * **`roles: ['user']`, pedido direto do usuário em 2026-08-31**:
 * `admin_master` não assina plano nenhum (`USER.role` é o único controle
 * de acesso do MVP, sem cobrança pra quem administra a plataforma — o
 * guard de assinatura ativa em `core/router/guards.ts` já pula esse check
 * inteiro pra `admin_master`), então "Meu plano"/"Faturas" não fazem
 * sentido nessa conta — mesma régua de `NavGroup.roles` já usada no grupo
 * `adminGroup` abaixo, só que no sentido inverso (esconde de admin, em
 * vez de mostrar só pra admin).
 */
export const billingGroup: NavGroup = {
  items: [
    {
      icon: Tag,
      id: 'billing-subscription',
      label: t('sidebar.nav.myPlan'),
      to: { name: 'billing-subscription' },
    },
    {
      icon: Receipt,
      id: 'billing-transactions',
      label: t('sidebar.nav.invoices'),
      to: { name: 'billing-transactions' },
    },
  ],
  roles: ['user'],
  title: t('sidebar.nav.subscription'),
}

/**
 * Só `admin_master` (`NavGroup.roles`) — namespace `/v1/admin/*` inteiro
 * já implementado no backend (Identity/Billing/Pricing/Platform).
 *
 * **Segmentado em 3 grupos em 2026-09-01, pedido direto do usuário**
 * ("reordenar o menu, tem muita coisa num grupo chamado administração,
 * da pra segmentar por plataforma, financeiro, usuarios") — antes era 1
 * grupo só ("Administração") com 8 itens sem nenhuma hierarquia visual
 * entre eles, misturando conta/cobrança/config num scroll só. Dividido
 * por área, não por Bounded Context 1:1 (o pedido do usuário foi por
 * ÁREA de produto, não por camada técnica) — `adminFinanceGroup`
 * (Billing), `adminPlatformGroup` (Identity/Pricing admin/Platform).
 *
 * **`adminUsersGroup` desfeito no mesmo dia, rodada seguinte** — nasceu
 * como grupo PRÓPRIO nessa mesma segmentação, mas com 1 item só
 * ("Contas de usuário"); pedido do usuário logo em seguida ("ficou um
 * item por grupo... pelo menos 2 itens por grupo") não deixou nenhum
 * outro grupo `roles: ['admin_master']` sobrando pra parear — movido
 * pra dentro de `adminPlatformGroup`, primeiro item (prioridade visual:
 * gerenciar conta é tipicamente a ação admin mais comum). Contradiz um
 * pouco a frase "não dinheiro nem conta de usuário" do parágrafo acima
 * (motivo original de EXCLUIR conta de usuário daqui) — mantida como
 * registro histórico da decisão original, a exceção agora é só sobre
 * densidade mínima de itens por grupo, não uma reversão da lógica de
 * categorização.
 */
// `admin-subscriptions`/`admin-transactions` ganharam `to` na Fase 7
// (2026-09-01, pedido direto do usuário: "crie uma fase 7 com a parte
// financeira, assinaturas e transações e implemente") — antes ficavam
// sem `to` de propósito (só "ver TODAS as assinaturas/transações de
// todos os usuários", sem CRUD óbvio pra assinatura na época).
export const adminFinanceGroup: NavGroup = {
  items: [
    {
      icon: Tag,
      id: 'admin-plans',
      label: t('sidebar.nav.adminPlans'),
      to: { name: 'admin-plans' },
    },
    {
      icon: Wallet,
      id: 'admin-subscriptions',
      label: t('sidebar.nav.adminSubscriptions'),
      to: { name: 'admin-subscriptions' },
    },
    {
      icon: Receipt,
      id: 'admin-transactions',
      label: t('sidebar.nav.adminTransactions'),
      to: { name: 'admin-transactions' },
    },
  ],
  roles: ['admin_master'],
  title: t('sidebar.nav.adminFinanceGroup'),
}

export const adminPlatformGroup: NavGroup = {
  items: [
    {
      icon: UsersThree,
      id: 'admin-users',
      label: t('sidebar.nav.adminUsers'),
      to: { name: 'admin-users' },
    },
    {
      icon: Storefront,
      id: 'admin-marketplaces',
      label: t('sidebar.nav.adminMarketplaces'),
      to: { name: 'admin-marketplaces' },
    },
    {
      icon: Bell,
      id: 'admin-notifications',
      label: t('sidebar.nav.adminNotifications'),
      to: { name: 'admin-notifications' },
    },
    {
      icon: Gear,
      id: 'admin-settings',
      label: t('sidebar.nav.adminSettings'),
      to: { name: 'admin-settings' },
    },
    {
      icon: Clipboard,
      id: 'admin-audit-logs',
      label: t('sidebar.nav.adminAuditLogs'),
      to: { name: 'admin-audit-logs' },
    },
    {
      icon: Lifebuoy,
      id: 'admin-tickets',
      label: t('sidebar.nav.adminTickets'),
      to: { name: 'admin-tickets' },
    },
  ],
  roles: ['admin_master'],
  title: t('sidebar.nav.adminPlatformGroup'),
}

export const navGroups: NavGroup[] = [
  dashboardGroup,
  operationGroup,
  billingGroup,
  adminFinanceGroup,
  adminPlatformGroup,
]
