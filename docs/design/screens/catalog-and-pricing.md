# Telas — Catalog e Pricing (marketplaces)

ProductLaunchList, ProductForm (rename `operationalCost`→`shippingCost`; ícone discreto "Marketplaces" no rodapé do Drawer, 2026-09-10), atalho "Ver precificação" em ProductsView, AdminMarketplacesView/AdminMarketplaceForm, MarketplaceLogo, MarketplacesView, ConnectMarketplaceModal, adendo `coupon`/`percentage_of_total`/`individual_fixed_fee`/`shippingCost`+`operationalCost` (da EMPRESA, ver `COMPANY.operationalCostPercentage` em `billing-and-identity.md`) de ProductMarketplacePricingView, ProductMarketplacesView (2026-09-10: vínculo produto↔marketplace virou automático, modal de "vincular" E "Desvincular"/DELETE removidos, category_id virou mutável via PATCH), AdminProductCategoriesView, AdminCategoryMarketplaceList.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## ProductLaunchList (`modules/catalog/components/blocks/ProductLaunchList.vue`)

"Lançamentos" (`PRODUCT_LAUNCH`) — pedido direto do usuário em 2026-08-31
("vamos seguir com o catálogo... implementar produtos e lançamentos de
produtos"), fechando a única pendência funcional real da Fase 3.
`docs/negocio/contexto-plataforma-precificacao.md` (seção 2.3) e
`core/layouts/config/navigation.ts` já documentavam a decisão: nunca uma
listagem própria/item de sidebar, sempre uma ABA dentro do detalhe de UM
produto.

- **Primeiro componente do módulo Catalog a justificar `components/blocks/`**
  — `ProductForm.vue` (form simples) continua solto em `components/`;
  `ProductLaunchList.vue` é composição de verdade (`DataTable`+toolbar+
  `Modal`+`ConfirmDialog`), mesmo critério de promoção de subpasta já
  usado noutros módulos (seção 3.3 de `docs/infra/convencoes-frontend-infra.md`).
  Mesmo motor genérico de `ProductsView.vue`
  (`useResourceList`/`useCrudDrawer`/`useConfirmAction`) — `useCrudDrawer`
  reaproveitado apesar do nome sugerir `Drawer.vue`: a lógica não conhece
  qual componente de UI a consome.
- **`ProductLaunchForm.vue` (`components/ProductLaunchForm.vue`) dentro
  de um `Modal`, não um segundo `Drawer`** — já se está dentro do Drawer
  de edição do produto quando essa tela abre; um painel lateral
  empilhado dentro de outro ficaria estranho, `Modal` sobrepõe em vez de
  deslizar. Mesmo padrão de form único create+edit de `ProductForm.vue`.
- **`TabBar` no `Drawer` de edição de `ProductsView.vue`** ("Dados do
  produto"/"Lançamentos") — só existe em modo `edit` (produto precisa
  existir pra ter lançamentos); `activeProductTab` reseta pra "Dados"
  toda vez que um edit novo abre, porque `useCrudDrawer.close()` não
  reseta `mode`/`editingRecord` de propósito (evita flicker na animação
  de saída) — sem esse reset explícito, reabrir pra um produto DIFERENTE
  poderia herdar a aba "Lançamentos" ainda ativa da edição anterior. O
  `Drawer` cresce de `size="md"` pra `"lg"` só no modo `edit`, pra caber
  a tabela de lançamentos.
- **Achado real, sistêmico — `Select`/`Tooltip`/`DropdownMenu`/`DatePicker`/
  `DateRangePicker` nunca funcionavam de verdade dentro de um
  `Modal`/`Drawer`**: os 5 portais floating do design system usavam
  `z-index: 50`, sempre MENOR que `Modal.vue`/`Drawer.vue` (`100`/`101`)
  — qualquer um deles usado aninhado renderizava atrás do modal/drawer,
  interceptando clique. Só apareceu agora porque `ProductLaunchForm.vue`
  (`DatePicker` dentro de um `Modal`, que por sua vez está dentro do
  `Drawer` de edição do produto) foi o primeiro caso real de componente
  flutuante aninhado num desses dois. Confirmado com Playwright: clicar
  no atalho "Hoje" do `DatePicker` travava com "element intercepts
  pointer events", o elemento por cima sendo o próprio conteúdo do
  `Modal`. Corrigido nos 5 componentes pra `z-index: 200`.
- **Achado real, sistêmico, encontrado no mesmo processo — erro de campo
  do backend nunca aparecia sob o input pra qualquer campo com nome
  composto** (`full_sale_price`, `purchase_price`, `target_margin`,
  `password_confirmation`...): `parseApiError.ts` devolvia `fieldErrors`
  chaveado como o Laravel manda (snake_case, nome do REQUEST), mas todo
  `useXForm.ts` indexa `errors.value` pela chave CAMELCASE de
  `XFormValues` — sem conversão, `errors.value['full_sale_price']` nunca
  é lido por `fieldError('fullSalePrice')`. 3 forms de Identity
  (`useRegisterForm`/`useUpdateProfileForm`/`useResetPasswordForm`) já
  tinham percebido isso pro único campo composto que cada um tem
  (`password_confirmation`) e remendado com um ternário ad-hoc repetido 3
  vezes; `useProductForm.ts` (3 campos compostos) nunca tinha sido
  corrigido — só ficou visível agora ao escrever `useProductLaunchForm.ts`
  (`purchase_price`) e revisar o padrão de perto. Corrigido de forma
  centralizada em `parseApiError.ts` (`toCamelCaseKey`, testado em
  `tests/shared/services/parseApiError.test.ts`) — os 3 ternários ad-hoc
  removidos, todo formulário (existente e futuro) funciona sem precisar
  de nenhum remendo próprio por campo.
- Verificado em browser real contra o backend local: criar produto →
  editar → aba "Lançamentos" com as 2 tabs corretas → estado vazio
  honesto → criar lançamento (incluindo escolher "Hoje" no `DatePicker`
  dentro do `Modal`, confirmando o fix de z-index) → editar → excluir,
  ciclo completo funcionando ponta a ponta contra a API real.

## ProductForm (`modules/catalog/components/ProductForm.vue`) — rename `operationalCost` → `shippingCost`

**Mudança de contrato do backend, 2026-09-08, aviso cross-session da
sessão de backend `ticket-message-image-attachments`** —
`PRODUCT.operational_cost` foi renomeado pra `PRODUCT.shipping_cost`
("Custos de envio"), mesmo valor/comportamento, só o nome mudou.
Necessário porque `USER_MARKETPLACE.operational_cost_percentage` (novo,
ver `ConnectMarketplaceModal` abaixo) criou um SEGUNDO conceito também
chamado "custo operacional" (percentual da conexão, não fixo em R$ do
produto) — colisão de nome resolvida no lado do backend renomeando o
campo mais antigo.

- **Diferente da rodada anterior (2026-09-04, só o LABEL mudou pra
  "Custos de envio", campo interno `operationalCost` ficou intacto por
  pedido explícito do usuário)** — desta vez é um rename real de
  contrato, então o campo interno muda ponta a ponta: `product.type.ts`
  (`Product.shippingCost`), `productFormSchema.ts`
  (`ProductFormValues.shippingCost`), `useProductForm.ts`
  (`toFormValues`/`toRequestPayload`), `ProductForm.vue`
  (`shippingCostInput`, `fieldError('shippingCost')`). Chaves i18n
  correspondentes renomeadas (`fields.shippingCost`,
  `shippingCostTooltip`, `errors.shippingCostMin`) — o TEXTO visível
  ("Custos de envio", mesmo tooltip de embalagem/etiqueta/combustível)
  não muda, só a chave interna.
- **Efeito colateral no breakdown de precificação** (ver adendo na
  seção `ProductMarketplacePricingView` abaixo) — a chave
  `pricing.*_breakdown.operationalCost` (que antes carregava o valor
  deste campo) passou a significar OUTRA coisa (o percentual novo da
  conexão). O valor deste campo agora mora em
  `pricing.*_breakdown.shippingCost`.
- Verificado em browser real contra o backend local: label "Custos de
  envio" + tooltip inalterados no formulário de criação, `POST
  /products` manda `shipping_cost` (não mais `operational_cost`),
  resposta grava e devolve `shipping_cost: "4.75"` corretamente.

## ProductsView (`modules/catalog/views/ProductsView.vue`) — atalho "Ver precificação"

**Pedido direto do usuário, 2026-09-04** — a listagem de produtos não
tinha nenhum caminho pra chegar na tela de precificação
(`ProductMarketplacePricingView.vue`), só alcançável até então pelo
card de um marketplace específico já conectado
(`MarketplacesView.vue`). Botão novo `variant="outline"` +
`icon-before="ChartBar"` (mesmo ícone já usado no toggle barra/tabela
daquela tela) ao lado do `<h1>`, num header novo
(`.products-view__header`, `display:flex; justify-content:space-between`).

- **Problema real de navegação, não só estético**: a rota de destino
  (`marketplace-pricing`) é por CONEXÃO (`userMarketplaceId` na URL) —
  a listagem de produtos não sabe de nenhuma conexão específica ("como
  vamos chegar aqui sem mktplace, vai ter que pegar a primeira conexão
  ativa", pedido literal do usuário). Resolvido com
  `useFirstActiveMarketplaceConnection` (novo, `core/composables/`) —
  busca `GET /user-marketplaces?filter[active]=true&per_page=1` e usa o
  primeiro resultado.
- **Por que mora em `core/`, não em `modules/catalog/`**: a
  regra de fronteira de módulo (`docs/infra/convencoes-frontend-infra.md`
  seção 2) proíbe `modules/catalog` importar de `modules/pricing`
  diretamente — mas `core/` importando de `modules/pricing/services/`
  já é padrão estabelecido (`useAdminUserOptions.ts`, mesmo critério:
  "core→módulo é permitido, só módulo→módulo é proibido"). Segue
  exatamente essa receita: a busca (`listUserMarketplaces`) continua
  morando no `pricingApi.ts` de sempre, só a ORQUESTRAÇÃO cross-módulo
  sobe pra `core/`.
- **`firstActiveConnectionId` extraído como função pura, testada**
  (`tests/core/composables/useFirstActiveMarketplaceConnection.test.ts`)
  — mesmo critério de `isMarketplaceLimitReached` (`useMarketplaceLimit.ts`):
  a lógica de decisão ("primeira conexão da lista, ou `null` se
  vazia") fica isolada e testável sem precisar mockar a chamada HTTP; o
  composable em volta (`ref`/`load()`) é só encanamento, sem teste
  próprio (mesmo critério de "wrapper fino" já usado em `useToast.ts`).
- **Botão desabilitado, nunca escondido, enquanto não há conexão
  ativa** (`firstActiveConnection.isLoading.value ||
  !firstActiveConnection.connectionId.value`) — mesma checagem
  PROATIVA já usada em `planLimit.isLimitReached` (`ListToolbar`,
  `addDisabled`): nunca um clique que não leva a lugar nenhum. Como um
  botão `disabled` não dispara hover/tooltip de forma confiável em
  todo browser, a explicação (`pricingShortcutUnavailable`, "Conecte um
  marketplace antes de ver a precificação.") vira um parágrafo comum
  abaixo do header (mesmo estilo `.products-view__plan-limit` já usado
  pro aviso de limite de plano), não um `Tooltip` sobre o botão.
- Verificado (typecheck/lint/suíte completa — 379 testes, sem
  regressão — e build de produção), mesma limitação de navegador real
  desta sessão. Round-trip real (clicar o botão, cair na conexão certa,
  e o caso de conta sem nenhuma conexão ativa mostrando o aviso em vez
  do botão quebrado) fica pendente do usuário.

## AdminMarketplacesView (`modules/pricing/views/AdminMarketplacesView.vue`)

Primeira tela ADMIN do projeto (Fase 4, 2026-08-31) — mesma forma visual
exata de `ProductsView.vue` (Catalog), sem nenhum componente novo:
`DataTable`+`PaginationNav`+`Drawer`, `TabBar` dentro do Drawer de edição
pra "Regras de comissão" (`AdminPricingRuleList.vue`, dentro de um
`Modal`, mesmo padrão de "Lançamentos"). Coluna "Status" usa `StatusDot`
(`green`/`gray`) pro `active` do marketplace — não `Badge`, mesmo
critério já registrado na seção StatusDot (ponto colorido, não pill, pra
esse tipo de indicador binário simples).

**Correção de escopo de rota, 2026-08-31, pedida direto pelo usuário**:
"admin deve ver a tela de link do produto e mktplace" — `pricing.routes.ts`
tinha `meta.roles: ['user']` nesta rota E em `product-marketplaces`, e
`navigation.ts` tinha o mesmo `roles: ['user']` no grupo "Marketplaces" da
sidebar — herdado do momento em que a Fase 4 nasceu como feature só do
vendedor comum, sem motivo de negócio real pra bloquear `admin_master`
(que já é isento do guard de assinatura ativa no backend). Removido dos 3
lugares. Coluna "Nome" também ganhou `MarketplaceLogo` (ver seção própria
abaixo) no mesmo dia.

## AdminMarketplaceForm (`modules/pricing/components/AdminMarketplaceForm.vue`)

**Primeiro upload de arquivo do projeto** — mudança de contrato pedida
pelo usuário em 2026-08-31 ("não podemos ficar dependendo de links
externos"): a 1ª rodada dos campos de marketplace tinha `logo_url` como
texto colado; nesta 2ª rodada o backend trocou o campo de ENTRADA pra
`logo_base64` (a resposta continua `logo_url`, agora sempre um link do
próprio storage). Sem componente `FileInput` no design system ainda
(nenhum outro form do projeto precisou de upload até aqui) — resolvido
com um `<input type="file">` NATIVO, visualmente escondido (técnica
padrão de "visually hidden", não `display:none` — teria tirado do fluxo
de tab/foco de teclado) e disparado por um `Button` normal
(`fileInputRef.click()`), convertido pra `data:` URI via `FileReader`
antes de entrar em `values.logoBase64`.

- **Preview de 3 estados**: arquivo recém-escolhido (`values.logoBase64`)
  → `logo_url` já existente, se estiver editando e nenhum arquivo novo
  foi escolhido ainda → `IconTile`/`Storefront` de fallback (mesmo
  fallback visual de `MarketplacesView.vue`, quando não há nenhum dos
  dois). Um `computed` simples resolve a prioridade.
- **`logo_base64` só entra no payload quando o admin escolhe um arquivo
  novo** — omitido (nunca mandado como `null`) em qualquer edição que
  não mexeu nisso, pra não implicitamente "limpar" o logo em todo PATCH
  de rotina. Mesmo padrão já usado pra senha opcional em
  `useUpdateProfileForm.ts` (Identity) — `...(values.logoBase64 ? {...}
  : {})`.
- `accept="image/png,image/jpeg,image/webp,image/svg+xml"` no input —
  restringe o tipo de arquivo antes mesmo de chegar no form; validação
  de verdade (tamanho, se é imagem de fato) é do backend.
- Verificado em browser real com upload de arquivo de verdade
  (`page.setInputFiles`, Playwright): preview aparece imediatamente após
  escolher o arquivo, submit grava no backend, `logo_url` resultante
  aponta pro storage do próprio backend (`/storage/marketplaces/logos/<uuid>.<ext>`),
  card em `MarketplacesView.vue` exibe a imagem real servida.

**Toggle "Em breve", 2026-09-02 (tarefa 66 de
`docs/api/ordem-de-implementacao.md` no repo `backend`)** — 2º `Toggle`,
logo abaixo de "Marketplace ativo" (`values.comingSoon`, default
`false`). Ortogonal a `active` de propósito, mesmo raciocínio do backend
— um marketplace "em breve" continua listado em `GET /marketplaces`
(`MarketplacesView.vue`), só não pode ser conectado ainda
(`errorMessageMarketplaceComingSoon`).

**PF/PJ por marketplace, 2026-09-04 — aviso cross-session da sessão de
backend (tarefas 86-89 de `docs/api/ordem-de-implementacao.md`, repo
`backend`)**: `MARKETPLACE` ganhou `requires_store_document_type`
(boolean, liga a exigência de PF/PJ na hora de conectar — ver
`ConnectMarketplaceModal`, seção abaixo) e `individual_fixed_fee`
("taxa fixa para PF", string R$ nullable, só na visão admin, ainda sem
uso em nenhum cálculo de precificação). 3º `Toggle` (`requiresStoreDocumentType`)
logo abaixo de "Em breve" + `FormGroup`/`Input` numérico
(`individualFixedFee`, `useNumberFieldModel` nullable, mesmo padrão de
`couponValue` em `ConnectMarketplaceModal`) com `labelTooltip`
explicando que ainda não entra no cálculo — mesma disciplina de
transparência já usada nos outros campos "só armazenado nesta rodada"
do design system (`ads_percentage` antes de 2026-09-03, `operational_cost`,
etc.).

## MarketplaceLogo (`modules/pricing/components/MarketplaceLogo.vue`)

**Extraído em 2026-08-31**, pedido direto do usuário ("adicione os logos
a todas as listagens de mktplace") — o markup ícone-ou-imagem que já
existia solto dentro de `MarketplacesView.vue` (fallback `IconTile`/
`Storefront` em `@error`) virou componente próprio no momento em que um
2º e 3º consumidor real precisaram do mesmo comportamento
(`AdminMarketplacesView.vue`, `ProductMarketplacesView.vue`) — mesmo
critério de promoção já usado no resto do projeto (só sobe/vira
componente quando um consumidor adicional de verdade aparece).

- Só 2 props (`logoUrl`, `name` pro `alt`) + `size` opcional (default 24,
  usado em 24px nas duas tabelas e 48px no card grid) — sem decisão de
  negócio, só "mostra a imagem ou o fallback".
- Estado de falha (`hasFailed`) é local ao componente (`ref` interno),
  não mais um `Set` de ids mantido pela view como na primeira versão
  dentro de `MarketplacesView.vue` — cada instância cuida do próprio
  estado de erro, sem precisar de uma chave externa.
- Reaproveitado com `IconText.vue` nas duas tabelas (`AdminMarketplacesView`/
  `ProductMarketplacesView`, célula `#cell-name`/`#cell-marketplaceName`)
  — mesmo padrão "ícone/imagem + texto" já documentado na seção IconText.
- **Escopo explicitamente NÃO estendido ao `Select` de "vincular
  marketplace"** (`ProductMarketplacesView.vue`, modal de vínculo) — é
  texto puro do Reka UI sem suporte a conteúdo rico por opção; adaptar um
  átomo compartilhado pra um único consumidor contrariaria a régua de
  promoção ao contrário (desceria complexidade pro genérico por causa de
  1 caso). Revisitável se pedido explicitamente.
- Verificado em browser real contra o backend de verdade: 2 marketplaces
  reais renderizando `<img>` (não fallback) no grid, na tabela admin e na
  tabela de vínculo produto↔marketplace, todas as 3 telas juntas.

## MarketplacesView (`modules/pricing/views/MarketplacesView.vue`)

**Grid de cards, pedido direto do usuário com referência visual real de
outro produto** (captura: ícone + nome + toggle + botão "Connect", tags/
badges e link externo que não existem no domínio da Orbita, descartados).
Primeiro uso de `IconTile.vue` FORA de tile-pequeno-ao-lado-de-texto
(célula de tabela, `NotificationItem`) — aqui como elemento PRINCIPAL do
card (`size=48`, `icon-size=24`, ícone `Storefront` fixo pra todo card,
sem distinção por marketplace — não existe campo de logo/cor em
`MARKETPLACE`, inventar uma distinção visual sem dado real seria
fabricar conteúdo). Cartão: `{colors.bg-1}` + borda `{colors.ink-10}` +
`{radius.16}` — mesma receita de "seção com borda" já usada em
`AccountView.vue`/`MySubscriptionView.vue`, aplicada num grid
(`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`) em vez
de empilhada verticalmente.

`Toggle.vue` (variante solta, não "boxed") — liga/desliga `active` de
uma conexão já existente, `disabled` quando o marketplace ainda não foi
conectado (não existe "meio-termo" pra `active` sem uma conexão criada
primeiro). Estado desabilitado do `Toggle` já herda o tratamento visual
do próprio componente, sem CSS extra aqui.

**Correção pixel-perfect, 2026-08-31, reportada pelo usuário comparando
lado a lado com a captura de referência** — a v1 tinha 2 erros estruturais
reais, não só estéticos: (1) `Toggle` morava no CABEÇALHO do card, ao
lado do `IconTile`; a referência mostra o toggle na mesma LINHA do botão
"Connect", rodapé do card, não no topo. (2) botão de conectar era
`variant="primary"` (preto sólido, sem ícone); a referência mostra
`outline` com um ícone de "trocar/sincronizar" antes do texto. Os dois
corrigidos: `Toggle` movido pro rodapé (`.marketplaces-view__card-footer`,
`justify-content: space-between` — ações à esquerda, toggle à direita,
`margin-top: auto` no footer pra alinhar a base de todos os cards mesmo
quando um tem `card-subtitle` — nome da loja — e outro não), botão
"Conectar"/"Gerenciar" trocado pra `variant="outline"` +
`icon-before="ArrowsDownUp"` (mesmo ícone já usado em `ListToolbar.vue`
pro botão "Ordenar" — par de setas verticais, o mais próximo do "⇅" da
referência no conjunto de ícones gerado). Reconfirmado em browser real
(screenshot lado a lado): estrutura ícone→título→[subtítulo]→rodapé
(botão+toggle) bate com a referência nos dois estados (conectado/não
conectado), rodapé alinhado na mesma altura nos dois cards.

**Gap fechado, mesmo dia, em duas rodadas** — backend implementou os 4
campos pedidos acima (`logo_url`/`description`/`tags`/`website_url`,
nullable, em `MarketplaceResource`/`AdminMarketplaceResource`).
Atualizado aqui: cabeçalho do card ganhou `<img>` de verdade quando
`logoUrl` existe (`IconTile`/`Storefront` continua sendo o fallback
quando não há logo, ou quando a imagem falha ao carregar — `@error` no
`<img>` marca o id como "falhou" e troca pro fallback, defesa contra URL
morta que o cadastro não teria como validar sozinho) + link externo
(`hostnameOf()`, só o domínio via `URL().hostname`, mesmo formato
"webflow.com" da referência — ícone `ArrowSquareOut`), descrição (parágrafo
simples abaixo do título) e tags (`Badge` `variant="gray"`, um por tag).

**Segunda rodada, mesmo dia — `logo_url` deixou de aceitar link
externo.** Pedido direto do usuário depois da 1ª entrega ("não podemos
ficar dependendo de links externos"): o CAMPO DE ENTRADA virou
`logo_base64` (upload real, `AdminMarketplaceForm.vue` — ver seção
própria abaixo), mas o campo de LEITURA continua `logo_url` — agora
sempre um link do próprio storage do backend, nunca mais externo. Zero
mudança nesta view: ela só lê `card.marketplace.logoUrl` pra exibir,
nunca soube ou precisou saber de onde a imagem veio.

**Tarja "Em breve" + botão de conectar desabilitado, 2026-09-02 (tarefa
66)** — pedido direto do usuário: "quando `coming_soon: true`, mostrar a
flag/badge 'em breve' no card... e desabilitar o botão de conectar antes
mesmo do usuário tentar (o backend já bloqueia, mas fica melhor pro
usuário ver isso de cara)". Botão "Conectar" ganha
`card.marketplace.comingSoon` na mesma expressão `:disabled` que já
cobria o limite de plano (`marketplaceLimit.isLimitReached.value`) —
front barra ANTES de tentar, defesa client-side pura, o backend continua
sendo a fonte de verdade real (`errorMessageMarketplaceComingSoon`, 422,
se alguém contornar).

**Revisão pixel-perfect no mesmo dia, pedido direto do usuário com
screenshot** ("coloque uma tarja mais bonita... assim parece só uma tag
do canal") — a 1ª versão usava `Badge` `variant="gray"` ao lado do nome
(`.marketplaces-view__card-title-row`, wrapper flex novo só pra isso),
mesmo tom cinza das tags de categoria logo abaixo — o usuário apontou
que ficava indistinguível delas, lendo como "mais uma tag" em vez de um
aviso de estado do card. Substituído por uma TARJA de verdade
(`.marketplaces-view__card-ribbon`, `<div>` novo, condicional, sempre o
PRIMEIRO filho do card) — faixa horizontal sangrando até as 3 bordas
(margem negativa igual ao padding do card, mesma técnica já usada em
preview de upload de logo), cortada de volta pro `{radius.16}` do
próprio card via `overflow: hidden` no `.marketplaces-view__card`
(`position: relative` adicionado junto). Fundo tingido com
`color-mix(in srgb, {colors.accent-yellow} 20%, transparent)` + texto na
cor sólida do mesmo acento — mesma técnica de `StatusDot`
`variant="pill"` (nunca reimplementada à mão, só o princípio
reaproveitado, já que aqui é uma faixa cheia, não uma cápsula) — mantém
a mesma linguagem de "acento pastel, nunca decorativo" do resto do
design system, evita uma cor saturada sólida competindo com o resto do
card. `.marketplaces-view__card-title-row` removido (voltou a ser
`<p>` solto). Verificado em browser real contra o backend local: card
"Amazon" marcado `coming_soon` mostra a tarja amarela clara no topo,
cantos arredondados batendo com o card, claramente diferente das tags
cinzas de categoria mais abaixo; botão "Conectar" continua desabilitado.

**Bug real de overflow no rodapé do card conectado, reportado pelo
usuário em 2026-09-03 com screenshot** ("veja como ficou bugado na
lista de canais de venda") — o botão "Ver precificação"
(`ProductMarketplacePricingView.vue`, mesmo dia) foi adicionado como
3º botão de TEXTO em `.marketplaces-view__card-actions`
("Gerenciar"/"Ver precificação"/"Excluir", todos com ícone+label,
`display:flex` sem `flex-wrap`) — 3 botões de texto nunca cabiam na
largura de um card do grid (`minmax(260px, 1fr)`), o terceiro
("Excluir") estourava a borda direita do card, cortado visualmente
exatamente como a captura mostrou. **Corrigido convertendo os 2 botões
SECUNDÁRIOS ("Ver precificação"/"Excluir") pra ícone-only** (`Button`
sem conteúdo no slot default vira a variante "Icon Only" do próprio
componente, seção Button acima) — `aria-label` no lugar do texto
visível (`pricing.marketplaces.pricingButton`/`common.actions.delete`,
mesmas chaves já existentes, só reaproveitadas como rótulo acessível
em vez de texto). "Gerenciar" continua com texto — é a ação primária do
card, mesmo critério de hierarquia visual já usado noutros lugares do
design system (ação principal com texto, secundárias ícone-only —
mesmo padrão das colunas de ação do `DataTable`). `flex-wrap: wrap`
também adicionado em `.marketplaces-view__card-actions` como defesa
extra pra qualquer card ainda mais estreito no futuro. Verificado em
browser real, `getBoundingClientRect()` nos 7 cards do grid (3
desconectados, 1 conectado real): `actionsRight` sempre menor que
`cardRight` em todos, nenhum overflow; card conectado renderiza
"Gerenciar" (texto) + ícone de gráfico + ícone de lixeira + `Toggle`,
tudo dentro da borda do card.

## ConnectMarketplaceModal (`modules/pricing/components/blocks/ConnectMarketplaceModal.vue`)

**3 percentuais informativos por canal, 2026-09-02 (tarefa 65 de
`docs/api/ordem-de-implementacao.md` no repo `backend`)** —
`adsPercentage`/`campaignDiscountPercentage`/`affiliatePercentage`
(todos nullable, editáveis no CREATE e no UPDATE) adicionados ao mesmo
modal de conectar/editar conexão, cada um com `FormGroup`'s
`labelTooltip` (seção FormGroup, extraído originalmente pro pedido de
`ProductForm.vue`) explicando o que representa — mesmo pedido direto do
usuário ("adicionar tooltip nos 3 campos novos... explicando o que cada
um significa").

- **Achado real de layout**: até então o modal só tinha 1 `FormGroup`
  (`storeName`) direto no slot default — `.ui-modal-body` não tem
  `gap`/`flex-column` próprio (só um `<div>` normal), então 4
  `FormGroup` empilhados ficariam colados sem respiro nenhum entre si.
  Corrigido envolvendo os 4 num wrapper local
  (`.connect-marketplace-modal__fields`, `display:flex;
  flex-direction:column; gap:{spacing.16}`) — mesma técnica já usada em
  `AdminCategoryMarketplaceForm.vue`/`ProductForm.vue` pra esse mesmo
  problema.
- `useNumberFieldModel(values, <campo>, { nullable: true })` pros 3 —
  mesmo padrão já usado em `PRODUCT.weight`/`height`/`width`/`length`
  (campo numérico opcional, string vazia vira `null`, nunca `0`).
- **`update()` (`useUserMarketplaceForm.ts`) passou a mandar os 3 campos
  no PATCH** (antes só mandava `store_name`) — `marketplace_id` continua
  de fora do payload de update de propósito (`UpdateUserMarketplaceRequest`
  real do backend nem aceita esse campo, não dá pra trocar o marketplace
  de uma conexão já existente).
- Verificado em browser real contra o backend local: conectar um
  marketplace preenchendo os 3 campos grava os valores corretos
  (conferido no banco, `8.50`/`12.00`/`3.00`); reabrir a mesma conexão
  em modo edição mostra os valores prefilidos; editar e salvar
  (`20` no campo de ads) atualiza corretamente; hover no ícone de
  tooltip mostra o texto explicativo certo pros 3 campos.

**4º campo, `couponValue` (valor FIXO em R$, não percentual), 2026-09-04
— achado via consulta ao OpenAPI, não pedido de UI isolado**: o usuário
avisou que o backend adicionou `USER_MARKETPLACE.coupon_value` e pediu
pra (1) incluir no formulário desta modal e (2) verificar se já entra no
motor de precificação antes de decidir se cabia também na tela de
precificação. `npm run generate:api-types` confirmou os dois: o campo
está em `CreateUserMarketplaceRequest`/`UpdateUserMarketplaceRequest`/
`UserMarketplaceResource`, E um `coupon: string` novo apareceu nos dois
breakdowns (`suggested_breakdown`/`practiced_breakdown`) de
`ProductMarketplacePricingResource` — conferido também direto no código
do backend (`ProductMarketplacePricingCalculator::rawProfitAt`, `git
diff` do repo `backend`): `couponValue` é subtraído FIXO do lucro (nunca
multiplicado pelo preço, ao contrário de `ads`/`affiliate`/`commission`
— mesmo padrão de `fixedFee`/`costPrice`/`operationalCost`), então
realmente precisava virar 8ª parcela do breakdown, não só um campo
armazenado sem uso (ver `ProductMarketplacePricingView`, seção abaixo,
pro lado da precificação).

- 5º `FormGroup` no mesmo wrapper `.connect-marketplace-modal__fields`
  (tooltip explicando que é valor fixo, deduzido do lucro — diferente
  dos 3 percentuais). `useNumberFieldModel` reaproveitado igual aos
  outros — o átomo já é genérico o bastante pra dinheiro, não só
  percentual.
- **Sem `max` no Zod** (`userMarketplaceFormSchema.ts`), só `min(0)` —
  mesma regra de `practiced_price`
  (`useUpdatePracticedPriceForm.ts`/`UpdatePracticedPriceModal.vue`):
  não faz sentido limitar um valor em R$ a 100, diferente dos 3
  percentuais que continuam com `max(100)`.
- **Achado real, ao regenerar `schema.d.ts`**: o backend local (mesma
  instância Docker) estava com as rotas `POST /auth/register` e
  `GET|DELETE /auth/me/sso-accounts` temporariamente COMENTADAS em
  `routes/api/v1/identity.php` (estado de trabalho de outra sessão,
  confirmado via `git diff` no repo `backend`, não um bug de cache —
  `route:clear`/`config:clear` não mudou nada) — a regeneração completa
  teria apagado `RegisterUserRequest`/`SsoAccountResource` do schema e
  quebrado `identityApi.ts`/`ssoAccount.type.ts` (confirmado via
  `vue-tsc`, 3 erros `TS2339`). Corrigido revertendo `schema.d.ts` pro
  commit e aplicando só os 5 trechos novos de `coupon_value`/`coupon` à
  mão (conferidos contra o JSON puro do `/docs/api.json`, não
  inventados) — nunca confiar cegamente numa regeneração completa
  quando o backend local pode estar num estado intermediário de
  trabalho de outra sessão; `git diff --stat` do arquivo gerado é o jeito
  barato de notar uma regressão dessas antes de seguir em frente.
- Verificado (typecheck/lint/testes/build, sem regressão — 363 testes)
  contra a mesma limitação de navegador real já registrada nesta sessão
  (Playwright sem `libnspr4.so`/`libnss3.so` no ambiente, sem acesso
  root pra instalar) — round-trip real em UI (conectar com cupom
  preenchido → ver refletido na barra de precificação) fica pendente de
  confirmação manual do usuário.

**6º campo, `storeDocumentType` (PF/PJ), 2026-09-04 — aviso cross-session
da sessão de backend `shopee-pricing-calculator`** (tarefas 86-89 de
`docs/api/ordem-de-implementacao.md`, repo `backend`): `MARKETPLACE`
ganhou `requires_store_document_type` — quando `true` pro marketplace da
conexão, `POST /user-marketplaces` passa a EXIGIR `store_document_type`
(`'individual' | 'company'`, `422 errorMessageStoreDocumentTypeRequired`
se ausente). Único dos 6 campos desta modal condicionalmente
obrigatório — todos os outros (percentuais, cupom) são sempre opcionais.

- **Campo só aparece quando o marketplace exige**
  (`v-if="marketplaceRequiresStoreDocumentType"`, nova prop boolean —
  `MarketplacesView.vue` repassa `activeCard.marketplace.requiresStoreDocumentType`)
  — mesma disciplina de "nunca pedir informação irrelevante" já usada em
  `ProductMarketplacesView.vue` (seletor de categoria só aparece se o
  marketplace tem `CATEGORY_MARKETPLACE` configurado).
- **`Select.vue`, não `Input.vue`** — só 2 valores reais possíveis
  (`individual`/`company`), rotulados "Pessoa física (PF)"/"Pessoa
  jurídica (PJ)". Mesmo padrão de string-vazia-como-"não escolhido" já
  usado em `categoryId` (`ProductMarketplacesView.vue`) — `Select.vue`
  não aceita `null` no `v-model`, e `''` como valor de MODELO (não de
  OPÇÃO) já é tratado como placeholder pela própria Reka UI por baixo,
  sem precisar de sentinel tipo `'all'` (esse sentinel só é necessário
  quando `''` precisaria ser uma OPÇÃO de verdade na lista, o que não é
  o caso aqui).
- **Obrigatoriedade condicional resolvida com uma função, não um
  boolean fixo, no schema Zod** (`createUserMarketplaceFormSchema(t,
  isStoreDocumentTypeRequired)`, novo 2º parâmetro) — achado de design
  real: `useUserMarketplaceForm()` (e portanto o schema que ele cria) é
  instanciado UMA VEZ só e reaproveitado pro grid INTEIRO de cards
  (`MarketplacesView.vue`, já documentado acima) — cada abertura do
  modal pode ser um marketplace DIFERENTE, com exigência diferente. Um
  boolean fixo capturado na criação do schema ficaria preso ao
  marketplace de quando o composable foi criado (o PRIMEIRO card
  aberto), errado pra qualquer card seguinte. A função
  (`() => props.marketplaceRequiresStoreDocumentType`) é reavaliada
  DENTRO do `.superRefine()` a cada `.safeParse()` — sempre lê o valor
  mais recente da prop reativa, correto pro card ativo no momento do
  submit.
- `useUserMarketplaceForm()` ganhou o mesmo parâmetro
  (`isStoreDocumentTypeRequired: () => boolean`) — repassado direto pro
  schema, sem lógica própria adicional no composable.
- Verificado (typecheck/lint/suíte completa — 370 testes, incluindo 3
  testes novos exercitando as 3 combinações de obrigatoriedade — e build
  de produção). Round-trip real em UI (conectar um marketplace PF/PJ,
  confirmar o `422` sem o campo e o sucesso com ele) fica pendente da
  mesma limitação de navegador real já registrada nesta sessão.

**`operationalCostPercentage` — NÃO entrou nesta modal, 2026-09-08.**
Primeira versão do dia (aviso cross-session da sessão de backend
`ticket-message-image-attachments`) tentava um 7º campo aqui
(`USER_MARKETPLACE.operational_cost_percentage`, percentual POR
CONEXÃO) — implementado, verificado, e só então descoberto (testando em
browser real) que o backend quebrava com `500`
(`SQLSTATE[42703]: Undefined column "operational_cost_percentage" of
relation "user_marketplaces"`). Reportado à sessão de backend via
mensagem cross-session; a resposta corrigiu a premissa por completo — o
usuário já tinha corrigido o backend direto: o campo sempre devia ter
sido **`COMPANY.operationalCostPercentage`** (um valor só pra empresa
INTEIRA, mesmo tratamento de `sales_tax_percentage`, não varia por
canal/conexão), não `USER_MARKETPLACE`. A 1ª mensagem cross-session
estava errada; pegamos o timing exato da correção acontecendo do lado
de lá. Revertido por completo desta modal (`ConnectMarketplaceModal.vue`,
`useUserMarketplaceForm.ts`, `userMarketplaceFormSchema.ts`,
`userMarketplace.type.ts`, `schema.d.ts`) — implementado do jeito certo
em `CompanyForm.vue`, ver `billing-and-identity.md`. No breakdown de
precificação, a chave `pricing.*_breakdown.operational_cost` continua
existindo normalmente (ver adendo logo abaixo) — só a FONTE do dado
mudou (`COMPANY`, não `USER_MARKETPLACE`), o contrato de resposta do
breakdown em si nunca mudou.

## ProductMarketplacePricingView (`modules/pricing/views/ProductMarketplacePricingView.vue`) — adendo `coupon`

**Mesmo pedido/achado de 2026-09-04 acima** — `coupon` virou a 8ª parcela
do breakdown (`SEGMENT_KEYS`/`PricingBreakdown`, `pricingBreakdown.ts`/
`productMarketplacePricing.type.ts`), entre `affiliate` e `profit` na
ordem visual (mesma posição que `affiliate` ocupou quando entrou em
2026-09-03 — cada dedução nova nasce logo antes do lucro, nunca no meio
das parcelas de custo/comissão). Cor da barra continua a mesma rampa
sequencial (`color-mix` de `$color-accent-red` cada vez mais perto de
`$color-ink`, convergindo pro verde de `profit`) — `coupon` ganhou
`color-mix(in srgb, $color-accent-red 8%, $color-ink)`, o degrau mais
próximo de `$color-ink` antes do `profit`. Chave nova
`pricing.productMarketplacePricing.segments.coupon` ("Cupom") no
catálogo, mesma disciplina i18n de sempre.

Sem mudança nenhuma de estrutura da tela (barra, tabela, KPIs, abas) —
`SEGMENT_KEYS` já era iterado dinamicamente pelo template (legenda,
barra, colunas da tabela), então adicionar uma chave no array bastou pra
propagar pros 3 lugares sem tocar template. `PricingDashboardMockupView.vue`
(rascunho 100% mockado, sem API) não foi tocado — não representa mais
dado real desde que a tela de verdade existe, documentado como tal desde
a criação dela.

**Adendo `percentage_of_total`, mesmo dia (2026-09-04)** — pedido direto
do usuário, consultando o OpenAPI de novo: cada parcela do breakdown
(`suggested_breakdown`/`practiced_breakdown`) ganhou um objeto irmão
`percentage_of_total` com a mesma % que cada uma representa sobre o
preço de venda total — o backend já calcula isso a partir dos MESMOS
valores arredondados exibidos (`ProductMarketplacePricingCalculator::percentageOf`,
confirmado lendo o código do repo `backend`), não uma segunda fonte de
verdade.

- **`buildPriceSegments` (`pricingBreakdown.ts`) parou de dividir
  `value ÷ price` no cliente** — passou a usar
  `breakdown.percentageOfTotal[key]` direto pra `widthPercent`
  (clampado a `≥ 0`, mesmo motivo de antes: lucro negativo não pode virar
  `flex-basis` negativo) e um novo campo `percent` (string CRUA, sem
  clamp — mostra a % negativa de verdade quando é o caso). Único source
  of truth agora: a largura visual da barra e o texto do rótulo vêm do
  MESMO número, nunca dois cálculos ligeiramente diferentes pra mesma
  coisa (achado teórico, não um bug visto — mas evitado de propósito).
  `price` saiu da assinatura da função (não sobrava uso pra ele).
- **Pedido inicial ("veja uma forma agradável") foi corrigido em tempo
  real pelo usuário**: a 1ª tentativa desta sessão pôs a % só no
  `Tooltip` de cada segmento (mesmo texto de sempre + `(X%)`) — o
  usuário interrompeu: **"exiba a porcentagem na barra, não no
  tooltip"**. Revertido o tooltip pro texto original (só `label: R$
  valor`) e implementado um rótulo **dentro** do próprio segmento
  colorido.
- **Rótulo como pill de contraste FIXO, não texto solto**: a rampa de
  cor dos segmentos mistura vários deles com `$color-ink` puro
  (`tax`/`ads`/`affiliate`/`coupon`) — esse token FLIPA de preto pra
  branco no tema escuro (ver seção Colors), então o PRÓPRIO SEGMENTO
  troca de "quase preto" pra "quase branco" só de mudar de tema (ex.:
  `affiliate` é 80% ink — em modo claro fica quase preto, em modo escuro
  quase branco). Um texto de cor fixa (`$color-ink`/`$color-paper`
  comuns, ou até uma cor calculada por segmento) ficaria ilegível contra
  pelo menos um dos dois temas em pelo menos um desses segmentos —
  **não verificável neste ambiente** (mesma limitação de Playwright sem
  `libnspr4.so`/`libnss3.so`, sem navegador real disponível pra medir
  contraste de verdade). Resolvido com uma técnica que não depende de
  saber a cor por baixo: pill com fundo `color-mix(in srgb,
  $color-ink-fixed 55%, transparent)` (preto translúcido, SEMPRE — não
  flipa) + texto `$color-paper-fixed` (branco, SEMPRE) — mesmos tokens
  "-fixed" já usados pro toast/`IconTile`/`StatCard` quando o fundo por
  trás não acompanha o tema. Mesma ideia de rótulo sobre foto/gradiente
  em mapas e gráficos — o pill garante o próprio contraste, não depende
  do que está por baixo.
- **Limite mínimo de largura pra mostrar o rótulo, revertido no mesmo
  dia — reportado pelo usuário com screenshot real**: a 1ª versão só
  renderizava o pill pra `widthPercent >= 6` (constante
  `MIN_SEGMENT_PERCENT_LABEL_WIDTH`), escondendo o rótulo das parcelas
  menores (`fixedFee`/`operationalCost`/`ads`/`affiliate`/`coupon`,
  cada uma tipicamente 1-4% do preço nos dados reais) — exatamente o que
  o usuário reportou como problema: "só não retornou pra fixo,
  operacional, ads, afiliado, cupom". Removido o limite por completo —
  **todo** segmento agora sempre renderiza o pill, sem exceção; risco
  aceito de pills adjacentes colidirem visualmente em fatias muito
  estreitas (não visto/medido, verificação de navegador real bloqueada
  no ambiente desta sessão) em troca de nunca esconder informação que o
  usuário pediu explicitamente pra ver em todo item.
- **Visão de tabela também ganhou a %** (não pedida explicitamente pro
  "view de barras", mas natural/sem custo — mesma resposta da API, já
  exibida como texto simples numa célula, sem risco de contraste): cada
  coluna de parcela virou `(percent%)` cinza (`$color-ink-40`, mesmo tom
  de `__suggested-hint`) ao lado do valor em R$. `PricingTableRow`
  trocou `Record<SegmentKey, string>` por `Record<SegmentKey,
  SegmentCell>` (`{ percent, value }`) pra carregar os dois pela mesma
  chave de coluna — nome de classe deliberadamente diferente do pill da
  barra (`__table-segment-percent` vs. `__segment-percent`), contextos
  visuais/réguas de contraste diferentes, mesmo nome pisaria um no
  outro.
- Verificado (typecheck/lint/suíte completa — 363 testes, sem regressão
  — e build de produção) contra a mesma limitação de navegador real já
  registrada nesta sessão. A confirmação visual do PILL sobre os 9
  segmentos, nos dois temas, é exatamente o tipo de verificação que essa
  limitação bloqueia — fica pendente de conferência manual do usuário,
  com atenção especial aos segmentos `tax`/`ads`/`affiliate`/`coupon`
  (os que misturam com `$color-ink`, o caso mais arriscado de contraste
  descrito acima).

**Adendo `individual_fixed_fee`, 2026-09-04 (tarefa 90, aviso cross-
session da sessão de backend `shopee-pricing-calculator`)** —
`MARKETPLACE.individualFixedFee` ("taxa fixa para PF", já armazenado
desde o addendum de PF/PJ em `AdminMarketplaceForm`/`ConnectMarketplaceModal`,
seções acima) passou a entrar de fato no cálculo: 10ª parcela do
breakdown, `individualFixedFee`, entre `coupon` e `profit` — mesmo
critério de "cada dedução nova nasce logo antes do lucro" já usado pras
9 anteriores. **Regra de negócio real, não capricho de UI**: o backend
só devolve esse valor diferente de `"0.00"` quando a CONEXÃO
(`UserMarketplace.storeDocumentType`) é `'individual'` (PF) — PJ ou sem
tipo definido sempre mostra `"0.00"` aqui, mesmo que o marketplace tenha
a taxa cadastrada. Efeito colateral avisado pelo backend e documentado
aqui pra não ser confundido com bug numa verificação futura: lucro/
margem sugeridos e praticados de uma mesma conexão podem mudar só por
trocar `storeDocumentType` entre PF/PJ via `PATCH /user-marketplaces/{id}`
— comportamento esperado do motor, não um erro de arredondamento.

- Cor: próximo degrau da rampa sequencial depois de `coupon` (`8%` red),
  `color-mix(in srgb, $color-accent-red 3%, $color-ink)` — o mais
  próximo de `$color-ink` puro antes do verde de `profit`.
- Chave nova `pricing.productMarketplacePricing.segments.individualFixedFee`
  ("Taxa PF") no catálogo.
- Mesma mecânica de propagação automática das duas rodadas anteriores
  (`coupon`, `percentage_of_total`) — `SEGMENT_KEYS` iterado
  dinamicamente pelo template, uma chave nova no array bastou pra
  propagar pra barra/legenda/tabela sem tocar markup.
- Teste novo (`pricingBreakdown.test.ts`) exercitando um valor real de
  `individualFixedFee` (conexão PF) como prova de que o frontend só
  EXIBE o valor vindo do backend, nunca decide sozinho se a taxa se
  aplica — essa decisão é 100% do motor de precificação.
- Verificado (typecheck/lint/suíte completa — 371 testes, sem regressão
  — e build de produção), mesma limitação de navegador real já
  registrada. Confirmação visual do décimo segmento na barra (incluindo
  o cenário real de alternar `storeDocumentType` PF↔PJ numa mesma
  conexão e ver o lucro recalcular) fica pendente do usuário.

**2 bugs visuais reais, reportados pelo usuário em 2026-09-04**:

1. **"Lucro total" (KPI) sempre verde, mesmo negativo** — o `<p>` do
   valor tinha uma classe FIXA (`__kpi-value--profit`, sempre
   `$color-accent-green`), nunca calculada a partir do sinal de
   `list.totals.value.profit`. Um total negativo (soma de vários
   produtos com prejuízo) continuava pintado de verde — o oposto do que
   a cor deveria comunicar. Corrigido trocando a classe fixa pelas
   mesmas 3 variantes de `outcomeTone` já usadas por linha
   (`--positive`/`--neutral`/`--negative`, cores idênticas às de
   `__product-margin--*`), aplicadas dinamicamente
   (`` `...--${outcomeTone(list.totals.value.profit)}` ``) — sem passar
   `meetsTargetMargin` aqui: o total é uma soma de produtos com margens-
   alvo DIFERENTES entre si, não existe uma única meta pra comparar.
2. **% do preço PRATICADO sempre verde quando há lucro, mesmo abaixo da
   `target_margin` cadastrada do produto** — `outcomeTone` (decisão de
   2026-09-03, documentada acima na própria seção) tinha sido
   simplificada pra olhar só o SINAL do lucro, abandonando de propósito
   o `meetsTargetMargin` que o backend já calcula
   (`PricingEvaluation.meetsTargetMargin`) — um preço com lucro pequeno
   mas insuficiente pra bater a margem alvo do vendedor ainda pintava
   verde, lendo como "tudo certo" quando não estava. **Correção, não
   reversão total**: `outcomeTone(profit, meetsTargetMargin?)` ganhou um
   2º parâmetro opcional — quando `meetsTargetMargin === false`, força
   `neutral` (amarelo), SEM sobrepor o vermelho de um prejuízo de
   verdade (prejuízo continua checado PRIMEIRO, é sempre pior que "só
   não bate meta"). Só se aplica ao preço PRATICADO — o SUGERIDO é
   construído pra sempre bater a meta
   (`ProductMarketplacePricingCalculator`), então nunca tem
   `meetsTargetMargin` de verdade; os 2 chamadores do sugerido (barra
   quando não há praticado, coluna "Preço sugerido" da tabela) continuam
   sem passar o 2º argumento — mesmo comportamento de antes, puro sinal
   do lucro. Efeito colateral bem-vindo: o amarelo (antes só alcançável
   num "profit === 0" quase impossível de reproduzir digitando um preço
   real, já registrado como achado anterior) agora tem um caminho real e
   comum de aparecer.
- `marginToneClass(profit, meetsTargetMargin?)` (view) repassa o 2º
  parâmetro pro `outcomeTone`. Na barra, só passa
  `row.pricing.meetsTargetMargin` quando `active.isPracticed` é `true`
  (senão `null`, mesma regra do "sugerido nunca tem essa checagem"). Na
  tabela, `PricingTableRow` ganhou o campo `meetsTargetMargin` (`boolean
  | null`, nasce/falta em conjunto com `practicedPrice`/`practicedProfit`
  — mesmo padrão já documentado pros outros 3 campos do praticado),
  passado só na célula "Preço praticado".
- 6 testes novos em `outcomeTone` (`pricingBreakdown.test.ts`) cobrindo
  as combinações reais: lucro que não bate meta (novo caso, `neutral`),
  lucro que bate meta (`positive`), prejuízo vence mesmo com
  `meetsTargetMargin: false` (`negative`), e `null`/`undefined`
  continuam caindo na regra antiga (`positive` só pelo sinal).
- Verificado (typecheck/lint/suíte completa — 375 testes, sem regressão
  — e build de produção), mesma limitação de navegador real desta
  sessão. Confirmação visual dos 2 fixes (KPI vermelho/amarelo com dado
  real de prejuízo, e a % do praticado virando amarela quando abaixo da
  margem alvo) fica pendente do usuário.

**3º bug real, mesmo dia, reportado pelo usuário: "por que não mostra
mais o preço praticado?"** — screenshot mostrando a coluna "Preço
praticado" com `—` (traço) pra TODAS as linhas, mesmo em produtos que
já tinham preço praticado gravado. Investigado direto contra o backend
local (não só suposição): rodei `ListProductMarketplacePricingAction` à
mão via `tinker` pra um `PRODUCT_MARKETPLACE` com `practiced_price`
confirmado no banco (`69.90`) e capturei o JSON real da resposta —
`pricing.practiced_profit: "5.44"` (existe), mas
`pricing.practiced_campaign_price: null`. Causa raiz encontrada no
código do backend (`ProductMarketplacePricingCalculator.php`, repo
`backend`): **não é bug do backend** — é uma decisão real, já
comentada no código ("Pedido direto do usuário, 2026-09-04 — achado
real na UI: não faz sentido sugerir 'preço a anunciar' em cima de um
preço praticado que nem bate a margem cadastrada, quanto mais um que dá
prejuízo"), que passou a mandar `practiced_campaign_price: null` de
propósito sempre que `meetsTargetMargin` é `false` — sem aviso
cross-session pra esta sessão, essa mudança de contrato só apareceu
pelo sintoma na UI.

- **O bug era só do frontend**: `hasPracticedPrice` (`tableRows`,
  `ProductMarketplacePricingView.vue`) e a condição de
  `resolveActivePricing` (`pricingBreakdown.ts`) exigiam os TRÊS campos
  não-nulos (`practicedPrice`/`practicedProfit`/`practicedCampaignPrice`)
  pra considerar "existe preço praticado" — presunção que já não era
  mais verdadeira depois da decisão acima. Qualquer produto com preço
  praticado ABAIXO da meta caía inteiro pro ramo do SUGERIDO (inclusive
  na BARRA, não só na tabela — mesma causa raiz nos dois lugares),
  escondendo um preço praticado real só porque uma 4ª informação
  (opcional por natureza) tinha ficado `null`.
- **Corrigido tirando `practicedCampaignPrice` da condição de
  presença** nos dois lugares — só `practicedPrice`/`practicedProfit`
  (que o backend sempre manda juntos, sem exceção) decidem se há preço
  praticado. `ActivePricing.campaignPrice` e `hasCampaignMarkup()`
  ganharam suporte a `null` de primeira classe — `hasCampaignMarkup`
  virou **type predicate** (`campaignPrice is string`), não `boolean`
  solto, pra deixar o `v-if` do template estreitar `string | null` pra
  `string` sozinho (sem precisar de `as string` logo depois, no
  `formatMoney()`) — mesma técnica de type guard já usada em
  `isCheckoutSkipped()` (Billing).
- **2 testes novos** cobrindo exatamente o cenário reportado:
  `resolveActivePricing` com `practicedCampaignPrice: null` mas
  `practicedPrice`/`practicedProfit` reais (deve continuar resolvendo
  pro PRATICADO, não cair pro sugerido) e `hasCampaignMarkup(null, ...)`
  (deve retornar `false`, nunca quebrar).
- Verificado (typecheck/lint/suíte completa — 377 testes, sem regressão
  — e build de produção) contra o JSON real capturado do backend local
  via `tinker` (não um dado inventado) — confirma que o cenário exato
  reportado pelo usuário agora resolve pro preço praticado. Confirmação
  visual em navegador real (a coluna "Preço praticado" voltando a
  mostrar o valor) fica pendente do usuário, mesma limitação de
  ambiente desta sessão.

**4º ajuste, mesmo dia — 2 rodadas, reportado pelo usuário**:
`affiliate`/`coupon`/`individualFixedFee` ficavam praticamente
idênticos na barra.

- **1ª tentativa (insuficiente)**: respaçar o percentual de vermelho
  misturado em `$color-ink` (`70`/`55`/`38`/`22`/`8`, era
  `70`/`45`/`20`/`8`/`3`) — o usuário reportou de novo, com screenshot,
  que continuava "praticamente a mesma cor". Causa raiz real: no modo
  claro, `$color-ink` é preto — os 3 últimos degraus convergiam pra uma
  luminância muito baixa, faixa onde o olho não distingue bem variações
  de matiz da MESMA cor (vermelho bem escuro vs. vermelho um pouco
  menos escuro ainda), não importa quantos pontos percentuais separem
  cada mistura.
- **2ª tentativa (correção de verdade)**: trocada a estratégia — em vez
  de continuar espremendo tons na rampa vermelho→preto,
  `affiliate`/`coupon`/`individualFixedFee` saíram dela e passaram a
  usar 3 acentos "frios" DISTINTOS da paleta
  (`$color-accent-purple`/`$color-accent-indigo`/`$color-accent-blue`,
  cores sólidas, sem `color-mix()`) — mesma técnica já validada no
  design system pra distinguir N categorias quando uma rampa de matiz
  único não aguenta mais (paleta categórica cíclica do `ChartCard.vue`,
  seção própria acima). `tax`/`ads` continuam na família vermelho/ink
  (sem reclamação do usuário sobre esses dois) — a barra agora lê como
  3 grupos visuais: quente (custo/comissão/fixo/operacional/imposto/
  ads) → frio (afiliado/cupom/taxa PF) → verde (lucro). Como os 3
  acentos escolhidos são "idênticos entre claro/escuro" (nunca
  misturam com `ink`, ao contrário da rampa anterior), o resultado
  também para de correr risco de flip de contraste entre temas — o
  mesmo tipo de cuidado já documentado acima na escolha do pill de %.
- Verificado (typecheck/lint/suíte completa — 379 testes, sem
  regressão — e build de produção, confirmando que os 3 tokens de cor
  resolvem sem erro no SCSS). Confirmação visual da distinção real
  entre os 3 tons (e que realmente não se parecem mais entre si, dessa
  vez) fica pendente do usuário — mesma limitação de navegador real
  desta sessão.

**5º ajuste, mesmo dia — copiar preço sugerido/a anunciar, 2 rodadas de
UX, reportado pelo usuário**: pedido inicial — "temos q permitir o
usuario copiar o preço sugerido e o preço sugerido a anunciar, e só
mandar o numero não mandar o R$ junto".

- **`formatDecimal` novo** (`shared/services/formatNumber.ts`) — mesmo
  formatador `Intl.NumberFormat('pt-BR')` de `formatMoney`, sem
  `style: 'currency'` — devolve `"75,47"`, não `"R$ 75,47"`. O vendedor
  cola direto num campo de preço do marketplace, que não aceita o
  símbolo de moeda junto. Testado (`formatNumber.test.ts`, 4 testes
  novos).
- **1ª versão (revertida)**: um `Button` ícone-only (`CopySimple`)
  separado ao lado de cada preço, um por valor copiável — o usuário
  rejeitou: "nao gostei, coloque pra copiar clicando em cima do numero
  e quando passar por cima mostrar o tooltip 'click pra copiar'".
- **2ª versão (definitiva)**: `CopyablePrice.vue`, componente novo
  (`modules/pricing/components/`, 1º do módulo Pricing — reuso interno
  de UMA tela só, 6 pontos dentro de `ProductMarketplacePricingView.vue`,
  não promovido pra `shared/` de propósito, critério de promoção só
  sobe com um SEGUNDO módulo precisando). O NÚMERO em si é o gatilho —
  `<button>` nativo resetado pra parecer texto comum (`font`/`color:
  inherit`, sem borda/fundo), envolvido num `Tooltip.vue`
  ("Clique para copiar"). Exibe `formatMoney` (com "R$", igual a
  qualquer preço da tela), copia `formatDecimal` (sem "R$") — o texto
  visível e o valor copiado são deliberadamente diferentes.
- **Escopo**: só preço SUGERIDO e "preço a anunciar" (campanha) viram
  clicáveis — nunca o preço PRATICADO (é dado do próprio vendedor,
  editável via lápis, não "algo a copiar pra colar em outro lugar").
  No preço PRINCIPAL da barra (`active.price`), só vira `CopyablePrice`
  quando `!active.isPracticed` (ou seja, quando esse número JÁ é o
  sugerido) — quando é o praticado, o sugerido continua copiável
  separadamente na dica "Sugerido: ..." logo abaixo.
- **Achado real de narrowing, TypeScript**: `hasCampaignMarkup()` é um
  type predicate (`campaignPrice is string`) — funciona pra estreitar
  `string | null` → `string` dentro do MESMO elemento/bloco de
  conteúdo onde o `v-if` está (funcionou sem cast pra `<CopyablePrice
  :value="active.campaignPrice" />`, filho do MESMO `<p v-if=...>`),
  mas NÃO estreita através de uma closure de EVENT HANDLER
  (`@click="fn(row.practicedCampaignPrice)"` num elemento SEPARADO,
  ainda que com o mesmo `v-if` repetido) — TypeScript não confia em
  narrowing de `obj.prop` através de um callback que só executa depois
  (`obj` teoricamente poderia mudar até lá). Achado descartado nesta
  versão (o botão separado que exigia isso foi removido), registrado
  aqui só como conhecimento válido pra qualquer padrão parecido no
  futuro — a solução, quando necessário, é um `as string` pontual no
  ponto de uso dentro do handler, nunca tentar forçar a narrowing a
  atravessar a closure.
- Chaves i18n mortas removidas (`copyPriceButton`/`copyCampaignPriceButton`,
  namespace real — o da `pricingDashboardMockup`, mockup separado, não
  foi tocado), nova `copyPriceTooltip` ("Clique para copiar").
- Verificado (typecheck/lint/suíte completa — 383 testes, sem
  regressão — e build de produção). Confirmação visual/funcional do
  clique-pra-copiar (tooltip aparecendo no hover, valor certo indo pro
  clipboard sem "R$") fica pendente do usuário, mesma limitação de
  navegador real desta sessão.

**6º ajuste, mesmo dia — alinhamento à direita das colunas numéricas,
reportado pelo usuário com screenshot**: as células de preço/parcela da
visão em tabela ficavam alinhadas à esquerda (default), dificultando
comparar valores entre linhas (dígitos menos significativos em posições
verticais diferentes).

- **`DataTableColumn` ganhou `align?: 'left' | 'right'`** (`shared/components/ui/types/dataTable.type.ts`)
  — opcional, default `'left'` (nenhum outro consumidor do `DataTable.vue`
  em nenhuma outra tela muda de comportamento). `DataTable.vue` aplica a
  classe condicional tanto no `<th>` quanto no `<td>` — capacidade
  GENÉRICA do bloco compartilhado, não um remendo de CSS só nesta tela
  (`DataTable` é usado por praticamente todo CRUD do projeto, a
  necessidade de coluna numérica alinhada à direita não é exclusiva
  desta tela, só a primeira a pedir).
- **`ProductMarketplacePricingView.vue`**: as 10 colunas de parcela do
  breakdown + `practicedPrice`/`suggestedPrice` ganharam
  `align: 'right'` — só `productName` continua à esquerda (texto, não
  número).
- **Achado real de CSS**: `text-align: right` no `<td>` sozinho não
  reposiciona um filho `display: flex` (`.product-marketplace-pricing-view__table-price`,
  já usada pelas células de preço) — `text-align` só afeta conteúdo
  inline/texto direto, não a distribuição de itens flex. Precisou de
  `justify-content: flex-end` explícito nessa classe também; as células
  de PARCELA (`cell-${key}`, só texto solto + `<span>` inline, sem
  wrapper flex) já respeitavam o `text-align` do `<td>` sem ajuste
  extra.
- Verificado (typecheck/lint/suíte completa — 383 testes, sem
  regressão — e build de produção). Confirmação visual do alinhamento
  real nas 12 colunas numéricas fica pendente do usuário, mesma
  limitação de navegador real desta sessão.

**Adendo `shippingCost` (10ª parcela, rename) + `operationalCost`
(11ª, novo significado), 2026-09-08 — aviso cross-session da sessão de
backend `ticket-message-image-attachments`, corrigido no mesmo dia** —
2 mudanças de contrato relacionadas:

1. `PRODUCT.operational_cost` renomeado pra `PRODUCT.shipping_cost` (ver
   seção `ProductForm` acima) — a chave do breakdown que carregava esse
   valor também mudou: `pricing.*_breakdown.shipping_cost`
   (`shippingCost` no domínio). **Mesma posição visual que
   `operationalCost` já ocupava** na barra/legenda/tabela (logo depois
   de `fixedFee`) — é o mesmo valor de sempre, só o nome mudou, tanto no
   backend quanto no `SEGMENT_KEYS`
   (`pricingBreakdown.ts`)/`product-marketplace-pricing-view__segment--*`
   (cor idêntica à que `operationalCost` tinha antes: `color-mix(in
   srgb, $color-accent-orange 50%, $color-accent-red)`).
2. `COMPANY.operational_cost_percentage` (novo, ver `CompanyForm` em
   `billing-and-identity.md` — **não** `ConnectMarketplaceModal`, ver
   correção logo acima) passou a alimentar a chave
   `pricing.*_breakdown.operational_cost` — MESMO NOME de chave que
   antes pertencia ao produto, mas agora com um valor/fonte
   COMPLETAMENTE diferente (percentual da EMPRESA INTEIRA, deduzido do
   lucro igual a `ads`/`affiliate`, mas um valor só, não varia por
   conexão). Posicionado como 11ª parcela, logo depois do `shippingCost`
   (mesmo agrupamento visual "custos operacionais"), com cor nova
   (`color-mix(in srgb, $color-accent-orange 25%, $color-accent-red)` —
   próximo degrau da mesma rampa quente, distinto do `shippingCost` ao
   lado).
- **Achado real, mesmo dia — a 1ª versão desta mudança tinha o item 2
  errado**: implementamos `operational_cost_percentage` em
  `USER_MARKETPLACE` (por conexão) a partir do primeiro aviso
  cross-session, verificamos em browser real e encontramos um `500`
  (`SQLSTATE[42703]: Undefined column "operational_cost_percentage" of
  relation "user_marketplaces"`) — reportamos à sessão de backend, que
  respondeu que o usuário já tinha corrigido a premissa direto com eles:
  o campo sempre devia ter sido `COMPANY`, um valor só pra empresa
  inteira, não por conexão. Revertido por completo do lado de
  `USER_MARKETPLACE`/`ConnectMarketplaceModal.vue`, implementado do
  jeito certo em `CompanyForm.vue`. A chave do BREAKDOWN
  (`pricing.*_breakdown.operational_cost`) nunca mudou nos dois cenários
  — só a fonte do dado.
- **Cuidado explícito, documentado no código (`productMarketplacePricing.type.ts`,
  `pricingBreakdown.ts`)**: qualquer leitura futura de
  `breakdown.operationalCost` pra "mostrar o custo operacional do
  PRODUTO" está lendo o valor ERRADO desde esta mudança — esse dado
  agora mora em `breakdown.shippingCost`.
- 11 segmentos reais agora (era 10) — `SEGMENT_KEYS` cresceu de
  `['costPrice', 'commission', 'fixedFee', 'operationalCost', 'tax',
  'ads', 'affiliate', 'coupon', 'individualFixedFee', 'profit']` pra
  `['costPrice', 'commission', 'fixedFee', 'shippingCost',
  'operationalCost', 'tax', 'ads', 'affiliate', 'coupon',
  'individualFixedFee', 'profit']` — propagação automática pra
  barra/legenda/tabela via o mesmo `v-for` dinâmico de sempre, sem
  mudança de template.
- Chave i18n nova `pricing.productMarketplacePricing.segments.shippingCost`
  ("Envio") — `operationalCost` mantém o label existente ("Operacional"),
  agora com significado real (antes era um placeholder pro valor do
  produto, hoje é o percentual de verdade da empresa).
- **Round-trip visual do NOVO segmento `operationalCost` verificado em
  browser real, do jeito certo (via `CompanyForm.vue`, não
  `ConnectMarketplaceModal.vue`)**: `PATCH /company` com
  `operational_cost_percentage: 12.5` gravou e devolveu
  `"operational_cost_percentage":"12.50"` corretamente.
  `shippingCost` (rename puro do produto) também verificado ponta a
  ponta: criar produto com `shipping_cost` preenchido e consultar `GET
  /user-marketplaces/{id}/products` mostra o valor correto na chave
  nova. O reflexo do valor da empresa dentro do BREAKDOWN em si
  (`pricing.*_breakdown.operational_cost` calculado a partir de um
  `operational_cost_percentage` real da empresa) não foi testado
  isoladamente nesta rodada — depende do motor de precificação já
  aplicar o valor certo, fora do escopo desta verificação de UI.
- Verificado (typecheck/lint/suíte completa — 403 testes, incluindo um
  teste novo confirmando `shippingCost`/`operationalCost` como 2
  segmentos distintos com valores próprios — e build de produção).

## ProductMarketplacesView (`modules/pricing/views/ProductMarketplacesView.vue`)

Rota própria (`/products/:id/marketplaces`), não uma aba — decisão de
arquitetura, não de design visual (fronteira de módulo, ver
`docs/planejamento/plano-implementacao.md` Fase 4). Visualmente é o
mesmo esqueleto de lista simples já usado em `ProductLaunchList.vue`
(header + botão de ação + `DataTable` + `Modal` pro formulário), só que
o "formulário" aqui é um único `Select` (nunca mais de 1 campo, não
precisou de `FormGroup`/`useResourceForm` — não há o que validar além de
"algo foi selecionado"). Link "Voltar para Produtos" no cabeçalho é
`Button` `variant="ghost"` com `icon-before` (`ArrowLineLeft`), não um
`<a>`/`<button>` cru — nunca reinventar estilo de botão fora do design
system, mesmo pra um link de navegação simples.

**2 ajustes pedidos direto pelo usuário em 2026-08-31**: a rota deixou
de exigir `role: 'user'` (mesmo motivo da correção em
`AdminMarketplacesView` acima — admin também pode gerenciar vínculo de
qualquer produto seu) e a coluna "Marketplace" ganhou `MarketplaceLogo`
(ver seção própria acima) via `ProductMarketplaceRow.marketplaceLogoUrl`,
campo novo resolvido em `useProductMarketplaces.ts` cruzando
`UserMarketplace`→`Marketplace`, mesmo caminho que já resolvia o nome.

**Categoria de produto opcional no vínculo, 2026-09-02 (tarefa 64 de
`docs/api/ordem-de-implementacao.md` no repo `backend`)** — 2º `Select`
no `Modal` de "Vincular marketplace", só aparece
(`categoryOptionsForSelectedConnection.length > 0`) quando o marketplace
da conexão escolhida tem alguma `CATEGORY_MARKETPLACE` configurada
(`categoryOptionsFor(userMarketplaceId)`, `useProductMarketplaces.ts`) —
nem todo marketplace cobra por categoria, campo nunca obrigatório.
Reseta (`watch(selectedConnectionId)`) toda vez que a conexão muda — a
categoria marcada pode não existir no marketplace da NOVA conexão
escolhida. Coluna nova "Categoria" na tabela (`—` quando o vínculo não
tem uma), resolvida cruzando `link.categoryId` com as categorias do
marketplace daquela conexão (`buildProductMarketplaceRows`, 4º parâmetro
novo — um `Map<marketplaceId, CategoryMarketplace[]>` buscado uma vez
por marketplace conectado no `refresh()`, evita uma chamada por linha da
tabela). Verificado em browser real contra o backend local: escolher uma
conexão cujo marketplace tem categoria configurada revela o 2º `Select`;
escolher uma categoria e vincular grava `category_id` corretamente
(conferido direto no banco); a coluna "Categoria" mostra o título certo.

**Modal de "Vincular marketplace" removido, 2026-09-10** — backend (sessão
de peer `ticket-message-image-attachments`) passou a criar
`PRODUCT_MARKETPLACE` automaticamente: todo produto já nasce vinculado a
toda `USER_MARKETPLACE` ativa do usuário (e vice-versa, ao conectar uma
conexão nova), `practicedPrice`/`categoryId` nascem `null`. `POST
/products/{id}/marketplaces` continua existindo (agora idempotente,
`200` pra vínculo já existente / `201` só no caso raro de lacuna não
coberta pelo auto-vínculo), mas nenhuma tela chama mais esse endpoint —
`link()`/`buildAvailableConnectionOptions()` (`useProductMarketplaces.ts`)
e `createProductMarketplace()` (`pricingApi.ts`) foram removidos por
inteiro: com todo vínculo possível já existindo de cara, a lista de
"conexões disponíveis pra vincular" ficaria sempre vazia — código morto,
não uma opção guardada pra fallback. `unlink()` (`DELETE`) continua —
ação real e distinta (parar de vender um produto naquele canal
específico), não relacionada ao auto-vínculo.

O botão "Marketplaces" que abria esta tela saiu da linha da listagem de
`ProductsView.vue` (pedido do próprio usuário à sessão de backend) e
virou um ícone discreto (`Storefront`,
`variant="ghost"`, sem texto — mesmo padrão do botão de editar preço
praticado desta própria tela) no rodapé do `Drawer` de edição de produto
(`ProductForm.vue`), plugado no novo slot `leading` de
`CrudFormActions.vue` (`shared/components/blocks/`, slot opcional —
vazio em todo outro consumidor do bloco, sem impacto neles). Só aparece
em modo `edit` (produto precisa existir pra ter vínculo). Verificado em
browser real: criar um produto sem nenhuma conexão ativa → tela mostra o
estado vazio (`"Nenhum marketplace vinculado ainda."`, sem botão
"Vincular"); conectar um marketplace depois → o mesmo produto aparece
automaticamente vinculado na tela, sem nenhuma ação manual de "vincular".

**"Desvincular" (`DELETE`) removido no mesmo dia, algumas horas depois**
— essa tela chegou a implementar "Desvincular" (coluna "Ações",
`ConfirmDialog`) na 1ª rodada da mudança acima, tratando-o como feature
permanente de "tirar produto de um canal". O backend reportou o problema
real: aquele `DELETE` nasceu só como passo interno de "trocar categoria"
(apaga+recria), nunca pra isso — com vínculo automático + seeder de
backfill (recria vínculo faltante em todo deploy), a exclusão seria
silenciosamente desfeita em produção. Resolução: `DELETE` saiu do
backend (rota removida — patch manual de `schema.d.ts`, removendo
`productMarketplace.destroy`), coluna "Ações" saiu junto (nada mais
restava nela). Em troca, **`category_id` virou mutável via `PATCH`** —
o campo select de categoria (mesmas opções que antes viviam no modal de
"vincular", `categoryOptionsFor`) foi pro `UpdatePracticedPriceModal.vue`
(compartilhado com `ProductMarketplacePricingView.vue`), atrás de uma
prop opcional `categoryOptions` — só esta tela passa (é a única com
coluna "Categoria"), então o campo simplesmente não aparece no outro
consumidor. Categoria só TROCA, nunca LIMPA de volta pra vazio (decisão
do próprio backend — sem opção "nenhuma" no `Select`). Verificado em
browser real contra o backend local: PATCH manda
`{practiced_price, category_id}`, `200` com os dois persistidos; tabela
atualiza preço E categoria na mesma ação.

## AdminProductCategoriesView / AdminProductCategoryForm (`modules/pricing/views/AdminProductCategoriesView.vue`, `modules/pricing/components/AdminProductCategoryForm.vue`)

CRUD de `PRODUCT_CATEGORY` — exclusivo do admin (tarefa 64,
`docs/api/ordem-de-implementacao.md` no repo `backend`, pedido direto do
usuário: "categoria de produto + comissão por categoria por
marketplace"). Mesma forma exata de `AdminMarketplacesView.vue`/
`AdminMarketplaceForm.vue` — `useResourceList`/`useCrudDrawer`/
`useConfirmAction` pro CRUD principal, `Drawer.vue` com o form (`title`/
`active`, `Toggle.vue` — mesmo par de campos que `AdminSettingsView`),
sem aba dentro do Drawer de edição (categoria não tem conteúdo aninhado
próprio — comissão por marketplace mora na aba "Categorias" de
`AdminMarketplacesView.vue`, seção própria abaixo, não aqui). Categoria é
simples, sem hierarquia/subcategoria — um desenho inicial com `parent_id`
foi revertido na mesma rodada de planejamento, a pedido do usuário.

- **Filtro de `marketplace_id`** (`ListToolbar` `#filters`, junto do já
  usual `active`) — pedido explícito do usuário durante o planejamento
  da tarefa 64 ("filter[marketplace_id] adicionado por pedido seu"),
  mostra só categorias já com comissão configurada pra um marketplace
  específico. `useMarketplaceOptions.ts` (novo, `modules/pricing/composables/`)
  alimenta o `Select` — mesmo padrão de `useAdminPlanOptions.ts`
  (`modules/billing/`), local ao módulo até um segundo consumidor real
  justificar subir pra `core/`.
- Verificado em browser real contra o backend local: criar categoria
  "Eletrônicos" → aparece na listagem com `StatusDot` verde (ativa) →
  toast "Categoria criada com sucesso."

## AdminCategoryMarketplaceList / AdminCategoryMarketplaceForm (`modules/pricing/components/blocks/AdminCategoryMarketplaceList.vue`, `modules/pricing/components/AdminCategoryMarketplaceForm.vue`)

"Categorias" — 3ª aba do Drawer de edição de `AdminMarketplacesView.vue`
(ao lado de "Dados do marketplace"/"Regras de comissão"), sempre
aninhada a UM marketplace, nunca listagem própria — mesmo padrão exato
de `AdminPricingRuleList.vue`/`AdminPricingRuleForm.vue`: `useResourceList`/
`useCrudDrawer`/`useConfirmAction`, `Modal.vue` (já dentro do Drawer de
edição do marketplace).

- **Diferente de `PricingRule` (campos preenchidos do zero),
  `CategoryMarketplace` vincula uma categoria EXISTENTE** — o `Select`
  de categoria só aparece no CREATE (`categoryOptions`, calculado pelo
  consumidor: todas as categorias ATIVAS ainda não vinculadas a este
  marketplace, mesmo critério de `buildAvailableConnectionOptions` em
  `useProductMarketplaces.ts` — evita a Action recusar com
  `errorMessageCategoryAlreadyLinkedToMarketplace`). No EDIT, a
  categoria é fixa (`UpdateCategoryMarketplaceRequest` real do backend
  nem aceita `category_id` — trocar de categoria é sempre excluir e
  vincular outra) — mostra o título como `Input` desabilitado, mesmo
  padrão do campo `hash` em `AdminSettingForm.vue`.
- Botão "Vincular categoria" fica `disabled` quando não sobra nenhuma
  categoria ativa pra vincular (todas já vinculadas, ou nenhuma
  cadastrada) — mesmo critério de `addDisabled` em `ListToolbar.vue` —
  com uma dica de texto explicando o motivo.
- Verificado em browser real contra o backend local: aba "Categorias"
  dentro do Drawer de edição do marketplace, vincular "Eletrônicos" com
  15% de comissão → linha aparece na tabela ("Eletrônicos" / "15%") →
  toast "Categoria vinculada com sucesso." → conferido no banco
  (`CATEGORY_MARKETPLACE.commission_percentage: 15.00`).


**Item de menu "Ver precificação" + botão "Voltar" contextual, 2026-09-08,
pedido direto do usuário (repassado pela sessão de backend)** — 2
correções reais na mesma rodada.

1. **Botão "Voltar" (`goBackToConnections`) sempre navegava pra
   `marketplaces` fixo** — mesmo quando o usuário chegou nesta tela por
   outro caminho (ex.: o item de menu novo abaixo, vindo de "Produtos").
   Trocado pro composable `useGoBack()` (extraído de `AppHeader.vue`
   pra `shared/composables/`, ver seção própria em
   `docs/design/components/shell-and-layout.md`) — volta pra ONDE o
   usuário realmente veio, com a mesma guarda contra escapar do app numa
   aba sem navegação interna. Texto do botão deixou de citar um destino
   fixo ("Voltar para Marketplaces", chave `backToConnections` removida)
   — agora é só "Voltar" (`common.actions.back`, já existente): nomear
   um destino que pode não ser mais verdade seria enganoso.
2. **Item de menu novo "Ver precificação"** (`sidebar.nav.pricing`,
   grupo "Operação", ícone `ChartBar`) — até aqui a tela só era
   alcançável com uma conexão já em mãos (card conectado em
   `MarketplacesView.vue`), nunca pelo menu, porque a rota real
   (`marketplace-pricing`) exige `userMarketplaceId` no path. Resolvido
   com uma rota IRMÃ nova, `pricing` (`path: 'pricing'`, sem parâmetro),
   apontando pro MESMO componente `ProductMarketplacePricingView.vue` —
   zero mudança na lógica do componente: ele já tinha, desde a
   implementação original, um fallback no `onMounted` pra "id da rota
   não bate com nenhuma conexão ativa → usa a 1ª disponível e
   `router.replace`" (pensado pra link salvo de uma conexão desconectada
   depois) — chegar sem `userMarketplaceId` nenhum cai na MESMA branch
   (`route.params.userMarketplaceId` vem `undefined`, vira `''` via
   `?? ''`, nunca bate com nenhum id real). `relatedRouteNames` migrado
   do item "Canais de venda" pra este item novo — é ele, não "Canais de
   venda", que corresponde à rota de destino real depois do fallback
   resolver o id.
- **Achado real #1, só descoberto testando em browser real (Playwright,
  agora disponível na sessão — libs do sistema instaladas pelo usuário)**:
  o estado "sem nenhuma conexão" que eu tinha acabado de escrever
  (`connections.cards.value.length === 0`) NUNCA aparecia — `cards` é
  "um card por MARKETPLACE DO CATÁLOGO" (`useMarketplaceConnections.ts`,
  sempre existem, cadastrados pelo admin), não "conexões do usuário".
  Testado ao vivo contra um usuário com ZERO linhas em
  `user_marketplaces`: a tela mostrava "Nenhuma conexão ativa
  disponível" (o hint ERRADO, pensado pro caso "tem conexão mas nenhuma
  ATIVA") em vez do estado vazio novo. Corrigido nos 2 lugares (o `v-if`
  novo E a condição pré-existente do `v-else-if`, que tinha a MESMA
  imprecisão desde sempre — só nunca tinha sido notada porque a tela só
  era alcançável já COM uma conexão em mãos) trocando pra
  `connections.connectedCount.value` (`connections.value.length`, já
  existia no composable, é o dado certo).
- **Achado real #2, mesmo teste**: breadcrumb mostrava "Operação / Ver
  precificação / Precificação"... não — mostrava **"Operação /
  Precificação / Precificação"** antes da correção (2 segmentos com o
  MESMO texto): o item de menu tinha `label: 'Precificação'`, igual ao
  `route.meta.title` da rota real (`pricing.productMarketplacePricing.title`)
  — mesma classe de bug já documentada como "Usuários / Usuários"
  (`adminUsersGroup`, `core/layouts/config/navigation.ts`). Resolvido
  reaproveitando o texto "Ver precificação" já usado nos 2 botões de
  atalho existentes (`catalog.products.pricingShortcut`/
  `pricing.marketplaces.pricingButton`) — nenhum texto novo inventado
  pro mesmo conceito, breadcrumb final: "Operação / Ver precificação /
  Precificação".
- **3 estados agora corretos no `<template>`**: zero conexões
  (`connectedCount === 0`, estado vazio com CTA "Ir para Canais de
  venda"), conexões existem mas nenhuma ativa (`connectedCount > 0` E
  `marketplaceTabs.length === 0`, hint textual sem CTA — caso raro,
  usuário desativou manualmente todas), pelo menos 1 ativa (`TabBar`
  normal, fallback automático já cobre isso).
- **Verificação real em browser** (Playwright, primeira vez disponível
  nesta sessão — libs do sistema `libnss3`/`libnspr4` instaladas pelo
  usuário): usuário de teste com empresa+assinatura mas ZERO conexões →
  clicar "Ver precificação" no menu → estado vazio com CTA, clicar CTA →
  cai em "Canais de venda"; conexão ativa criada (Mercado Livre
  Clássico) → clicar "Ver precificação" de novo → fallback resolve a
  conexão e troca a URL pra `/marketplaces/{id}/pricing` automaticamente
  (`router.replace`, sem duplicar entrada no histórico) → aba do
  marketplace renderiza normalmente; navegado por Produtos → Ver
  precificação → Voltar → volta pra Produtos (não mais "Canais de
  venda" fixo); typecheck, ESLint, os 392 testes e build de produção,
  todos limpos.

**KPIs reduzidos a só "Margem média", 2026-09-08, pedido direto do
usuário** — "Faturamento total"/"Lucro total"/"Produtos" removidos da
faixa de KPIs (`.product-marketplace-pricing-view__kpi-row`), mantendo
só "Margem média" com um tooltip novo explicando o que ela considera.

- **Só do front, de propósito** (pedido explícito do usuário) — os 3
  campos continuam vindo de `meta.totals` na resposta da API
  (`ProductMarketplacePricingTotals`, `pricingApi.ts`) e o tipo/mapeamento
  continuam intactos, refletindo o contrato real do backend 1:1 (mesma
  convenção de sempre — tipo de domínio nunca diverge do schema gerado).
  Só a EXIBIÇÃO saiu da tela; nenhuma mudança de contrato foi pedida ao
  backend.
- **Tooltip novo** (`kpis.averageMarginTooltip`, "Considerando uma
  unidade de cada produto.") — mesmo padrão já usado nesta mesma view
  pro hint de preço de campanha/aproximação (`Tooltip` + `Icon="Info"`
  12px dentro de um `<span tabindex="0">`, cor `{colors.ink-40}` aqui —
  diferente do amarelo usado nos outros tooltips da tela, que sinalizam
  uma condição especial; este é só informativo, sem nada de atenção).
  Mesmo achado real já documentado pro `__suggested-hint` (mesmo
  arquivo) se repetiu aqui: um ícone de tooltip dentro de um `<span
  tabindex="0">` no MEIO de uma linha de texto vira, sozinho, uma caixa
  de bloco (reset global `svg { display: block }`) e cai órfão embaixo
  do label sem `:deep(svg) { display: inline-block; vertical-align:
  middle; }` — aplicado de propósito desde a primeira versão, não
  descoberto de novo por tentativa e erro.
- **CSS morto removido junto**: as 3 variantes
  `.product-marketplace-pricing-view__kpi-value--positive/--neutral/--negative`
  (achado real de 2026-09-04, cor dinâmica do "Lucro total" pelo sinal
  do total via `outcomeTone`) só existiam pro KPI removido — `outcomeTone`
  continua importado/usado normalmente pra cor de margem por LINHA
  (`marginToneClass`), não removido do arquivo.
- **Verificação**: typecheck, ESLint, os 397 testes (sem regressão) e
  build de produção, todos limpos. Verificado em browser real
  (Playwright): os 3 KPIs removidos não aparecem mais no DOM, "Margem
  média" com o ícone de tooltip fica na MESMA linha do label (sem cair
  órfão), hover no ícone abre o tooltip com o texto correto
  ("Considerando uma unidade de cada produto.").
