import type { RouteLocationRaw } from 'vue-router'

export interface BreadcrumbItem {
  label: string
  /** Omitido no último item — a página atual não é um link, é só texto. */
  to?: RouteLocationRaw
}
