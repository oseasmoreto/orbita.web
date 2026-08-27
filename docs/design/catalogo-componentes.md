# Catálogo de Componentes de UI — Micro/Macro e Ordem de Implementação

Fonte: página **"🔶 Components"** do arquivo Figma
[Dashboard Design System (Community)](https://www.figma.com/design/yJ24tdCVyBRTAyLvplYoZE/Dashboard-Design-System--Community-?node-id=1246-28355),
lida via MCP em 2026-08-27. Este documento categoriza os 24 frames dessa
página segundo a mesma régua micro/macro já definida em
`docs/infra/convencoes-frontend-infra.md` (seções 3.1/3.2) — não redefine a
régua, só aplica ela a um catálogo real — e propõe uma ordem de construção
amarrada às fases de `docs/planejamento/plano-implementacao.md`.

Regra de bolso (detalhe completo no doc de convenções):
- **Micro** (`shared/components/ui/`): átomo, não sabe de domínio, não faz
  chamada de API. Se tem comportamento complexo (foco, teclado, ARIA), é
  construído em cima de um primitivo Reka UI, nunca do zero.
- **Macro** (`shared/components/blocks/` ou `modules/<contexto>/components/blocks/`):
  composição de 2+ micro, pode ter lógica de apresentação, mas nunca regra
  de negócio (decisão vem de um composable via prop).

---

## 1. Reimplementados contra a spec real (concluído em 2026-08-27)

`Button.vue`/`Input.vue`/`Icon.vue` já existiam no repo desde a Fase 0, mas
tinham sido construídos **antes** de revisar o Figma real — não batiam com
a spec. Reimplementados do zero, verificados em browser real (typecheck +
lint + biome + build + screenshot + hover programático).

| Figma | Componente | O que a versão antiga errava | O que mudou |
|---|---|---|---|
| Button | `Button.vue` | Eixo `size` tinha `sm`/`md`/`lg` (Figma só define `Medium`/`Large`); eixo `variant` tinha `danger` (não existe no Figma) e faltava `Outline`; eixo `icon` inteiro não existia (Figma tem `Icon Before`/`After`/`Only`/`Text Only`/`Icon-Icon`/`Icon-Text-Icon`); hover do `primary` usava `filter: brightness(92%)`, que **não tem efeito nenhum sobre preto puro** (achado real, confirmado via hover programático — o botão antigo nunca mudava de cor no hover). | `size: medium\|large`, `variant: primary\|secondary\|outline\|ghost`, props `icon-before`/`icon-after` (cobrem as 6 combinações do Figma sem precisar de um enum de variante de ícone), hover do primary via token `$color-primary-hover` (`#494949`, medido no componente real). |
| — (Form → `Type=Input-A`/`Input-B`) | `Input.vue` | Não distinguia os dois tipos do Figma; usava `{colors.bg-2}` como fundo (Figma usa `{colors.bg-1}`, branco). | Prop opcional `label`: ausente = Input-A (campo isolado, padding `8px 16px`); presente = Input-B (label 12px dentro da mesma caixa, padding `16px 20px`) — mesmo componente, um wrapper a mais pra acomodar o label sem duplicar o átomo. |
| — | `Icon.vue` | Nada — arquitetura (wrapper fino + prop `icon`) já estava correta. | Nenhuma mudança de código. Confirmado que o ícone dentro de `Button` é 20px (medium)/28px (large) — diferente do ícone de apoio de Select/Date (16px, ainda não implementado). |

**Achado operacional, não sobre o componente**: a API REST do Figma no
plano free tem rate limit curto — bateu no limite (`429`, retry-after de
~4,6 dias) no meio da pesquisa de detalhe do Button. As medidas de
`Input`/`Icon` já tinham sido capturadas antes disso na leitura inicial da
página inteira (ver seção 2 mais abaixo pra tiers seguintes) — não afetou
o resultado deste tier, mas os próximos tiers vão precisar trabalhar só
com o que já foi capturado até aqui (sem chamada nova ao Figma por uns
dias) ou pedir pro usuário validar visualmente contra o arquivo original.

---

## 2. Micro (átomos) — a implementar

| Figma | Componente proposto | Nota |
|---|---|---|
| Badge-Tag | `Badge.vue` | Tag genérica, ícone opcional antes/depois, 2 tamanhos de texto — já citado como exemplo de micro na seção 3.1 do doc de convenções. |
| Label | Avaliar se é prop de `Badge` (`variant="status"`) ou componente próprio `StatusBadge.vue` | Pill de status (In Progress/Approved/Rejected...) com/sem fundo — sobrepõe conceitualmente com Badge, decidir na hora de implementar, não duplicar átomo. |
| Avatar-Name | `Avatar.vue` | Imagem/inicial em formato circular; variante com nome ao lado é composição, não o átomo em si. |
| Form → `Type=CheckBox` | `Checkbox.vue` ✅ | Concluído — construído sobre `CheckboxRoot` da Reka UI, usando os próprios ícones `Checkbox`/`Checkbox2`/`Checkbox3`/`Checkbox5`/`Checkbox6`/`Checkbox8` de `docs/icons-snow-ui/` como estado renderizado (não só referência). |
| Form → `Type=Switch` | `Toggle.vue` ✅ | Concluído — `SwitchRoot`/`SwitchThumb` estilizados via CSS (token de espaçamento/raio), não com os ícones planos do Figma (matam a transição de deslizar). Dimensões não verificadas no Figma (rate limit), ver seção "Ordem de implementação". |
| Form → `Type=Select-A/B`, Dropdown | `Select.vue` ✅ | Concluído — família `Select*` da Reka UI. Ícone do trigger é `CaretUpDown` (regular.generated) — "ArrowLineUpDown" do Figma não existe no export. Achado real: `SelectContent` teletransporta pro `<body>` via `SelectPortal`, escapando do escopo do Vue — precisou de `:global()` nas regras (ver design-system.md, seção Components → Select). |
| Search | Variante de `Input.vue` (`type="search"` + ícone) | `Type=Grey/White/Typing` são estado visual, não justificam componente novo. |
| _Tab Item | `Tab.vue` | Trigger individual (`State=Unselected/Selected`), construído em cima do primitivo Reka UI `Tabs`. |
| OS → ToolTips | `Tooltip.vue` | Primitivo Reka UI `Tooltip`, já previsto na seção 3.1. |
| OS → Data loading | `Spinner.vue` | Já temos o ícone (`Loading`/`Loading1` gerados em `docs/icons-snow-ui/`) — o componente é só o wrapper com animação de rotação. |
| Featured Icon | `IconTile.vue` (nome a definir) | Ícone grande dentro de um container arredondado — usado como hero de empty-state/card, não domínio. |

---

## 3. Macro (blocos) — a implementar

| Figma | Componente proposto | Nota |
|---|---|---|
| Form (como conjunto) | `FormGroup.vue` (`shared/components/blocks/`) | Já citado na seção 3.2 do doc de convenções. Agrupa Label+Input/Select/Checkbox+mensagem de erro — composição, nunca decide regra de validação (isso é do composable `use<Recurso>Form`). |
| Table Components | `DataTable.vue` (`shared/components/blocks/`) | Já citado na seção 3.2. Bloco mais rico do catálogo — variantes de célula (`Type=Status/Date/Text-Icon/Users/User/Activity/Operation/Select/Title`...) viram slots/props de coluna, não componentes separados. |
| Breadcrumb | `Breadcrumb.vue` | Composição de `Button`/link + separador. |
| Tabs (a barra, não o item) | `TabBar.vue` ou uso direto do primitivo Reka UI `Tabs` + `Tab.vue` | O frame "Tabs" mistura `BlockTab` (Tab + linha + Badge-Tag) e `TopTab` (grupo de Buttons) — dois padrões de navegação por abas, avaliar qual(is) a Orbita realmente precisa antes de construir os dois. |
| Notification (item) | `NotificationItem.vue` (`modules/platform/components/`) | `State=Failure/Successful`, `Size=Big/Small` — item de uma lista de notificações (Fase 5), não o toast (`vue-sonner` já cobre toast avulso). |
| Widget → `Card`/`Status`/`Info` | `Card.vue`, `StatCard.vue` (nomes a definir) | Cascas de card de dashboard — construir a casca não depende do backend, mas o conteúdo real (preço sugerido) segue bloqueado pelo gap já registrado em `plano-implementacao.md` (Fase 4). |
| Chart (Histogram/ChartDot/Ring/ChartScale) | `ChartCard.vue` (wrapper `chart.js`+`vue-chartjs`) | Já é regra o wrapper de gráfico ser sempre um block (seção 3.2). Mesmo bloqueio de backend do item anterior. |
| Date Picker | `DatePicker.vue` | Primitivo Reka UI (Popover + calendário) — o mais complexo do catálogo, variantes com hora/intervalo aumentam o escopo. Baixa prioridade — nenhuma tela do plano atual exige filtro de data ainda. |
| Layout → `_Sidebar Item` + `Header-A` | `core/layouts/AppLayout.vue` (sidebar + header) | **Não é um componente de UI solto — é infraestrutura de layout que falta desde a Fase 0.** Ver seção 4. |

**Gap encontrado, não achado no Figma**: `Modal`/`Dialog`/`ConfirmDialog` já é
exigido pela seção 3.1 do doc de convenções (primitivo Reka UI `Dialog`),
mas não existe frame próprio nessa página do Figma — construir direto sobre
o primitivo Reka UI + tokens do design system, sem referência visual do
Figma pra essa rodada.

---

## 4. Fora de escopo (não são componentes de UI pra implementar)

| Figma | Motivo |
|---|---|
| Typography | Guia de estilo (já documentado em `design-system.md`), não um componente. |
| Color Guidance | Guia de cor (idem), não um componente. |
| Design Notes (Cursors, Line/arrows) | Anotação interna do próprio Figma (cursor de mouse, seta de anotação) — não é UI de produto. |
| Brand (Logo, Copyright, Social Media) | Rodapé de marketing com redes sociais — Orbita é um dashboard autenticado, sem página pública de marketing nesse formato. |
| AI (RightBar, Chat bubble, Function Bar) | Painel de assistente de IA — nenhuma feature de IA existe no roadmap de nenhum dos docs do projeto. |
| OS → WindowControl | Chrome de janela desktop (minimizar/maximizar/fechar) — não aplicável a app web. |
| Layout (segunda ocorrência, `#4113:43109`) | Duplicata/sobra no arquivo Figma — sem conteúdo além de um ícone de stack, sem variantes reais. |

---

## 5. Ordem de implementação

Amarrada ao que `docs/planejamento/plano-implementacao.md` já diz que cada
fase precisa — não uma ordem nova e desconectada.

| Tier | Componente(s) | Por quê agora |
|---|---|---|
| 0 | `Button` ✅, `Input` ✅, `Icon` (sem mudança) | **Concluído em 2026-08-27**, reimplementados contra a spec real (seção 1) — variantes/tamanhos/cores medidos direto no Figma, verificado em browser real. `Icon.vue` não precisou de mudança de código, só confirmação de tamanho por contexto de uso. |
| 1 | `Checkbox` ✅, `Toggle` ✅, `Select` ✅ | **Concluído em 2026-08-27.** Fecha os átomos de formulário que a Fase 1 (Identity) já vai consumir em login/registro ("lembrar de mim", preferência, plano). |
| 2 | `AppLayout` (sidebar + header) | **Pré-requisito de infra, não coberto por nenhuma fase ainda** — toda tela depois do login (Fase 1 em diante) precisa da casca autenticada; hoje só existe `HomeView` placeholder sem layout nenhum. Construir logo depois dos átomos do Tier 1, antes de qualquer tela de negócio nova. |
| 3 | `Badge`, `Avatar`, `Tooltip`, `Spinner` | Átomos de apoio usados transversalmente (perfil no header, status em qualquer lista, loading de qualquer chamada assíncrona). |
| 4 | `FormGroup`, `Search` | Fecham a experiência de formulário completa — Fase 1 (`AccountView`) e Fase 3 (`ProductForm`). |
| 5 | `Modal`/`ConfirmDialog` | Necessário a partir da Fase 2 (cancelar assinatura) e reusado em praticamente toda fase depois (excluir produto, desconectar marketplace...). |
| 6 | `DataTable` | Bloco mais pesado do catálogo, mas é o que a Fase 3 (lista de produtos) e Fase 4 (marketplaces conectados) mais precisam. |
| 7 | `Select`/`Dropdown` como menu de ação de linha | Reaproveita o átomo do Tier 1 — só faz sentido depois do `DataTable` existir. |
| 8 | `Breadcrumb`, `Tab`/`TabBar` | Navegação secundária — ganha valor a partir da Fase 4/6, quando existem sub-seções (ex.: admin de marketplace com abas). |
| 9 | `NotificationItem` | Fase 5 (Platform). |
| 10 | `Card`/`StatCard`, `ChartCard` | Casca pronta pra Fase 4, mas conteúdo real de preço sugerido **continua bloqueado** pelo gap de backend já registrado (`PricingCalculator` nunca exposto em rota). |
| 11 | `DatePicker` | Mais raro — só entra quando alguma tela pedir filtro de data (ex.: auditoria na Fase 6). Menor prioridade do catálogo. |

Cada componente novo entra na seção "Components" de
`docs/design/design-system.md` no mesmo PR que o introduz (regra já
existente, não nova) — este catálogo é o roteiro de *quando*, o
design-system é a fonte de verdade de *como*.
