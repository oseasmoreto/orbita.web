<script setup lang="ts">
/**
 * Formulário único de criação E edição — mesmo padrão de
 * `AdminPlanForm.vue`. `hash` só é editável em modo `create` — depois de
 * criado é a PK, imutável (mesmo espírito de uma PK real,
 * `UpdateSettingRequest` nem aceita o campo); em modo `edit` o `Input`
 * fica `disabled`, só pra deixar visível qual configuração está sendo
 * editada.
 */
import { useI18n } from 'vue-i18n'
import { useAdminSettingForm } from '../composables/useAdminSettingForm'
import type { AdminSettingFormValues } from '../schemas/adminSettingFormSchema'
import type { Setting } from '../types/setting.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'
import Select from '@/shared/components/ui/Select.vue'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{
  mode: 'create' | 'edit'
  setting: Setting | null
}>()

const emit = defineEmits<{
  cancel: []
  saved: [setting: Setting]
}>()

const { t } = useI18n()
const { errors, isSubmitting, reset, submit, values } = useAdminSettingForm()

reset(props.setting ?? undefined)

const typeOptions: SelectOption[] = [
  { label: t('platform.admin.settings.types.int'), value: 'int' },
  { label: t('platform.admin.settings.types.string'), value: 'string' },
  { label: t('platform.admin.settings.types.enum'), value: 'enum' },
  { label: t('platform.admin.settings.types.text'), value: 'text' },
  { label: t('platform.admin.settings.types.json'), value: 'json' },
  { label: t('platform.admin.settings.types.bool'), value: 'bool' },
  { label: t('platform.admin.settings.types.float'), value: 'float' },
]

function fieldError(key: keyof AdminSettingFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.setting ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="admin-setting-form" @submit.prevent="handleSubmit">
    <div class="admin-setting-form__fields">
      <FormGroup :error="fieldError('hash')" :label="$t('platform.admin.settings.form.fields.hash')">
        <Input
          v-model="values.hash"
          :disabled="mode === 'edit'"
          :invalid="Boolean(fieldError('hash'))"
          :placeholder="$t('platform.admin.settings.form.placeholders.hash')"
        />
      </FormGroup>

      <FormGroup :error="fieldError('name')" :label="$t('platform.admin.settings.form.fields.name')">
        <Input v-model="values.name" :invalid="Boolean(fieldError('name'))" />
      </FormGroup>

      <FormGroup :label="$t('platform.admin.settings.form.fields.type')">
        <Select
          :model-value="values.type"
          :options="typeOptions"
          @update:model-value="(value) => (values.type = value as AdminSettingFormValues['type'])"
        />
      </FormGroup>

      <FormGroup :error="fieldError('value')" :label="$t('platform.admin.settings.form.fields.value')">
        <Input v-model="values.value" :invalid="Boolean(fieldError('value'))" />
      </FormGroup>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="mode === 'create' ? $t('common.actions.add') : $t('common.actions.save')"
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-setting-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  margin-bottom: $spacing-24;
}
</style>
