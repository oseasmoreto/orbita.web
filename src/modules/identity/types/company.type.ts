import type { components } from '@/core/api/schema'

type CompanyResource = components['schemas']['CompanyResource']

/**
 * `COMPANY` (Bounded Context Identity, tarefa 63 de `docs/api/ordem-de-implementacao.md`
 * no repo `backend`) — singleton por usuário: `id`/`name`/`document` (CPF
 * ou CNPJ)/`responsibleDocument` (CPF do responsável, obrigatório só
 * quando `document` é CNPJ — ver `companyFormSchema.ts`)/
 * `salesTaxPercentage` (imposto sobre venda, ainda sem uso em nenhuma
 * regra de precificação, mesmo status de `PRODUCT.shippingCost`).
 * `document` saiu de `USER` nesta mudança — mora só aqui agora.
 *
 * `taxRegime` (2026-09-08, pedido direto do usuário) — regime tributário
 * da empresa (`'individual' | 'mei' | 'simples_nacional'`, nullable).
 * **Puramente informativo, sem nenhuma regra de bloqueio no backend** —
 * o aviso de que portes maiores não são suportados pela plataforma é
 * texto de UI (`CompanyForm.vue`), nunca uma validação real.
 *
 * `operationalCostPercentage` (2026-09-08, pedido direto do usuário) —
 * percentual de custo operacional do vendedor, nullable, valor SÓ PRA
 * EMPRESA TODA (mesmo tratamento de `salesTaxPercentage`, não varia por
 * conexão/canal). **Achado real, mesmo dia**: a 1ª versão deste campo
 * tinha sido implementada em `USER_MARKETPLACE` (por conexão) — o
 * usuário corrigiu com o backend logo em seguida, confirmando que o
 * valor é único por empresa. Entra na fórmula de precificação deduzido
 * do lucro, exposto no breakdown como
 * `pricing.*_breakdown.operationalCost`
 * (`productMarketplacePricing.type.ts`) — contrato de resposta do
 * breakdown não mudou, só a FONTE do dado.
 */
export interface Company {
  createdAt: CompanyResource['created_at']
  document: CompanyResource['document']
  id: CompanyResource['id']
  name: CompanyResource['name']
  operationalCostPercentage: CompanyResource['operational_cost_percentage']
  responsibleDocument: CompanyResource['responsible_document']
  salesTaxPercentage: CompanyResource['sales_tax_percentage']
  taxRegime: CompanyResource['tax_regime']
}

export function toCompany(resource: CompanyResource): Company {
  return {
    createdAt: resource.created_at,
    document: resource.document,
    id: resource.id,
    name: resource.name,
    operationalCostPercentage: resource.operational_cost_percentage,
    responsibleDocument: resource.responsible_document,
    salesTaxPercentage: resource.sales_tax_percentage,
    taxRegime: resource.tax_regime,
  }
}
