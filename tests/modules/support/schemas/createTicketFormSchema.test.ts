import { createTicketFormSchema } from '@/modules/support/schemas/createTicketFormSchema'

const ticketFormSchema = createTicketFormSchema((key) => key)

const validPayload = {
  message: 'Não consigo conectar minha conta do Mercado Livre.',
  subject: 'Erro ao conectar marketplace',
}

describe('createTicketFormSchema', () => {
  it('accepts a valid payload', () => {
    expect(ticketFormSchema.safeParse(validPayload).success).toBe(true)
  })

  it('rejects a missing subject', () => {
    expect(ticketFormSchema.safeParse({ ...validPayload, subject: '' }).success).toBe(false)
  })

  it('rejects a subject longer than 255 characters', () => {
    const result = ticketFormSchema.safeParse({ ...validPayload, subject: 'a'.repeat(256) })
    expect(result.success).toBe(false)
  })

  it('rejects a missing message', () => {
    expect(ticketFormSchema.safeParse({ ...validPayload, message: '' }).success).toBe(false)
  })
})
