import { isDocumentRequiredError } from '@/modules/billing/composables/useSubscribeToPlan'

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
