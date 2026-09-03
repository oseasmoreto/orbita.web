<script setup lang="ts">
/**
 * Formulário único de criação E edição — mesmo padrão de
 * `AdminMarketplaceForm.vue` (Pricing), renderizado dentro do `Drawer.vue`
 * por `AdminPlansView.vue`. Cadastro de plano é exclusivo do admin
 * (Fase 6, `docs/planejamento/plano-implementacao.md`).
 *
 * `billingCycle`/`isTrial`/`trialDays` têm uma regra cruzada validada no
 * schema (`adminPlanFormSchema.ts`, testado) — o campo "Dias de trial" só
 * aparece quando o ciclo selecionado é "Trial", pra não confundir o
 * admin com um campo que não se aplica ao resto dos planos.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAdminPlanForm } from '../composables/useAdminPlanForm'
import type { AdminPlanFormValues } from '../schemas/adminPlanFormSchema'
import type { AdminPlan } from '../types/plan.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Input from '@/shared/components/ui/Input.vue'
import Select from '@/shared/components/ui/Select.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{
  mode: 'create' | 'edit'
  plan: AdminPlan | null
}>()

const emit = defineEmits<{
  cancel: []
  saved: [plan: AdminPlan]
}>()

const { t } = useI18n()
const { errors, isSubmitting, reset, submit, values } = useAdminPlanForm()

reset(props.plan ?? undefined)

const billingCycleOptions = computed<SelectOption[]>(() => [
  { label: t('billing.billingCycleFilter.monthly'), value: 'monthly' },
  { label: t('billing.billingCycleFilter.yearly'), value: 'yearly' },
  { label: t('billing.admin.plans.form.fields.billingCycleTrial'), value: 'trial' },
])

// Trocar o ciclo pra/de "trial" já ajusta `isTrial`/`trialDays` sozinho —
// evita o admin ter que lembrar de marcar os 2 campos em sincronia (o
// schema rejeitaria a combinação errada, mas isso resolve antes mesmo de
// chegar na validação).
function handleBillingCycleChange(value: string): void {
  values.billingCycle = value as AdminPlanFormValues['billingCycle']
  values.isTrial = value === 'trial'

  if (value !== 'trial') {
    values.trialDays = null
  }
}

const priceModel = useNumberFieldModel(values, 'price')
const maxMarketplacesModel = useNumberFieldModel(values, 'maxMarketplaces')
const maxProductsModel = useNumberFieldModel(values, 'maxProducts')
const trialDaysModel = useNumberFieldModel(values, 'trialDays', { nullable: true })

function fieldError(key: keyof AdminPlanFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.plan ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="admin-plan-form" @submit.prevent="handleSubmit">
    <div class="admin-plan-form__fields">
      <FormGroup :error="fieldError('name')" :label="$t('billing.admin.plans.form.fields.name')">
        <Input v-model="values.name" :invalid="Boolean(fieldError('name'))" />
      </FormGroup>

      <FormGroup :error="fieldError('price')" :label="$t('billing.admin.plans.form.fields.price')">
        <Input v-model="priceModel" :invalid="Boolean(fieldError('price'))" type="number" />
      </FormGroup>

      <FormGroup :label="$t('billing.admin.plans.form.fields.billingCycle')">
        <Select
          :model-value="values.billingCycle"
          :options="billingCycleOptions"
          @update:model-value="handleBillingCycleChange"
        />
      </FormGroup>

      <FormGroup
        v-if="values.billingCycle === 'trial'"
        :error="fieldError('trialDays')"
        :label="$t('billing.admin.plans.form.fields.trialDays')"
      >
        <Input v-model="trialDaysModel" :invalid="Boolean(fieldError('trialDays'))" type="number" />
      </FormGroup>

      <FormGroup
        :error="fieldError('maxProducts')"
        :label="$t('billing.admin.plans.form.fields.maxProducts')"
      >
        <Input v-model="maxProductsModel" :invalid="Boolean(fieldError('maxProducts'))" type="number" />
      </FormGroup>

      <FormGroup
        :error="fieldError('maxMarketplaces')"
        :label="$t('billing.admin.plans.form.fields.maxMarketplaces')"
      >
        <Input
          v-model="maxMarketplacesModel"
          :invalid="Boolean(fieldError('maxMarketplaces'))"
          type="number"
        />
      </FormGroup>

      <Toggle v-model="values.active" :label="$t('billing.admin.plans.form.fields.active')" />
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        mode === 'create' ? $t('common.actions.add') : $t('common.actions.save')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.admin-plan-form__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  margin-bottom: $spacing-24;
}
</style>
