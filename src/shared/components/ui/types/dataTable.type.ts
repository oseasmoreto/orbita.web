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
  title: string
}

export type DataTableSortDirection = 'asc' | 'desc' | null
