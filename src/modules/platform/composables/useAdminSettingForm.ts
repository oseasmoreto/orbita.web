import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  type AdminSettingFormValues,
  createAdminSettingFormSchema,
} from '../schemas/adminSettingFormSchema'
import { createSetting, updateSetting } from '../services/platformApi'
import type { Setting } from '../types/setting.type'

function emptyFormValues(): AdminSettingFormValues {
  return { hash: '', name: '', type: 'string', value: '' }
}

function toFormValues(setting: Setting): AdminSettingFormValues {
  return { hash: setting.hash, name: setting.name, type: setting.type, value: setting.value }
}

function toRequestPayload(values: AdminSettingFormValues) {
  return { hash: values.hash, name: values.name, type: values.type, value: values.value }
}

/**
 * Formulário único pra criar E editar configuração — mesmo padrão de
 * `useAdminPlanForm.ts`, em cima de `useResourceForm`. `hash` é a única
 * particularidade: existe no payload de CRIAR (`CreateSettingRequest`
 * exige), mas `UpdateSettingRequest` nem aceita o campo (é a PK,
 * imutável) — `update()` abaixo monta o payload de update só com
 * `name`/`type`/`value`, nunca repassa `hash` (que vai como parâmetro de
 * rota separado pra `updateSetting`). `AdminSettingForm.vue` também
 * desabilita o campo visualmente em modo `edit`, mas a garantia real de
 * "hash nunca muda" é aqui + no tipo do backend.
 */
export function useAdminSettingForm() {
  const { t } = useI18n()

  return useResourceForm<AdminSettingFormValues, Setting, ReturnType<typeof toRequestPayload>>({
    create: createSetting,
    emptyValues: emptyFormValues,
    schema: createAdminSettingFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('platform.admin.settings.form.createSuccess')
        : t('platform.admin.settings.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) =>
      updateSetting(existing.hash, {
        name: payload.name,
        type: payload.type,
        value: payload.value,
      }),
  })
}
