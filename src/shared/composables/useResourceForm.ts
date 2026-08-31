import { reactive, ref } from 'vue'
import type { ZodType } from 'zod'
import { parseApiError } from '../services/parseApiError'
import { useApiMessage } from './useApiMessage'
import { useToast } from './useToast'

export interface UseResourceFormOptions<
  TValues extends Record<string, unknown>,
  TResource,
  TPayload,
> {
  create: (payload: TPayload) => Promise<TResource>
  emptyValues: () => TValues
  schema: ZodType<TValues>
  successMessage: (mode: 'create' | 'edit') => string
  toFormValues: (resource: TResource) => TValues
  toRequestPayload: (values: TValues) => TPayload
  update: (existing: TResource, payload: TPayload) => Promise<TResource>
}

/**
 * Motor genérico de "formulário único cria/edita 1 recurso" — mesma
 * família de `useResourceList`/`useCrudDrawer`/`useConfirmAction`
 * (`.ai/rules/crud-pattern.md`), pedido direto do usuário em 2026-08-31
 * depois de notar que `useProductForm.ts`/`useProductLaunchForm.ts` eram
 * praticamente idênticos (mesmo `reset`/`validate`/`submit`, só mudando
 * schema/payload/service). Não sabe nada de domínio nem de `services/` —
 * recebe as poucas peças que realmente variam por entidade (schema,
 * conversão de/pra valores de formulário, payload de request, as 2
 * chamadas de API) e faz todo o "encanamento" repetido uma única vez:
 * estado (`values`/`errors`/`isSubmitting`), `reset(existing?)`,
 * `validate()` e o fluxo de `submit()` (valida → create-ou-update
 * conforme `existing` → toast de sucesso → em erro, `parseApiError` +
 * toast + popula `errors` campo a campo via `resolveFieldError`).
 *
 * `TPayload` é inferido do retorno de `toRequestPayload` — `create`/
 * `update` só tipam certo quando o objeto de config inteiro é passado
 * inline (tipagem contextual do TS), mesmo padrão que já valia sem essa
 * abstração (um `payload` só, usado nas duas chamadas).
 */
export function useResourceForm<TValues extends Record<string, unknown>, TResource, TPayload>(
  options: UseResourceFormOptions<TValues, TResource, TPayload>,
) {
  const toast = useToast()
  const { resolveFieldError, resolveMessage } = useApiMessage()

  const values = reactive<TValues>(options.emptyValues())
  const errors = ref<Partial<Record<keyof TValues, string>>>({})
  const isSubmitting = ref(false)

  function reset(existing?: TResource): void {
    Object.assign(values, existing ? options.toFormValues(existing) : options.emptyValues())
    errors.value = {}
  }

  function validate(): boolean {
    const result = options.schema.safeParse(values)

    if (result.success) {
      errors.value = {}
      return true
    }

    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    )
    return false
  }

  async function submit(existing?: TResource): Promise<TResource | null> {
    if (!validate()) {
      return null
    }

    isSubmitting.value = true

    try {
      const payload = options.toRequestPayload(values as TValues)
      const resource = existing
        ? await options.update(existing, payload)
        : await options.create(payload)

      toast.success(options.successMessage(existing ? 'edit' : 'create'))
      return resource
    } catch (caughtError) {
      const apiError = parseApiError(caughtError)
      toast.error(resolveMessage(apiError.messageKey))

      if (apiError.fieldErrors) {
        const fieldErrors = errors.value as Record<string, string>

        for (const [field, messages] of Object.entries(apiError.fieldErrors)) {
          fieldErrors[field] = resolveFieldError(field, messages[0])
        }
      }

      return null
    } finally {
      isSubmitting.value = false
    }
  }

  return { errors, isSubmitting, reset, submit, values }
}
