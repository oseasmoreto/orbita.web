export interface ChartSeriesConfig {
  /** Linha tracejada (série de comparação, ex.: "Last year") — só faz sentido pra `type="line"`. */
  dashed?: boolean
  label: string
  values: number[]
}

export interface ChartMetricOption {
  key: string
  label: string
}
