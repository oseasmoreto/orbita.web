<script setup lang="ts">
/**
 * Formulário único de criação E edição de lançamento — mesmo padrão de
 * `ProductForm.vue`, renderizado dentro do `Modal.vue` por
 * `ProductLaunchList.vue` (não um `Drawer.vue` — já estamos dentro do
 * Drawer de edição do produto, um segundo painel lateral empilhado
 * ficaria estranho; `Modal.vue` sobrepõe em vez de deslizar).
 *
 * `purchasePrice`/`quantity` (`Input.vue` só expõe `v-model` de
 * `string`) usam `useNumberFieldModel` (`shared/composables/`, mesmo
 * raciocínio de `ProductForm.vue` — extraído em 2026-08-31 porque o par
 * `get`/`set` estava duplicado à mão nos dois forms). `date` não precisa
 * dessa ponte — `DatePicker.vue` já expõe `v-model` de `string` (ISO
 * `YYYY-MM-DD`), igual ao tipo do próprio campo do formulário.
 */
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import DatePicker from '@/shared/components/ui/DatePicker.vue'
import { useProductLaunchForm } from '../composables/useProductLaunchForm'
import type { ProductLaunchFormValues } from '../schemas/productLaunchFormSchema'
import type { ProductLaunch } from '../types/productLaunch.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'

const props = defineProps<{
  launch: ProductLaunch | null
  mode: 'create' | 'edit'
  productId: string
}>()

const emit = defineEmits<{
  cancel: []
  saved: [launch: ProductLaunch]
}>()

const { errors, isSubmitting, reset, submit, values } = useProductLaunchForm(props.productId)

reset(props.launch ?? undefined)

const purchasePriceInput = useNumberFieldModel(values, 'purchasePrice')
const quantityInput = useNumberFieldModel(values, 'quantity')

function fieldError(key: keyof ProductLaunchFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.launch ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="product-launch-form" @submit.prevent="handleSubmit">
    <div class="product-launch-form__fields">
      <FormGroup :error="fieldError('date')" :label="$t('catalog.products.launches.form.fields.date')">
        <DatePicker v-model="values.date" :invalid="Boolean(fieldError('date'))" />
      </FormGroup>

      <FormGroup
        :error="fieldError('purchasePrice')"
        :label="$t('catalog.products.launches.form.fields.purchasePrice')"
      >
        <Input
          v-model="purchasePriceInput"
          :invalid="Boolean(fieldError('purchasePrice'))"
          type="number"
        />
      </FormGroup>

      <FormGroup
        :error="fieldError('quantity')"
        :label="$t('catalog.products.launches.form.fields.quantity')"
      >
        <Input v-model="quantityInput" :invalid="Boolean(fieldError('quantity'))" type="number" />
      </FormGroup>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('catalog.products.launches.form.submitCreate')
          : $t('catalog.products.launches.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.product-launch-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}
</style>
