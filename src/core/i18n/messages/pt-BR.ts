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
  billing: {
    choosePlan: {
      pendingDescription:
        'A escolha de plano ainda está em construção — sua conta já foi criada, mas por enquanto não há nenhum plano pra selecionar aqui.',
      subtitle: 'Sua conta foi criada. Falta só escolher um plano pra continuar.',
      title: 'Escolha um plano',
    },
  },
  catalog: {
    products: {
      columns: {
        createdAt: 'Cadastrado em',
        fullSalePrice: 'Preço de venda',
        name: 'Nome',
        sku: 'SKU',
        targetMargin: 'Margem alvo',
      },
      createButton: 'Novo produto',
      deleteConfirm: {
        description: 'Essa ação não pode ser desfeita.',
        title: 'Excluir produto?',
      },
      deleteSuccess: 'Produto excluído com sucesso.',
      empty: 'Nenhum produto cadastrado ainda.',
      form: {
        createSuccess: 'Produto criado com sucesso.',
        createTitle: 'Novo produto',
        editTitle: 'Editar produto',
        errors: {
          eanRequired: 'EAN é obrigatório.',
          fullSalePriceBelowPurchase: 'Preço de venda deve ser maior ou igual ao preço de compra.',
          fullSalePricePositive: 'Preço de venda deve ser maior que zero.',
          nameRequired: 'Nome é obrigatório.',
          ncmRequired: 'NCM é obrigatório.',
          purchasePricePositive: 'Preço de compra deve ser maior que zero.',
          skuRequired: 'SKU é obrigatório.',
          targetMarginMax: 'Margem não pode passar de 100%.',
          targetMarginMin: 'Margem não pode ser negativa.',
        },
        fields: {
          ean: 'EAN',
          fullSalePrice: 'Preço de venda',
          height: 'Altura (cm)',
          length: 'Comprimento (cm)',
          name: 'Nome',
          ncm: 'NCM',
          purchasePrice: 'Preço de compra',
          sku: 'SKU',
          targetMargin: 'Margem alvo (%)',
          weight: 'Peso (kg)',
          width: 'Largura (cm)',
        },
        submitCreate: 'Criar produto',
        submitEdit: 'Salvar alterações',
        updateSuccess: 'Produto atualizado com sucesso.',
      },
      searchPlaceholder: 'Buscar por SKU',
      title: 'Produtos',
    },
  },
  common: {
    actions: {
      actions: 'Ações',
      add: 'Adicionar',
      back: 'Voltar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      download: 'Baixar',
      edit: 'Editar',
      filter: 'Filtrar',
      hidePassword: 'Ocultar senha',
      logout: 'Sair',
      save: 'Salvar',
      showPassword: 'Mostrar senha',
      sort: 'Ordenar',
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
    search: {
      placeholder: 'Buscar',
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
    title: 'Dashboard',
  },
  errors: {
    unknown: 'Ocorreu um erro inesperado. Tente novamente.',
  },
  identity: {
    forgotPassword: {
      errors: {
        emailInvalid: 'Informe um e-mail válido.',
        emailRequired: 'E-mail é obrigatório.',
      },
      fields: {
        email: 'E-mail',
      },
      placeholders: {
        email: 'seuemail\\@exemplo.com',
      },
      submit: 'Enviar instruções',
      subtitle: 'Sem problemas, vamos te enviar as instruções de recuperação',
      success: 'Se o e-mail existir na nossa base, enviamos um link de recuperação.',
      successTitle: 'Verifique seu e-mail',
      title: 'Esqueceu a senha?',
    },
    login: {
      errors: {
        emailInvalid: 'Informe um e-mail válido.',
        emailRequired: 'E-mail é obrigatório.',
        passwordRequired: 'Senha é obrigatória.',
      },
      fields: {
        email: 'E-mail',
        password: 'Senha',
      },
      forgotPasswordLink: 'Esqueceu a senha?',
      noAccount: 'Não tem uma conta?',
      orContinueWith: 'Ou continue com',
      placeholders: {
        email: 'seuemail\\@exemplo.com',
        password: 'Digite sua senha',
      },
      registerLink: 'Cadastre-se',
      ssoGoogle: 'Entrar com Google',
      ssoMicrosoft: 'Entrar com Microsoft',
      submit: 'Entrar',
      subtitle: 'Entre na sua conta para continuar',
      title: 'Olá, bem-vindo',
    },
    register: {
      errors: {
        emailInvalid: 'Informe um e-mail válido.',
        emailRequired: 'E-mail é obrigatório.',
        nameRequired: 'Nome é obrigatório.',
        passwordConfirmationMismatch: 'As senhas não conferem.',
        passwordConfirmationRequired: 'Confirme a senha.',
        passwordMin: 'A senha precisa ter pelo menos 8 caracteres.',
      },
      fields: {
        email: 'E-mail',
        name: 'Nome',
        password: 'Senha',
        passwordConfirmation: 'Confirmar senha',
      },
      hasAccount: 'Já tem uma conta?',
      loginLink: 'Entrar',
      orContinueWith: 'Ou continue com',
      placeholders: {
        email: 'seuemail\\@exemplo.com',
        name: 'Nome e sobrenome',
        password: 'Crie uma senha',
        passwordConfirmation: 'Repita a senha',
      },
      ssoGoogle: 'Cadastrar com Google',
      ssoMicrosoft: 'Cadastrar com Microsoft',
      submit: 'Criar conta',
      subtitle: 'Comece a precificar seus produtos em cada marketplace',
      success: 'Conta criada com sucesso.',
      title: 'Crie sua conta',
    },
    resetPassword: {
      errors: {
        passwordConfirmationMismatch: 'As senhas não conferem.',
        passwordConfirmationRequired: 'Confirme a senha.',
        passwordMin: 'A senha precisa ter pelo menos 8 caracteres.',
      },
      fields: {
        password: 'Nova senha',
        passwordConfirmation: 'Confirmar nova senha',
      },
      invalidLink: 'Este link de recuperação é inválido ou expirou. Solicite um novo.',
      invalidLinkTitle: 'Link inválido',
      placeholders: {
        password: 'Digite a nova senha',
        passwordConfirmation: 'Repita a nova senha',
      },
      submit: 'Redefinir senha',
      subtitle: 'Defina uma nova senha para {email}',
      success: {
        cta: 'Entrar agora',
        description: 'Sua senha foi atualizada com sucesso, faça login para continuar.',
        title: 'Senha atualizada com sucesso',
      },
      title: 'Redefinir senha',
    },
    ssoCallback: {
      connecting: 'Conectando sua conta...',
      errorDescription: 'Não foi possível concluir o login com esse provedor. Tente novamente.',
      errorTitle: 'Falha ao conectar',
    },
  },
  showcase: {
    title: 'Vitrine de componentes',
  },
} as const
