import { z } from 'zod'

/**
 * Espelha `CreateUserByAdminRequest` (`core/api/schema.d.ts`) — mesmos 4
 * campos de `registerFormSchema.ts` (cadastro público) + `role` (novo,
 * 2026-09-01, pedido direto do usuário: admin_master pode criar outro
 * admin_master direto por aqui, backend já aceita o campo opcional —
 * `UserRole::User` continua sendo o default se algum dia o valor vier
 * vazio, mesmo comportamento do backend quando o campo é omitido).
 * Mensagens/chaves próprias (`identity.admin.users.form.errors.*`)
 * porque é uma tela diferente (admin criando conta em nome de alguém,
 * não autoatendimento). "Senha e confirmação precisam bater" via
 * `.refine()`, mesmo padrão.
 */
export function createAdminUserFormSchema(t: (key: string) => string) {
  return z
    .object({
      email: z
        .string()
        .email(t('identity.admin.users.form.errors.emailInvalid'))
        .min(1, t('identity.admin.users.form.errors.emailRequired')),
      name: z.string().min(1, t('identity.admin.users.form.errors.nameRequired')),
      password: z.string().min(8, t('identity.admin.users.form.errors.passwordMin')),
      passwordConfirmation: z
        .string()
        .min(1, t('identity.admin.users.form.errors.passwordConfirmationRequired')),
      role: z.enum(['admin_master', 'user']),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t('identity.admin.users.form.errors.passwordConfirmationMismatch'),
      path: ['passwordConfirmation'],
    })
}

export type CreateAdminUserFormValues = z.infer<ReturnType<typeof createAdminUserFormSchema>>
