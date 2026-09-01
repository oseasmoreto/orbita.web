import { z } from 'zod'

/**
 * Espelha `CreateTicketRequest` (`core/api/schema.d.ts`) — `subject`
 * (obrigatório, até 255 caracteres, mesmo teto do backend) e `message`
 * (obrigatório, sem teto — `TEXT`/`string` livre no backend).
 */
export function createTicketFormSchema(t: (key: string) => string) {
  return z.object({
    message: z.string().min(1, t('support.tickets.form.errors.messageRequired')),
    subject: z
      .string()
      .min(1, t('support.tickets.form.errors.subjectRequired'))
      .max(255, t('support.tickets.form.errors.subjectMax')),
  })
}

export type CreateTicketFormValues = z.infer<ReturnType<typeof createTicketFormSchema>>
