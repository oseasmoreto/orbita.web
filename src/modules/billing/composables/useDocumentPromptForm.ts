import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createDocumentFormSchema, type DocumentFormValues } from '../schemas/documentFormSchema'

function emptyValues(): DocumentFormValues {
  return { document: '' }
}

/**
 * Mesmo padrão de `useLoginForm.ts`/`useForgotPasswordForm.ts` (validate/
 * values/errors), mas sem `submit()` próprio — quem decide o que fazer
 * com o documento validado é `useSubscribeToPlan.confirmDocument()`
 * (`DocumentPromptModal.vue` só emite o valor, nunca chama a API
 * diretamente, mesma régua de bloco sem regra de negócio).
 */
export function useDocumentPromptForm() {
  const { t } = useI18n()
  const schema = createDocumentFormSchema(t)

  const values = reactive<DocumentFormValues>(emptyValues())
  const errors = ref<Partial<Record<keyof DocumentFormValues, string>>>({})

  function validate(): boolean {
    const result = schema.safeParse(values)

    if (result.success) {
      errors.value = {}
      return true
    }

    errors.value = Object.fromEntries(
      result.error.issues.map((issue) => [issue.path[0], issue.message]),
    )
    return false
  }

  function reset(): void {
    values.document = ''
    errors.value = {}
  }

  return { errors, reset, validate, values }
}
