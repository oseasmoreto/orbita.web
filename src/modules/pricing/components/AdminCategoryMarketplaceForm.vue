<script setup lang="ts">
/**
 * Formulário único de criação E edição da comissão de uma categoria num
 * marketplace — renderizado dentro de um `Modal.vue` por
 * `AdminCategoryMarketplaceList.vue` (já dentro do Drawer de edição do
 * marketplace, mesmo padrão de `AdminPricingRuleForm.vue`).
 *
 * `categoryId` só é ESCOLHIDO no CREATE (`Select` com `categoryOptions`,
 * já filtrado pelo consumidor pra excluir categorias já vinculadas a
 * este marketplace — mesmo critério de `buildAvailableConnectionOptions`
 * em `useProductMarketplaces.ts`). No EDIT, a categoria é fixa
 * (`UpdateCategoryMarketplaceRequest` real do backend nem aceita esse
 * campo — trocar de categoria é sempre excluir e vincular outra) — mostra
 * o título como texto desabilitado, mesmo padrão do campo `hash` em
 * `AdminSettingForm.vue`.
 */
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import { useAdminCategoryMarketplaceForm } from '../composables/useAdminCategoryMarketplaceForm'
import type { CategoryMarketplaceFormValues } from '../schemas/categoryMarketplaceFormSchema'
import type { CategoryMarketplace } from '../types/categoryMarketplace.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'
import Select from '@/shared/components/ui/Select.vue'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{
  categoryOptions: SelectOption[]
  link: CategoryMarketplace | null
  marketplaceId: string
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  cancel: []
  saved: [link: CategoryMarketplace]
}>()

const { errors, isSubmitting, reset, submit, values } = useAdminCategoryMarketplaceForm(
  props.marketplaceId,
)

reset(props.link ?? undefined)

const commissionPercentageInput = useNumberFieldModel(values, 'commissionPercentage')

function fieldError(key: keyof CategoryMarketplaceFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.link ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="admin-category-marketplace-form" @submit.prevent="handleSubmit">
    <div class="admin-category-marketplace-form__fields">
      <FormGroup
        :error="mode === 'create' ? fieldError('categoryId') : undefined"
        :label="$t('pricing.admin.categoryMarketplaces.form.fields.category')"
      >
        <Select
          v-if="mode === 'create'"
          v-model="values.categoryId"
          :invalid="Boolean(fieldError('categoryId'))"
          :options="categoryOptions"
          :placeholder="$t('pricing.admin.categoryMarketplaces.form.placeholders.category')"
        />
        <Input v-else disabled :model-value="link?.category.title ?? ''" />
      </FormGroup>

      <FormGroup
        :error="fieldError('commissionPercentage')"
        :label="$t('pricing.admin.categoryMarketplaces.form.fields.commissionPercentage')"
      >
        <Input
          v-model="commissionPercentageInput"
          :invalid="Boolean(fieldError('commissionPercentage'))"
          type="number"
        />
      </FormGroup>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('pricing.admin.categoryMarketplaces.form.submitCreate')
          : $t('pricing.admin.categoryMarketplaces.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.admin-category-marketplace-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}
</style>
