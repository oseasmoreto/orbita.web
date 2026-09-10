# Telas — Dashboard de precificação e Central de Ajuda

PricingDashboardMockupView (rascunho mockado), ProductMarketplacePricingView (motor real conectado, reescrita completa e correções), HelpView.

> Faz parte do design system do Orbita — tokens e princípios gerais ficam em
> `docs/design/design-system.md`, este arquivo é a continuação dele.

## PricingDashboardMockupView (`shared/views/PricingDashboardMockupView.vue`)

**Primeiro rascunho visual da dashboard de precificação (Fase 4),
2026-09-02, pedido direto do usuário** com referência de outro produto
(barra horizontal empilhada por produto, decomposta em custo + taxas +
lucro) — "vamos desenhar a tela de precificação... monta um mockup numa
rota a parte, sem comunicação com api, só pra vermos como fica, com aba
por marketplace pra usarmos nosso componente de aba". Rota isolada
(`/pricing-dashboard-mockup`), fora da navegação principal — mesmo
espírito de `ShowcaseView.vue` (`/showcase`): superfície de exploração,
não uma feature real ainda. **Fecha (parcialmente) o gap "sem componente
de card/tabela/badge ainda... primeiro lugar que vai exigir isso"**
registrado desde a Fase 0 em "Known Gaps" — os dados continuam 100%
mockados, mas a composição visual já é real.

- **Sem chamada de API nenhuma** — os números vêm de um "recipe" fixo
  por produto (`costPrice`/`operationalCost`/`salePrice`, nível de
  produto, igual nas 3 abas) cruzado com um recipe por marketplace
  (`commissionPercentage`/`fixedFee`/`campaignDiscountPercentage`/
  `adsPercentage`, variam por aba) + `COMPANY.salesTaxPercentage` fixo —
  a soma dos 8 segmentos sempre bate 100% com o preço de venda, do jeito
  que o cálculo real (`PricingCalculator`, já existente, nunca conectado
  a rota nenhuma) vai precisar fechar quando for implementado de
  verdade. Os 8 segmentos mapeiam 1:1 pros campos reais já existentes no
  modelo de dados (`PRODUCT.costPrice`/`operationalCost`,
  `PRICING_RULE.percentage`/`fixed_fee`,
  `USER_MARKETPLACE.campaignDiscountPercentage`/`adsPercentage`,
  `COMPANY.salesTaxPercentage`) — nenhum campo novo, só a composição
  visual é nova.
- **Aba por marketplace = `TabBar.vue` reaproveitado tal como é**
  (`TabsContent` do próprio `reka-ui`, mesmo padrão de
  `AdminMarketplacesView.vue`) — pedido explícito do usuário, "pra
  usarmos nosso componente de aba".
- **Barra segmentada é um componente novo, bespoke** (`.pricing-dashboard-mockup__bar`,
  8 `<span>` com `flex-basis` proporcional ao valor de cada segmento) —
  sem token de "rampa sequencial" pronto no design system (só paleta
  categórica plana, `{colors.accent-*}`), então a progressão clara→escura
  (custo→taxas) é construída localmente via `color-mix()` interpolando
  entre `{colors.accent-orange}` e `{colors.accent-red}`/`{colors.ink}`
  — mesma TÉCNICA já usada em `StatusDot` `variant="pill"`/`DateRangePicker`
  (nunca compartilhada como componente, só o princípio reaproveitado).
  `profit` fecha em `{colors.accent-green}` sólido, mesma cor já usada
  pra "lucro"/valor positivo no resto do app. Cada segmento é focável
  (`tabindex="0"`) e envolvido por um `Tooltip.vue` mostrando o valor
  exato em R$ — replica o hover da referência sem inventar um mecanismo
  novo de tooltip.
- **Legenda compartilha as mesmas 8 classes de cor da barra**
  (`.pricing-dashboard-mockup__legend-swatch--<segmento>` via `@extend`
  das classes `__segment--<segmento>`) — nunca redeclara a cor duas
  vezes, a paleta muda num lugar só.
- Verificado em browser real: trocar de aba recalcula os totais/barras
  corretamente (números diferentes por marketplace, já que comissão/
  taxa fixa/campanha/ads variam por canal); hover num segmento mostra o
  tooltip certo (`"Valor pago: R$ 22,00"`, conferido); sem erro nenhum
  no console.

**Bug real, reportado pelo usuário com 2 screenshots no mesmo dia —
"espaço em branco perdido" crescendo a cada troca de aba.** Causa:
`TabsContent` (reka-ui) mantém as 3 abas SEMPRE no DOM — `unmountOnHide`
(default `true`) só limpa o CONTEÚDO (slot) da aba inativa, o `<div>`
wrapper continua montado pra sempre, controlado por atributo `hidden`
nativo. `.pricing-dashboard-mockup__panel` tinha `display: flex`
aplicado direto na classe que vai no PRÓPRIO `TabsContent` (`class` no
componente cai por fallthrough no elemento raiz que ele renderiza) —
com a especificidade extra do `[data-v-xxxxxxxx]` do scoped style, essa
regra EMPATAVA em especificidade com `[hidden] { display: none }` do
navegador (classe vs. atributo, mesmo peso) e vencia por ser a última
declarada, no `<style>` do componente — cada aba já visitada ficava
"escondida" só de nome (`hidden="true"` no atributo), mas
`display: flex` continuava valendo, e o `padding-top: {spacing.16}` do
próprio bloco (vazio, sem filhos) sobrava como 16px de espaço em branco
visível — um por aba já visitada, empilhando a cada troca. Confirmado
via `getComputedStyle`/`getBoundingClientRect` real: antes do fix, aba
inativa tinha `display: flex`, `height: 16`; depois, `display: none`,
`height: 0`. **Corrigido** com `&[hidden] { display: none; }` aninhado
dentro do próprio `.pricing-dashboard-mockup__panel` — especificidade
classe+atributo bate a classe sozinha, sem precisar de `!important`.
Nenhum outro consumidor de `TabsContent` do projeto
(`AdminMarketplacesView.vue` e outros) tem esse bug porque nenhum deles
aplica `display` direto na classe que vai no elemento `TabsContent` em
si — só no conteúdo de dentro. **Lição geral pra qualquer `class` posta
direto num `TabsContent`/`Presence`-based component do reka-ui**: se a
classe declarar `display` (ou qualquer propriedade que precise ceder
espaço quando escondido), sempre acompanhar de `&[hidden] { display:
none; }` no mesmo bloco — o scoped CSS do Vue tem especificidade
suficiente pra vencer o `[hidden]` nativo do browser por acidente.
Reverificado em browser real: `top` do painel ativo permanece fixo
(`250px`) trocando Mercado Livre → Shopee → Amazon → Mercado Livre de
novo, sem nenhum espaço acumulando.

**Densidade aumentada, pedido direto do usuário** ("diminua um pouco o
espaço entre as linhas, pense q podem ser planilhas com mais de 50
produtos") — `gap` entre produtos `{spacing.20}`→`{spacing.12}`, margem
entre nome/preço e a barra `{spacing.8}`→`{spacing.4}`, altura da barra
`{size.24}`→`{size.16}`. Mesma régua de "densidade importa mais que
respiro" já usada em `DataTable`/listagens admin, só que aplicada aqui
de propósito porque o usuário citou o volume real esperado (50+ linhas)
como motivo.

**Botão de "Editar produto" + "Editar vínculo produto↔marketplace" por
LINHA, "Editar vínculo do marketplace" por ABA — 2 rodadas de correção
no mesmo dia, pedido direto do usuário.** 1ª versão: os 2 botões por
LINHA (`PencilSimpleLine`→editar produto, `Storefront`→editar
`PRODUCT_MARKETPLACE`). 1º pedido de correção ("coloque o botão do lado
esquerdo do nome do produto, e coloque tbm o botao para editar o
vinculo do mktplace nas tabs q no caso é o vinculo entre user x
mktplace") foi malinterpretado como "mover" o botão de vínculo da linha
pra aba — **removi o botão por linha por engano**. Usuário corrigiu de
novo: "mas dai vc nao me entendeu, faça o seguinte: mantenha o botão de
editar vinculo do mktplace com o produto, adicione um botão em cada aba
pra editar o vinculo do mktplace da aba com o usuario" — os DOIS botões
deveriam existir ao mesmo tempo, em níveis diferentes, editando vínculos
DIFERENTES:

- **Por LINHA de produto (mantido/restaurado)**: `PencilSimpleLine`
  (esquerda do nome, `router.push({ name: 'products-edit', params: {
  id } })`, mesmo par de `ProductsView.vue`) + `Storefront` (direita do
  preço, `router.push({ name: 'product-marketplaces', params: { id }
  })`) — edita `PRODUCT_MARKETPLACE` (vínculo produto↔categoria-por-
  canal daquele produto específico).
- **Por ABA de marketplace (novo, adicional — não substitui o de
  linha)**: `Storefront` + texto "Editar vínculo do marketplace"
  (`variant="outline"`, dentro da faixa de KPIs, canto direito) —
  `goToMarketplaceConnection()` navega pra `marketplaces` (a tela
  "Canais de venda"), edita `USER_MARKETPLACE` (a conexão usuário↔canal
  — `store_name`/`ads_percentage`/`campaign_discount_percentage`/
  comissão, os campos que alimentam os segmentos "Comissão campanha"/
  "Ads" de CADA barra da aba inteira, não um produto isolado). Sem rota
  própria pra abrir `ConnectMarketplaceModal.vue` direto numa conexão
  específica, por isso vai pra listagem geral.
- **Alinhamento vertical ícone↔texto corrigido, mesmo pedido ("deixe
  alinhado bonitinho", com captura mostrando o ícone visivelmente
  desalinhado do nome do produto)** — achado real: `<p>` ganha
  `margin-bottom: $font-size-md` via `paragraph-spacing`
  (`_reset.scss`), o mixin de espaçamento de PARÁGRAFO DE PROSA
  (`docs/design/tokens/paragraph/`), que não deveria valer pra texto de
  UI (regra já documentada na seção Typography deste doc: "Texto de UI
  — label, botão — não herda esse espaçamento, fica em 0 por padrão").
  Como `.pricing-dashboard-mockup__product-name`/`__product-price` são
  `<p>` de rótulo de UI (não prosa), a margem invisível inflava a caixa
  desse elemento bem mais que o ícone ao lado (`Button` ghost, 28px) —
  `align-items: center` da linha centralizava as CAIXAS (maiores por
  causa da margem), não o texto visível dentro delas, jogando o texto
  pra fora do centro óptico. Corrigido com `margin-bottom: 0` explícito
  nos dois seletores. Confirmado via `getBoundingClientRect()`: centro
  vertical do ícone e centro vertical da caixa de texto resolvendo pro
  MESMO pixel (antes, desalinhados).
- Verificado em browser real (login com usuário/empresa/assinatura
  seedados via tinker, servidor Vite em `:5174`): pencil à esquerda do
  nome e `Storefront` à direita do preço nas 6 linhas das 3 abas,
  perfeitamente alinhados com o texto (não só com a linha); exatamente
  1 botão "Editar vínculo do marketplace" por aba, clicar navega pra
  `/marketplaces`; clicar no `Storefront` de uma linha navega pra
  `/products/:id/marketplaces` (vínculo do PRODUTO, distinto do botão
  da aba); troca de aba continua sem reabrir o bug de espaço em branco
  acumulado (`top` do painel ativo fixo em `250px` trocando Mercado
  Livre→Shopee→Amazon de novo).

**50 produtos, pedido direto do usuário** ("coloque 50 produtos pra eu
ver como fica") — os 6 `PRODUCT_RECIPES` escritos à mão viraram 50,
gerados por `generateProductRecipe(name, index)` a partir de
`PRODUCT_NAME_POOL` (50 nomes reais de e-commerce) + 17 degraus de preço
(`SALE_PRICE_STEPS`, R$29,90–R$349,90) + proporção de custo determinística
(15%–27,5% do preço de venda) — nunca `Math.random()`, mesmo espírito de
"mockup 100% descartável não justifica 50 objetos digitados à mão".
Conferido por script (fora do componente, só validação aritmética) que a
MENOR margem entre os 50 produtos × 3 marketplaces é 5,85% — nunca
negativa, garantindo que nenhum segmento de barra vira `flex-basis`
negativo (CSS trata como `0`, quebraria a soma visual dos segmentos).
Verificado em browser real: as 50 linhas renderizam, o KPI "Produtos"
mostra 50, alinhamento ícone↔texto continua correto em todas, e rolar
até a última linha ("Cabo HDMI 2m") não revela nenhum problema de layout
em escala.

**Visualização em tabela + busca + copiar preço, pedido direto do
usuário** ("faça uma visualização de tabela, com um botão para o
usuario ficar alternando as views, adicione uma barra de busca pra
filtrar o produto por nome, e do lado do preço sugerido coloque um
botão de copy nas duas views"):

- **Alternância de view** (`viewMode: 'bar' | 'table'`, ref simples) —
  2 `Button` ícone-only (`ChartBar`/`Table`) agrupados num wrapper com
  fundo `{colors.ink-4}` (`.pricing-dashboard-mockup__view-toggle`,
  visual de "segmented control"), `variant="secondary"` na opção ativa,
  `variant="ghost"` na inativa — mesmo par de variantes já usado no
  resto do design system pra indicar seleção sem inventar uma variante
  nova de `Button`.
- **Busca por nome** (`Search.vue`, já existente) — um `ref` só
  (`searchQuery`), compartilhado pelas 3 abas (não reaplicado por
  marketplace) e pelas duas views. Filtra `productsByMarketplace` via
  `.toLowerCase().includes()` simples (sem acento-insensível — nenhum
  pedido nesse sentido, YAGNI). **KPIs recalculam sobre o conjunto
  FILTRADO**, não o catálogo inteiro — decisão deliberada (mesmo
  comportamento esperado de um filtro de dashboard de verdade: buscar
  "tênis" já atualiza faturamento/lucro/margem/contagem só dos 2
  produtos encontrados, não os 50). `totalsFor` ganhou uma guarda
  `products.length === 0 ? 0 : ...` na média de margem — sem isso, uma
  busca sem resultado nenhum dividiria por zero (`NaN%` visível na UI).
- **Toolbar fora de `.pricing-dashboard-mockup__panel`, de propósito**
  — como busca/view são estado compartilhado entre as 3 abas, o
  controle fica uma vez só, direto no slot default de `TabBar` (que
  renderiza depois da lista de abas, antes dos `TabsContent`) — nunca
  duplicado 3x dentro de cada painel (o que criaria 3 `<input>` bound
  ao mesmo `ref`, redundante e confuso).
- **Tabela reaproveita `DataTable.vue`** (mesmo bloco genérico de toda
  listagem admin do projeto) — os 8 segmentos viram COLUNA em vez de
  segmento de barra (`toTableRow()` achata `product.segments[]` pra
  propriedades diretas do tipo `ProductTableRow`, isolando o único
  cast do arquivo — `Record<SegmentKey, number>` — na mesma função,
  mesmo padrão já documentado em `DataTable.vue`/`getCellValue`).
  Slot dinâmico `#[`cell-${key}`]` (um `<template v-for>` por segmento)
  cobre as 8 colunas de valor sem repetir 8 blocos de template quase
  idênticos. `PencilSimpleLine` colado ao nome na coluna "Produto"
  espelha o mesmo botão da visão em barra; coluna "Preço sugerido"
  reúne preço+margem+copy+`Storefront`, mesmo trio já usado na visão em
  barra.
- **Botão de copiar** (`copySuggestedPrice`, `CopySimple` ghost) —
  `navigator.clipboard.writeText(formatMoney(price))` + toast de
  sucesso/erro via `useToast()`; presente nas DUAS views (bar: entre o
  preço e o `Storefront` da linha; tabela: dentro da célula "Preço
  sugerido", mesma posição relativa). Sem fallback de
  `document.execCommand('copy')` (API descontinuada) — o `catch` só
  cobre o caso raro de permissão de clipboard negada pelo browser.
- Verificado em browser real, com permissão de clipboard concedida ao
  contexto do Playwright: alternar pra tabela renderiza as 50 linhas
  com as 9 colunas corretas (8 segmentos + preço sugerido); clicar
  "Copiar" nas duas views escreve o valor formatado certo
  (`navigator.clipboard.readText()` confirmando `"R$ 29,90"`) e mostra
  o toast "Preço copiado para a área de transferência."; buscar "tênis"
  reduz as 50 linhas pra 2 (`Tênis esportivo leve`/`Tênis de corrida`)
  nas DUAS views, o KPI "Produtos" acompanha (50→2), e o filtro
  PERSISTE ao trocar de view (mesmo `ref` compartilhado); busca sem
  nenhum resultado mostra o estado vazio, sem `NaN%` no KPI de margem;
  tabela com 9 colunas rola horizontalmente dentro do próprio wrapper
  (`overflow-x: auto` do `DataTable.vue`) sem nunca estourar a largura
  da PÁGINA (`document.documentElement.scrollWidth -
  document.documentElement.clientWidth` confirmado em `0`).

## ProductMarketplacePricingView (`modules/pricing/views/ProductMarketplacePricingView.vue`)

**Motor de precificação real conectado pela primeira vez, 2026-09-03** —
aviso cross-session da sessão de backend (tarefa 76, planilha real do
usuário): `GET /user-marketplaces/{id}/products` lista todo
`PRODUCT_MARKETPLACE` de UMA conexão já com o cálculo pronto
(`ProductMarketplacePricingCalculator`), `PATCH /products/{id}/marketplaces/{id}`
edita o preço praticado. Substitui conceitualmente o rascunho de
`PricingDashboardMockupView.vue` (100% mockado) — mas a forma real é
diferente do mockup: a API é por UMA conexão por vez (`userMarketplaceId`),
não multi-marketplace com abas simuladas. Rota própria
(`/marketplaces/:userMarketplaceId/pricing`, nome `marketplace-pricing`),
alcançada pelo botão novo "Ver precificação" no card CONECTADO de
`MarketplacesView.vue` (`ChartBar`, ao lado de "Gerenciar") — nunca item
de sidebar próprio, mesmo padrão de `product-marketplaces`;
`relatedRouteNames` no item `marketplaces` de `navigation.ts` garante o
breadcrumb "Operação / Canais de venda / Precificação" em vez de cair só
no título sozinho (mesmo achado real já documentado pra
`catalog-products`).

- **Achado real reportado pelo usuário, 2026-09-10 — `type`/`interface`
  soltos direto no `.vue`, único caso em todo o projeto**: `ViewMode`,
  `SegmentCell` e `PricingTableRow` viviam declarados dentro do próprio
  `<script setup>` desta view — toda outra tela/componente do projeto já
  mantinha tipo em `modules/<contexto>/types/`, só este arquivo tinha
  fugido da convenção (conferido: `grep` por `^type \|^interface` em todo
  `.vue` do projeto não achou nenhum outro caso). Movidos pra
  `productMarketplacePricing.type.ts` como `PricingViewMode`/
  `PricingTableSegmentCell`/`PricingTableRow` (renomeados só pra evitar
  nome genérico demais num arquivo de tipos compartilhado — `ViewMode`/
  `SegmentCell` colidiriam de nome fácil com outro módulo no futuro).
- **Coluna "Produto" fixa no scroll horizontal, mesmo dia** — pedido
  direto do usuário (10+ parcelas de breakdown forçam scroll lateral na
  visão em tabela): `DataTableColumn.sticky: true` na coluna
  `productName` — mecanismo novo, genérico, em `DataTable.vue` (ver seção
  própria em `docs/design/components/blocks-and-overlays.md`). Verificado
  em browser real: scroll horizontal simulado (`scrollLeft`) mantém
  "Produto" visível com hairline separando do conteúdo que desliza por
  baixo.
- **Achado real, schema OpenAPI gerado mente sobre 2 campos booleanos** —
  `ProductMarketplacePricingResource.pricing.meets_target_margin`/
  `is_approximated` chegam tipados como `string` em `schema.d.ts`
  (Scramble não consegue seguir o tipo através de
  `$evaluation->meetsTargetMargin`, propriedade dinâmica anexada ao
  Model pela Action, nunca uma coluna real). Conferido contra a fonte de
  verdade real do backend
  (`Domain/Pricing/ValueObjects/PricingEvaluation.php`): os dois são
  `bool`/`?bool` de verdade, serializam como booleano JSON nativo.
  Corrigido no tipo de domínio (`productMarketplacePricing.type.ts`) com
  `Omit` + override + cast via `unknown` (TS recusa cast direto entre
  tipos que não se sobrepõem o bastante) — nunca redigitar o resource
  inteiro à mão só por causa de 2 campos errados. Confirmado em browser
  real que o runtime realmente manda booleano (`StatusDot` renderizou
  "Dentro da meta"/"Sem preço praticado" corretamente a partir do valor
  já tipado certo — só teria funcionado se a leitura do campo estivesse
  correta).
- **`practicedProfit`/`practicedMarginPercentage` vêm `null`** quando o
  vínculo ainda não tem `practicedPrice` definido — não dá pra calcular
  lucro/margem de um preço que não existe. `StatusDot` cobre os 3
  estados (`gray`/"Sem preço praticado" quando `null`, `green`/"Dentro
  da meta", `red`/"Abaixo da meta") — mesma paleta genérica já usada em
  outras telas, o componente não sabe o que "bate meta" significa, só
  recebe a cor already-decided pelo consumidor.
- **`isApproximated`** (faixa de comissão sem fechar exata, faixas
  contíguas, caso raro) vira um ícone `Info` com `Tooltip` ao lado do
  preço sugerido — mesmo padrão de tooltip via `<span tabindex="0">`
  (não um `Button`) já documentado em `ProductForm.vue`.
- **Sem busca** — a API só aceita `sort`/`per_page`
  (`sort` só permite `created_at`), nenhum filtro de texto existe ainda
  (`useProductMarketplacePricingList.ts` não expõe `searchInput`,
  diferente de `useProductList.ts` — UI que não filtra nada de verdade é
  pior que não ter UI nenhuma).
- **`UpdatePracticedPriceModal.vue`** — bespoke, mesma categoria de
  `EditUserRoleModal.vue`/`OverrideSubscriptionModal.vue` (ação pontual,
  não o par create/update que `useResourceForm` modela). Não emite a
  linha atualizada — preço praticado muda TAMBÉM lucro/margem/
  `meetsTargetMargin` (calculados no backend), então o consumidor sempre
  refaz `list.refresh()` inteiro depois de `saved`, nunca tenta
  recalcular isso no cliente. **2º campo, `categoryId`, entrou em
  2026-09-10** atrás de uma prop opcional `categoryOptions` — só
  `ProductMarketplacesView.vue` passa (única tela com coluna
  "Categoria"), esta tela (por CONEXÃO) não mostra categoria, então o
  campo não renderiza aqui. **3º campo, `status`, entrou no mesmo dia,
  algumas horas depois** — diferente de `categoryId`, SEMPRE visível nos
  2 consumidores (todo vínculo já tem um status real, `not_sent`
  default) — `StatusDot` na célula/card + `Select` estático no modal
  (`not_sent`/`pending`/`sent`). Ver adendo completo em
  `docs/design/screens/catalog-and-pricing.md`, seção
  `ProductMarketplacesView`.
- **Preview de lucro/margem antes de aplicar, 2026-09-11** (pedido
  direto do usuário — "testar um preço praticado hipotético, ex.
  campanha do canal pedindo um preço menor, sem correr o risco de
  esquecer de reverter"): digitar no campo "Preço praticado" chama
  `GET .../simulate` (novo endpoint, READ-ONLY, nunca persiste) debounced
  300ms (`usePracticedPriceSimulation.ts`, `@vueuse/core` `refDebounced`
  — mesma convenção de debounce morar em quem consome, seção 4 de
  `docs/infra/convencoes-frontend-infra.md`) e mostra lucro/margem
  calculados num painel abaixo do campo, sem tocar no valor salvo — só o
  botão "Salvar" persiste de verdade (`PATCH` de sempre). Fechar o modal
  sem salvar não muda nada no servidor, mesmo tendo digitado vários
  preços de teste no meio.
  - `toPricingEvaluation` extraído de `toProductMarketplacePricing`
    (`productMarketplacePricing.type.ts`) — o resource do `simulate`
    (`SimulateProductMarketplacePricingResource`) tem o MESMO shape de
    `pricing` de sempre, reaproveitado sem redigitar o mapper.
  - Mesma trava de `latestRequestId` já usada em `useResourceList.ts`
    (achado real de 2026-09-10, resposta fora de ordem) protege o
    preview também — digitar rápido não deixa uma resposta antiga
    "ressuscitar" por cima de uma mais nova.
  - **Achado colateral do backend, mesmo dia**: `PATCH .../marketplaces/{id}`
    passou a rejeitar `practiced_price: 0` (`422`, `min:0.01` em vez de
    `min:0`) — um preço exatamente zero dividia por zero no cálculo de
    margem assim que uma faixa de comissão do marketplace começa em
    `range_min=0`. Espelhado em `updatePracticedPriceFormSchema.ts`
    (`.min(0.01)`) — verificado em browser real que `0` já é barrado
    client-side, sem round-trip pro 422 acontecer na prática.
  - Cor do preview (`update-practiced-price-modal__preview-margin--*`)
    é a MESMA paleta de `ProductMarketplacePricingView.vue`
    (`outcomeTone`, `pricingBreakdown.ts`) — verde/amarelo/vermelho,
    classe CSS local ao modal, função de decisão compartilhada.
- **Bug real do backend, encontrado testando em browser real, reportado
  cross-session e corrigido no mesmo dia**: `PATCH .../marketplaces/{id}`
  com `{"practiced_price": 99.9}` (exatamente o tipo `number | null` que
  o próprio `UpdateProductMarketplaceRequest` documenta no OpenAPI)
  devolvia `500` — `UpdateProductMarketplaceDto::__construct()` exigia
  `?string`, mas `toDto()` passava `$this->input('practiced_price')` sem
  cast, que chega como PHP `float` quando o JSON manda um number.
  Confirmado no `storage/logs/laravel.log` real (TypeError), não era
  erro de setup local — reportado pra sessão de backend via mensagem
  cross-session (ela decidiu e aplicou o fix com o próprio TDD, esta
  sessão nunca editou código de outro Bounded Context: `(string)
  $this->input('practiced_price')` null-safe, mesmo padrão dos outros
  campos Money da API). Reverificado depois em browser real contra a
  API de verdade: editar (`79.90` → `200`, tabela recalcula lucro/margem
  em tempo real) e LIMPAR o preço (`practiced_price: null` → volta pro
  estado "Sem preço praticado") funcionam ponta a ponta.

**Gap real encontrado pelo usuário, 2026-09-03 — `ProductMarketplacesView.vue`
(tabela POR PRODUTO, não por conexão) nunca mostrava/editava o preço
praticado**, mesmo o backend expondo `practiced_price` em
`ProductMarketplaceResource` desde sempre (não é campo novo — o tipo de
domínio do frontend (`ProductMarketplace`, `productMarketplace.type.ts`)
só nunca tinha sido atualizado quando a tarefa 76 adicionou o campo; só
`ProductMarketplacePricing`, o tipo da listagem CALCULADA, tinha ganhado
`practicedPrice`). Corrigido:

- `ProductMarketplace` (tipo base) ganhou `practicedPrice: string | null`.
- `UpdatePracticedPriceModal.vue`/`useUpdatePracticedPriceForm.ts`
  generalizados pra aceitar só o mínimo necessário
  (`PracticedPriceTarget = Pick<ProductMarketplace, 'id' | 'practicedPrice'
  | 'productId'>`) em vez do `ProductMarketplacePricing` inteiro — as duas
  telas editam o MESMO vínculo `PRODUCT_MARKETPLACE`, só serializado por
  2 Resources diferentes do backend (`ProductMarketplaceResource` vs.
  `ProductMarketplacePricingResource`), então reaproveitar o modal é
  reaproveitar a operação de verdade, não só copiar UI parecida. `label`
  virou prop explícita (`description` do `Modal`) — cada consumidor
  decide o subtítulo (nome do PRODUTO numa tela, `"{marketplace} —
  {loja}"` na outra), o modal não sabe de onde a linha veio.
- Nova coluna "Preço praticado" em `ProductMarketplacesView.vue` (entre
  "Categoria" e "Vinculado em"), mesmo par ícone-de-lápis+valor já usado
  em `ProductMarketplacePricingView.vue`.
- Verificado em browser real contra a API de verdade: a coluna mostra
  `R$ 55,50` (preço seedado), abrir o modal mostra o subtítulo "Shopee —
  Loja Verify PM" corretamente, editar pra `123,45` dispara o `PATCH`
  real (`200`) e a tabela atualiza sem reload.

**Reescrita completa reaproveitando o visual do mockup, 2026-09-03,
pedido direto do usuário** ("temos uma tela linda de precificação a do
mockup, pq vc nao usou ela? se faltar campos peça ao backend") — a v1
desta tela (`DataTable` simples, colunas numéricas soltas) foi
substituída pela barra empilhada + alternância barra/tabela + copiar
preço de `PricingDashboardMockupView.vue`, agora com dado 100% real.
Causa da v1 ter ficado mais pobre que o mockup: a API só devolvia preço
final + lucro agregado, sem a quebra por parcela (custo/comissão/taxa
fixa/operacional/imposto/ads/lucro) que a barra precisa pra desenhar os
segmentos — pedido de campo novo ao backend
(`pricing.suggested_breakdown`/`practiced_breakdown`, ver
`ProductMarketplacePricingCalculator.php`, que já calculava cada parcela
internamente e só não expunha), atendido no mesmo dia.

- **Não é reuso 1:1 do markup do mockup** — 3 diferenças reais:
  1. **Sem `TabBar`** — o contrato real é por UMA conexão
     (`userMarketplaceId`) por vez, não multi-marketplace simulado.
  2. **7 segmentos, não 8** — sem "Comissão campanha":
     `USER_MARKETPLACE.campaignDiscountPercentage` não entra na fórmula
     real (confirmado com o backend, campo só armazenado sem uso ainda),
     era 100% especulado no mockup. `SEGMENT_KEYS`/`buildPriceSegments`/
     `resolveActivePricing` (`services/pricingBreakdown.ts`, testado —
     `tests/modules/pricing/services/pricingBreakdown.test.ts`) — mesma
     régua de "decisão de negócio real merece teste" já usada em
     `buildProductSortParam`.
  3. **Dois preços por produto agora** (praticado E sugerido, não um
     `salePrice` só) — `resolveActivePricing()` decide qual vira a barra
     principal: PRATICADO quando existe (a situação real — "quanto estou
     ganhando de verdade"), senão SUGERIDO (nada real ainda, mostra a
     recomendação, com `Badge` "Sugerido" ao lado do preço). Quando o
     praticado é o principal, uma linha secundária mostra o sugerido +
     botão de copiar + aviso de aproximação (mesmo ícone/tooltip já
     existente na v1).
- **`widthPercent` de cada segmento nunca fica negativo** (`Math.max(...,
  0)`, testado) — `profit` pode vir negativo de verdade (prejuízo, preço
  praticado baixo demais), mas `flex-basis` negativo é inválido em CSS;
  sem o clamp as parcelas positivas somariam mais que 100% da barra. O
  `overflow: hidden` do container (reaproveitado do mockup) corta o
  excesso — barra fica "cheia" sem verde de lucro visível, comunicação
  razoável de "não cobre nem os custos" sem quebrar layout.
- **Cor do preço/margem é vermelha quando o resultado é ruim de
  verdade** — margem negativa (sinal claro, independe de meta) OU
  `meetsTargetMargin: false` no preço praticado; verde nos outros casos,
  inclusive sugerido (que por construção sempre bate a meta — é o preço
  que RESOLVE pra ela). Confirmado em browser real: um produto com
  preço praticado propositalmente baixo (13% de margem contra meta de
  20%) rendeu `rgb(255, 71, 71)` via `getComputedStyle` — a checagem
  visual a olho nu no screenshot (baixa resolução) tinha sido enganosa,
  só a leitura programática confirmou a cor certa.
- **Sem busca/KPIs** — mesma disciplina já documentada na v1: API só
  pagina/ordena, um "faturamento total" calculado só sobre a página
  atual (15 itens) seria enganoso perto do catálogo inteiro.
- Verificado em browser real contra a API de verdade (5 produtos reais,
  1 sem preço praticado, 1 com margem abaixo da meta): barra renderiza
  os 7 segmentos com a rampa de cor correta, badge "Sugerido"/hint
  secundário aparecem nos casos certos, copiar preço sugerido funciona
  (clipboard confirmado), editar o preço praticado de um produto sem
  preço (`PATCH` `200`) atualiza a barra/badge/margem em tempo real sem
  reload, visão em tabela mostra as mesmas 7 colunas de parcela + preço
  com os mesmos botões, rolagem horizontal do wrapper (`overflow-x:
  auto` do `DataTable.vue`) revela as ações completas sem estourar a
  página.

**3 correções pedidas direto pelo usuário no mesmo dia, com captura
mostrando o preço inteiro colorido de verde** ("so a porcentagem mude a
cor, outro ponto tem q deixar explicito o q é preço sugerido e botar o
preço praticado" + "onde tem valor pago, coloque custo, quando der lucro
é verde, quando fica no 0x0 amarelo e prejuizo é vermelho, na visão de
coluna coloque em colunas separadas o preço praticado e sugerido"):

1. **Cor só na porcentagem, nunca no valor em R$** — a regra anterior
   (`isNegativeOutcome`) e a marcação HTML aplicavam a classe de cor no
   `<p>` inteiro (`__product-price`), incluindo o valor monetário; a
   classe agora vive só no `<span>` da porcentagem
   (`__product-margin--positive/--neutral/--negative`), o valor em R$
   fica sempre `{colors.ink}`.
2. **Regra de cor trocada de "margem negativa OU abaixo da meta" pra um
   sinal direto de 3 estados sobre o LUCRO** (`outcomeTone`,
   `services/pricingBreakdown.ts`, testado) — verde quando `profit > 0`,
   amarelo no empate exato "0x0" (`profit === 0`), vermelho no prejuízo
   (`profit < 0`). Mais simples e a mesma leitura em qualquer coluna
   (praticado ou sugerido), sem depender de saber qual preço é o
   "ativo" nem de `meetsTargetMargin`. `computeMarginPercent` (mesmo
   arquivo, testado) extraído de dentro de `resolveActivePricing` pra
   ficar reutilizável — a tabela agora precisa calcular a margem do
   sugerido MESMO quando o praticado é quem manda na barra (ver item 3).
3. **"Valor pago" virou "Custo"** (`segments.costPrice` no catálogo
   i18n) — nome mais direto pro primeiro segmento da barra/coluna.
4. **Visão de tabela: praticado e sugerido viram 2 colunas sempre
   visíveis** (`Preço praticado`/`Preço sugerido`), não mais uma coluna
   só com o preço "ativo" + Badge + hint secundário (esse padrão
   continua exclusivo da visão em barra, onde só cabe 1 preço em
   destaque por linha). `PricingTableRow` ganhou os dois conjuntos
   completos (`practicedPrice`/`practicedMarginPercent`/
   `practicedProfit`, todos `null` juntos quando ainda não há preço
   praticado — os 3 nascem/faltam em conjunto — e
   `suggestedPrice`/`suggestedMarginPercent`/`suggestedProfit`, este
   último sempre presente). Célula de "Preço praticado" mostra um
   `—` (mesma classe `__suggested-hint`, `{colors.ink-40}`) quando
   `null`, com o botão de editar do lado; célula de "Preço sugerido"
   sempre tem valor, com os botões de copiar/ver marketplaces. As 7
   colunas de parcela (Custo/Comissão/Fixo/Operacional/Imposto/Ads/
   Lucro) continuam vindo do breakdown do preço "ativo"
   (praticado-quando-existe-senão-sugerido) — só as 2 colunas de PREÇO
   foram desdobradas, não a composição de custo inteira, escopo do
   pedido era só sobre os preços.
- Reverificado em browser real com 3 produtos (sugerido puro, praticado
  com lucro, praticado com prejuízo) e `getComputedStyle` em cada
  `__product-price`/`__product-margin`: o valor em R$ resolve sempre
  `rgb(0, 0, 0)` (nunca colorido) nas duas visões; a porcentagem resolve
  `rgb(113, 221, 140)` (verde) no caso de lucro e `rgb(255, 71, 71)`
  (vermelho) no de prejuízo — o caso neutro (amarelo, `profit === 0`)
  não foi reproduzido no browser (não dá pra forçar um lucro
  EXATAMENTE zero digitando um preço via UI, os centavos nunca fecham
  redondo contra comissão percentual + taxa fixa), coberto só pelo
  teste unitário de `outcomeTone('0')`; tabela mostra as colunas "Preço
  praticado"/"Preço sugerido" lado a lado, com `—` + lápis na linha sem
  preço praticado ainda.

**2 mudanças de fórmula do backend, 2026-09-03, aviso cross-session da
sessão de backend (mesma planilha real, confirmadas com o usuário antes
de codar do lado deles — dinheiro de verdade)**:

1. **`affiliate_percentage` entrou no cálculo** — 8ª parcela no
   breakdown (`PricingBreakdown.affiliate`), mesmo tratamento de `ads`
   (deduzida do lucro). Como a barra/legenda/colunas de segmento já
   iteram `SEGMENT_KEYS` dinamicamente (nunca hardcoded no template),
   bastou adicionar `'affiliate'` no array (entre `'ads'` e `'profit'`,
   `services/pricingBreakdown.ts`) + a cor da rampa sequencial
   (`color-mix(in srgb, {colors.accent-red} 20%, {colors.ink})`, mais
   perto do preto que `ads` — continua a progressão custo→lucro) + o
   label `segments.affiliate: 'Afiliado'` no catálogo — nenhuma mudança
   de template. `PricingBreakdown`/`toPricingBreakdown()`
   (`productMarketplacePricing.type.ts`) e os 3 fixtures de teste
   (`pricingBreakdown.test.ts`) atualizados pro novo campo.
2. **`suggestedCampaignPrice`/`practicedCampaignPrice`** (novo par em
   `PricingEvaluation`, "VALOR DO ANÚNCIO PARA DESCONTO" da planilha) —
   o preço MAIOR que o vendedor precisa anunciar pra, depois do
   desconto de campanha configurado (`USER_MARKETPLACE.campaignDiscountPercentage`),
   ainda render o preço sugerido/praticado de verdade
   (`precoAtivo ÷ (1 − desconto%)`). **Pedido explícito da sessão de
   backend, repassado pelo usuário**: like o valor sozinho na tela
   convida a leitura invertida (achar que É o preço com desconto já
   aplicado, o oposto do que é) — o texto precisa deixar isso claro, não
   só o número solto. Resolvido com um rótulo autoexplicativo direto no
   texto visível (`campaignPriceLabel`: "Preço a anunciar (compensa o
   desconto de campanha)"), não escondido só num tooltip — o `Tooltip`/
   ícone `Info` (mesmo padrão de `isApproximatedTooltip`) entra como
   reforço COM o texto completo da ressalva, não no lugar dele.
   - **`hasCampaignMarkup(campaignPrice, price)`** (`pricingBreakdown.ts`,
     testado) — só mostra a linha quando `campaignPrice > price` de
     verdade (desconto de campanha configurado). Sem desconto
     configurado (`null`/`0%` em `USER_MARKETPLACE`), o backend devolve
     o preço de campanha IGUAL ao preço de venda (divide por `1 − 0%`)
     — repetir o mesmo número com um rótulo a mais seria ruído puro,
     nem todo vendedor roda campanha com desconto.
   - **Bar view**: nova linha (mesma classe `__suggested-hint` do hint
     de "Sugerido: R$ X") logo abaixo do preço ativo, sempre que
     `hasCampaignMarkup(active.campaignPrice, active.price)` — aparece
     independente de `isPracticed` (é sobre o preço ATIVO, não um dos
     dois específico).
   - **Table view**: mesma linha dentro de CADA célula de preço
     (`Preço praticado`/`Preço sugerido`), comparada contra o preço
     daquela coluna especificamente (`practicedCampaignPrice` vs.
     `practicedPrice`, `suggestedCampaignPrice` vs. `suggestedPrice`) —
     precisou envolver o preço+hint num `div.__prices` (já existente,
     reaproveitado do bar view) dentro da célula, que antes só tinha o
     `<p>` de preço solto ao lado dos botões (`display:flex` da célula
     não empilhava verticalmente sem esse wrapper).
- Verificado em browser real contra a API de verdade (conexão com
  `campaign_discount_percentage: 20`, 2 produtos — 1 só sugerido, 1
  praticado): legenda/colunas mostram "Afiliado" corretamente nas duas
  visões; hint "Preço a anunciar (compensa o desconto de campanha): R$
  X" aparece nas 2 visões, sempre MAIOR que o preço de venda ao lado
  (`R$ 69,68` > `R$ 55,74` sugerido; `R$ 125,00` > `R$ 100,00`
  praticado; `R$ 120,54` > `R$ 96,43` sugerido da 2ª linha); tooltip do
  ícone `Info` mostra o texto completo da ressalva ao passar o mouse.

## HelpView (`shared/views/HelpView.vue`)

**Central de Ajuda, pedido direto do usuário, 2026-09-03**: "quero
aproveitar que voce consegue tirar screenshot e montar um faq step by
step" — guia passo a passo com screenshots reais (não mockup) da
jornada completa (empresa → conectar marketplace → cadastrar produto →
vincular produto ao marketplace → conferir precificação → praticar
preço), usando a Shopee como exemplo por ser o único marketplace com o
motor de precificação já validado (`ProductMarketplacePricingView`,
seção acima).

- **Conteúdo é 100% estático** — `public/guides/onboarding/shopee.json`
  (14 passos, cada um com `id`/`group`/`title`/`description`/`image`) +
  os screenshots na mesma pasta, gerados via Playwright contra a
  aplicação real (usuário/empresa/produto seedados, não dado
  inventado). `HelpGuide`/`HelpGuideStep` (`shared/types/help.type.ts`),
  `fetchHelpGuide()` (`shared/services/`) e `useHelpGuide()`
  (`shared/composables/`) — vive em `shared/`, não em
  `modules/<contexto>/`, porque não mapeia pra nenhum Bounded Context do
  backend (mesmo precedente de `ShowcaseView.vue`/
  `PricingDashboardMockupView.vue`).
- **`fetchHelpGuide()` usa `fetch()` nativo, não `core/api/client.ts`**
  — decisão registrada explicitamente no comentário do arquivo: o guia é
  um JSON estático servido pelo próprio frontend (build da Vite), não um
  endpoint da API do backend (sem sessão/CSRF/`VITE_API_BASE_URL`). A
  régua de "nunca `fetch()` fora de `services/`" continua valendo (por
  isso a chamada mora num `service` próprio) — só a exceção do cliente
  axios não se aplica a esse caso específico.
- **`clampStepIndex`/`groupHelpSteps` são funções puras, testadas**
  (`tests/shared/composables/useHelpGuide.test.ts`) — mesmo critério já
  usado em `PaginationNav`/`resolveBreadcrumbItems`: lógica de estado
  (bounds do índice atual, agrupamento preservando ordem de primeira
  aparição) extraída pra fora do composable especificamente pra ser
  testável sem montar componente nenhum.
- **Só existe UM guia hoje, `GUIDE_PATH` fixo no componente** — sem
  seletor de guia nem rota parametrizada (`/help`, sem `:guideId`).
  Generalizar pra múltiplos guias (outro marketplace) é a extensão
  natural se um segundo guia aparecer; antecipar isso agora seria
  abstração sem caso de uso real (mesmo critério do resto do projeto).
- **Alcançada por um ícone novo no `AppHeader`** (`Question`, entre os
  ícones de ação — tema/notificações), não por item de sidebar — mesma
  categoria de "ação global, independente de onde você está no app" já
  usada pra tema/notificações, diferente de conteúdo de domínio
  (Produtos, Canais de venda) que vive na sidebar.
- **Layout: título+navegação de passo numa linha só, ANTES da imagem —
  2 rodadas de correção pedidas direto pelo usuário no mesmo dia.** A
  1ª versão botava a imagem (screenshot em tamanho natural, bem alto)
  ANTES do título/descrição/botões — resultado: "Anterior"/"Próximo"
  só ficavam visíveis depois de rolar a página, o usuário não via os
  botões de cara. Corrigido reordenando o template (progresso → título+
  botões → descrição → imagem) e juntando o `<h2>` do passo com os 2
  `Button` de navegação numa `flex` row só (`justify-content:
  space-between`), economizando uma linha inteira de altura. **A
  imagem, depois de uma tentativa de limitar a altura em `vh`
  (`object-fit: contain`) pra garantir que tudo coubesse em ~100vh,
  voltou pro tamanho original a pedido explícito do usuário** — a
  reordenação já resolvia o problema real (botões visíveis sem rolar),
  então limitar a altura da imagem era uma segunda mudança sem
  necessidade, só deixando os screenshots pequenos demais pra ler o
  conteúdo.
- **Passo da "empresa" reapontado pra `/account`, não pra
  `/company-registration`, achado real reportado pelo usuário**: a 1ª
  versão usava 2 screenshots da tela de ONBOARDING (`CompanyRegistrationView`,
  vazia e preenchida) — mas essa tela só é alcançada automaticamente
  durante o cadastro (`requiresCompany` guard), sem link nenhum no app
  pra voltar nela depois. Um guia de ajuda que aponta pra uma tela que o
  usuário não consegue "ir até" de novo (fora de repetir o fluxo de
  cadastro) não serve pra consulta contínua. Substituído por 1 screenshot
  só de `/account` (seção "Empresa", o mesmo `CompanyForm.vue`
  reaproveitado nas duas telas) — sempre alcançável a partir do avatar
  do usuário na sidebar, e reduz 2 passos artificiais (vazio/preenchido)
  pra 1 passo real ("revise a qualquer momento"). Textos/numeração dos
  outros 13 passos e nomes de arquivo renumerados junto (`01`–`14`).
- **Passo "Vínculo criado" completado com o que faltava, reportado pelo
  usuário**: a descrição original só explicava que o vínculo alimenta o
  motor de precificação, sem mencionar a coluna "Preço praticado" —
  visível no próprio screenshot (com "—" + ícone de lápis), que também
  permite registrar o preço praticado DIRETO dali, o mesmo dado que
  aparece na tela de precificação (seção `ProductMarketplacePricingView`
  acima) só que organizado por PRODUTO em vez de por MARKETPLACE. Texto
  atualizado pra explicar essa dualidade.
- Verificado em browser real: os 14 passos carregam e navegam
  corretamente (clique na lista lateral e nos botões Anterior/Próximo,
  incluindo os dois ficarem `disabled` nas pontas), progresso "Passo X
  de 14" acompanha, ícone "Ajuda" do `AppHeader` navega pra `/help`.

**Bug real de produção, reportado pelo usuário em 2026-09-03 — F5 na
rota `/help` entrava em loop de carregamento infinito e acabava
redirecionando pra `dominio.com:5173`** (navegação via SPA continuava
funcionando normal — só quebrava no reload/acesso direto pela URL, já
que a navegação da SPA nunca passa pelo nginx). Causa raiz, confirmada
direto no `docker/nginx.conf`:

1. `public/guides/onboarding/...` tinha nascido como `public/**help**/onboarding/...`
   — MESMO nome da rota `/help`. O build da Vite copia `public/` pra
   `dist/` tal como está, então isso virava uma pasta REAL `dist/help/`
   no servidor.
2. `try_files $uri $uri/ /index.html;` — pedindo `/help` (sem barra),
   nginx via que `/help/` (com barra) batia num DIRETÓRIO existente
   ANTES de cair no fallback `/index.html`, e disparava seu PRÓPRIO
   redirect 301 pra adicionar a barra final — nunca chegando no Vue
   Router.
3. Esse container escuta numa porta INTERNA (`listen 5173`, atrás do
   Traefik/Dokploy, que termina TLS no domínio público em 443) — o
   `Location` desse redirect automático, por padrão
   (`absolute_redirect on` é o default do nginx), usa host+PORTA DE
   ESCUTA do próprio nginx pra montar a URL absoluta, vazando a porta
   interna `5173` — não roteável fora da rede do container — direto pro
   navegador do usuário. Dava exatamente o sintoma relatado: a URL na
   barra de endereço virava `dominio.com:5173/help/`, uma porta
   inatingível pela internet pública, e a conexão simplesmente travava.

**Corrigido em 3 frentes** (a 1ª já bastaria pra ESTE caso específico, as
outras 2 são defesa contra qualquer colisão do mesmo tipo no futuro):

1. Pasta estática renomeada `public/help/` → `public/guides/` — elimina
   a colisão de nome com a rota `/help` (nenhuma pasta em `public/`
   deve levar o nome de uma rota da SPA, regra geral daqui pra frente).
2. `try_files $uri /index.html;` (`docker/nginx.conf`, `$uri/` removido)
   — sem o parâmetro de diretório, só um ARQUIVO de verdade intercepta o
   fallback; qualquer rota da SPA, mesmo colidindo de nome com uma pasta
   estática futura, sempre cai em `/index.html`. Assets em `public/`
   continuam servidos normalmente (são arquivos, `$uri` sozinho já
   resolve).
3. `absolute_redirect off;` (`docker/nginx.conf`) — qualquer redirect
   que o nginx venha a gerar sozinho no futuro (esse cenário ou outro)
   emite só o PATH no `Location`, nunca host:porta — o navegador resolve
   contra o host/porta que ele já está usando de verdade (o domínio
   público via Traefik), a porta interna do container nunca mais
   aparece numa resposta.
- Verificado localmente com nginx real (Docker, `docker/nginx.conf` +
  `dist/` da build de produção montados, replicando a mesma colisão de
  nome antes da correção): `curl -I http://localhost:5173/help`
  ANTES da correção devolvia `301 Location: http://localhost:5173/help/`
  (a mesma classe de bug, porta vazada); DEPOIS das 3 correções, a mesma
  chamada devolve `200` servindo `index.html` direto, sem redirect
  nenhum — F5/acesso direto em `/help` funciona igual à navegação via
  SPA.

