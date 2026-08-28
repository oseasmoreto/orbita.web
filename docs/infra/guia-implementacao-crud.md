# Guia de implementação — CRUD padrão

Passo a passo pra implementar qualquer tela de CRUD do Orbita (listagem +
criar + editar + excluir) sem fugir do padrão já estabelecido com o
primeiro CRUD real do projeto (Produtos, `modules/catalog`,
2026-08-28 — `docs/planejamento/plano-implementacao.md`, Fase 3).

Este documento é a versão **humana**, com checklist e revisão — a versão
**para a IA seguir durante a implementação** é `.ai/rules/crud-pattern.md`
(mais terso, carregado automaticamente por path glob). Os dois descrevem
o mesmo padrão; este aqui existe pra quem vai revisar o PR ou planejar o
próximo CRUD sem reabrir o código do anterior pra lembrar a forma.

**Referência viva**: sempre que este guia e o código de `modules/catalog`
divergirem, o código vence — atualize este documento, não o contrário
(mesma régua de "não deixe a documentação divergir do código" do resto do
projeto).

---

## 1. Quando este guia se aplica

Uma tela que:
- Lista um recurso paginado, com busca e (opcionalmente) ordenação;
- Permite criar/editar esse recurso pelo mesmo formulário;
- Permite excluir com confirmação.

Não se aplica a: telas de detalhe sem edição, wizards de múltiplas
etapas, ou qualquer fluxo que não seja "listar + form único + excluir".

## 2. Pré-requisitos — checar antes de escrever qualquer linha

- [ ] O endpoint já existe no backend? Confirme em `core/api/schema.d.ts`
      (`components['schemas']['<Recurso>Resource']`,
      `Create<Recurso>Request`, `Update<Recurso>Request`,
      `operations['<recurso>.index'|'store'|'show'|'update'|'destroy']`).
      Se não existir, pare aqui — não implemente contra um contrato que
      ainda não foi gerado.
- [ ] Quais campos são obrigatórios/opcionais no `Create<Recurso>Request`?
      Isso define o schema Zod (passo 4).
- [ ] Quais campos o `index` aceita em `sort`/`filter`? Isso define o que
      a `DataTable` pode ordenar e o que a busca do `ListToolbar` filtra
      de verdade — **nunca ofereça ordenação/filtro que a API não aceita**.
- [ ] A rota vai exigir sessão autenticada (`meta.requiresAuth: true`)? Se
      a Fase 1 (Identity/login) ainda não estiver pronta no momento da
      implementação, isso pode ficar `false` temporariamente — registre
      isso como pendência real na Fase correspondente de
      `docs/planejamento/plano-implementacao.md`, não deixe implícito.

## 3. Passo a passo

Todos os arquivos vivem em `modules/<contexto>/`. Troque `<Recurso>` pelo
nome da entidade (ex.: `Product`) e `<contexto>` pelo Bounded Context
(ex.: `catalog`).

### 3.1 Tipo de domínio — `types/<recurso>.type.ts`

```ts
import type { components } from '@/core/api/schema'

type <Recurso>Resource = components['schemas']['<Recurso>Resource']

export interface <Recurso> { /* camelCase, campo a campo do Resource */ }

export function to<Recurso>(resource: <Recurso>Resource): <Recurso> { /* mapper */ }
```

Nunca redigite o shape à mão sem ancorar no `Resource` gerado (seção 6.1
de `docs/infra/convencoes-frontend-infra.md`) — se o backend mudar um
campo, isso precisa quebrar o build do frontend, não divergir em
silêncio.

### 3.2 Service real — `services/<contexto>Api.ts`

Uma função por chamada HTTP (`list<Recurso>s`/`create<Recurso>`/
`update<Recurso>`/`delete<Recurso>`), sempre via `apiClient`
(`core/api/client.ts`) — nunca `axios`/`fetch` direto. Ver
`modules/catalog/services/catalogApi.ts` como referência de forma
(parâmetros de paginação/filtro/sort, envelope de resposta).

### 3.3 Schema de validação — `schemas/<recurso>FormSchema.ts`

**Sempre uma fábrica, nunca um objeto estático** — mensagem de validação
é texto de UI, cai na regra não-negociável de i18n (`.ai/rules/i18n.md`):

```ts
export function create<Recurso>FormSchema(t: (key: string) => string) {
  return z.object({ /* ... t('<recurso>.form.errors.*') ... */ })
}
export type <Recurso>FormValues = z.infer<ReturnType<typeof create<Recurso>FormSchema>>
```

Toda regra de negócio replicável no cliente (ex.: "preço de venda ≥ preço
de compra", o exemplo canônico da seção 6.2 do doc de convenções) mora
aqui, com teste primeiro (`tests/modules/<contexto>/schemas/`).

### 3.4 Composable de listagem — `composables/use<Recurso>List.ts`

Wrap de `useResourceList<T>` (`shared/composables/`, genérico, já
testado) — só pluga o `service` e mapeia o `sortKey` da UI pro parâmetro
real de `sort` da API (função pura, testável isoladamente — ver
`buildProductSortParam` em `useProductList.ts`). Debounce de busca via
`refDebounced` do `@vueuse/core` (nunca um debounce escrito à mão).

### 3.5 Composable de formulário — `composables/use<Recurso>Form.ts`

Valida com o schema do passo 3.3 antes de chamar o service; em erro,
popula `errors` com o client-side E com `ApiError.fieldErrors` do 422;
mostra toast de sucesso via `useToast()` com mensagem resolvida por
`t('<recurso>.form.createSuccess'|'updateSuccess')`.

### 3.6 Formulário único — `components/<Recurso>Form.vue`

Um só componente pra criar E editar — prop `mode: 'create' | 'edit'`,
prop `<recurso>: <Recurso> | null`, emits `cancel`/`saved`. O texto do
botão de submit muda conforme `mode` (`t('...submitCreate')`/
`t('...submitEdit')`).

### 3.7 A view — `views/<Recurso>sView.vue`

Ordem fixa, de cima pra baixo:

1. `<h1>` com o título (i18n).
2. `ListToolbar` — `add-label` com texto explícito (nunca só ícone `+`),
   `search-placeholder` específico do que a busca realmente filtra.
   **`filterable`/`sortable` só ficam `true` se a view realmente escuta
   `@filter`/`@sort` com uma ação de verdade** — sem handler real,
   `:filterable="false"`/`:sortable="false"` com o motivo comentado no
   template (ver seção 5, "sem botão morto").
3. Banner de erro (`role="alert"`) quando `list.error` existe.
4. `DataTable` — coluna `operations` com `Editar`/`Excluir` como `Button`
   ícone+texto visíveis na própria linha (nunca escondidos atrás de um
   `DropdownMenu` nesse padrão). Colunas refletem só campos reais do
   recurso — nunca inventar coluna/badge que dependeria de dado que a API
   ainda não expõe.
5. `PaginationNav`.
6. `Drawer` (`size="md"`, lateral direito) envolvendo
   `<RecursoForm :mode :recurso @cancel @saved>`.
7. `ConfirmDialog` pra exclusão, ligado a `useConfirmAction`.

**`AppFooter` NÃO entra aqui** — é chrome global, montado uma vez em
`AppLayout.vue` (sticky no bottom, ao lado do `AppHeader` sticky no
topo). Nenhuma view individual monta seu próprio footer.

### 3.8 Rota e navegação

- `routes.ts` do módulo: `meta.title` é uma **chave i18n**
  (`'<contexto>.<recurso>s.title'`), nunca texto cru — resolvida via
  `i18n.global.t()` (fora de componente, ex. `router/guards.ts`) ou
  `useI18n().t()` (dentro de composable/componente, ex.
  `useBreadcrumb.ts`). Reaproveite a MESMA chave que a view usa no
  próprio `<h1>`, não duplique a string sob duas chaves.
- Registre a rota nova em `core/router/index.ts` (filha do `AppLayout`,
  igual `catalogRoutes`).
- Adicione o item real em `core/layouts/config/navigation.ts` — nunca um
  item sem `to` que devia navegar de verdade (isso só é aceitável nos
  itens de EXEMPLO da estrutura do Figma, documentados como tal).

### 3.9 Catálogo i18n

Antes de criar uma chave nova, confira `common.*` em
`core/i18n/messages/pt-BR.ts` — ação genérica de linha
(editar/excluir/visualizar/baixar/ações), nome de marketplace etc. já
tem chave lá, não duplique dentro do namespace do recurso. Todo o resto
(colunas, mensagens de erro do form, textos de botão) vira chave nova sob
um namespace próprio do recurso.

### 3.10 Testes

- `useResourceList`/`useCrudDrawer`/`useConfirmAction` genéricos **já
  estão testados** — não repita a cobertura deles no CRUD novo.
- Teste só o que é específico do recurso: a fábrica do schema Zod (com
  `(key) => key)` no lugar de `t` real), a função pura de mapeamento de
  `sort` (`buildXSortParam`), e qualquer regra de negócio do form.

## 4. Mock temporário — quando a Fase de auth ainda não existe

Se a rota precisa ficar acessível sem login (Fase 1/Identity ainda não
implementada) e o endpoint real 401 sem sessão, o interceptor global de
401 (`core/api/client.ts`, `UNAUTHORIZED_EVENT`) redireciona pro login
incondicionalmente — mesmo a rota não exigindo auth. Solução usada no
CRUD de Produtos (`modules/catalog/services/catalogApi.mock.ts`):

- Crie `services/<contexto>Api.mock.ts` com a MESMA assinatura/shape de
  retorno do service real (drop-in) — array em memória, paginação/busca/
  ordenação/CRUD completos, pra create/edit/delete refletirem na
  listagem durante a demonstração.
- Troque só o **import** nos 3 consumidores (`use<Recurso>List.ts`,
  `use<Recurso>Form.ts`, a view) pro `.mock`, com um comentário
  `MOCK TEMPORÁRIO` explicando o motivo e o caminho de reversão.
- **Nunca edite o service real pra "desviar" a chamada** — ele continua
  intacto, pronto pra voltar assim que a Fase 1 existir.

## 5. Checklist final antes do PR

- [ ] Toda string visível passa por `$t()`/`useI18n().t()` — incluindo
      dentro de `.ts` (schema Zod, `meta.title` de rota), não só `.vue`.
- [ ] Nenhum botão sem ação: todo `Button`/ícone clicável do toolbar ou
      da linha da tabela tem um handler real por trás. Se não tiver,
      removido ou desligado via prop (`filterable`/`sortable`), nunca
      deixado "por enquanto".
- [ ] Nenhuma coluna/badge inventada que dependeria de dado que a API
      ainda não expõe.
- [ ] `AppFooter` não foi importado na view (é chrome global).
- [ ] `useResourceList`/`useCrudDrawer`/`useConfirmAction` reaproveitados
      — nenhum estado de paginação/drawer/confirmação escrito à mão de
      novo.
- [ ] `typecheck`, `eslint`, `biome check` e `vitest run` passam limpos.
- [ ] Testado num browser real (ou explicitamente documentado que não
      deu, com o motivo) — listagem, criar, editar, excluir, e os estados
      de erro/vazio.
- [ ] `docs/planejamento/plano-implementacao.md` atualizado com status
      real (o que foi entregue, o que ficou pendente e por quê) — nunca
      aspiracional.
- [ ] Se algum comportamento novo do padrão foi decidido nesta rodada
      (ex.: uma variação do form, um jeito novo de lidar com um filtro),
      **atualize este guia e `.ai/rules/crud-pattern.md` juntos** — o
      próximo CRUD deve conseguir seguir só a documentação, sem precisar
      ler o código do anterior linha a linha.

## 6. Roteiro de revisão (self-review)

Antes de pedir revisão de outra pessoa, releia a view perguntando:

1. **Um usuário novo, sem contexto, entenderia o que cada botão faz só
   olhando a tela?** Texto explícito em ação primária (criar), ícone+
   texto em ação de linha (editar/excluir) — nunca só um ícone ambíguo
   pra ação destrutiva ou de criação.
2. **Alguma decisão de negócio (cálculo, validação, limite) vazou pro
   componente `.vue`?** Se sim, mover pro composable correspondente.
3. **O formulário valida no cliente o que o backend também valida?**
   Nunca confiar só no 422 de volta.
4. **Existe algum estado (loading/erro/vazio) sem tratamento visual?**
   Lista vazia, falha ao carregar, e envio em andamento (`isSubmitting`)
   precisam de feedback, não só a UI "travando" silenciosamente.
5. **Este CRUD, visto de fora, parece o mesmo padrão do anterior?** Se um
   revisor que conhece o CRUD de Produtos abrir este novo e estranhar a
   ordem dos elementos ou a forma dos composables, o padrão divergiu —
   volte na seção 3 e alinhe, ou justifique a divergência por escrito
   (uma necessidade real do recurso que o padrão genérico não cobre).
