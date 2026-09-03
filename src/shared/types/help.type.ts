/**
 * Guia de ajuda passo a passo — conteúdo 100% estático (`public/help/**.json`,
 * pedido direto do usuário em 2026-09-03: "montar um faq step by step...
 * gerar um json com os prints e os textos de orientação"), nunca gerado
 * a partir do schema OpenAPI (não é dado da API do backend). `group`
 * agrupa passos relacionados na navegação lateral do guia
 * (`HelpView.vue`) — vocabulário próprio do conteúdo, resolvido pra texto
 * via `help.groups.*` no catálogo i18n.
 */
export interface HelpGuideStep {
  description: string
  group: string
  id: string
  image: string
  title: string
}

export interface HelpGuide {
  description: string
  id: string
  marketplace?: string
  steps: HelpGuideStep[]
  title: string
}
