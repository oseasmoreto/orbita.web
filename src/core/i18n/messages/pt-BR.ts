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
    admin: {
      plans: {
        columns: {
          active: 'Ativo',
          billingCycle: 'Ciclo',
          createdAt: 'Criado em',
          limits: 'Limites',
          name: 'Nome',
          price: 'Preço',
        },
        createButton: 'Novo plano',
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Excluir plano?',
        },
        deleteSuccess: 'Plano excluído com sucesso.',
        empty: 'Nenhum plano cadastrado ainda.',
        filters: {
          billingCycle: 'Ciclo',
        },
        form: {
          createSuccess: 'Plano criado com sucesso.',
          createTitle: 'Novo plano',
          editTitle: 'Editar plano',
          errors: {
            maxMarketplacesPositive: 'Limite de marketplaces deve ser maior que zero.',
            maxProductsPositive: 'Limite de produtos deve ser maior que zero.',
            nameRequired: 'Nome é obrigatório.',
            pricePositive: 'Preço não pode ser negativo.',
            trialCycleMismatch: 'Ciclo "Trial" exige marcar o plano como trial (e vice-versa).',
            trialDaysRequired: 'Informe a duração do trial em dias.',
          },
          fields: {
            active: 'Ativo',
            billingCycle: 'Ciclo de cobrança',
            billingCycleTrial: 'Trial',
            maxMarketplaces: 'Limite de marketplaces',
            maxProducts: 'Limite de produtos',
            name: 'Nome',
            price: 'Preço',
            trialDays: 'Dias de trial',
          },
          updateSuccess: 'Plano atualizado com sucesso.',
        },
        limitsFormat: '{products} produtos · {marketplaces} marketplaces',
        title: 'Planos',
      },
      subscriptions: {
        columns: {
          cancelAtPeriodEnd: 'Cancelamento agendado',
          createdAt: 'Criado em',
          endDate: 'Válido até',
          plan: 'Plano',
          startDate: 'Assinante desde',
          status: 'Status',
          user: 'Usuário',
        },
        editButton: 'Editar',
        editModal: {
          fields: {
            endDate: 'Válido até',
            status: 'Status',
          },
          title: 'Editar assinatura',
        },
        empty: 'Nenhuma assinatura encontrada.',
        error: 'Não foi possível carregar as assinaturas agora.',
        filters: {
          plan: 'Plano',
          status: 'Status',
          user: 'Usuário',
        },
        title: 'Assinaturas',
        updateSuccess: 'Assinatura atualizada com sucesso.',
      },
      transactions: {
        columns: {
          createdAt: 'Data',
          gateway: 'Gateway',
          paymentMethod: 'Forma de pagamento',
          status: 'Status',
          user: 'Usuário',
          value: 'Valor',
        },
        empty: 'Nenhuma transação encontrada.',
        error: 'Não foi possível carregar as transações agora.',
        filters: {
          status: 'Status',
          user: 'Usuário',
        },
        title: 'Transações',
      },
    },
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
        ctaTrial: 'Testar grátis',
        equivalentNote: '*Valor equivalente para comparação.',
        maxMarketplaces: 'Até {count} marketplaces conectados',
        maxProducts: 'Até {count} produtos cadastrados',
        monthlyDescription: 'Tenha acesso a todos os recursos pagando mensalmente.',
        mostEconomical: 'Mais econômico',
        payUpfront: 'Pagamento anual à vista de {price}.',
        perMonth: '/mês',
        savings: 'Economize {amount}/ano',
        trialDescription: 'Acesso completo por {days} dias, sem cobrança no cartão.',
        trialSuffix: 'por {days} dias',
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
        costPrice: 'Preço de custo',
        createdAt: 'Cadastrado em',
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
        costPriceTooltip:
          'Custo de aquisição ou fabricação do produto, sem contar despesas operacionais (frete, embalagem, etiqueta, mão de obra).',
        createSuccess: 'Produto criado com sucesso.',
        createTitle: 'Novo produto',
        dimensionsTitle: 'Dimensões da embalagem',
        dimensionsTooltip: 'Usado pelo sistema para calcular a tabela de frete.',
        editTitle: 'Editar produto',
        errors: {
          costPricePositive: 'Preço de custo deve ser maior que zero.',
          nameRequired: 'Nome é obrigatório.',
          operationalCostMin: 'Custo operacional não pode ser negativo.',
          skuRequired: 'SKU é obrigatório.',
          targetMarginMax: 'Margem não pode passar de 100%.',
          targetMarginMin: 'Margem não pode ser negativa.',
        },
        fields: {
          costPrice: 'Preço de custo',
          ean: 'EAN',
          height: 'Altura (cm)',
          length: 'Comprimento (cm)',
          name: 'Nome',
          ncm: 'NCM',
          operationalCost: 'Custo operacional',
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
      pricingShortcut: 'Ver precificação',
      pricingShortcutUnavailable: 'Conecte um marketplace antes de ver a precificação.',
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
      send: 'Enviar',
      showPassword: 'Mostrar senha',
      sort: 'Ordenar',
      unfavorite: 'Remover dos favoritos',
      view: 'Visualizar',
    },
    filters: {
      all: 'Todos',
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
    status: {
      active: 'Ativo',
      inactive: 'Inativo',
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
  /**
   * `ApiMessageKey::ErrorCampaignPriceUnreachable` (2026-09-03, mesma
   * rodada do campo `suggested_campaign_price`/`practiced_campaign_price`
   * — `ProductMarketplacePricingView.vue`) — `campaign_discount_percentage`
   * (`USER_MARKETPLACE`) em 100% ou mais torna `precoAtivo ÷ (1 − desconto%)`
   * indefinido/negativo, sem preço de anúncio possível. Só alcançável
   * hoje via `ConnectMarketplaceModal.vue` (campo editável na conexão).
   */
  errorMessageCampaignPriceUnreachable:
    'Um desconto de campanha de 100% ou mais torna o preço de anúncio impossível de calcular. Reduza o desconto de campanha dessa conexão.',
  errorMessageCannotDisconnectLastAccessMethod:
    'Esse é seu único jeito de acessar a conta — defina uma senha antes de desconectar.',
  errorMessageCannotModifyOwnAccount: 'Você não pode alterar a própria conta por aqui.',
  /**
   * `ApiMessageKey::ErrorCompanyAlreadyExists`/`ErrorCompanyRequired`
   * (tarefa 63, `COMPANY` novo) — a 1ª cobre uma 2ª tentativa de `POST
   * /company` (singleton, `user_id` unique); a 2ª é a defesa residual de
   * `useSubscribeToPlan.ts` (`isCompanyRequiredError`) pro caso raro de
   * chegar em `/choose-plan` sem empresa cadastrada, já que o guard de
   * rota deveria ter barrado isso antes.
   */
  errorMessageCompanyAlreadyExists: 'Você já tem uma empresa cadastrada.',
  errorMessageCompanyRequired: 'Cadastre sua empresa antes de assinar um plano.',
  errorMessageCsrfTokenMismatch: 'Sua sessão expirou. Recarregue a página e tente de novo.',
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
  errorMessageMarketplaceComingSoon: 'Esse marketplace ainda não está disponível pra conectar.',
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
  /**
   * `ApiMessageKey::ErrorResponsibleDocumentRequired` (tarefa 63) —
   * caminho residual da regra cruzada já validada no cliente
   * (`companyFormSchema.ts`, `.superRefine()`): CNPJ sem CPF de
   * responsável. Só aparece de verdade se o checksum do CPF for inválido
   * (a contagem de dígitos já é barrada antes de chegar aqui).
   */
  errorMessageResponsibleDocumentRequired:
    'Informe o CPF do responsável — obrigatório para empresas com CNPJ.',
  errorMessageSamePlan: 'Você já está nesse plano.',
  errorMessageServer: 'Ocorreu um erro no servidor. Tente novamente em instantes.',
  errorMessageStoreDocumentTypeRequired:
    'Esse marketplace exige informar se a loja é pessoa física ou jurídica.',
  errorMessageSubscriptionAlreadyActive: 'Você já tem uma assinatura ativa.',
  errorMessageSubscriptionNotActive: 'Sua assinatura não está ativa no momento.',
  errorMessageTargetMarginUnreachable:
    'A margem alvo desse produto é impossível de atingir com as taxas desse marketplace. Ajuste a margem alvo ou o custo do produto.',
  errorMessageTicketNotResolved: 'Só é possível disputar um chamado que já foi resolvido.',
  errorMessageTooManyRequests: 'Muitas tentativas. Aguarde um momento e tente de novo.',
  errorMessageTrialNotEligible: 'O plano de teste grátis é só para quem ainda não assinou antes.',
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
    help: 'Ajuda',
    notifications: 'Notificações',
    toggleSidebar: 'Ocultar/exibir menu',
    toggleTheme: 'Alternar tema',
    unreadNotifications: 'Há notificações não lidas',
  },
  help: {
    groups: {
      empresa: 'Empresa',
      marketplace: 'Marketplace',
      precificacao: 'Precificação',
      produto: 'Produto',
      vinculo: 'Vínculo',
    },
    loadError: 'Não foi possível carregar o guia de ajuda agora.',
    loading: 'Carregando guia de ajuda...',
    next: 'Próximo',
    previous: 'Anterior',
    retry: 'Tentar de novo',
    stepImageAlt: 'Captura de tela ilustrando o passo "{title}"',
    stepProgress: 'Passo {current} de {total}',
    stepsNavLabel: 'Passos do guia',
    title: 'Central de Ajuda',
  },
  identity: {
    account: {
      company: {
        title: 'Empresa',
      },
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
      installApp: {
        cta: 'Instalar aplicativo',
        description:
          'Instale o Orbita no seu computador ou smartphone para acessar mais rápido, direto da tela inicial.',
        installedDescription: 'O Orbita já está instalado neste dispositivo.',
        title: 'Instalar aplicativo',
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
    admin: {
      impersonation: {
        bannerText: 'Você está logado como {name} (impersonando).',
        stopCta: 'Voltar a ser admin',
      },
      users: {
        columns: {
          createdAt: 'Criado em',
          email: 'E-mail',
          name: 'Nome',
          role: 'Perfil',
          status: 'Status',
        },
        createButton: 'Novo usuário',
        editModal: {
          fields: {
            role: 'Perfil',
            status: 'Status',
          },
          success: 'Usuário atualizado com sucesso.',
          title: 'Editar usuário',
        },
        empty: 'Nenhum usuário encontrado.',
        filters: {
          role: 'Perfil',
          status: 'Status',
        },
        form: {
          createSuccess: 'Usuário criado com sucesso.',
          createTitle: 'Novo usuário',
          errors: {
            emailInvalid: 'Informe um e-mail válido.',
            emailRequired: 'E-mail é obrigatório.',
            nameRequired: 'Nome é obrigatório.',
            passwordConfirmationMismatch: 'As senhas não coincidem.',
            passwordConfirmationRequired: 'Confirme a senha.',
            passwordMin: 'A senha precisa ter pelo menos 8 caracteres.',
          },
          fields: {
            email: 'E-mail',
            name: 'Nome',
            password: 'Senha',
            passwordConfirmation: 'Confirmar senha',
            role: 'Perfil',
          },
        },
        impersonateButton: 'Impersonar',
        roles: {
          admin_master: 'Administrador',
          user: 'Usuário',
        },
        statuses: {
          active: 'Ativo',
          deleted: 'Excluído',
          suspended: 'Suspenso',
        },
        title: 'Usuários',
      },
    },
    companyRegistration: {
      createSuccess: 'Empresa cadastrada com sucesso.',
      description:
        'Precisamos desses dados pra emitir a cobrança da sua assinatura — leva menos de um minuto.',
      errors: {
        documentInvalid: 'Informe um CPF ou CNPJ válido.',
        documentRequired: 'CPF ou CNPJ é obrigatório.',
        nameRequired: 'Nome é obrigatório.',
        responsibleDocumentRequired: 'Informe o CPF do responsável — obrigatório para CNPJ.',
        salesTaxPercentageMin: 'Imposto sobre venda não pode ser negativo.',
      },
      fields: {
        document: 'CPF ou CNPJ',
        name: 'Nome da empresa',
        responsibleDocument: 'CPF do responsável',
        salesTaxPercentage: 'Imposto sobre venda (%)',
      },
      heading: 'Cadastre sua empresa',
      loadError: 'Não foi possível carregar os dados da empresa agora.',
      placeholders: {
        document: '000.000.000-00',
        responsibleDocument: '000.000.000-00',
      },
      responsibleDocumentTooltip:
        'Empresas com CNPJ precisam do CPF de uma pessoa responsável — se seu documento já é um CPF, esse campo não aparece.',
      retry: 'Tentar de novo',
      submitCreate: 'Continuar',
      submitUpdate: 'Salvar alterações',
      title: 'Cadastro de empresa',
      updateSuccess: 'Empresa atualizada com sucesso.',
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
  /**
   * `NotificationMessageKey` real do backend (`Domain/Platform/Enums/NotificationMessageKey.php`)
   * — mesma disciplina do `ApiMessageKey` acima: `NOTIFICATION.title`/
   * `.message` aceitam essas chaves OU texto livre (quando o admin manda
   * seu próprio texto no broadcast/envio direto), resolvidas via
   * `useApiMessage().resolveMessage()` (`NotificationItem.vue`), nunca um
   * `switch` manual.
   */
  notificationMessageAdminAnnouncement: 'Um administrador enviou um aviso.',
  notificationMessageImpersonationStarted: 'Um administrador começou a acessar sua conta.',
  notificationMessageSubscriptionActivated: 'Sua assinatura foi ativada com sucesso.',
  notificationMessageTicketOpened: 'Um usuário abriu um novo chamado de suporte.',
  notificationTitleAdminAnnouncement: 'Aviso do administrador',
  notificationTitleImpersonationStarted: 'Acesso administrativo iniciado',
  notificationTitleSubscriptionActivated: 'Assinatura ativada',
  notificationTitleTicketOpened: 'Novo chamado de suporte',
  platform: {
    admin: {
      auditLogs: {
        columns: {
          action: 'Ação',
          createdAt: 'Data',
          description: 'Descrição',
          impersonatedBy: 'Via impersonation',
          ipAddress: 'IP',
          module: 'Módulo',
          userId: 'Usuário',
        },
        empty: 'Nenhum registro de auditoria encontrado.',
        error: 'Não foi possível carregar o log de auditoria agora.',
        filters: {
          action: 'Ação',
          actionPlaceholder: 'ex: subscription.activated',
          impersonatedBy: 'Via impersonation',
          module: 'Módulo',
          modulePlaceholder: 'ex: billing',
          user: 'Usuário',
        },
        title: 'Auditoria',
      },
      notifications: {
        broadcastButton: 'Transmitir notificação',
        broadcastModal: {
          description:
            'Envia pra TODOS os usuários da plataforma. Deixe os campos em branco pra usar o texto padrão de aviso do administrador.',
          fields: {
            message: 'Mensagem',
            title: 'Título',
          },
          placeholders: {
            message: 'Mensagem opcional...',
            title: 'Título opcional...',
          },
          submit: 'Transmitir',
          success: 'Notificação enviada para todos os usuários.',
          title: 'Transmitir notificação',
        },
        columns: {
          createdAt: 'Criado em',
          status: 'Status',
          title: 'Título',
          type: 'Tipo',
        },
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Excluir notificação?',
        },
        deleteSuccess: 'Notificação excluída.',
        empty: 'Nenhuma notificação enviada ainda.',
        error: 'Não foi possível carregar as notificações agora.',
        filters: {
          status: 'Status',
          type: 'Tipo',
        },
        sendToUserButton: 'Notificar usuário',
        sendToUserModal: {
          fields: {
            message: 'Mensagem',
            title: 'Título',
            user: 'Usuário',
          },
          placeholders: {
            user: 'Selecione um usuário',
          },
          submit: 'Enviar',
          success: 'Notificação enviada.',
          title: 'Notificar usuário',
        },
        status: {
          cancelled: 'Cancelado',
          pending: 'Pendente',
          sending: 'Enviando',
          sent: 'Enviado',
        },
        title: 'Notificações',
        types: {
          admin_announcement: 'Aviso do admin',
          impersonation_started: 'Impersonation iniciada',
          subscription_activated: 'Assinatura ativada',
          ticket_opened: 'Chamado aberto',
        },
      },
      settings: {
        columns: {
          createdAt: 'Criado em',
          hash: 'Identificador',
          name: 'Nome',
          type: 'Tipo',
          value: 'Valor',
        },
        createButton: 'Nova configuração',
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Excluir configuração?',
        },
        deleteSuccess: 'Configuração excluída com sucesso.',
        empty: 'Nenhuma configuração cadastrada ainda.',
        filters: {
          type: 'Tipo',
        },
        form: {
          createSuccess: 'Configuração criada com sucesso.',
          createTitle: 'Nova configuração',
          editTitle: 'Editar configuração',
          errors: {
            hashFormat:
              'Use só letras minúsculas, números, ponto e underscore (ex: billing.trial_days).',
            hashRequired: 'Identificador é obrigatório.',
            nameRequired: 'Nome é obrigatório.',
            valueRequired: 'Valor é obrigatório.',
          },
          fields: {
            hash: 'Identificador',
            name: 'Nome',
            type: 'Tipo',
            value: 'Valor',
          },
          placeholders: {
            hash: 'ex: billing.trial_days',
          },
          updateSuccess: 'Configuração atualizada com sucesso.',
        },
        title: 'Configurações',
        types: {
          bool: 'Booleano',
          enum: 'Enum',
          float: 'Decimal',
          int: 'Inteiro',
          json: 'JSON',
          string: 'Texto curto',
          text: 'Texto longo',
        },
      },
    },
    notifications: {
      empty: 'Nenhuma notificação por enquanto.',
      error: 'Não foi possível carregar suas notificações agora.',
      title: 'Notificações',
      unread: 'Não lida',
    },
  },
  pricing: {
    admin: {
      categoryMarketplaces: {
        columns: {
          category: 'Categoria',
          commissionPercentage: 'Comissão',
        },
        createButton: 'Vincular categoria',
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Desvincular categoria?',
        },
        deleteSuccess: 'Categoria desvinculada com sucesso.',
        empty: 'Nenhuma categoria vinculada a este marketplace ainda.',
        form: {
          createSuccess: 'Categoria vinculada com sucesso.',
          createTitle: 'Vincular categoria',
          editTitle: 'Editar comissão da categoria',
          errors: {
            categoryRequired: 'Selecione uma categoria.',
            commissionPercentageMax: 'Comissão não pode passar de 100%.',
            commissionPercentageMin: 'Comissão não pode ser negativa.',
          },
          fields: {
            category: 'Categoria',
            commissionPercentage: 'Comissão (%)',
          },
          placeholders: {
            category: 'Selecione uma categoria',
          },
          submitCreate: 'Vincular',
          submitEdit: 'Salvar alterações',
          updateSuccess: 'Comissão atualizada com sucesso.',
        },
        noAvailableCategoriesHint:
          'Nenhuma categoria ativa disponível — cadastre uma categoria antes de vincular, ou todas já estão vinculadas a este marketplace.',
      },
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
        filters: {
          active: 'Status',
        },
        form: {
          createSuccess: 'Marketplace criado com sucesso.',
          createTitle: 'Novo marketplace',
          editTitle: 'Editar marketplace',
          errors: {
            individualFixedFeeMin: 'Taxa fixa para PF não pode ser negativa.',
            nameRequired: 'Nome é obrigatório.',
            websiteUrlInvalid: 'Informe uma URL válida.',
          },
          fields: {
            active: 'Marketplace ativo',
            chooseLogo: 'Escolher arquivo',
            comingSoon: 'Em breve (bloqueia conexão de novos usuários)',
            description: 'Descrição',
            individualFixedFee: 'Taxa fixa para PF (R$)',
            logo: 'Logo',
            name: 'Nome',
            requiresStoreDocumentType: 'Exige informar PF/PJ ao conectar',
            tags: 'Tags',
            websiteUrl: 'Site',
          },
          placeholders: {
            websiteUrl: 'https://exemplo.com',
          },
          submitCreate: 'Criar marketplace',
          submitEdit: 'Salvar alterações',
          tabs: {
            categories: 'Categorias',
            details: 'Dados do marketplace',
            pricingRules: 'Regras de comissão',
          },
          tooltips: {
            individualFixedFee:
              'Taxa fixa cobrada de lojas pessoa física neste marketplace. Só armazenado nesta rodada, ainda sem uso no cálculo de precificação.',
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
      productCategories: {
        columns: {
          active: 'Status',
          createdAt: 'Cadastrado em',
          title: 'Nome',
        },
        createButton: 'Nova categoria',
        deleteConfirm: {
          description: 'Essa ação não pode ser desfeita.',
          title: 'Excluir categoria?',
        },
        deleteSuccess: 'Categoria excluída com sucesso.',
        empty: 'Nenhuma categoria cadastrada ainda.',
        filters: {
          active: 'Status',
          marketplace: 'Marketplace',
        },
        form: {
          createSuccess: 'Categoria criada com sucesso.',
          createTitle: 'Nova categoria',
          editTitle: 'Editar categoria',
          errors: {
            titleRequired: 'Nome é obrigatório.',
          },
          fields: {
            active: 'Categoria ativa',
            title: 'Nome',
          },
          submitCreate: 'Criar categoria',
          submitEdit: 'Salvar alterações',
          updateSuccess: 'Categoria atualizada com sucesso.',
        },
        status: {
          active: 'Ativa',
          inactive: 'Inativa',
        },
        title: 'Categorias de produto',
      },
    },
    marketplaces: {
      activateSuccess: 'Conexão reativada com sucesso.',
      comingSoonBadge: 'Em breve',
      connectButton: 'Conectar',
      connectModal: {
        connectSuccess: 'Marketplace conectado com sucesso.',
        connectTitle: 'Conectar {name}',
        editTitle: 'Editar conexão — {name}',
        errors: {
          couponValueMin: 'Valor do cupom não pode ser negativo.',
          percentageMax: 'Percentual não pode passar de 100%.',
          percentageMin: 'Percentual não pode ser negativo.',
          storeDocumentTypeRequired: 'Informe se a loja é pessoa física ou jurídica.',
          storeNameRequired: 'Nome da loja é obrigatório.',
        },
        fields: {
          adsPercentage: '% investido em ads',
          affiliatePercentage: '% pago a afiliados',
          campaignDiscountPercentage: '% de desconto em campanhas',
          couponValue: 'Valor do cupom (R$)',
          storeDocumentType: 'Tipo de documento da loja',
          storeName: 'Nome da loja',
        },
        storeDocumentTypeOptions: {
          company: 'Pessoa jurídica (PJ)',
          individual: 'Pessoa física (PF)',
        },
        storeDocumentTypePlaceholder: 'Selecione PF ou PJ',
        submitConnect: 'Conectar',
        submitSave: 'Salvar alterações',
        tooltips: {
          adsPercentage: 'Percentual investido em ads/publicidade paga neste canal.',
          affiliatePercentage: 'Percentual pago a afiliados nas vendas feitas neste canal.',
          campaignDiscountPercentage:
            'Percentual de desconto que você aplica em campanhas promocionais neste canal.',
          couponValue:
            'Valor fixo em R$ de cupom/subsídio aplicado nesse canal — entra no cálculo de precificação, deduzido do lucro.',
        },
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
      pricingButton: 'Ver precificação',
      title: 'Canais de venda',
      usage: '{total} de {max} marketplaces conectados',
    },
    productMarketplacePricing: {
      backToConnections: 'Voltar para Marketplaces',
      campaignPriceLabel: 'Preço a anunciar',
      campaignPriceTooltip:
        'Preço que compensa o desconto de campanha configurado nesta conexão.\n\nNão é o preço já com desconto aplicado — é o valor MAIOR que você precisa colocar no anúncio pra, depois do desconto, ainda receber o preço sugerido/praticado de verdade.',
      copyPriceTooltip: 'Clique para copiar',
      editConnectionButton: 'Editar vínculo do marketplace',
      editModal: {
        errors: {
          priceMin: 'Preço não pode ser negativo.',
        },
        fields: {
          practicedPrice: 'Preço praticado (R$)',
        },
        placeholder: 'Deixe em branco pra limpar',
        success: 'Preço praticado atualizado com sucesso.',
        title: 'Editar preço praticado',
      },
      editPriceButton: 'Editar preço praticado',
      empty: 'Nenhum produto vinculado a este marketplace ainda.',
      isApproximatedTooltip:
        'Nenhuma faixa de comissão bateu exata pra esse valor — o cálculo usa a faixa mais próxima como aproximação.',
      kpis: {
        averageMargin: 'Margem média',
        productCount: 'Produtos',
        totalProfit: 'Lucro total',
        totalRevenue: 'Faturamento total',
      },
      noActiveConnectionsHint:
        'Nenhuma conexão ativa disponível — conecte um marketplace antes de ver a precificação.',
      practicedBadge: 'Praticado',
      priceCopied: 'Preço copiado para a área de transferência.',
      priceCopyFailed: 'Não foi possível copiar o preço.',
      searchPlaceholder: 'Buscar produto por nome...',
      segments: {
        ads: 'Ads',
        affiliate: 'Afiliado',
        commission: 'Comissão',
        costPrice: 'Custo',
        coupon: 'Cupom',
        fixedFee: 'Fixo',
        individualFixedFee: 'Taxa PF',
        operationalCost: 'Operacional',
        profit: 'Lucro',
        tax: 'Imposto',
      },
      suggestedBadge: 'Sugerido',
      suggestedPriceLabel: 'Sugerido',
      table: {
        columns: {
          practicedPrice: 'Preço praticado',
          product: 'Produto',
          suggestedPrice: 'Preço sugerido',
        },
      },
      title: 'Precificação',
      viewModes: {
        bar: 'Ver em barras',
        table: 'Ver em tabela',
      },
      viewToggleLabel: 'Alternar visualização',
    },
    productMarketplaces: {
      backToProducts: 'Voltar para Produtos',
      columns: {
        category: 'Categoria',
        createdAt: 'Vinculado em',
        marketplace: 'Marketplace',
        practicedPrice: 'Preço praticado',
        storeName: 'Loja',
      },
      empty: 'Nenhum marketplace vinculado ainda.',
      linkButton: 'Vincular marketplace',
      linkModal: {
        categoryPlaceholder: 'Selecione uma categoria (opcional)',
        fields: {
          category: 'Categoria',
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
  pricingDashboardMockup: {
    copyPriceButton: 'Copiar preço sugerido',
    editConnectionButton: 'Editar vínculo do marketplace',
    kpis: {
      averageMargin: 'Margem média',
      productCount: 'Produtos',
      totalProfit: 'Lucro total',
      totalRevenue: 'Faturamento total',
    },
    notice:
      'Mockup visual, sem dado real — a dashboard de precificação de verdade ainda não foi implementada (Fase 4).',
    priceCopied: 'Preço copiado para a área de transferência.',
    priceCopyFailed: 'Não foi possível copiar o preço.',
    searchPlaceholder: 'Buscar produto por nome...',
    segments: {
      ads: 'Ads',
      campaignDiscount: 'Comissão campanha',
      commission: 'Comissão',
      costPrice: 'Valor pago',
      fixedFee: 'Fixo',
      operational: 'Operacional',
      profit: 'Lucro',
      tax: 'Imposto',
    },
    table: {
      columns: {
        product: 'Produto',
        suggestedPrice: 'Preço sugerido',
      },
      empty: 'Nenhum produto encontrado.',
    },
    title: 'Precificação',
    viewModes: {
      bar: 'Ver em barras',
      table: 'Ver em tabela',
    },
    viewToggleLabel: 'Alternar visualização',
  },
  showcase: {
    title: 'Vitrine de componentes',
  },
  sidebar: {
    favoritesTab: 'Favoritos',
    nav: {
      adminAuditLogs: 'Auditoria',
      adminFinanceGroup: 'Financeiro',
      adminMarketplaces: 'Marketplaces',
      adminNotifications: 'Notificações',
      adminPlans: 'Planos',
      adminPlatformGroup: 'Plataforma',
      adminProductCategories: 'Categorias de produto',
      adminSettings: 'Configurações',
      adminSubscriptions: 'Assinaturas',
      adminTickets: 'Chamados',
      adminTransactions: 'Transações',
      adminUsers: 'Contas de usuário',
      dashboardDefault: 'Padrão',
      dashboards: 'Dashboards',
      invoices: 'Faturas',
      myPlan: 'Meu plano',
      myTickets: 'Meus chamados',
      operation: 'Operação',
      products: 'Produtos',
      salesChannels: 'Canais de venda',
      subscription: 'Assinatura',
    },
    noFavorites: 'Nenhum favorito ainda.',
    noRecent: 'Nenhuma página visitada ainda.',
    recentTab: 'Recentes',
  },
  support: {
    admin: {
      tickets: {
        columns: {
          user: 'Usuário',
        },
        empty: 'Nenhum chamado encontrado.',
        error: 'Não foi possível carregar os chamados agora.',
        filters: {
          repliedBy: 'Respondido por',
          status: 'Status',
          user: 'Usuário',
        },
        thread: {
          openedBy: 'Aberto por {name}',
        },
        title: 'Chamados',
      },
    },
    tickets: {
      columns: {
        createdAt: 'Aberto em',
        resolvedAt: 'Resolvido em',
        status: 'Status',
        subject: 'Assunto',
      },
      createButton: 'Novo chamado',
      empty: 'Você ainda não abriu nenhum chamado.',
      error: 'Não foi possível carregar seus chamados agora.',
      filters: {
        createdBetween: 'Aberto entre',
        resolvedBetween: 'Resolvido entre',
        status: 'Status',
      },
      form: {
        createSuccess: 'Chamado aberto com sucesso.',
        createTitle: 'Novo chamado',
        errors: {
          messageRequired: 'Descreva o problema ou dúvida.',
          subjectMax: 'Assunto muito longo — use até 255 caracteres.',
          subjectRequired: 'Assunto é obrigatório.',
        },
        fields: {
          message: 'Mensagem',
          subject: 'Assunto',
        },
        submit: 'Abrir chamado',
      },
      status: {
        open: 'Aberto',
        resolved: 'Resolvido',
      },
      thread: {
        disputeSuccess: 'Chamado reaberto — sua mensagem foi registrada.',
        reopenNotice: 'Enviar uma mensagem vai reabrir este chamado.',
        replyPlaceholder: 'Digite sua mensagem...',
        resolveButton: 'Marcar como resolvido',
        resolveSuccess: 'Chamado marcado como resolvido.',
        title: 'Chamado',
      },
      title: 'Meus chamados',
    },
  },
} as const
