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
    checkoutResult: {
      failure: {
        cta: 'Tentar novamente',
        description: 'Não foi possível confirmar seu pagamento. Nenhuma cobrança foi feita.',
        title: 'Pagamento não aprovado',
      },
      pending: {
        cta: 'Ir para o dashboard',
        description:
          'Recebemos seu pagamento e estamos aguardando a confirmação (comum em Pix/boleto). Sua assinatura ativa assim que for aprovado.',
        title: 'Pagamento em análise',
      },
      success: {
        cta: 'Ir para o dashboard',
        description: 'Sua assinatura foi confirmada. Bem-vindo(a) ao Orbita!',
        title: 'Pagamento aprovado',
      },
    },
    choosePlan: {
      card: {
        cta: 'Começar agora',
        ctaHighlighted: 'Assinar com desconto',
        equivalentNote: '*Valor equivalente para comparação.',
        maxMarketplaces: 'Até {count} marketplaces conectados',
        maxProducts: 'Até {count} produtos cadastrados',
        monthlyDescription: 'Tenha acesso a todos os recursos pagando mensalmente.',
        mostEconomical: 'Mais econômico',
        payUpfront: 'Pagamento anual à vista de {price}.',
        perMonth: '/mês',
        savings: 'Economize {amount}/ano',
        yearlyDescription: 'Mesmo conjunto de recursos do plano mensal, com melhor preço efetivo.',
      },
      empty: 'Nenhum plano disponível no momento.',
      error: 'Não foi possível carregar os planos agora.',
      heading: 'Escolha o melhor plano para a sua operação',
      pageDescription:
        'Todos os planos incluem acesso completo à plataforma. Cobrança recorrente e automática, cancele quando quiser.',
      retry: 'Tentar de novo',
      title: 'Escolha um plano',
      trust: {
        humanSupport: 'Suporte humano',
        recurringBilling: 'Cobrança recorrente e automática',
        secureCheckout: 'Checkout seguro',
      },
    },
    documentPrompt: {
      description: 'Precisamos desse dado pra emitir a cobrança da sua assinatura.',
      errors: {
        invalid: 'Informe um CPF ou CNPJ válido.',
        required: 'CPF ou CNPJ é obrigatório.',
      },
      fields: {
        document: 'CPF ou CNPJ',
      },
      placeholders: {
        document: '000.000.000-00',
      },
      submit: 'Confirmar',
      title: 'Confirme seu CPF ou CNPJ',
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
  /**
   * Registro de `ApiMessageKey` reais do backend (`Domain/Shared/Enums/ApiMessageKey.php`)
   * — chave FLAT (sem ponto), porque é literalmente a string que o
   * backend manda em `message` (`useApiMessage.resolveMessage()` resolve
   * por igualdade exata, `te()`/`t()` do vue-i18n tratam ponto como
   * caminho de objeto aninhado, então essas chaves não podem ser
   * namespaced). Só as que a Fase 2 (assinatura) realmente usa — não
   * adiantar o catálogo inteiro de erros do backend sem uma tela que
   * dispare cada um (seção 6.3 de `docs/infra/convencoes-frontend-infra.md`).
   */
  errorMessageCannotDisconnectLastAccessMethod:
    'Esse é seu único jeito de acessar a conta — defina uma senha antes de desconectar.',
  errorMessageDocumentRequired: 'Informe um CPF ou CNPJ válido pra continuar.',
  errorMessageEmailNotVerified: 'Confirme seu e-mail antes de assinar um plano.',
  errorMessageIncorrectPassword: 'Senha incorreta.',
  errorMessageSubscriptionAlreadyActive: 'Você já tem uma assinatura ativa.',
  errors: {
    unknown: 'Ocorreu um erro inesperado. Tente novamente.',
  },
  identity: {
    account: {
      dangerZone: {
        deleteCta: 'Excluir minha conta',
        description:
          'Essa ação não pode ser desfeita. Seus dados pessoais são anonimizados e o acesso à conta é encerrado imediatamente.',
        title: 'Zona de risco',
      },
      deleteAccount: {
        confirm: 'Excluir conta',
        description:
          'Se sua conta tiver senha, confirme abaixo. Contas conectadas só por SSO não precisam disso.',
        passwordLabel: 'Senha',
        passwordPlaceholder: 'Digite sua senha (se tiver uma)',
        title: 'Excluir conta',
      },
      errors: {
        emailInvalid: 'Informe um e-mail válido.',
        emailRequired: 'E-mail é obrigatório.',
        nameRequired: 'Nome é obrigatório.',
        passwordConfirmationMismatch: 'As senhas não conferem.',
        passwordMin: 'A senha precisa ter pelo menos 8 caracteres.',
      },
      fields: {
        email: 'E-mail',
        name: 'Nome',
        password: 'Nova senha',
        passwordConfirmation: 'Confirmar nova senha',
      },
      placeholders: {
        password: 'Deixe em branco pra manter a atual',
        passwordConfirmation: 'Repita a nova senha',
      },
      profile: {
        save: 'Salvar alterações',
        title: 'Dados da conta',
      },
      sso: {
        disconnect: 'Desconectar',
        disconnectSuccess: 'Provedor desconectado com sucesso.',
        empty: 'Nenhum provedor de login social conectado.',
        google: 'Google',
        microsoft: 'Microsoft',
        title: 'Contas conectadas',
      },
      title: 'Minha conta',
      updateSuccess: 'Dados atualizados com sucesso.',
    },
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
        emailVerificationFailed:
          'Este link de verificação é inválido ou expirou. Faça login novamente para solicitar um novo.',
        passwordRequired: 'Senha é obrigatória.',
        ssoFailed: 'Não foi possível concluir o login com esse provedor. Tente novamente.',
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
    verifyEmail: {
      continueCta: 'Já verifiquei, continuar',
      notReceived: 'Não recebeu o e-mail?',
      resendCta: 'Reenviar',
      resendSuccess: 'E-mail de verificação reenviado.',
      stillNotVerified: 'Seu e-mail ainda não foi verificado.',
      subtitle: 'Enviamos um link de confirmação para {email}. Clique nele para continuar.',
      title: 'Verifique seu e-mail',
    },
  },
  showcase: {
    title: 'Vitrine de componentes',
  },
} as const
