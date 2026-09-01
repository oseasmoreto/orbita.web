import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import { type AdminPlanFormValues, createAdminPlanFormSchema } from '../schemas/adminPlanFormSchema'
import { createAdminPlan, updateAdminPlan } from '../services/billingApi'
import type { AdminPlan } from '../types/plan.type'

function emptyFormValues(): AdminPlanFormValues {
  return {
    active: true,
    billingCycle: 'monthly',
    isTrial: false,
    maxMarketplaces: 1,
    maxProducts: 1,
    name: '',
    price: 0,
    trialDays: null,
  }
}

function toFormValues(plan: AdminPlan): AdminPlanFormValues {
  return {
    active: plan.active,
    billingCycle: plan.billingCycle,
    isTrial: plan.isTrial,
    maxMarketplaces: plan.maxMarketplaces,
    maxProducts: plan.maxProducts,
    name: plan.name,
    price: Number(plan.price),
    trialDays: plan.trialDays,
  }
}

function toRequestPayload(values: AdminPlanFormValues) {
  return {
    active: values.active,
    billing_cycle: values.billingCycle,
    is_trial: values.isTrial,
    max_marketplaces: values.maxMarketplaces,
    max_products: values.maxProducts,
    name: values.name,
    price: values.price,
    trial_days: values.trialDays,
  }
}

/**
 * Formulário único pra criar E editar plano (mesmo padrão de
 * `useAdminMarketplaceForm.ts`, em cima de `useResourceForm`) — cadastro
 * de plano é exclusivo do admin (Fase 6).
 */
export function useAdminPlanForm() {
  const { t } = useI18n()

  return useResourceForm<AdminPlanFormValues, AdminPlan, ReturnType<typeof toRequestPayload>>({
    create: createAdminPlan,
    emptyValues: emptyFormValues,
    schema: createAdminPlanFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('billing.admin.plans.form.createSuccess')
        : t('billing.admin.plans.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) => updateAdminPlan(existing.id, payload),
  })
}
