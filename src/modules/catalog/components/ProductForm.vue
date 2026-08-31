<script setup lang="ts">
/**
 * Formulário único de criação E edição (pedido direto do usuário,
 * 2026-08-28) — renderizado dentro do `Drawer.vue` lateral direito por
 * `ProductsView.vue`, nunca sozinho numa rota própria. `mode` só decide
 * o texto do botão de submit ("Criar produto"/"Salvar alterações") —
 * toda a lógica de "criar vs. atualizar" já foi resolvida em
 * `useProductForm.ts` (se `product` existe, é update).
 *
 * Campos numéricos (`Input.vue` só expõe `v-model` de `string`, é um
 * átomo genérico — não vale mudar o contrato dele só pra este form) usam
 * `useNumberFieldModel` (`shared/composables/`, extraído em 2026-08-31 —
 * o mesmo par `get`/`set` estava duplicado à mão aqui e em
 * `ProductLaunchForm.vue`), convertendo string↔number na borda deste
 * componente, sem vazar essa conversão pro composable.
 */
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import { useProductForm } from '../composables/useProductForm'
import type { ProductFormValues } from '../schemas/productFormSchema'
import type { Product } from '../types/product.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  product: Product | null
}>()

const emit = defineEmits<{
  cancel: []
  saved: [product: Product]
}>()

const { errors, isSubmitting, reset, submit, values } = useProductForm()

reset(props.product ?? undefined)

const fullSalePriceInput = useNumberFieldModel(values, 'fullSalePrice')
const purchasePriceInput = useNumberFieldModel(values, 'purchasePrice')
const targetMarginInput = useNumberFieldModel(values, 'targetMargin')
const weightInput = useNumberFieldModel(values, 'weight', { nullable: true })
const heightInput = useNumberFieldModel(values, 'height', { nullable: true })
const widthInput = useNumberFieldModel(values, 'width', { nullable: true })
const lengthInput = useNumberFieldModel(values, 'length', { nullable: true })

function fieldError(key: keyof ProductFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.product ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="product-form" @submit.prevent="handleSubmit">
    <div class="product-form__fields">
      <FormGroup :error="fieldError('name')" :label="$t('catalog.products.form.fields.name')">
        <Input v-model="values.name" :invalid="Boolean(fieldError('name'))" />
      </FormGroup>

      <div class="product-form__row">
        <FormGroup :error="fieldError('sku')" :label="$t('catalog.products.form.fields.sku')">
          <Input v-model="values.sku" :invalid="Boolean(fieldError('sku'))" />
        </FormGroup>
        <FormGroup :error="fieldError('ean')" :label="$t('catalog.products.form.fields.ean')">
          <Input v-model="values.ean" :invalid="Boolean(fieldError('ean'))" />
        </FormGroup>
      </div>

      <FormGroup :error="fieldError('ncm')" :label="$t('catalog.products.form.fields.ncm')">
        <Input v-model="values.ncm" :invalid="Boolean(fieldError('ncm'))" />
      </FormGroup>

      <div class="product-form__row">
        <FormGroup
          :error="fieldError('purchasePrice')"
          :label="$t('catalog.products.form.fields.purchasePrice')"
        >
          <Input
            v-model="purchasePriceInput"
            :invalid="Boolean(fieldError('purchasePrice'))"
            type="number"
          />
        </FormGroup>
        <FormGroup
          :error="fieldError('fullSalePrice')"
          :label="$t('catalog.products.form.fields.fullSalePrice')"
        >
          <Input
            v-model="fullSalePriceInput"
            :invalid="Boolean(fieldError('fullSalePrice'))"
            type="number"
          />
        </FormGroup>
      </div>

      <FormGroup
        :error="fieldError('targetMargin')"
        :label="$t('catalog.products.form.fields.targetMargin')"
      >
        <Input
          v-model="targetMarginInput"
          :invalid="Boolean(fieldError('targetMargin'))"
          type="number"
        />
      </FormGroup>

      <div class="product-form__row">
        <FormGroup :label="$t('catalog.products.form.fields.weight')">
          <Input v-model="weightInput" type="number" />
        </FormGroup>
        <FormGroup :label="$t('catalog.products.form.fields.height')">
          <Input v-model="heightInput" type="number" />
        </FormGroup>
      </div>

      <div class="product-form__row">
        <FormGroup :label="$t('catalog.products.form.fields.width')">
          <Input v-model="widthInput" type="number" />
        </FormGroup>
        <FormGroup :label="$t('catalog.products.form.fields.length')">
          <Input v-model="lengthInput" type="number" />
        </FormGroup>
      </div>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('catalog.products.form.submitCreate')
          : $t('catalog.products.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.product-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

// `padding`/`margin` negativo — mesmo achado real de `Drawer.vue`
// (`.ui-drawer-body`)/`Modal.vue` (`.ui-modal-body`): sem esse respiro,
// o anel de foco do campo encostado na borda ficava cortado pelo
// próprio `overflow-y: auto`. Aqui os 4 lados partiam de margem 0, então
// a compensação é uniforme nos 4.
.product-form__fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-4;
  margin: calc(-1 * #{$spacing-4});
  overflow-y: auto;
}

.product-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-16;
}
</style>
