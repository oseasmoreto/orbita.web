<script setup lang="ts">
/**
 * Formulário único de criação E edição de lançamento — mesmo padrão de
 * `ProductForm.vue`, renderizado dentro do `Modal.vue` por
 * `ProductLaunchList.vue` (não um `Drawer.vue` — já estamos dentro do
 * Drawer de edição do produto, um segundo painel lateral empilhado
 * ficaria estranho; `Modal.vue` sobrepõe em vez de deslizar).
 *
 * `purchasePrice`/`quantity` (`Input.vue` só expõe `v-model` de
 * `string`) usam o mesmo `computed` de conversão string↔number na borda
 * do componente, mesmo raciocínio de `ProductForm.vue`. `date` não
 * precisa dessa ponte — `DatePicker.vue` já expõe `v-model` de `string`
 * (ISO `YYYY-MM-DD`), igual ao tipo do próprio campo do formulário.
 */
import { computed } from 'vue'
import DatePicker from '@/shared/components/ui/DatePicker.vue'
import { useProductLaunchForm } from '../composables/useProductLaunchForm'
import type { ProductLaunchFormValues } from '../schemas/productLaunchFormSchema'
import type { ProductLaunch } from '../types/productLaunch.type'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
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

const purchasePriceInput = computed<string>({
  get: () => String(values.purchasePrice),
  set: (raw) => {
    values.purchasePrice = raw === '' ? 0 : Number(raw)
  },
})

const quantityInput = computed<string>({
  get: () => String(values.quantity),
  set: (raw) => {
    values.quantity = raw === '' ? 0 : Number(raw)
  },
})

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

    <div class="product-launch-form__actions">
      <Button type="button" variant="outline" @click="emit('cancel')">
        {{ $t('common.actions.cancel') }}
      </Button>
      <Button :disabled="isSubmitting" type="submit" variant="primary">
        {{
          props.mode === 'create'
            ? $t('catalog.products.launches.form.submitCreate')
            : $t('catalog.products.launches.form.submitEdit')
        }}
      </Button>
    </div>
  </form>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.product-launch-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.product-launch-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: $spacing-8;
  padding-top: $spacing-16;
}
</style>
