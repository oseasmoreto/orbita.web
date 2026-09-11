import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createShippingRuleFormSchema,
  type ShippingRuleFormValues,
} from '../schemas/shippingRuleFormSchema'
import { createAdminShippingRule, updateAdminShippingRule } from '../services/pricingApi'
import type { ShippingRule } from '../types/shippingRule.type'

function emptyFormValues(): ShippingRuleFormValues {
  return { fixedFee: 0, order: 0, weightMax: 0, weightMin: 0 }
}

function toFormValues(rule: ShippingRule): ShippingRuleFormValues {
  return {
    fixedFee: Number(rule.fixedFee),
    order: rule.order,
    weightMax: Number(rule.weightMax),
    weightMin: Number(rule.weightMin),
  }
}

function toRequestPayload(values: ShippingRuleFormValues) {
  return {
    fixed_fee: values.fixedFee,
    order: values.order,
    weight_max: values.weightMax,
    weight_min: values.weightMin,
  }
}

/**
 * Mirror exato de `useAdminPricingRuleForm.ts` — formulário único pra
 * criar E editar regra de frete por peso, `marketplaceId` fixo por
 * instância.
 */
export function useAdminShippingRuleForm(marketplaceId: string) {
  const { t } = useI18n()

  return useResourceForm<ShippingRuleFormValues, ShippingRule, ReturnType<typeof toRequestPayload>>(
    {
      create: (payload) => createAdminShippingRule(marketplaceId, payload),
      emptyValues: emptyFormValues,
      schema: createShippingRuleFormSchema(t),
      successMessage: (mode) =>
        mode === 'create'
          ? t('pricing.admin.shippingRules.form.createSuccess')
          : t('pricing.admin.shippingRules.form.updateSuccess'),
      toFormValues,
      toRequestPayload,
      update: (existing, payload) => updateAdminShippingRule(marketplaceId, existing.id, payload),
    },
  )
}
