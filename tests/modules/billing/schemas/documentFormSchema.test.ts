import { createDocumentFormSchema } from '@/modules/billing/schemas/documentFormSchema'

const documentFormSchema = createDocumentFormSchema((key) => key)

describe('documentFormSchema', () => {
  it('accepts a valid CPF, formatted or raw', () => {
    expect(documentFormSchema.safeParse({ document: '123.456.789-09' }).success).toBe(true)
    expect(documentFormSchema.safeParse({ document: '12345678909' }).success).toBe(true)
  })

  it('accepts a valid CNPJ, formatted or raw', () => {
    expect(documentFormSchema.safeParse({ document: '12.345.678/0001-95' }).success).toBe(true)
    expect(documentFormSchema.safeParse({ document: '12345678000195' }).success).toBe(true)
  })

  it('rejects an empty document with the "required" message', () => {
    const result = documentFormSchema.safeParse({ document: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.at(-1)?.message).toBe('billing.documentPrompt.errors.required')
    }
  })

  it('rejects a document with neither 11 nor 14 digits', () => {
    const result = documentFormSchema.safeParse({ document: '123' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.at(-1)?.message).toBe('billing.documentPrompt.errors.invalid')
    }
  })
})
