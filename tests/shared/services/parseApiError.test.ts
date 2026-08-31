import { AxiosError, type AxiosResponse } from 'axios'
import { parseApiError } from '@/shared/services/parseApiError'

function makeAxiosError(status: number, data: unknown): AxiosError {
  const error = new AxiosError('Request failed')
  error.response = {
    config: { headers: undefined },
    data,
    headers: {},
    status,
    statusText: '',
  } as unknown as AxiosResponse
  return error
}

describe('parseApiError', () => {
  it('extracts messageKey and status from a real axios error response', () => {
    const error = makeAxiosError(422, {
      errors: null,
      message: 'errorMessageSamePlan',
      success: false,
    })
    const result = parseApiError(error)

    expect(result.messageKey).toBe('errorMessageSamePlan')
    expect(result.status).toBe(422)
    expect(result.fieldErrors).toBeNull()
  })

  it('falls back to a generic key/status-0 for a non-axios error (network failure, thrown value)', () => {
    const result = parseApiError(new Error('boom'))

    expect(result.messageKey).toBe('errors.unknown')
    expect(result.status).toBe(0)
    expect(result.fieldErrors).toBeNull()
  })

  it('converts snake_case field-error keys to camelCase — matches the FORM VALUES key, not the raw request payload key', () => {
    // Achado real: Laravel devolve o 422 chaveado pelo nome do REQUEST
    // (snake_case, ex. "full_sale_price"), mas `errors.value` de todo
    // useXForm.ts é indexado por chave camelCase (`ProductFormValues`,
    // `RegisterFormValues`...) — sem essa conversão, `errors.value['full_sale_price']`
    // nunca é lido por `fieldError('fullSalePrice')` e o erro de campo
    // simplesmente não aparece sob o input, mesmo com o toast genérico
    // aparecendo normalmente.
    const error = makeAxiosError(422, {
      errors: {
        full_sale_price: ['Preço de venda deve ser maior que zero.'],
        name: ['Nome é obrigatório.'],
        password_confirmation: ['As senhas não coincidem.'],
      },
      message: 'errorMessageValidation',
      success: false,
    })

    const result = parseApiError(error)

    expect(result.fieldErrors).toEqual({
      fullSalePrice: ['Preço de venda deve ser maior que zero.'],
      name: ['Nome é obrigatório.'],
      passwordConfirmation: ['As senhas não coincidem.'],
    })
  })
})
