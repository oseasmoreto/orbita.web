import { z } from 'zod'

/**
 * Espelha só a parte de senha de `ResetPasswordRequest`
 * (`core/api/schema.d.ts`) — `email`/`token` não são digitados pelo
 * usuário (chegam via query string do link recebido por e-mail,
 * `ResetPasswordView.vue`), então não fazem parte da validação de
 * formulário. Mesma regra de "senha e confirmação precisam bater" do
 * cadastro.
 */
export function createResetPasswordFormSchema(t: (key: string) => string) {
  return z
    .object({
      password: z.string().min(8, t('identity.resetPassword.errors.passwordMin')),
      passwordConfirmation: z
        .string()
        .min(1, t('identity.resetPassword.errors.passwordConfirmationRequired')),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t('identity.resetPassword.errors.passwordConfirmationMismatch'),
      path: ['passwordConfirmation'],
    })
}

export type ResetPasswordFormValues = z.infer<ReturnType<typeof createResetPasswordFormSchema>>
