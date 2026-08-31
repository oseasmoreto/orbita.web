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
    billingCycleFilter: {
      monthly: 'Mensal',
      yearly: 'Anual',
    },
    checkoutResult: {
      failure: {
        cta: 'Tentar novamente',
        description: 'Não foi possível confirmar seu pagamento. Nenhuma cobrança foi feita.',
        title: 'Pagamento não aprovado',
      },
      pending: {
        checking: 'Verificando confirmação automaticamente...',
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
    mySubscription: {
      cancel: {
        cta: 'Cancelar assinatura',
        description:
          'Sua renovação será cancelada, mas você mantém acesso até o fim do ciclo já pago — sem reembolso.',
        title: 'Cancelar assinatura',
      },
      cancelled: 'Cancelamento agendado — acesso mantido até {date}.',
      cancelSuccess: 'Cancelamento agendado. Seu acesso continua até o fim do ciclo atual.',
      changePlan: {
        cta: 'Trocar de plano',
        currentPlanBadge: 'Plano atual',
        description:
          'A troca abre um novo checkout com o valor proporcional aos dias restantes do ciclo atual.',
        emptyForCycle: 'Nenhum outro plano disponível neste ciclo de cobrança.',
        title: 'Trocar de plano',
      },
      empty: 'Você ainda não tem uma assinatura.',
      error: 'Não foi possível carregar sua assinatura agora.',
      fields: {
        cycle: 'Ciclo de cobrança',
        endDate: 'Válido até',
        plan: 'Plano atual',
        startDate: 'Assinante desde',
        status: 'Status',
      },
      pendingPlanChange: 'Troca para o plano {plan} aguardando confirmação de pagamento.',
      retry: 'Tentar de novo',
      status: {
        active: 'Ativa',
        canceled: 'Cancelada',
        expired: 'Expirada',
        payment_failed: 'Pagamento recusado',
        pending: 'Pendente',
      },
      title: 'Meu plano',
    },
    transactions: {
      columns: {
        createdAt: 'Data',
        gateway: 'Gateway',
        paymentMethod: 'Forma de pagamento',
        status: 'Status',
        value: 'Valor',
      },
      empty: 'Nenhuma transação encontrada.',
      error: 'Não foi possível carregar suas transações agora.',
      status: {
        approved: 'Aprovada',
        authorized: 'Autorizada',
        cancelled: 'Cancelada',
        charged_back: 'Estornada (chargeback)',
        in_mediation: 'Em mediação',
        in_process: 'Em processamento',
        pending: 'Pendente',
        refunded: 'Reembolsada',
        rejected: 'Recusada',
      },
      title: 'Faturas',
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
        tabs: {
          details: 'Dados do produto',
          launches: 'Lançamentos',
        },
        updateSuccess: 'Produto atualizado com sucesso.',
      },
      launches: {
        columns: {
          date: 'Data',
          purchasePrice: 'Preço de compra',
          quantity: 'Quantidade',
        },
        createButton: 'Novo lançamento',
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Excluir lançamento?',
        },
        deleteSuccess: 'Lançamento excluído com sucesso.',
        empty: 'Nenhum lançamento cadastrado ainda.',
        form: {
          createSuccess: 'Lançamento criado com sucesso.',
          createTitle: 'Novo lançamento',
          editTitle: 'Editar lançamento',
          errors: {
            dateRequired: 'Data é obrigatória.',
            purchasePriceMin: 'Preço de compra não pode ser negativo.',
            quantityInteger: 'Quantidade deve ser um número inteiro.',
            quantityMin: 'Quantidade deve ser pelo menos 1.',
          },
          fields: {
            date: 'Data',
            purchasePrice: 'Preço de compra',
            quantity: 'Quantidade',
          },
          submitCreate: 'Criar lançamento',
          submitEdit: 'Salvar alterações',
          updateSuccess: 'Lançamento atualizado com sucesso.',
        },
      },
      marketplacesButton: 'Marketplaces',
      planLimit: {
        reached:
          'Você atingiu o limite de produtos do seu plano. Faça upgrade para cadastrar mais.',
        usage: '{total} de {max} produtos cadastrados',
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
      favorite: 'Favoritar',
      filter: 'Filtrar',
      hidePassword: 'Ocultar senha',
      logout: 'Sair',
      save: 'Salvar',
      showPassword: 'Mostrar senha',
      sort: 'Ordenar',
      unfavorite: 'Remover dos favoritos',
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
   * namespaced).
   *
   * **Regra revista em 2026-08-31** (era "só as que a Fase 2 realmente
   * usa" — seção 6.3 de `docs/infra/convencoes-frontend-infra.md`):
   * achado real ao testar deep link pra um produto inexistente
   * (`/products/:id/edit`) — o toast mostrou a chave crua
   * "errorMessageNotFound" na tela. Conferido: as 9 chaves
   * "genéricas/infra" do backend (`ErrorUnauthorized`/`ErrorForbidden`/
   * `ErrorNotFound`/`ErrorTooManyRequests`/`ErrorCsrfTokenMismatch`/
   * `ErrorServer`/`ErrorInvalidCredentials`/`ErrorAccountNotActive`/
   * `ErrorCannotModifyOwnAccount`) NENHUMA delas tinha sido cadastrada —
   * TODO 401/403/404/429/CSRF/500 do app inteiro, desde sempre, mostrava
   * a chave crua. Diferente de uma `ApiMessageKey` de NEGÓCIO específica
   * (ex.: `ErrorPlanChangeAlreadyPending`, só existe em `PATCH
   * /subscriptions`), essas genéricas podem ser disparadas por QUALQUER
   * endpoint do backend — não faz sentido esperar "uma tela que dispare
   * cada uma" pra cadastrar, cadastradas todas de uma vez agora.
   */
  errorMessageAccountNotActive: 'Sua conta está desativada.',
  errorMessageCannotDisconnectLastAccessMethod:
    'Esse é seu único jeito de acessar a conta — defina uma senha antes de desconectar.',
  errorMessageCannotModifyOwnAccount: 'Você não pode alterar a própria conta por aqui.',
  errorMessageCsrfTokenMismatch: 'Sua sessão expirou. Recarregue a página e tente de novo.',
  errorMessageDocumentRequired: 'Informe um CPF ou CNPJ válido pra continuar.',
  errorMessageEmailNotVerified: 'Confirme seu e-mail antes de assinar um plano.',
  errorMessageForbidden: 'Você não tem permissão para fazer isso.',
  errorMessageIncorrectPassword: 'Senha incorreta.',
  errorMessageInvalidCredentials: 'E-mail ou senha incorretos.',
  /**
   * `ApiMessageKey::ErrorInvalidPricingRuleRange` — achado ao implementar
   * o CRUD de `PricingRule` (Fase 4): backend revalida `range_max >=
   * range_min` na Action com a combinação FINAL mergeada (não só no
   * `CreatePricingRuleRequest`, que só vale quando os dois campos vêm
   * juntos no corpo) — o `.refine()` do schema Zod
   * (`pricingRuleFormSchema.ts`) cobre o caso comum, esta mensagem cobre
   * o resto que só o backend consegue revalidar (ex.: PATCH parcial que
   * o cliente nem tenta simular).
   */
  errorMessageInvalidPricingRuleRange: 'Faixa final deve ser maior ou igual à faixa inicial.',
  /**
   * `ApiMessageKey::ErrorInvalidSsoLoginToken` — token do 2º hop do fluxo
   * SSO (`useSsoExchange.ts`) inexistente, expirado (60s) ou já usado
   * (single-use, proteção contra reload/double-fetch acidental da
   * página `/sso/callback`).
   */
  errorMessageInvalidSsoLoginToken:
    'Esse link de login expirou ou já foi usado. Tente entrar de novo.',
  /**
   * As 6 chaves abaixo (`ErrorMarketplace*`/`ErrorNoPricingRuleAvailable`/
   * `ErrorProductAlreadyLinkedToMarketplace`/`ErrorUserMarketplaceNotActive`)
   * são do Bounded Context Pricing (Fase 4, 2026-08-31) — cadastradas
   * juntas na primeira rodada de implementação (CRUD admin de
   * Marketplace/PricingRule + conectar/gerenciar `USER_MARKETPLACE`),
   * cada uma com um consumidor real desde já (mesmo critério de "cataloga
   * quando o consumidor existe", seção 6.3 de
   * `docs/infra/convencoes-frontend-infra.md`).
   */
  errorMessageMarketplaceAlreadyConnected: 'Você já conectou esse marketplace.',
  errorMessageMarketplaceHasConnections:
    'Esse marketplace tem conexões de usuários — desative em vez de excluir.',
  errorMessageMarketplaceLimitReached:
    'Você atingiu o limite de marketplaces do seu plano. Faça upgrade para conectar mais.',
  errorMessageNoPricingRuleAvailable:
    'Esse marketplace ainda não tem regra de comissão cadastrada.',
  errorMessageNotFound: 'Não encontramos o que você estava procurando.',
  errorMessagePlanChangeAlreadyPending:
    'Você já tem uma troca de plano aguardando confirmação de pagamento.',
  errorMessageProductAlreadyLinkedToMarketplace:
    'Esse produto já está vinculado a esse marketplace.',
  /**
   * `ApiMessageKey::ErrorProductLimitReached` — `CreateProductAction`
   * (backend) já bloqueia a criação quando `PRODUCT.count() >= PLAN.max_products`,
   * achado real ao levantar o item "usePlanLimit" da Fase 3 (a validação
   * já existia no backend, só nunca tinha sido cadastrada aqui — o
   * usuário via a chave crua "errorMessageProductLimitReached" no toast).
   */
  errorMessageProductLimitReached:
    'Você atingiu o limite de produtos do seu plano. Faça upgrade para cadastrar mais.',
  errorMessageSamePlan: 'Você já está nesse plano.',
  errorMessageServer: 'Ocorreu um erro no servidor. Tente novamente em instantes.',
  errorMessageSubscriptionAlreadyActive: 'Você já tem uma assinatura ativa.',
  errorMessageSubscriptionNotActive: 'Sua assinatura não está ativa no momento.',
  errorMessageTooManyRequests: 'Muitas tentativas. Aguarde um momento e tente de novo.',
  errorMessageUnauthorized: 'Sua sessão expirou. Faça login novamente.',
  errorMessageUserMarketplaceNotActive:
    'Essa conexão está pausada — reative antes de vincular um produto.',
  /**
   * `ApiMessageKey::ErrorValidation` (backend) — achado real, 2026-08-31:
   * nunca tinha sido cadastrada aqui, então TODO 422 de validação em
   * qualquer formulário do app mostrava o toast genérico com a chave
   * crua "errorMessageValidation" em vez de um texto de verdade. Mensagem
   * de campo específica (embaixo de cada input) é resolvida à parte, via
   * `errors.validation.*` abaixo — este toast é só o aviso geral de "veja
   * os campos destacados".
   */
  errorMessageValidation: 'Confira os campos destacados abaixo.',
  errors: {
    unknown: 'Ocorreu um erro inesperado. Tente novamente.',
    /**
     * Dicionário de erro de VALIDAÇÃO DE CAMPO (não confundir com
     * `errorMessage*`/`ApiMessageKey`, que é a mensagem GERAL do 422) —
     * resolvido via `useApiMessage().resolveFieldError(field, rule)`.
     * Achado real: o backend manda `errors` chaveado pelo NOME DA REGRA
     * que falhou (`Str::snake(class_basename($rule))`,
     * `../backend/bootstrap/app.php`), nunca uma frase pronta — sem esse
     * dicionário, o usuário via a chave crua embaixo do campo (ex.:
     * "closure_validation_rule" sob um EAN inválido, a captura real que
     * motivou isto). Lista abaixo é EXAUSTIVA contra as regras
     * realmente usadas em `../backend/app/Http/Requests/**\/*.php` hoje —
     * nunca adivinhada, checar lá antes de adicionar uma regra nova.
     */
    validation: {
      /**
       * Regras `Closure` custom (`$fail()`) SEMPRE colapsam pro mesmo
       * nome genérico de classe (`closure_validation_rule`) — só um
       * dicionário POR CAMPO diferencia "EAN inválido" de "NCM inválido"
       * de "CPF/CNPJ inválido". Os 3 casos reais que existem hoje:
       * `CreateProductRequest`/`UpdateProductRequest` (`ean`/`ncm`) e
       * `SubscribeToPlanRequest` (`document`).
       */
      byField: {
        document: {
          closure_validation_rule: 'Informe um CPF ou CNPJ válido.',
        },
        ean: {
          closure_validation_rule:
            'EAN inválido — deve ser um código de barras EAN-8/12/13/14 válido.',
        },
        ncm: {
          closure_validation_rule: 'NCM inválido — deve ter exatamente 8 dígitos.',
        },
      },
      confirmed: 'A confirmação não corresponde.',
      date: 'Informe uma data válida.',
      email: 'Informe um e-mail válido.',
      exists: 'Registro não encontrado.',
      gte: 'Valor deve ser maior ou igual ao mínimo permitido.',
      integer: 'Deve ser um número inteiro.',
      max: 'Valor acima do máximo permitido.',
      min: 'Valor abaixo do mínimo permitido.',
      numeric: 'Deve ser um número.',
      regex: 'Formato inválido.',
      required: 'Campo obrigatório.',
      string: 'Deve ser um texto.',
      unique: 'Já existe um registro com esse valor.',
      uuid: 'Identificador inválido.',
    },
  },
  header: {
    goBack: 'Voltar',
    notifications: 'Notificações',
    toggleSidebar: 'Ocultar/exibir menu',
    toggleTheme: 'Alternar tema',
    unreadNotifications: 'Há notificações não lidas',
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
  pricing: {
    admin: {
      marketplaces: {
        columns: {
          active: 'Status',
          createdAt: 'Cadastrado em',
          name: 'Nome',
        },
        createButton: 'Novo marketplace',
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Excluir marketplace?',
        },
        deleteSuccess: 'Marketplace excluído com sucesso.',
        empty: 'Nenhum marketplace cadastrado ainda.',
        form: {
          createSuccess: 'Marketplace criado com sucesso.',
          createTitle: 'Novo marketplace',
          editTitle: 'Editar marketplace',
          errors: {
            nameRequired: 'Nome é obrigatório.',
            websiteUrlInvalid: 'Informe uma URL válida.',
          },
          fields: {
            active: 'Marketplace ativo',
            chooseLogo: 'Escolher arquivo',
            description: 'Descrição',
            logo: 'Logo',
            name: 'Nome',
            tags: 'Tags',
            websiteUrl: 'Site',
          },
          placeholders: {
            websiteUrl: 'https://exemplo.com',
          },
          submitCreate: 'Criar marketplace',
          submitEdit: 'Salvar alterações',
          tabs: {
            details: 'Dados do marketplace',
            pricingRules: 'Regras de comissão',
          },
          updateSuccess: 'Marketplace atualizado com sucesso.',
        },
        status: {
          active: 'Ativo',
          inactive: 'Inativo',
        },
        title: 'Marketplaces',
      },
      pricingRules: {
        columns: {
          fixedFee: 'Taxa fixa',
          order: 'Ordem',
          percentage: 'Percentual',
          rangeMax: 'Faixa até',
          rangeMin: 'Faixa a partir de',
        },
        createButton: 'Nova regra',
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Excluir regra de comissão?',
        },
        deleteSuccess: 'Regra de comissão excluída com sucesso.',
        empty: 'Nenhuma regra de comissão cadastrada ainda.',
        form: {
          createSuccess: 'Regra de comissão criada com sucesso.',
          createTitle: 'Nova regra de comissão',
          editTitle: 'Editar regra de comissão',
          errors: {
            fixedFeeMin: 'Taxa fixa não pode ser negativa.',
            orderInteger: 'Ordem deve ser um número inteiro.',
            orderMin: 'Ordem não pode ser negativa.',
            percentageMax: 'Percentual não pode passar de 100%.',
            percentageMin: 'Percentual não pode ser negativo.',
            rangeMaxBelowMin: 'Faixa final deve ser maior ou igual à faixa inicial.',
            rangeMaxMin: 'Faixa final não pode ser negativa.',
            rangeMinMin: 'Faixa inicial não pode ser negativa.',
          },
          fields: {
            fixedFee: 'Taxa fixa (R$)',
            order: 'Ordem',
            percentage: 'Percentual (%)',
            rangeMax: 'Faixa até (R$)',
            rangeMin: 'Faixa a partir de (R$)',
          },
          submitCreate: 'Criar regra',
          submitEdit: 'Salvar alterações',
          updateSuccess: 'Regra de comissão atualizada com sucesso.',
        },
      },
    },
    marketplaces: {
      activateSuccess: 'Conexão reativada com sucesso.',
      connectButton: 'Conectar',
      connectModal: {
        connectSuccess: 'Marketplace conectado com sucesso.',
        connectTitle: 'Conectar {name}',
        editTitle: 'Editar conexão — {name}',
        errors: {
          storeNameRequired: 'Nome da loja é obrigatório.',
        },
        fields: {
          storeName: 'Nome da loja',
        },
        submitConnect: 'Conectar',
        submitSave: 'Salvar alterações',
        updateSuccess: 'Conexão atualizada com sucesso.',
      },
      disconnectConfirm: {
        description:
          'Essa ação remove a conexão e também os vínculos de produto já feitos com ela. Não pode ser desfeita.',
        title: 'Desconectar marketplace?',
      },
      disconnectSuccess: 'Marketplace desconectado com sucesso.',
      manageButton: 'Gerenciar',
      pauseSuccess: 'Conexão pausada com sucesso.',
      title: 'Canais de venda',
      usage: '{total} de {max} marketplaces conectados',
    },
    productMarketplaces: {
      backToProducts: 'Voltar para Produtos',
      columns: {
        createdAt: 'Vinculado em',
        marketplace: 'Marketplace',
        storeName: 'Loja',
      },
      empty: 'Nenhum marketplace vinculado ainda.',
      linkButton: 'Vincular marketplace',
      linkModal: {
        fields: {
          connection: 'Conexão',
        },
        placeholder: 'Selecione uma conexão',
        submit: 'Vincular',
        title: 'Vincular marketplace',
      },
      linkSuccess: 'Marketplace vinculado com sucesso.',
      noAvailableConnectionsHint:
        'Nenhuma conexão ativa disponível — conecte um marketplace antes de vincular.',
      title: 'Marketplaces do produto',
      titleWithProduct: 'Marketplaces de {product}',
      unlinkButton: 'Desvincular',
      unlinkConfirm: {
        description: 'Essa ação não pode ser desfeita.',
        title: 'Desvincular marketplace?',
      },
      unlinkSuccess: 'Marketplace desvinculado com sucesso.',
    },
  },
  showcase: {
    title: 'Vitrine de componentes',
  },
  sidebar: {
    favoritesTab: 'Favoritos',
    nav: {
      admin: 'Administração',
      adminAuditLogs: 'Auditoria',
      adminMarketplaces: 'Marketplaces',
      adminNotifications: 'Notificações',
      adminPlans: 'Planos',
      adminSettings: 'Configurações',
      adminSubscriptions: 'Assinaturas',
      adminTransactions: 'Transações',
      adminUsers: 'Usuários',
      catalog: 'Catálogo',
      dashboardDefault: 'Padrão',
      dashboards: 'Dashboards',
      invoices: 'Faturas',
      marketplaces: 'Marketplaces',
      myPlan: 'Meu plano',
      products: 'Produtos',
      salesChannels: 'Canais de venda',
      subscription: 'Assinatura',
    },
    noFavorites: 'Nenhum favorito ainda.',
    noRecent: 'Nenhuma página visitada ainda.',
    recentTab: 'Recentes',
  },
} as const
