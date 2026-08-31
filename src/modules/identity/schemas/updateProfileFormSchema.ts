import { z } from 'zod'

/**
 * Espelha `UpdateUserProfileRequest` (backend) — `name`/`email` sempre
 * preenchidos no formulário (a tela já vem com os valores atuais, nunca
 * mostra em branco pro usuário apagar sem querer), mas `password` é
 * OPCIONAL: campo vazio significa "não trocar a senha", só valida
 * tamanho/confirmação quando o usuário realmente digitou algo — mesma
 * régua de "só some parâmetros preenchidos" que `UpdateUserProfileAction`
 * (backend) já aplica com `array_filter`.
 */
export function createUpdateProfileFormSchema(t: (key: string) => string) {
  return z
    .object({
      email: z
        .string()
        .email(t('identity.account.errors.emailInvalid'))
        .min(1, t('identity.account.errors.emailRequired')),
      name: z.string().min(1, t('identity.account.errors.nameRequired')),
      password: z.string(),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password.length === 0 || data.password.length >= 8, {
      message: t('identity.account.errors.passwordMin'),
      path: ['password'],
    })
    .refine((data) => data.password.length === 0 || data.password === data.passwordConfirmation, {
      message: t('identity.account.errors.passwordConfirmationMismatch'),
      path: ['passwordConfirmation'],
    })
}

export type UpdateProfileFormValues = z.infer<ReturnType<typeof createUpdateProfileFormSchema>>
