<script setup lang="ts">
/**
 * Formulário único de criação E edição de regra de comissão — mesmo
 * padrão de `ProductLaunchForm.vue` (Catalog), renderizado dentro de um
 * `Modal.vue` por `AdminPricingRuleList.vue` (não um `Drawer.vue` — já
 * estamos dentro do Drawer de edição do marketplace). Todos os campos
 * são numéricos — `useNumberFieldModel` (`shared/composables/`) pros 5.
 */
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import { useAdminPricingRuleForm } from '../composables/useAdminPricingRuleForm'
import type { PricingRuleFormValues } from '../schemas/pricingRuleFormSchema'
import type { PricingRule } from '../types/pricingRule.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'

const props = defineProps<{
  marketplaceId: string
  mode: 'create' | 'edit'
  rule: PricingRule | null
}>()

const emit = defineEmits<{
  cancel: []
  saved: [rule: PricingRule]
}>()

const { errors, isSubmitting, reset, submit, values } = useAdminPricingRuleForm(props.marketplaceId)

reset(props.rule ?? undefined)

const rangeMinInput = useNumberFieldModel(values, 'rangeMin')
const rangeMaxInput = useNumberFieldModel(values, 'rangeMax')
const percentageInput = useNumberFieldModel(values, 'percentage')
const fixedFeeInput = useNumberFieldModel(values, 'fixedFee')
const orderInput = useNumberFieldModel(values, 'order')

function fieldError(key: keyof PricingRuleFormValues): string | undefined {
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
  <form class="admin-pricing-rule-form" @submit.prevent="handleSubmit">
    <div class="admin-pricing-rule-form__fields">
      <div class="admin-pricing-rule-form__row">
        <FormGroup
          :error="fieldError('rangeMin')"
          :label="$t('pricing.admin.pricingRules.form.fields.rangeMin')"
        >
          <Input v-model="rangeMinInput" :invalid="Boolean(fieldError('rangeMin'))" type="number" />
        </FormGroup>
        <FormGroup
          :error="fieldError('rangeMax')"
          :label="$t('pricing.admin.pricingRules.form.fields.rangeMax')"
        >
          <Input v-model="rangeMaxInput" :invalid="Boolean(fieldError('rangeMax'))" type="number" />
        </FormGroup>
      </div>

      <div class="admin-pricing-rule-form__row">
        <FormGroup
          :error="fieldError('percentage')"
          :label="$t('pricing.admin.pricingRules.form.fields.percentage')"
        >
          <Input
            v-model="percentageInput"
            :invalid="Boolean(fieldError('percentage'))"
            type="number"
          />
        </FormGroup>
        <FormGroup
          :error="fieldError('fixedFee')"
          :label="$t('pricing.admin.pricingRules.form.fields.fixedFee')"
        >
          <Input v-model="fixedFeeInput" :invalid="Boolean(fieldError('fixedFee'))" type="number" />
        </FormGroup>
      </div>

      <FormGroup
        :error="fieldError('order')"
        :label="$t('pricing.admin.pricingRules.form.fields.order')"
      >
        <Input v-model="orderInput" :invalid="Boolean(fieldError('order'))" type="number" />
      </FormGroup>
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('pricing.admin.pricingRules.form.submitCreate')
          : $t('pricing.admin.pricingRules.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.admin-pricing-rule-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.admin-pricing-rule-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $spacing-16;
}
</style>
