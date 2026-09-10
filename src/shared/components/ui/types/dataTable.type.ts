export interface DataTableColumn {
  /**
   * Alinhamento do conteúdo da coluna (cabeçalho + célula) — opcional,
   * default `'left'` (mesmo comportamento de sempre, nenhum consumidor
   * existente precisa mudar). `'right'` pedido direto do usuário,
   * 2026-09-04 ("deixe sempre alinhado a direita as celulas com
   * numeros") — colunas de valor monetário/numérico ficam mais fáceis
   * de comparar entre linhas quando alinhadas à direita (dígitos menos
   * significativos sempre na mesma posição vertical).
   */
  align?: 'left' | 'right'
  key: string
  sortable?: boolean
  /**
   * Fixa a coluna no scroll horizontal (`position: sticky; left: 0`) —
   * pedido direto do usuário, 2026-09-10 (`ProductMarketplacePricingView.vue`,
   * a tabela por conexão tem 10+ parcelas de breakdown, "deixar a coluna
   * com o nome do produto fixa no scroll lateral"). Pensado pra UMA
   * coluna (a primeira, visualmente à esquerda) — marcar mais de uma
   * como `sticky` empilha todas em `left: 0` e sobrepõe, então o
   * consumidor é quem garante isso, o componente não valida.
   */
  sticky?: boolean
  title: string
}

export type DataTableSortDirection = 'asc' | 'desc' | null
