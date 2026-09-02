import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import { type CompanyFormValues, createCompanyFormSchema } from '../schemas/companyFormSchema'
import { createCompany, getOwnCompany, updateCompany } from '../services/identityApi'
import type { Company } from '../types/company.type'

function emptyFormValues(): CompanyFormValues {
  return { document: '', name: '', responsibleDocument: '', salesTaxPercentage: 0 }
}

function toFormValues(company: Company): CompanyFormValues {
  return {
    document: company.document,
    name: company.name,
    responsibleDocument: company.responsibleDocument ?? '',
    salesTaxPercentage: Number(company.salesTaxPercentage),
  }
}

/** `CompanyFormValues` (camelCase) → payload real da API (`CreateCompanyRequest`/`UpdateCompanyRequest`, os dois compartilham o mesmo shape — mesmo raciocínio do backend, ver `company.type.ts`). */
function toRequestPayload(values: CompanyFormValues) {
  return {
    document: values.document,
    name: values.name,
    responsible_document: values.responsibleDocument || null,
    sales_tax_percentage: values.salesTaxPercentage,
  }
}

/**
 * Singleton (`GET/POST/PATCH /company`, sem `{id}`) — diferente de
 * `useProductForm.ts` (onde `existing` chega via prop de um Drawer que já
 * sabe se é create ou edit), aqui é o próprio `load()` que descobre o
 * modo: `getOwnCompany()` devolve `null` quando o usuário ainda não
 * cadastrou (404 esperado, ver `identityApi.ts`) — fica em modo create,
 * é o caminho normal do onboarding (`CompanyRegistrationView.vue`). Um
 * `GET` com sucesso preenche o form e vira update — cobre o caso raro de
 * alguém navegar de volta pra essa URL já com empresa cadastrada.
 */
export function useCompanyForm() {
  const { t } = useI18n()
  const toast = useToast()
  const { resolveMessage } = useApiMessage()

  const isLoading = ref(true)
  const hasLoadError = ref(false)
  const existingCompany = ref<Company | null>(null)

  const form = useResourceForm<CompanyFormValues, Company, ReturnType<typeof toRequestPayload>>({
    create: createCompany,
    emptyValues: emptyFormValues,
    schema: createCompanyFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('identity.companyRegistration.createSuccess')
        : t('identity.companyRegistration.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (_existing, payload) => updateCompany(payload),
  })

  async function load(): Promise<void> {
    isLoading.value = true
    hasLoadError.value = false

    try {
      existingCompany.value = await getOwnCompany()
      form.reset(existingCompany.value ?? undefined)
    } catch (caughtError) {
      hasLoadError.value = true
      toast.error(resolveMessage(parseApiError(caughtError).messageKey))
    } finally {
      isLoading.value = false
    }
  }

  async function submit(): Promise<Company | null> {
    const saved = await form.submit(existingCompany.value ?? undefined)

    if (saved) {
      existingCompany.value = saved
    }

    return saved
  }

  return { ...form, existingCompany, hasLoadError, isLoading, load, submit }
}
