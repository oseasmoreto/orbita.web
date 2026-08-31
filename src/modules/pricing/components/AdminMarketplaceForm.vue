<script setup lang="ts">
/**
 * Formulário único de criação E edição — mesmo padrão de
 * `ProductForm.vue` (Catalog), renderizado dentro do `Drawer.vue` lateral
 * direito por `AdminMarketplacesView.vue`. Cadastro de marketplace é
 * exclusivo do admin (`docs/negocio/contexto-plataforma-precificacao.md`
 * seção 3) — esta view só é alcançável por `admin_master`
 * (`meta.roles`, `routes.ts`).
 */
import { useAdminMarketplaceForm } from '../composables/useAdminMarketplaceForm'
import type { MarketplaceFormValues } from '../schemas/marketplaceFormSchema'
import type { AdminMarketplace } from '../types/marketplace.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'

const props = defineProps<{
  marketplace: AdminMarketplace | null
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  cancel: []
  saved: [marketplace: AdminMarketplace]
}>()

const { errors, isSubmitting, reset, submit, values } = useAdminMarketplaceForm()

reset(props.marketplace ?? undefined)

function fieldError(key: keyof MarketplaceFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.marketplace ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="admin-marketplace-form" @submit.prevent="handleSubmit">
    <div class="admin-marketplace-form__fields">
      <FormGroup :error="fieldError('name')" :label="$t('pricing.admin.marketplaces.form.fields.name')">
        <Input v-model="values.name" :invalid="Boolean(fieldError('name'))" />
      </FormGroup>

      <Toggle v-model="values.active" :label="$t('pricing.admin.marketplaces.form.fields.active')" />
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('pricing.admin.marketplaces.form.submitCreate')
          : $t('pricing.admin.marketplaces.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.admin-marketplace-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.admin-marketplace-form__fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-4;
  margin: calc(-1 * #{$spacing-4});
  overflow-y: auto;
}
</style>
