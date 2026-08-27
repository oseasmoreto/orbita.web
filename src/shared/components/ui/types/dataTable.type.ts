export interface DataTableColumn {
  key: string
  sortable?: boolean
  title: string
}

export type DataTableSortDirection = 'asc' | 'desc' | null
