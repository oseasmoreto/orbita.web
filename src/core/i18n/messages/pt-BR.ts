/**
 * Catálogo pt-BR. Única locale no MVP. Duas responsabilidades, no mesmo
 * arquivo por serem a mesma peça de infra (`vue-i18n`), mas com papéis
 * diferentes:
 * 1. `errors`/`notifications` (se/quando existir): resolve
 *    ApiMessageKey/NotificationMessageKey → texto (seção 6.3 de
 *    `docs/infra/convencoes-frontend-infra.md`) — chave sem entrada aqui é
 *    tratada como texto livre pelo `useApiMessage`
 *    (`shared/composables/useApiMessage.ts`), nunca falha por chave ausente.
 * 2. Todo o resto (`common`, `dashboard`, e cada namespace novo por página/
 *    módulo): todo texto estático de UI — heading, label, título de coluna,
 *    texto de botão/ação — regra não-negociável desde 2026-08-28 (`CLAUDE.md`
 *    raiz deste repo, seção "Regras não-negociáveis"): nenhum texto solto
 *    direto num `.vue`, sempre uma chave aqui resolvida via
 *    `$t()`/`useI18n().t()`. Dado de domínio (nome de produto, preço, data,
 *    "+12%") não conta como texto de UI — não precisa de chave, só copy de
 *    fato.
 *
 * `common` — pedido direto do usuário, 2026-08-28: texto que não é
 * específico de um módulo/contexto (ação de linha genérica tipo
 * editar/excluir, nome de marketplace) mora aqui, não duplicado dentro de
 * cada namespace de página. `dashboard` já consome `common.actions`/
 * `common.marketplaces` em vez de repetir as mesmas strings — qualquer
 * módulo/CRUD novo faz o mesmo antes de criar uma chave de página pro
 * mesmo texto.
 */
export default {
  common: {
    actions: {
      actions: 'Ações',
      delete: 'Excluir',
      download: 'Baixar',
      edit: 'Editar',
      view: 'Visualizar',
    },
    marketplaces: {
      amazon: 'Amazon',
      magalu: 'Magalu',
      mercadoLivre: 'Mercado Livre',
      other: 'Outros',
      shopee: 'Shopee',
      tiktok: 'TikTok',
    },
  },
  dashboard: {
    charts: {
      lastMonth: 'Mês passado',
      margin: 'Margem',
      marketplaceShare: 'Participação por marketplace',
      products: 'Produtos',
      productsByMarketplace: 'Produtos por marketplace',
      suggestedPrice: 'Preço sugerido',
      thisMonth: 'Este mês',
    },
    eyebrow: 'Precificação',
    planUsage: {
      marketplaces: 'Marketplaces',
      products: 'Produtos',
      title: 'Uso do plano',
    },
    recentProducts: {
      columns: {
        createdAt: 'Cadastrado em',
        margin: 'Margem',
        marketplace: 'Marketplace',
        price: 'Preço',
        product: 'Produto',
      },
      outsideMargin: 'Fora da margem',
      title: 'Produtos recentes',
      withinMargin: 'Dentro da margem',
    },
    stats: {
      activeLinks: 'Vínculos ativos',
      marketplacesConnected: 'Marketplaces conectados',
      outOfMargin: 'Fora da margem',
      productsRegistered: 'Produtos cadastrados',
    },
  },
  errors: {
    unknown: 'Ocorreu um erro inesperado. Tente novamente.',
  },
} as const
