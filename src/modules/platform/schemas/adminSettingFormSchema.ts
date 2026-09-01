import { z } from 'zod'

const HASH_SLUG_PATTERN = /^[a-z0-9_.]+$/

/**
 * Espelha `CreateSettingRequest`/`UpdateSettingRequest`
 * (`core/api/schema.d.ts`) — configuração interna, exclusiva do admin
 * (Fase 6). `hash` é validado aqui mesmo em modo `edit` (sempre
 * populado por `toFormValues`, campo desabilitado na UI —
 * `AdminSettingForm.vue`) porque `values` não distingue os 2 modos por
 * dentro do schema; quem garante que `hash` nunca muda de verdade é o
 * `update()` de `useAdminSettingForm.ts` (monta o payload de update só
 * com `name`/`type`/`value`, nunca repassa `hash` — `UpdateSettingRequest`
 * nem aceita esse campo).
 */
export function createAdminSettingFormSchema(t: (key: string) => string) {
  return z.object({
    hash: z
      .string()
      .min(1, t('platform.admin.settings.form.errors.hashRequired'))
      .regex(HASH_SLUG_PATTERN, t('platform.admin.settings.form.errors.hashFormat')),
    name: z.string().min(1, t('platform.admin.settings.form.errors.nameRequired')),
    type: z.enum(['int', 'string', 'enum', 'text', 'json', 'bool', 'float']),
    value: z.string().min(1, t('platform.admin.settings.form.errors.valueRequired')),
  })
}

export type AdminSettingFormValues = z.infer<ReturnType<typeof createAdminSettingFormSchema>>
