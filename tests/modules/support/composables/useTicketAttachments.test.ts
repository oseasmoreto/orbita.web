import {
  canAddAttachment,
  MAX_TICKET_ATTACHMENT_SIZE_BYTES,
  MAX_TICKET_ATTACHMENTS,
  validateAttachmentFile,
} from '@/modules/support/composables/useTicketAttachments'

function buildFile(name: string, type: string, sizeInBytes: number): File {
  return new File([new Uint8Array(sizeInBytes)], name, { type })
}

describe('validateAttachmentFile', () => {
  it('accepts a supported image type under the size limit', () => {
    const file = buildFile('logo.png', 'image/png', 1024)
    expect(validateAttachmentFile(file)).toBeNull()
  })

  it('accepts every mime type the backend allows (png/jpeg/webp/svg)', () => {
    const types = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']

    for (const type of types) {
      expect(validateAttachmentFile(buildFile('file', type, 1024))).toBeNull()
    }
  })

  it('rejects an unsupported mime type', () => {
    const file = buildFile('document.pdf', 'application/pdf', 1024)
    expect(validateAttachmentFile(file)).toBe('support.tickets.attachments.errors.invalidType')
  })

  it('rejects a file over the 2MB limit', () => {
    const file = buildFile('big.png', 'image/png', MAX_TICKET_ATTACHMENT_SIZE_BYTES + 1)
    expect(validateAttachmentFile(file)).toBe('support.tickets.attachments.errors.tooLarge')
  })

  it('accepts a file exactly at the 2MB limit', () => {
    const file = buildFile('exact.png', 'image/png', MAX_TICKET_ATTACHMENT_SIZE_BYTES)
    expect(validateAttachmentFile(file)).toBeNull()
  })
})

describe('canAddAttachment', () => {
  it('allows adding while under the 5-attachment cap', () => {
    expect(canAddAttachment(0)).toBe(true)
    expect(canAddAttachment(MAX_TICKET_ATTACHMENTS - 1)).toBe(true)
  })

  it('blocks adding once the cap is reached', () => {
    expect(canAddAttachment(MAX_TICKET_ATTACHMENTS)).toBe(false)
    expect(canAddAttachment(MAX_TICKET_ATTACHMENTS + 1)).toBe(false)
  })
})
