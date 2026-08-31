import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createPricingRuleFormSchema,
  type PricingRuleFormValues,
} from '../schemas/pricingRuleFormSchema'
import { createAdminPricingRule, updateAdminPricingRule } from '../services/pricingApi'
import type { PricingRule } from '../types/pricingRule.type'

function emptyFormValues(): PricingRuleFormValues {
  return { fixedFee: 0, order: 0, percentage: 0, rangeMax: 0, rangeMin: 0 }
}

function toFormValues(rule: PricingRule): PricingRuleFormValues {
  return {
    fixedFee: Number(rule.fixedFee),
    order: rule.order,
    percentage: Number(rule.percentage),
    rangeMax: Number(rule.rangeMax),
    rangeMin: Number(rule.rangeMin),
  }
}

function toRequestPayload(values: PricingRuleFormValues) {
  return {
    fixed_fee: values.fixedFee,
    order: values.order,
    percentage: values.percentage,
    range_max: values.rangeMax,
    range_min: values.rangeMin,
  }
}

/**
 * Formulário único pra criar E editar regra de comissão — mesmo padrão
 * de `useProductLaunchForm.ts`, em cima de `useResourceForm`.
 * `marketplaceId` é fixo (recebido na criação do composable), cada
 * instância vive dentro do contexto de UM marketplace.
 */
export function useAdminPricingRuleForm(marketplaceId: string) {
  const { t } = useI18n()

  return useResourceForm<PricingRuleFormValues, PricingRule, ReturnType<typeof toRequestPayload>>({
    create: (payload) => createAdminPricingRule(marketplaceId, payload),
    emptyValues: emptyFormValues,
    schema: createPricingRuleFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('pricing.admin.pricingRules.form.createSuccess')
        : t('pricing.admin.pricingRules.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) => updateAdminPricingRule(marketplaceId, existing.id, payload),
  })
}
