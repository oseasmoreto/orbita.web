import {
  createCompanyFormSchema,
  isCnpjDocument,
} from '@/modules/identity/schemas/companyFormSchema'

const companyFormSchema = createCompanyFormSchema((key) => key)

const validCpfPayload = {
  document: '11144477735',
  name: 'Loja da Maria',
  operationalCostPercentage: null,
  responsibleDocument: '',
  salesTaxPercentage: 6,
  taxRegime: '',
}

const validCnpjPayload = {
  document: '11222333000181',
  name: 'Comércio LTDA',
  operationalCostPercentage: null,
  responsibleDocument: '11144477735',
  salesTaxPercentage: 6,
  taxRegime: '',
}

describe('isCnpjDocument', () => {
  it('is true for a 14-digit document, formatted or not', () => {
    expect(isCnpjDocument('11222333000181')).toBe(true)
    expect(isCnpjDocument('11.222.333/0001-81')).toBe(true)
  })

  it('is false for an 11-digit document (CPF)', () => {
    expect(isCnpjDocument('11144477735')).toBe(false)
    expect(isCnpjDocument('111.444.777-35')).toBe(false)
  })

  it('is false for an empty or partial document', () => {
    expect(isCnpjDocument('')).toBe(false)
    expect(isCnpjDocument('123')).toBe(false)
  })
})

describe('companyFormSchema', () => {
  it('accepts a valid CPF payload with no responsible document', () => {
    expect(companyFormSchema.safeParse(validCpfPayload).success).toBe(true)
  })

  it('accepts a valid CNPJ payload with a responsible CPF', () => {
    expect(companyFormSchema.safeParse(validCnpjPayload).success).toBe(true)
  })

  it('rejects a missing name', () => {
    expect(companyFormSchema.safeParse({ ...validCpfPayload, name: '' }).success).toBe(false)
  })

  it('rejects an empty document', () => {
    expect(companyFormSchema.safeParse({ ...validCpfPayload, document: '' }).success).toBe(false)
  })

  it('rejects a document that is neither 11 nor 14 digits', () => {
    expect(companyFormSchema.safeParse({ ...validCpfPayload, document: '123456' }).success).toBe(
      false,
    )
  })

  it('accepts a formatted document (mask stripped before counting digits)', () => {
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, document: '111.444.777-35' }).success,
    ).toBe(true)
  })

  it('rejects a negative sales tax percentage', () => {
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, salesTaxPercentage: -1 }).success,
    ).toBe(false)
  })

  it('rejects a CNPJ document without a responsible document — the canonical cross-field rule', () => {
    const result = companyFormSchema.safeParse({ ...validCnpjPayload, responsibleDocument: '' })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('responsibleDocument')
    }
  })

  it('does not require a responsible document when the company document is already a CPF', () => {
    expect(companyFormSchema.safeParse(validCpfPayload).success).toBe(true)
  })

  it('accepts each of the 3 real tax regime values, purely informational', () => {
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, taxRegime: 'individual' }).success,
    ).toBe(true)
    expect(companyFormSchema.safeParse({ ...validCpfPayload, taxRegime: 'mei' }).success).toBe(true)
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, taxRegime: 'simples_nacional' }).success,
    ).toBe(true)
  })

  it('rejects a tax regime value outside the 3 real options', () => {
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, taxRegime: 'lucro_real' }).success,
    ).toBe(false)
  })

  it('accepts a real operational cost percentage — belongs to the whole company, not a marketplace connection (bug real, 2026-09-08, corrected same day)', () => {
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, operationalCostPercentage: 7.5 }).success,
    ).toBe(true)
  })

  it('rejects a negative operational cost percentage', () => {
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, operationalCostPercentage: -1 }).success,
    ).toBe(false)
  })

  it('rejects an operational cost percentage above 100', () => {
    expect(
      companyFormSchema.safeParse({ ...validCpfPayload, operationalCostPercentage: 101 }).success,
    ).toBe(false)
  })
})
