# Telas — Billing e Identity

PlanCard, DocumentPromptModal (removido), CompanyForm/CompanyRegistrationView, BillingCheckoutResultView, MySubscriptionView, TransactionsView, AdminSubscriptionsView/OverrideSubscriptionModal, AdminTransactionsView, AccountView, DeleteAccountModal, PWA install prompt.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## PlanCard (`modules/billing/components/blocks/PlanCard.vue`)

Inspirado numa referência visual mandada pelo usuário (2026-08-30,
mockup de outro produto) pra Fase 2 (Billing) — card de plano com preço,
checklist e CTA. **Sem os pedaços que não se aplicam ao domínio do
Orbita** (pedido explícito): nenhum seletor de marketplace nem plano
"combo" limitado a canal específico — `PLAN` não tem esse conceito
(`docs/negocio/contexto-plataforma-precificacao.md` seção 2.2).

- **Checklist é só os 2 limites REAIS do plano**
  (`max_products`/`max_marketplaces`) — nunca uma lista de features
  inventada sem campo nenhum por trás (a referência tinha ~13 itens
  genéricos de marketing, sem equivalente nos dados reais).
- **Preço/economia calculados fora do componente**
  (`modules/billing/composables/usePlanPricing.ts`, testado —
  `tests/modules/billing/composables/usePlanPricing.test.ts`): plano
  anual mostra `getMonthlyEquivalent` (preço do próprio plano ÷ 12,
  `PLAN.price` é o valor cobrado POR CICLO, não um valor mensal
  separado) como número grande, com nota "*Valor equivalente pra
  comparação" e o valor cobrado à vista; `getYearlySavings` compara
  contra o plano mensal mais barato da mesma lista e só aparece
  (`Economize R$X/ano`) quando a conta dá economia real — nunca um valor
  negativo/zero.
- **Badge "Mais econômico"** (`findMostEconomicalPlan`) é sempre o de
  menor equivalente mensal entre os planos listados, nunca um plano fixo
  por nome/id — sem pill/badge pronto no design system que bata com o
  visual (fundo sólido `{colors.accent-blue}` + texto branco fixo,
  `$color-paper-fixed` — nem `Badge.vue`, só ghost/gray, nem `StatusDot`
  pill, tingido claro), então é markup local do próprio card.
- Bloco puramente de apresentação — nunca chama API, só recebe os
  números já calculados e emite `select`.
- Vive em `modules/billing/components/blocks/`, não em `shared/` —
  primeiro (e único, por ora) consumidor é `ChoosePlanView.vue`. Sobe pra
  `shared/components/blocks/` só quando um segundo consumidor real
  aparecer (ex.: oferta de upgrade no dashboard ao bater limite de plano,
  nó "Upgrade" de `docs/negocio/jornada-usuario.mmd`) — critério de
  promoção já estabelecido na seção 2 de `docs/infra/convencoes-frontend-infra.md`,
  não antecipado agora.
- Verificado em browser real com o payload de verdade do backend
  (`GET /plans`, 2 planos mensais reais — nenhum anual seedado ainda —
  mais um anual mockado pra exercitar a variante) e com o fluxo completo
  de assinatura (ver `DocumentPromptModal` abaixo).

**2 props novas, 2026-08-31 — segundo consumidor real (`MySubscriptionView.vue`,
troca de plano) sem promover o componente pra `shared/` ainda** (continua
só os 2 consumidores dentro de `modules/billing/`, critério de promoção
não cruzado):

- **`isCurrent`**: card representa o plano que o usuário JÁ tem hoje —
  troca o `Button` de CTA por um badge "Plano atual" (fundo `{colors.ink-4}`,
  texto `{colors.ink-40}`, mesma linguagem de "estado neutro" já usada em
  outros badges do design system) — nunca oferece selecionar o próprio
  plano de novo, o backend recusaria com `errorMessageSamePlan`
  (`ChangeSubscriptionPlanAction`). `MySubscriptionView.vue` não passa
  `isCurrent` pra nenhum card na prática — filtra o plano atual da lista
  ANTES de renderizar a grade (`otherPlans`, via `canChangeToPlan`), então
  a prop existe pronta pro caso um consumidor futuro preferir mostrar
  todos os planos com o atual desabilitado em vez de escondido.
- **`ctaLabelOverride`**: sobrescreve o texto do botão — sem isso, "Começar
  agora"/"Assinar com desconto" (cópia de assinatura NOVA) apareciam até
  no contexto de TROCA de plano, achado real ao inspecionar o screenshot
  da primeira versão (`MySubscriptionView.vue` chamando `PlanCard` sem
  essa prop). Corrigido passando `$t('billing.mySubscription.changePlan.cta')`
  ("Trocar de plano") — `null` por padrão preserva o comportamento
  original em `ChoosePlanView.vue`, que não passa a prop.

**Botão de logout em `ChoosePlanView.vue`, 2026-09-01, pedido direto pelo
usuário** — esta view fica fora do `AppLayout` (sem `AppSidebar`/
`AppHeader`; é o passo de onboarding entre cadastro e pagamento,
`skipOnboardingChecks`), então não herdava o botão de logout que já mora
no topo da sidebar (`AppSidebarContent.vue`) — sem saída visível, quem
chegasse aqui numa conta errada (ou só quisesse desistir do onboarding)
ficava preso. Adicionado um `.choose-plan-view__topbar` (`display: flex;
justify-content: space-between`) envolvendo a marca "Orbita" (já
existente) e um `Button` `variant="ghost"` com `icon-before="SignOut"` no
canto superior direito, texto visível (`$t('common.actions.logout')`,
"Sair") — mesmo `useLogout()` (`modules/identity/composables`), mesmo
ícone e mesma chave de tradução já usados no botão da sidebar, mas com o
texto ao lado do ícone (não ícone-só como na sidebar) porque aqui não há
nenhum outro indício visual de "isso é sair" (sem avatar/nome ao lado).
Verificado em browser real: botão aparece no canto superior direito da
tela de planos, clique chama `POST /auth/logout` e redireciona pra
`/login`.

**Feature de trial integrada no front, 2026-09-01** — backend concluiu a
tarefa 54 (`docs/negocio/contexto-plataforma-precificacao.md` seção 6,
`PLAN.is_trial`/`trial_days`) e avisou via mensagem cross-session; usuário
confirmou implementar na hora ("já faça"). 4 pontos de integração:

1. **Tipos regenerados** (`npm run generate:api-types`) — `PlanResource`
   ganhou `is_trial`/`trial_days`, `BillingCycle` ganhou o terceiro valor
   `'trial'`, `SubscriptionCheckoutResource.checkout_url` virou nullable.
   `Plan` (`modules/billing/types/plan.type.ts`) ganhou os 2 campos em
   cima do schema gerado, mesmo padrão de sempre — nunca redigitado à
   mão.
2. **`checkout_url: null` → redirect direto, sem Mercado Pago** —
   assinar/trocar pra um plano trial pula Payment/Transaction/checkout
   inteiro no backend; a resposta chega com `checkout_url: null` em vez
   do link de sempre. `isCheckoutSkipped(checkoutUrl): checkoutUrl is null`
   (type guard, testado em `tests/modules/billing/composables/useSubscribeToPlan.test.ts`)
   isola essa única ramificação de decisão nova — `useSubscribeToPlan.subscribe()`
   e `useSubscription.changePlan()` checam essa guarda antes do
   `window.location.href = checkout.checkoutUrl` de sempre; quando
   `true`, `router.push({ name: 'billing-success' })` no lugar do
   redirect de página inteira. `changePlan()` ganhou a mesma guarda por
   defesa de tipo (o `SubscriptionCheckout` é o mesmo shape das duas
   ações), mesmo trial nunca sendo uma TROCA de plano válida na prática
   (só oferecido a quem não tem nenhum histórico de assinatura — quem já
   está trocando de plano já tem histórico, por definição).
3. **`PlanCard.vue` — texto próprio pro trial, não o genérico
   mensal/anual** (`plan.isTrial`, checado ANTES dos ramos
   `isYearly`/senão): sufixo de preço "por N dias" em vez de "/mês"
   (`billing.choosePlan.card.trialSuffix`), descrição "Acesso completo
   por N dias, sem cobrança no cartão" em vez de "Tenha acesso... pagando
   mensalmente" (`trialDescription`), CTA "Testar grátis" em vez de
   "Começar agora"/"Assinar com desconto" (`ctaTrial`) — sem isso, o
   card mostrava "R$0,00/mês" com o texto de assinatura paga normal, o
   tipo de detalhe que faz um usuário desconfiar que é golpe/bug antes
   de clicar. **`findMostEconomicalPlan` (`usePlanPricing.ts`) passou a
   excluir plano trial do comparativo** (`plans.filter(p => !p.isTrial)`,
   testado) — R$0 sempre venceria trivialmente qualquer plano pago,
   fazendo o badge "Mais econômico" pousar no trial sempre que ele
   aparecesse na lista (aparece pra todo usuário sem histórico) em vez de
   destacar o melhor plano PAGO, que é o propósito real do badge.
4. **`errorMessageTrialNotEligible`** — chave nova no catálogo flat de
   `errorMessage*` (`core/i18n/messages/pt-BR.ts`, mesmo padrão de
   `errorMessageSamePlan`/`errorMessageDocumentRequired` etc.), string
   conferida 1:1 contra `ApiMessageKey::ErrorTrialNotEligible` do backend
   (`app/Domain/Shared/Enums/ApiMessageKey.php`). Nenhuma lógica nova de
   composable precisou — o catch genérico de `useSubscribeToPlan.subscribe()`
   (`toast.error(resolveMessage(apiError.messageKey))`) já cobria
   qualquer chave desconhecida/nova só de existir no catálogo.

Verificado em browser real contra o backend local (seed real, plano
trial `trial_days: 10`): card do Trial renderiza "R$ 0,00 / por 10 dias",
descrição e CTA "Testar grátis" corretos; badge "Mais econômico" pousa no
Starter (plano pago mais barato), não mais no Trial; clicar "Testar
grátis" dispara `POST /subscriptions` (`201`) e redireciona DIRETO pra
`/billing/success` sem passar pelo Mercado Pago; usuário com histórico de
assinatura (simulado via assinatura `expired`) não vê mais o card do
Trial na listagem (comportamento do backend, já correto sem mudança
nenhuma no front) e uma chamada direta pro endpoint com o `plan_id` do
trial devolve `422 errorMessageTrialNotEligible` — a chave nova bate
exatamente com o que o backend manda.

**Bug real, reportado pelo usuário em 2026-09-01 testando o fluxo
completo**: assinou o trial, caiu em "Pagamento aprovado" normalmente,
mas clicar "Ir para o dashboard" travava de volta em `/choose-plan` —
mesmo o usuário confirmando, direto na aba de rede, que `/v1/auth/me` já
respondia `requires_subscription: false`. Causa raiz:
`authStore.requiresSubscription` (`core/router/guards.ts`) só é
hidratado UMA VEZ por carregamento de página (`bootstrapSession()`,
flag `sessionBootstrapped`) — o redirect pro trial é 100% client-side
(`router.push`, nunca sai da SPA), então a store continuava com o valor
de ANTES da assinatura existir, e o guard de rota (que lê a store, não
o backend de novo) mandava de volta pra `/choose-plan` em toda navegação
seguinte. **Mesma classe de bug também adormecida** (não causada por
esta feature, só nunca tinha sido exercitada) em
`BillingCheckoutResultView.handleCta()`: se o poll de confirmação do
Mercado Pago (`useSubscriptionConfirmationPoll.ts`) resolve a assinatura
DEPOIS do primeiro carregamento da tela — cenário realista, é
exatamente pra isso que o poll existe —, a store também nunca era
re-sincronizada antes do clique em "Ir para o dashboard".

Corrigido extraindo `refreshCurrentUser()` (exportado,
`core/router/guards.ts`) de dentro de `bootstrapSession()` — mesma
lógica de sempre (refaz `GET /auth/me`, atualiza `user`/`favorites`/
`planLimits`/`requiresSubscription` na store), só que agora reaproveitável
sem a guarda de "uma vez só". Chamado em 3 pontos, todos ANTES de
navegar: `useSubscribeToPlan.subscribe()` (ramo `isCheckoutSkipped`, antes
do `router.push` pro `/billing/success`), `useSubscription.changePlan()`
(mesmo ramo, defesa de tipo — trial nunca é troca de plano válida na
prática) e `BillingCheckoutResultView.handleCta()` (antes de navegar pro
`home`, cobre tanto o caso do trial quanto o caso do poll). Módulo
`billing` importando de `core/router/guards.ts` é permitido pela regra
de fronteira (`docs/infra/convencoes-frontend-infra.md` seção 2: módulo
pode importar de `core/`, nunca de outro módulo) — mesmo precedente já
registrado em `useLogout.ts` (Identity → `core/store`).

Reverificado em browser real reproduzindo o relato exato do usuário: login
→ assinar trial → `/billing/success` → clicar "Ir para o dashboard" →
`GET /auth/me` disparado de novo → aterrissa em `/` (dashboard renderiza
de verdade, sidebar/header com o usuário certo) → reload confirma que não
é só rota client-side desatualizada (sessão persistida corretamente no
backend).

**2º bug real do mesmo dia, reportado pelo usuário**: na tela "Meu plano"
(`MySubscriptionView.vue`), o campo "Plano atual" mostrava "—" pra quem
está no trial. Causa raiz: `currentPlan` era resolvido cruzando
`subscription.planId` com `plans.plans` (a lista de `GET /plans`,
`useChoosePlan.ts`) — mas `ListActivePlansAction::hidesTrialFor()`
esconde o plano trial de `GET /plans` pra qualquer usuário que já tenha
**qualquer** histórico de assinatura, e a própria assinatura trial ATIVA
do usuário conta como esse histórico. Resultado: assim que alguém assina
o trial, ele some da lista de planos pra ele mesmo, e o front nunca mais
consegue achar o nome pra exibir. Confirmado via `curl` autenticado antes
de pedir a correção — não é bug exclusivo do trial, é sistêmico (qualquer
plano que um dia vire `active: false` teria o mesmo problema).

Não dava pra corrigir só no front — não existe `GET /plans/{id}` nem o
plano embutido em `GET /subscriptions`. Pedido pro backend
(`SubscriptionResource`/`AdminSubscriptionResource` ganharem `plan`
embutido, mesmo shape do `PlanResource`), resolvido no mesmo dia.
`Subscription` (`subscription.type.ts`) ganhou o campo `plan: Plan`
(mapeado via `toPlan(resource.plan)`, reaproveitando o mapper que já
existia) — `MySubscriptionView.currentPlan` virou simplesmente
`subscription.value?.plan`, sem cruzar mais com `plans.plans` (que
continua usada só pro que realmente precisa dela: grade de troca de
plano e `pendingPlan`, este último ainda resolvido por cruzamento porque
o backend não embutiu um `pendingPlan` — trial nunca é alvo de troca de
plano válida, então esse caso específico não recai no mesmo bug).
Reverificado em browser real contra o backend local: "Plano atual" mostra
"Trial" corretamente pra um usuário na assinatura trial.

## DocumentPromptModal — removido em 2026-09-02

**Existiu de 2026-08-31 a 2026-09-02** — aberto quando
`useSubscribeToPlan.subscribe()` recebia `errorMessageDocumentRequired`
do backend, pedindo CPF/CNPJ inline no checkout de assinatura ("o próprio
checkout é o ponto de coleta", comentário real do backend na época, sem
tela de cadastro dedicada ainda). **Removido junto com a tarefa 63**
(`docs/api/ordem-de-implementacao.md` no repo `backend`, pedido direto do
usuário) — CPF/CNPJ saiu de `USER` pra virar cadastro de empresa próprio
(`COMPANY`), obrigatório ANTES de chegar em `/choose-plan`, não mais
coletado no meio do checkout. Ver `CompanyRegistrationView.vue` abaixo,
que substitui esse fluxo inteiro (tela própria, não mais um modal reativo
a erro). `documentFormSchema.ts` foi removido junto — a mesma checagem de
contagem de dígitos virou `companyFormSchema.ts`
(`modules/identity/schemas/`).

## CompanyForm / CompanyRegistrationView (`modules/identity/components/CompanyForm.vue`, `modules/identity/views/CompanyRegistrationView.vue`)

`CompanyRegistrationView.vue` é o passo obrigatório de onboarding (tarefa
63) — mesmo shell de `ChoosePlanView.vue` (topbar com marca + logout,
fora do `AppLayout`, `skipOnboardingChecks: true`): é o mesmo tipo de
tela, um passo do fluxo entre e-mail verificado e escolha de plano
(`docs/negocio/jornada-usuario.mmd`, nó `RegisterCompany`), não uma
página do app principal. `core/router/guards.ts` manda pra cá sempre que
`authStore.requiresCompany` é `true` (`LoginResultResource.requires_company`,
mesmo padrão de `requires_subscription`).

**`CompanyForm.vue` extraído no mesmo dia, pedido direto do usuário**
("precisamos editar os dados ou pelo menos visualizar os dados da
empresa no account") — segundo consumidor real (`AccountView.vue`, seção
abaixo) do mesmo formulário singleton, mesmo critério de promoção já
usado no resto do projeto. Só os CAMPOS + estados de loading/erro, sem
cabeçalho/moldura própria — cada consumidor decide isso: `CompanyRegistrationView.vue`
envolve num card centralizado (`.company-registration-view__card`,
`{radius.16}` + borda, mesmo tratamento visual de antes da extração);
`AccountView.vue` encaixa direto dentro de um `<section>` que já tem essa
moldura (mesma receita das outras seções da tela). Nunca decide o que
fazer DEPOIS de salvar — só emite `saved` com a `Company` resultante
(mesma régua de `ProductForm.vue`): `CompanyRegistrationView.vue` refaz
`/auth/me` e navega pro próximo passo; `AccountView.vue` não passa
handler nenhum pro evento — o toast de sucesso já vem de dentro do
próprio `useCompanyForm.ts` (`useResourceForm`), não precisa de mais
nada depois de uma edição pontual.

- **Singleton, não CRUD de coleção** (`useCompanyForm.ts`, em cima de
  `useResourceForm` — o mesmo motor genérico de `useProductForm.ts`, só
  que `existing` nasce de um `GET /company` no `load()` em vez de vir por
  prop de um Drawer): 404 (usuário ainda não cadastrou, o caminho normal
  do onboarding) fica em modo create; um `GET` com sucesso preenche o
  form e vira update — cobre o caso raro de navegar de volta pra essa URL
  já com empresa cadastrada (verificado em browser real: revisitar a
  rota manualmente depois do cadastro mostra os dados preenchidos e o
  botão "Salvar alterações", não "Continuar").
- **Campo "CPF do responsável" só aparece pra CNPJ** (`isCnpjDocument`,
  `companyFormSchema.ts` — conta de dígitos do campo `document`, 14 =
  CNPJ) — usa `FormGroup`'s `labelTooltip` (seção FormGroup acima,
  extraído para este mesmo pedido) explicando o motivo ("empresas com
  CNPJ precisam do CPF de uma pessoa responsável"). Regra cruzada
  espelhada no Zod via `.superRefine()` no schema inteiro — mesmo padrão
  já usado (e removido) em `productFormSchema.ts` antes do rename pra
  `cost_price`.
- **Depois de salvar, refaz `/auth/me`** (`refreshCurrentUser()`, mesmo
  achado real já documentado em `core/router/guards.ts` pro trial de
  plano) antes de navegar — sem isso,
  `authStore.requiresCompany` ficaria preso em `true` e o guard mandaria
  de volta pra cá na próxima navegação. Destino final depende de
  `authStore.requiresSubscription`: `/choose-plan` (caminho normal do
  onboarding) ou `/` (caso raro de editar a empresa já com assinatura
  ativa).
- Verificado em browser real contra o backend local: login sem empresa
  redireciona pra cá; digitar um CNPJ revela o campo de responsável e
  bloqueia o submit sem ele (erro client-side, sem round-trip);
  trocar pra CPF esconde o campo de novo; submit grava
  `document`/`sales_tax_percentage` corretos no banco
  (`responsible_document: null` pro caso CPF); login seguinte pula
  direto pra `/choose-plan`, sem re-redirecionar pra cá.

## BillingCheckoutResultView (`modules/billing/views/BillingCheckoutResultView.vue`)

Uma view só pras 3 `back_urls` reais do Checkout Pro do Mercado Pago
(`MercadoPagoGateway::createCheckout`, backend —
`${FRONTEND_URL}/billing/success`/`/pending`/`/failure`) — sem ela, quem
completasse o pagamento hospedado caía num 404 real ao voltar.
`route.meta.checkoutResult` (`'success' | 'pending' | 'failure'`) decide
a variante ORIGINAL (ícone/cor/texto/CTA); as 3 rotas
(`modules/billing/routes.ts`) só variam esse meta, mesmo componente —
nada de 3 views quase idênticas duplicadas. Reaproveita `AuthLayout.vue`
(mesmo shell de Login/Register/ResetPassword).

**Refresh em tempo real ligado em 2026-08-31** — pedido direto do
usuário ("vamos seguir com o gap 1"), fechando a última pendência real
da Fase 2; só ficou barato de fazer depois do Gap 2 (`pending_plan_id`
em `SubscriptionResource`, ver seção `MySubscriptionView` abaixo) já ter
sido resolvido antes.

- **`useSubscriptionConfirmationPoll.ts`** (`modules/billing/composables/`,
  `isSubscriptionConfirmed` testado como função pura) — `start()`, no
  `onMounted`, captura um SNAPSHOT da assinatura e só liga o poll
  (`useIntervalFn` do `@vueuse/core`, 3s, até 20 tentativas — ~1min,
  desiste em silêncio depois) se houver algo pendente pra confirmar:
  `status: pending` (assinatura NOVA, `SubscribeToPlanAction` já cria a
  linha assim antes do redirect) ou `pending_plan_id` setado (TROCA de
  plano, `ChangeSubscriptionPlanAction` idem). As duas rotas de retorno
  (`/success`/`/pending`) servem os dois fluxos sem diferenciar na
  URL — comparar contra o snapshot inicial (não um valor fixo) é o que
  permite saber qual das duas transições é a que importa aqui.
  "Confirmado" = `status` virou `active` OU `pending_plan_id` voltou a
  `null` — as 2 transições reais de `ConfirmSubscriptionPaymentAction`
  (backend, chamado pelo webhook).
- **`displayVariant` (não `variant`) é o que o template usa** — assim que
  `isConfirmed`, a tela troca SOZINHA pra `success` (ícone/cor/texto/CTA,
  reaproveitando os MESMOS textos/tokens já usados pra assinatura
  aprovada de verdade, zero cópia nova) sem precisar de F5. `failure`
  nunca é alvo de poll (resultado definitivo, sem nada a esperar).
- **Indicador "Verificando confirmação automaticamente..."** (`Spinner`
  14px + texto, `billing.checkoutResult.pending.checking`) — só aparece
  na variante ORIGINAL `pending` enquanto `isPolling`; some sozinho
  quando confirma (a tela já virou `success` nesse ponto) ou quando o
  timeout de tentativas esgota.
- Verificado em browser real contra o backend local, simulando o webhook
  via tinker ENQUANTO a página estava aberta (o cenário real que a
  feature existe pra cobrir, não só a leitura estática): assinatura
  `pending`→`active` no meio do poll fez a tela virar de "Pagamento em
  análise" pra "Pagamento aprovado" sozinha (ícone, cor, título,
  descrição, indicador de verificação sumindo) sem nenhum reload; troca
  de plano pendente resolvida (`pending_plan_id`→`null`) também
  detectada da mesma forma, confirmada depois navegando pra "Meu plano"
  (aviso de troca pendente já tinha sumido, plano atual já mostrando o
  novo).

## MySubscriptionView (`modules/billing/views/MySubscriptionView.vue`)

Fecha as pendências reais que restavam da Fase 2, pedido direto do
usuário ("implemente tudo q falta pra fase 02"): cancelamento
(`DELETE /subscriptions/{id}`) e troca de plano
(`PATCH /subscriptions/{id}`), os dois endpoints já prontos no backend
desde a rodada original da Fase 2, telas nunca construídas até aqui.

- **Mesma receita de "seção com borda" de `AccountView.vue`**
  (`{colors.bg-1}` + borda `{colors.ink-10}` + `{radius.16}` + padding
  `{spacing.24}`) — resumo da assinatura numa seção, troca de plano em
  outra, sem componente de "card" novo (`AccountView.vue` já resolveu
  esse gap, reaproveitado aqui, não reinventado).
- **Resumo em grade de campos** (plano/status/ciclo/assinante desde/
  válido até) — `StatusDot` pro status (`subscriptionStatusColor`,
  `subscription.type.ts`), `CalendarBlank` 14px antes das datas (mesmo
  padrão de "ícone de apoio pequeno antes de texto" já usado em
  `IconText.vue`/células de tabela, sem reaproveitar `IconText` aqui
  porque não é uma célula de `DataTable`).
- **Sem `ConfirmDialog` antes de trocar de plano** — mesma consistência
  do fluxo de assinatura original (`ChoosePlanView.vue`): clicar no
  `PlanCard` já redireciona pro checkout do Mercado Pago, onde o usuário
  revisa o valor prorata antes de pagar — o checkout hospedado já É a
  confirmação. Cancelamento usa `ConfirmDialog` porque não tem esse passo
  intermediário — o clique cancela direto.
- **Grade de troca de plano reaproveita `PlanCard.vue`** (ver seção
  acima, props `isCurrent`/`ctaLabelOverride` novas) — filtra o plano
  atual da lista (`canChangeToPlan`, `useSubscription.ts`) antes de
  renderizar, então a grade só mostra os planos pra que trocar de
  verdade.
- **`canCancelSubscription`/`canChangeToPlan` são funções puras,
  test-first** (`tests/modules/billing/composables/useSubscription.test.ts`)
  — mesma régua de `usePlanPricing.ts`: `canCancelSubscription` só é
  falso quando já não há assinatura ou o cancelamento já foi agendado
  (evita disparar `DELETE` de novo à toa — o backend é idempotente,
  então isso é só UX, não uma trava de segurança real);
  `canChangeToPlan` só é falso pro próprio plano atual (o backend
  recusaria com `errorMessageSamePlan`).
- **Gap de contrato do backend fechado em 2026-08-31** — pedido direto
  do usuário ("vamos iniciar pelo gap 2"), mensagem pra sessão
  `backend-c5` pedindo `pending_plan_id` em `SubscriptionResource`
  (`GET /subscriptions`), resolvido no mesmo dia. `subscription.type.ts`
  ganhou o campo em `Subscription`/`toSubscription()`. Efeito na tela:
  um `computed` (`pendingPlan`, resolve o `id` pro `Plan` de verdade na
  mesma lista já carregada pra grade de troca) alimenta um aviso
  (`billing.mySubscription.pendingPlanChange`, "Troca para o plano {plano}
  aguardando confirmação de pagamento") e esconde a seção inteira
  "Trocar de plano" enquanto a troca está pendente — evita deixar
  clicar de novo só pra bater no 422 `errorMessagePlanChangeAlreadyPending`.
  **`.my-subscription-view__cancelled-notice` generalizada pra
  `__notice`** — os 2 avisos (cancelamento agendado, troca pendente)
  podem aparecer AO MESMO TEMPO (`cancelAtPeriodEnd`/`pendingPlanId` são
  estados independentes na mesma assinatura), `margin-bottom` em vez de
  depender de `gap` de container, pra empilhar bem nos dois casos (1 ou
  2 avisos).
- Verificado em browser real contra o backend local, com dado de
  verdade (assinatura ativa criada via tinker + segundo plano real
  disponível pra trocar): resumo renderiza plano/status/datas corretos;
  cancelar mostra "Cancelamento agendado — acesso mantido até {data}" e
  sobrevive a um reload da página; clicar "Trocar de plano" dispara o
  `PATCH` real e redireciona de fato pro Checkout Pro do Mercado Pago
  (sandbox, URL com `pref_id` real) — confirmado no banco que
  `pending_plan_id` fica setado pro plano novo enquanto `plan_id`
  continua o antigo, exatamente como `ChangeSubscriptionPlanAction`
  documenta; repetir a troca com uma já pendente mostra o toast de erro
  certo sem navegar pra lugar nenhum; com `pending_plan_id` real setado
  no banco, o aviso mostra o nome do plano de destino resolvido ("Pro")
  e a seção de troca some; com cancelamento E troca pendente ao mesmo
  tempo, os 2 avisos empilham e o botão de cancelar (correto — já
  cancelado) some.

**Filtro de ciclo de cobrança, 2026-08-31, pedido direto do usuário**
("nas telas de planos tanto no choose-plan quanto na meu plano adicione o
filtro por `?filter[billing_cycle]=monthly` como um seletor em cima dos
cards") — a API (`GET /plans`) já suportava o filtro, só não existia
seletor nenhum: as duas telas sempre buscavam TODOS os planos misturados
(mensal + anual na mesma grade). Adicionado um `BlockTab` "Mensal"/"Anual"
acima da grade, tanto aqui quanto em `ChoosePlanView.vue` (que não tem
seção própria neste documento — mesmo padrão de `PlanCard`, ver acima).

- **`useChoosePlan.ts` reescrito pra manter DUAS listas** —
  `plans` (universo completo, sem filtro, buscada 1x) e `visiblePlans`
  (só o ciclo selecionado, refeita via `GET /plans?filter[billing_cycle]=...`
  de verdade a cada troca). Necessário porque `usePlanPricing.ts`
  (`getYearlySavings`/`findMostEconomicalPlan`) precisa do universo
  INTEIRO pra comparar ciclos entre si (ex.: "economize R$X/ano" compara
  o anual contra o mensal mais barato — que só existe fora do filtro
  atual), mas a grade renderizada usa só `visiblePlans`. Mesma dualidade
  replicada aqui (`plans.plans`/`plans.visiblePlans`, mesma composable
  reaproveitada) — o resumo de "Meu plano atual" continua resolvendo
  contra `plans.plans` (universo completo), nunca contra o filtro
  selecionado, senão trocar de aba faria o plano atual "sumir" do resumo
  se ele não fosse do ciclo visível no momento.
- **A seção "Trocar de plano" (com o seletor dentro) fica visível mesmo
  quando o ciclo atual não tem nenhum plano pra trocar** —
  `hasPendingPlanChange` continua sendo o gate real da seção
  (não `otherPlans.length`), com uma mensagem nova
  (`billing.mySubscription.changePlan.emptyForCycle`) no lugar da grade
  vazia; sem isso, o usuário ficaria sem nenhuma forma de descobrir que o
  outro ciclo tem opções.
- Verificado em browser real contra o backend de verdade (2 planos
  mensais + 2 anuais seedados): alternar Mensal/Anual dispara o `GET`
  real com `filter[billing_cycle]` correto nos 2 componentes; badge "Mais
  econômico" recalcula só dentro do ciclo visível; o caso de economia
  ZERO (yearly = 12× o mensal exato nos dados de seed) corretamente não
  mostra nenhum badge de economia (nunca um valor zerado/negativo).

## TransactionsView (`modules/billing/views/TransactionsView.vue`)

"Faturas" — histórico próprio via `GET /transactions`
(`ListOwnTransactionsAction`), read-only. Mesma receita de
`ProductsView.vue` (`useResourceList`/`DataTable`/`PaginationNav`), sem
`ListToolbar`/`useCrudDrawer`/`ConfirmDialog` — não existe criar/editar/
excluir transação (registro financeiro imutável, mesma regra já vale pro
admin: `AdminTransactionController` só tem `index`/`show`).

- **`buildTransactionSortParam` testado** (mesmo padrão de
  `buildProductSortParam`, `useProductList.ts`) — a API real só ordena
  por `value`/`created_at` (`core/api/schema.d.ts`, `transaction.index`),
  qualquer outra coluna não ganha `sortable: true` na tabela.
- **Status via `StatusDot`** (`transactionStatusColor`,
  `transaction.type.ts`) — aprovada/autorizada em verde, pendente/em
  processamento/em mediação em amarelo, recusada/cancelada em vermelho,
  reembolsada/estornada (chargeback) em cinza (sem sinal claro de
  "bom"/"ruim" pro usuário final, tratado como neutro).
- Verificado em browser real contra o backend local, com 2 transações
  reais criadas via tinker (`approved`/`pix`, `pending`/`credit_card`):
  tabela renderiza as 2 linhas com valor formatado (`formatMoney`) e
  `StatusDot` na cor certa (verde/amarelo), paginação aparece mesmo com
  só 1 página (mesmo comportamento já esperado de `PaginationNav`).

## AdminSubscriptionsView / OverrideSubscriptionModal (`modules/billing/`)

**Fase 7, 2026-09-01** — "Assinaturas" (admin): "ver TODAS as assinaturas
de todos os usuários" (`GET /admin/subscriptions`,
`AdminSubscriptionController`), pedido direto do usuário ("crie uma
fase 7 com a parte financeira, assinaturas e transações e implemente").
Mesma forma geral de `AdminMarketplacesView.vue`
(`useResourceList`/`DataTable`/`PaginationNav`+`ListToolbar`), mas **sem
`useCrudDrawer`**: não existe criar/excluir assinatura pelo admin
(`AdminSubscriptionController` só tem `index`/`show`/`update`) — só
`OverrideSubscriptionModal.vue` (`Modal`, 2 campos: `status`/`end_date`)
pra correção manual de suporte via `OverrideSubscriptionAction`, mesma
categoria de `EditUserRoleModal.vue`/`useUpdateUserRoleForm.ts`
(bespoke, fora do `useResourceForm` — não é o par create/update que ele
modela).

- **`user`/`plan` embutidos desde o início** — diferente do achado real
  de `AdminAuditLogResource` (descoberto DEPOIS de construir a tela),
  aqui o gap foi reportado pra sessão de backend ANTES de escrever a UI
  (mesmo padrão já visto no mesmo dia, aplicado proativamente): `GET
  /admin/subscriptions` nunca chegou a expor `user_id` cru pra esta
  tela, resolvido em minutos. `AdminSubscription` (`subscription.type.ts`)
  ganhou `user: AdminUser` — 3º consumidor real de `AdminUser`
  (`core/types/adminUser.type.ts`, depois de Identity e Platform).
- **Filtro de `status`** (`ListToolbar` `#filters`, `Select`, sentinel
  `'all'`) — reaproveita as mesmas chaves i18n de
  `billing.mySubscription.status.*` (tela "Meu plano" do próprio
  usuário), sem duplicar tradução.
- **Filtros de `user_id`/`plan_id`, Fase 9 (2026-09-01)** — fecham o gap
  real reportado na auditoria de integração do OpenAPI (a API já aceitava
  os dois, sem controle de UI correspondente). 2 `Select` novos,
  alimentados por `useAdminUserOptions` (`core/composables/`, novo —
  ponte cross-módulo pra listar usuários pra picker, reutilizada por
  `AdminTransactionsView`/`AdminTicketsView`/`AdminNotificationsView`) e
  `useAdminPlanOptions` (`modules/billing/composables/`, LOCAL — só este
  consumidor existe até aqui, não cruzou o critério de promoção pra
  `core/`). Os dois auto-aplicam ao trocar (mesmo padrão do `Select` de
  status, sem botão "Filtrar" — só os filtros de DATA exigem confirmação
  explícita nesse projeto).
- **`OverrideSubscriptionModal.vue`**: `status` via `Select` (5 valores
  de `SubscriptionStatus`), `end_date` via `DatePicker.vue` (`v-model`
  de string ISO, `''` = sem data) — convertido pra `null` só na hora do
  payload, já que `end_date` é `nullable` de propósito no backend
  (decisão P11: admin pode limpar a data pra reverter a assinatura pra
  indeterminada). Sempre manda os 2 campos explícitos no `PATCH` (nunca
  omite pra "não mudar") — mais simples que replicar a lógica de
  `sometimes` do backend num form que já mostra o valor atual
  pré-preenchido.
- Verificado em browser real contra o backend local: tabela mostra nome
  de usuário/plano reais (não UUID), editar uma assinatura (trocar
  status "Ativa" → "Cancelada" no modal) dispara o `PATCH` real e a
  linha atualiza sem reload, filtro de status funciona.

## AdminTransactionsView (`modules/billing/views/AdminTransactionsView.vue`)

**Fase 7, 2026-09-01** — "Transações" (admin), read-only
(`AdminTransactionController` só tem `index`/`show` — registro
financeiro imutável, mesma regra do `TransactionController` do próprio
usuário). Mesma forma de `TransactionsView.vue` + `ListToolbar` com
filtro de `status` (todos os 9 valores de `TransactionStatus`,
reaproveitando `billing.transactions.status.*` já existente, sem
duplicar tradução).

- **Sem filtro de `gateway`/`subscription_id`, decisão mantida na
  auditoria da Fase 9** — hoje só existe 1 gateway integrado (Mercado
  Pago, `docs/infra/convencoes-frontend-infra.md` seção 15.1); um
  `Select` sem segunda opção real pra escolher não vale a pena, mesma
  régua de "sem dimensão real pra oferecer" já usada noutros lugares do
  design system (ex.: busca de Marketplace/`Product`). `subscription_id`
  é busca por UUID cru, sem UI natural sem já saber o ID de antemão. Os
  2 services já aceitam os params — mapeamento 1:1 com o
  `QueryParameter` real do controller, deliberadamente só sem UI.
- **Filtro de `user_id`, Fase 9 (2026-09-01)** — 1 `Select` novo
  (`useAdminUserOptions`, mesmo composable cross-módulo do
  `AdminSubscriptionsView` acima), fechando o gap real que a auditoria
  de integração encontrou (`filter[user_id]` documentado no controller,
  sem controle de UI).
- **`user` embutido desde o início**, mesmo caso de `AdminSubscription`
  acima — reportado pra sessão de backend antes de construir a tela.
- Verificado em browser real: tabela mostra nome de usuário real, valor
  formatado (`formatMoney`), `StatusDot` na cor certa; filtro de usuário
  produz `filter[user_id]=...` correto na URL da requisição.

## AccountView (`modules/identity/views/AccountView.vue`)

Fecha a última pendência real da Fase 1 — escopo direto de
`mapeamento-cruds-perfil.md` (backend): editar nome/e-mail/senha, ver/
desconectar provedores SSO, excluir a própria conta. **Diferente das
outras telas de Identity, é uma tela do APP PRINCIPAL** — vive dentro de
`AppLayout` (sidebar/header), não do shell split-screen de
`AuthLayout.vue`. Sem componente de "Card" pronto no design system (só
`{rounded.16}` reservado desde a Fase 0) — cada seção (dados da conta,
contas conectadas, zona de risco) é uma `<section>` com borda
`{colors.ink-10}` + `{radius.16}`, mesma receita repetida 3x; zona de
risco usa `{colors.accent-red}` na borda.

Descoberta via clique no bloco de usuário (avatar + nome) no topo do
`AppSidebar` (`core/layouts/AppSidebarContent.vue`) — virou
`RouterLink` pra `account` em vez de `<div>` estático, com
`text-decoration:none; color:inherit` pra não parecer um link azul
sublinhado tradicional, só hover/focus-ring de affordance.

**Seção "Empresa", 2026-09-02, pedido direto do usuário** ("precisamos
editar os dados ou pelo menos visualizar os dados da empresa no
account") — 4ª `<section>` da grade, mesma receita de borda/raio das
outras 3, encaixando `<CompanyForm />` (ver seção `CompanyForm /
CompanyRegistrationView` acima) sem passar handler pro `@saved` — o
toast de sucesso já vem de dentro do próprio `useCompanyForm.ts`, editar
a empresa aqui não precisa de nenhuma navegação depois, diferente do
onboarding. Verificado em browser real contra o backend local (usuário
com empresa CNPJ já cadastrada): seção carrega prefilida (nome/CPF-CNPJ/
CPF do responsável/imposto), editar o nome e salvar mostra "Empresa
atualizada com sucesso." e persiste no banco.

## DeleteAccountModal (`modules/identity/components/DeleteAccountModal.vue`)

Composição de `Modal.vue` + `FormGroup` + `Input` + 2 `Button`, mesmo
padrão de bloco de `DocumentPromptModal.vue` (Billing) — nunca decide o
que fazer com a senha digitada, só emite `confirm`
(`AccountView.vue`/`useDeleteAccount.ts` decidem). Sem variante
destrutiva/vermelha no botão de confirmar — mesma decisão já registrada
em `ConfirmDialog.vue` (Figma não define essa variante pro `Button`).
`password` sempre opcional no campo: `UserResource` não expõe se a conta
tem senha cadastrada (conta só-SSO não tem), então a UI nunca sabe se
deve exigir preenchimento — manda o que foi digitado e deixa o backend
recusar com `errorMessageIncorrectPassword` se for o caso.

## Instalar aplicativo / PWA install prompt (`core/pwa/composables/useInstallPrompt.ts`, seção em `AccountView.vue`)

**Pedido direto do usuário, 2026-09-04** ("em navegadores com suporte a
pwa, vamos colocar um botão em account para ativar o pwa e instalar o
app no pc ou smartphone") — botão de instalação nativa do PWA, visível
só em navegadores/plataformas que suportam o evento `beforeinstallprompt`
(Chromium — Chrome/Edge/Android; Firefox desktop e Safari/iOS não têm
essa API), seguindo a convenção "nunca link morto" já estabelecida no
projeto: a seção inteira fica ausente do DOM (não desabilitada, não
mostrando uma mensagem de "indisponível") quando o navegador não suporta.

- **Singleton em nível de módulo, mesmo padrão de `useTheme.ts`/
  `useAppUpdatePrompt.ts`** — `beforeinstallprompt` dispara UMA vez só,
  cedo no carregamento da página; se o listener fosse registrado dentro
  da função exportada `useInstallPrompt()` (chamada de verdade só em
  `AccountView.vue`, rota lazy-loaded), o evento já teria disparado e
  sido perdido antes do listener existir. O listener é registrado como
  código de nível de MÓDULO (`window.addEventListener` fora de qualquer
  função exportada) — `App.vue` (componente raiz, nunca lazy) faz um
  import só pelo efeito colateral (`import
  './core/pwa/composables/useInstallPrompt'`, sem nome vinculado, ao
  lado da chamada de `useAppUpdatePrompt()`), garantindo que o listener
  já está ativo desde o boot do app.
- **`isInstalled` nasce já resolvido**, sem esperar o evento
  `appinstalled`: `window.matchMedia('(display-mode: standalone)').matches`
  (cross-browser) OU `navigator.standalone === true` (iOS/Safari, não
  existe em `lib.dom.ts`, precisa de cast) — cobre o usuário que já
  tinha instalado o app antes desta sessão de página carregar.
  `appinstalled` (fires quando a instalação de fato acontece, por
  qualquer caminho) marca `isInstalled = true` daí em diante — transição
  de mão única, nunca reverte sozinha.
- `BeforeInstallPromptEvent` é tipado à mão (interface própria
  estendendo `Event`) — não existe em `lib.dom.ts` do TypeScript, mesma
  categoria de gap já documentada nesta seção pra outras APIs
  específicas de browser (`navigator.standalone`).
- `canInstall` = evento capturado E ainda não instalado; `promptInstall()`
  chama `.prompt()` no evento guardado, aguarda `.userChoice`, marca
  `isInstalled = true` só se `outcome === 'accepted'`, e sempre limpa o
  evento guardado depois (não reutilizável, mesmo em caso de recusa).
- Seção em `AccountView.vue` (`v-if="canInstall || isInstalled"`) — 2
  estados visuais: já instalado (mensagem informativa, sem botão) ou
  instalável (descrição + `Button` `variant="outline"` com
  `icon-before="DownloadSimple"`, chamando `promptInstall`). Sem um
  terceiro estado "indisponível" — a seção nunca aparece pra Firefox/
  Safari, em vez de aparecer desabilitada com uma explicação (decisão
  revertida durante a implementação: uma chave `unavailableDescription`
  chegou a ser escrita e removida antes de ir pro código, texto morto
  nunca referenciado).
- **Verificação**: 6 testes unitários
  (`tests/core/pwa/composables/useInstallPrompt.test.ts`, mesma técnica
  de dispatch sintético de `beforeinstallprompt` já usada — evento
  criado via `new Event(...)` com `prompt`/`userChoice` anexados
  manualmente antes do `dispatchEvent`, já que não é um evento
  construtível padrão) cobrindo estado inicial, captura do evento,
  recusa, compartilhamento de estado entre chamadas independentes
  (singleton), aceite com `promptInstall()`, e `appinstalled` mantendo
  o estado instalado — todos passando, junto com a suíte completa (361
  testes), ESLint, `vue-tsc` (typecheck) e o build de produção
  (incluindo o build do service worker via `vite-plugin-pwa`), todos
  limpos. **Confirmação em navegador real (Chrome/Edge desktop e "Add to
  Home Screen" no Android) não foi possível nesta sessão** — o ambiente
  sandbox não tem as bibliotecas nativas que o Chromium do Playwright
  precisa (`libnspr4.so`/`libnss3.so`/`libnssutil3.so`/`libsmime3.so`,
  confirmado ausentes em todo o sistema de arquivos via `ldd` e busca
  global) e não há acesso root/sudo pra instalá-las
  (`playwright install-deps` exige senha, indisponível no ambiente); só
  o engine Chromium está baixado localmente (sem Firefox/WebKit pra
  tentar como alternativa). Fica pendente de confirmação manual do
  usuário num navegador real — o fluxo completo (aparecimento do botão,
  clique disparando o prompt nativo do browser, e o estado virando "já
  instalado" depois de aceitar) depende dessa API do browser em si, não
  reproduzível de outra forma neste ambiente.

