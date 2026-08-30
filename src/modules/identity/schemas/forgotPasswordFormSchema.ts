import { z } from 'zod'

/**
 * Espelha `RequestPasswordResetRequest` (`core/api/schema.d.ts`) — só
 * `email`. Ordem `.email()` antes de `.min()` — ver comentário
 * equivalente em `loginFormSchema.ts` (campo vazio precisa mostrar
 * "obrigatório", não "e-mail inválido").
 */
export function createForgotPasswordFormSchema(t: (key: string) => string) {
  return z.object({
    email: z
      .string()
      .email(t('identity.forgotPassword.errors.emailInvalid'))
      .min(1, t('identity.forgotPassword.errors.emailRequired')),
  })
}

export type ForgotPasswordFormValues = z.infer<ReturnType<typeof createForgotPasswordFormSchema>>
