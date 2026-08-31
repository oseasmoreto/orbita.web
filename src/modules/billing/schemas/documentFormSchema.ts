import { z } from 'zod'

const NON_DIGIT_PATTERN = /\D/g
const DOCUMENT_DIGITS_PATTERN = /^\d{11}$|^\d{14}$/

/**
 * Espelha `Document::fromString` (backend, `Domain/Identity/ValueObjects/Document.php`)
 * na parte barata de validar no cliente antes do roundtrip — só a
 * CONTAGEM de dígitos (11 = CPF, 14 = CNPJ), aceitando formatado ou não
 * (o backend já normaliza tirando pontuação, `preg_replace('/\D/', ...)`).
 * O dígito verificador real (checksum de CPF/CNPJ) só é conferido no
 * backend — reimplementar esse algoritmo aqui só pra UX de formulário
 * não vale o custo, o 422 de volta já cobre esse caso residual.
 */
export function createDocumentFormSchema(t: (key: string) => string) {
  return z.object({
    document: z.string().superRefine((value, ctx) => {
      if (value.length === 0) {
        ctx.addIssue({ code: 'custom', message: t('billing.documentPrompt.errors.required') })
        return
      }

      if (!DOCUMENT_DIGITS_PATTERN.test(value.replace(NON_DIGIT_PATTERN, ''))) {
        ctx.addIssue({ code: 'custom', message: t('billing.documentPrompt.errors.invalid') })
      }
    }),
  })
}

export type DocumentFormValues = z.infer<ReturnType<typeof createDocumentFormSchema>>
