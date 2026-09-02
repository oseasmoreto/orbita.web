import { z } from 'zod'

const NON_DIGIT_PATTERN = /\D/g
const CPF_DIGIT_COUNT = 11
const CNPJ_DIGIT_COUNT = 14

function digitsOnly(value: string): string {
  return value.replace(NON_DIGIT_PATTERN, '')
}

/**
 * Espelha a mesma checagem barata de `Document::fromString` (backend,
 * `Domain/Identity/ValueObjects/Document.php`) já usada antes em
 * `billing/schemas/documentFormSchema.ts` (removido nesta mudança, o
 * documento saiu do checkout de assinatura pra virar cadastro de
 * empresa próprio) — só a CONTAGEM de dígitos, aceitando formatado ou
 * não. Exportado porque `CompanyRegistrationView.vue` usa pra decidir
 * se mostra o campo de CPF do responsável.
 */
export function isCnpjDocument(document: string): boolean {
  return digitsOnly(document).length === CNPJ_DIGIT_COUNT
}

/**
 * Espelha `CreateCompanyAction`/`UpdateCompanyAction` (backend, tarefa
 * 63) — `responsibleDocument` só é obrigatório quando `document` é CNPJ
 * (empresa PJ precisa de um CPF de responsável); se `document` já é CPF,
 * a própria pessoa já é o responsável, campo fica vazio. Regra cruzada
 * via `.superRefine()` no schema inteiro, marcada no campo
 * `responsibleDocument` — mesmo padrão de regra cruzada já usado (e
 * removido) em `productFormSchema.ts` antes do rename de `cost_price`.
 */
export function createCompanyFormSchema(t: (key: string) => string) {
  return z
    .object({
      document: z.string().superRefine((value, ctx) => {
        const digits = digitsOnly(value)

        if (digits.length === 0) {
          ctx.addIssue({
            code: 'custom',
            message: t('identity.companyRegistration.errors.documentRequired'),
          })
          return
        }

        if (digits.length !== CPF_DIGIT_COUNT && digits.length !== CNPJ_DIGIT_COUNT) {
          ctx.addIssue({
            code: 'custom',
            message: t('identity.companyRegistration.errors.documentInvalid'),
          })
        }
      }),
      name: z.string().min(1, t('identity.companyRegistration.errors.nameRequired')),
      responsibleDocument: z.string(),
      salesTaxPercentage: z
        .number()
        .min(0, t('identity.companyRegistration.errors.salesTaxPercentageMin')),
    })
    .superRefine((data, ctx) => {
      if (
        isCnpjDocument(data.document) &&
        digitsOnly(data.responsibleDocument).length !== CPF_DIGIT_COUNT
      ) {
        ctx.addIssue({
          code: 'custom',
          message: t('identity.companyRegistration.errors.responsibleDocumentRequired'),
          path: ['responsibleDocument'],
        })
      }
    })
}

export type CompanyFormValues = z.infer<ReturnType<typeof createCompanyFormSchema>>
