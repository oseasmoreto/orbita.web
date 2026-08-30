import { z } from 'zod'

/**
 * Espelha `RegisterUserRequest` (`core/api/schema.d.ts`) — `name`, `email`,
 * `password`, `password_confirmation`. "Senha e confirmação precisam
 * bater" é regra replicável no cliente (mesmo espírito do "preço de venda
 * ≥ preço de compra" do CRUD de Produtos) via `.refine()`.
 *
 * **Mínimo de 8 caracteres pra senha é suposição, não confirmada contra o
 * `FormRequest` real do backend** — o schema gerado (`RegisterUserRequest`)
 * só expõe `password: string`, sem o `min`/regra de força real (o
 * Scramble infere tipo, não a regra de validação completa). Usa o piso
 * padrão do `Password::defaults()` do Laravel (8) até confirmar contra o
 * `FormRequest` de verdade — revisar se o 422 real devolver uma regra
 * diferente (ex.: exigir maiúscula/número).
 *
 * Fábrica, não schema pronto (mesmo motivo de `createLoginFormSchema`).
 */
export function createRegisterFormSchema(t: (key: string) => string) {
  return z
    .object({
      // Ordem importa: ver comentário equivalente em `loginFormSchema.ts`
      // — `.email()` antes de `.min()` garante que campo vazio mostra
      // "obrigatório", não "e-mail inválido".
      email: z
        .string()
        .email(t('identity.register.errors.emailInvalid'))
        .min(1, t('identity.register.errors.emailRequired')),
      name: z.string().min(1, t('identity.register.errors.nameRequired')),
      password: z.string().min(8, t('identity.register.errors.passwordMin')),
      passwordConfirmation: z
        .string()
        .min(1, t('identity.register.errors.passwordConfirmationRequired')),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: t('identity.register.errors.passwordConfirmationMismatch'),
      path: ['passwordConfirmation'],
    })
}

export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterFormSchema>>
