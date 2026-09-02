import type { components } from '@/core/api/schema'

type CompanyResource = components['schemas']['CompanyResource']

/**
 * `COMPANY` (Bounded Context Identity, tarefa 63 de `docs/api/ordem-de-implementacao.md`
 * no repo `backend`) — singleton por usuário: `id`/`name`/`document` (CPF
 * ou CNPJ)/`responsibleDocument` (CPF do responsável, obrigatório só
 * quando `document` é CNPJ — ver `companyFormSchema.ts`)/
 * `salesTaxPercentage` (imposto sobre venda, ainda sem uso em nenhuma
 * regra de precificação, mesmo status de `PRODUCT.operationalCost`).
 * `document` saiu de `USER` nesta mudança — mora só aqui agora.
 */
export interface Company {
  createdAt: CompanyResource['created_at']
  document: CompanyResource['document']
  id: CompanyResource['id']
  name: CompanyResource['name']
  responsibleDocument: CompanyResource['responsible_document']
  salesTaxPercentage: CompanyResource['sales_tax_percentage']
}

export function toCompany(resource: CompanyResource): Company {
  return {
    createdAt: resource.created_at,
    document: resource.document,
    id: resource.id,
    name: resource.name,
    responsibleDocument: resource.responsible_document,
    salesTaxPercentage: resource.sales_tax_percentage,
  }
}
