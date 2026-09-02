<script setup lang="ts">
/**
 * Formulário único de criação E edição — mesmo padrão de
 * `AdminMarketplaceForm.vue`, renderizado dentro do `Drawer.vue` lateral
 * direito por `AdminProductCategoriesView.vue`. Categoria simples, sem
 * hierarquia/subcategoria (tarefa 64) — só `title`/`active`.
 */
import { useAdminProductCategoryForm } from '../composables/useAdminProductCategoryForm'
import type { ProductCategoryFormValues } from '../schemas/productCategoryFormSchema'
import type { ProductCategory } from '../types/productCategory.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'

const props = defineProps<{
  category: ProductCategory | null
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  cancel: []
  saved: [category: ProductCategory]
}>()

const { errors, isSubmitting, reset, submit, values } = useAdminProductCategoryForm()

reset(props.category ?? undefined)

function fieldError(key: keyof ProductCategoryFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.category ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="admin-product-category-form" @submit.prevent="handleSubmit">
    <div class="admin-product-category-form__fields">
      <FormGroup
        :error="fieldError('title')"
        :label="$t('pricing.admin.productCategories.form.fields.title')"
      >
        <Input v-model="values.title" :invalid="Boolean(fieldError('title'))" />
      </FormGroup>

      <Toggle
        v-model="values.active"
        :label="$t('pricing.admin.productCategories.form.fields.active')"
      />
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('pricing.admin.productCategories.form.submitCreate')
          : $t('pricing.admin.productCategories.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-product-category-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.admin-product-category-form__fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-4;
  margin: calc(-1 * #{$spacing-4});
  overflow-y: auto;
}
</style>
