<script setup lang="ts">
/**
 * Formulário único de criação E edição de regra de frete por peso —
 * mirror exato de `AdminPricingRuleForm.vue`, renderizado dentro de um
 * `Modal.vue` por `AdminShippingRuleList.vue`.
 */
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import { useAdminShippingRuleForm } from '../composables/useAdminShippingRuleForm'
import type { ShippingRuleFormValues } from '../schemas/shippingRuleFormSchema'
import type { ShippingRule } from '../types/shippingRule.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'

const props = defineProps<{
  marketplaceId: string
  mode: 'create' | 'edit'
  rule: ShippingRule | null
}>()

const emit = defineEmits<{
  cancel: []
  saved: [rule: ShippingRule]
}>()

const { errors, isSubmitting, reset, submit, values } = useAdminShippingRuleForm(
  props.marketplaceId,
)

reset(props.rule ?? undefined)

const weightMinInput = useNumberFieldModel(values, 'weightMin')
const weightMaxInput = useNumberFieldModel(values, 'weightMax')
const fixedFeeInput = useNumberFieldModel(values, 'fixedFee')
const orderInput = useNumberFieldModel(values, 'order')

function fieldError(key: keyof ShippingRuleFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.rule ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="admin-shipping-rule-form" @submit.prevent="handleSubmit">
    <div class="admin-shipping-rule-form__fields">
      <div class="admin-shipping-rule-form__row">
        <FormGroup
          :error="fieldError('weightMin')"
          :label="$t('pricing.admin.shippingRules.form.fields.weightMin')"
        >
          <Input v-model="weightMinInput" :invalid="Boolean(fieldError('weightMin'))" type="number" />
        </FormGroup>
        <FormGroup
          :error="fieldError('weightMax')"
          :label="$t('pricing.admin.shippingRules.form.fields.weightMax')"
        >
          <Input v-model="weightMaxInput" :invalid="Boolean(fieldError('weightMax'))" type="number" />
        </FormGroup>
      </div>

      <div class="admin-shipping-rule-form__row">
        <FormGroup
          :error="fieldError('fixedFee')"
          :label="$t('pricing.admin.shippingRules.form.fields.fixedFee')"
        >
          <Input v-model="fixedFeeInput" :invalid="Boolean(fieldError('fixedFee'))" type="number" />
        </FormGroup>
        <FormGroup
          :error="fieldError('order')"
          :label="$t('pricing.admin.shippingRules.form.fields.order')"
        >
          <Input v-model="orderInput" :invalid="Boolean(fieldError('order'))" type="number" />
        </FormGroup>
      </div>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('pricing.admin.shippingRules.form.submitCreate')
          : $t('pricing.admin.shippingRules.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.admin-shipping-rule-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.admin-shipping-rule-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-16;
}
</style>
