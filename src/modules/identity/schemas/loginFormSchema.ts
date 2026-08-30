import { z } from 'zod'

/**
 * Espelha `LoginRequest` (`core/api/schema.d.ts`) — `email`/`password`,
 * sem campo de "lembrar de mim": a API real (`login.store`) não aceita
 * nenhum parâmetro além desses dois, então não existe nada pra esse
 * checkbox controlar — não implementado na tela por esse motivo (mesma
 * régua de "sem botão sem ação" já aplicada no `ListToolbar` do CRUD de
 * Produtos).
 *
 * Fábrica, não schema pronto (mesmo motivo de `createProductFormSchema`)
 * — mensagem de validação é texto de UI, `useI18n()` só existe dentro do
 * composable que chama esta fábrica.
 */
export function createLoginFormSchema(t: (key: string) => string) {
  return z.object({
    // Ordem importa: zod roda as duas checagens e o último issue de um
    // mesmo campo é o que sobrevive em `Object.fromEntries` (composable
    // popula `errors` assim) — `.email()` antes de `.min()` garante que
    // um campo vazio mostra "obrigatório", não "e-mail inválido".
    email: z
      .string()
      .email(t('identity.login.errors.emailInvalid'))
      .min(1, t('identity.login.errors.emailRequired')),
    password: z.string().min(1, t('identity.login.errors.passwordRequired')),
  })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginFormSchema>>
