import {
  isCheckoutSkipped,
  isCompanyRequiredError,
} from '@/modules/billing/composables/useSubscribeToPlan'

describe('isCompanyRequiredError', () => {
  it('matches the exact ApiMessageKey the backend throws when the company is missing', () => {
    expect(isCompanyRequiredError('errorMessageCompanyRequired')).toBe(true)
  })

  it('returns false for any other message key', () => {
    expect(isCompanyRequiredError('errorMessageSubscriptionAlreadyActive')).toBe(false)
    expect(isCompanyRequiredError('errorMessageEmailNotVerified')).toBe(false)
    expect(isCompanyRequiredError('errors.unknown')).toBe(false)
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
