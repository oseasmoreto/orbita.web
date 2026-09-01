import {
  isCheckoutSkipped,
  isDocumentRequiredError,
} from '@/modules/billing/composables/useSubscribeToPlan'

describe('isDocumentRequiredError', () => {
  it('matches the exact ApiMessageKey the backend throws when document is missing', () => {
    expect(isDocumentRequiredError('errorMessageDocumentRequired')).toBe(true)
  })

  it('returns false for any other message key', () => {
    expect(isDocumentRequiredError('errorMessageSubscriptionAlreadyActive')).toBe(false)
    expect(isDocumentRequiredError('errorMessageEmailNotVerified')).toBe(false)
    expect(isDocumentRequiredError('errors.unknown')).toBe(false)
  })
})

describe('isCheckoutSkipped', () => {
  it('is true when checkout_url comes back null (trial plan activated instantly)', () => {
    expect(isCheckoutSkipped(null)).toBe(true)
  })

  it('is false for a real Mercado Pago checkout URL', () => {
    expect(
      isCheckoutSkipped('https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=123'),
    ).toBe(false)
  })
})
