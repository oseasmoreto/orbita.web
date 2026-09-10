<script setup lang="ts">
/**
 * Extraído de `CompanyRegistrationView.vue` em 2026-09-02, pedido direto
 * do usuário ("precisamos editar os dados ou pelo menos visualizar os
 * dados da empresa no account") — segundo consumidor real
 * (`AccountView.vue`) do mesmo formulário singleton, mesmo critério de
 * promoção já usado no resto do projeto (`IconTile.vue`...). Só os
 * CAMPOS + estados de loading/erro — sem
 * cabeçalho/card, cada consumidor decide a própria moldura (`CompanyRegistrationView.vue`
 * é um card centralizado fora do `AppLayout`; `AccountView.vue` é mais um
 * `<section>` dentro da grade de perfil já existente).
 *
 * Nunca decide o que fazer DEPOIS de salvar — só emite `saved` com a
 * `Company` resultante (mesma régua de `ProductForm.vue`: consumidor
 * decide navegação/refresh, o form só sabe validar e submeter).
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Input from '@/shared/components/ui/Input.vue'
import Select from '@/shared/components/ui/Select.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import { Warning } from '@/shared/components/icons/regular.generated'
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import { useCompanyForm } from '../composables/useCompanyForm'
import { isCnpjDocument, TAX_REGIME_OPTIONS } from '../schemas/companyFormSchema'
import type { CompanyFormValues } from '../schemas/companyFormSchema'
import type { Company } from '../types/company.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const { t } = useI18n()

const taxRegimeOptions: SelectOption[] = TAX_REGIME_OPTIONS.map((value) => ({
  label: t(`identity.companyRegistration.taxRegimeOptions.${value}`),
  value,
}))

const emit = defineEmits<{ saved: [company: Company] }>()

const { errors, existingCompany, hasLoadError, isLoading, isSubmitting, load, submit, values } =
  useCompanyForm()

const salesTaxPercentageInput = useNumberFieldModel(values, 'salesTaxPercentage')
const operationalCostPercentageInput = useNumberFieldModel(values, 'operationalCostPercentage', {
  nullable: true,
})

onMounted(load)

const requiresResponsibleDocument = computed(() => isCnpjDocument(values.document))

function fieldError(key: keyof CompanyFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit()

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <div v-if="isLoading" class="company-form__state">
    <Spinner :size="32" />
  </div>

  <div v-else-if="hasLoadError" class="company-form__state">
    <p>{{ $t('identity.companyRegistration.loadError') }}</p>
    <Button variant="outline" @click="load">{{ $t('identity.companyRegistration.retry') }}</Button>
  </div>

  <form v-else class="company-form" @submit.prevent="handleSubmit">
    <FormGroup :error="fieldError('name')" :label="$t('identity.companyRegistration.fields.name')">
      <Input v-model="values.name" :invalid="Boolean(fieldError('name'))" />
    </FormGroup>

    <FormGroup
      :error="fieldError('document')"
      :label="$t('identity.companyRegistration.fields.document')"
    >
      <Input
        v-model="values.document"
        :invalid="Boolean(fieldError('document'))"
        :placeholder="$t('identity.companyRegistration.placeholders.document')"
      />
    </FormGroup>

    <FormGroup
      v-if="requiresResponsibleDocument"
      :error="fieldError('responsibleDocument')"
      :label="$t('identity.companyRegistration.fields.responsibleDocument')"
      :label-tooltip="$t('identity.companyRegistration.responsibleDocumentTooltip')"
    >
      <Input
        v-model="values.responsibleDocument"
        :invalid="Boolean(fieldError('responsibleDocument'))"
        :placeholder="$t('identity.companyRegistration.placeholders.responsibleDocument')"
      />
    </FormGroup>

    <FormGroup
      :error="fieldError('salesTaxPercentage')"
      :label="$t('identity.companyRegistration.fields.salesTaxPercentage')"
    >
      <Input
        v-model="salesTaxPercentageInput"
        :invalid="Boolean(fieldError('salesTaxPercentage'))"
        type="number"
      />
    </FormGroup>

    <FormGroup
      :error="fieldError('operationalCostPercentage')"
      :label="$t('identity.companyRegistration.fields.operationalCostPercentage')"
      :label-tooltip="$t('identity.companyRegistration.operationalCostPercentageTooltip')"
    >
      <Input
        v-model="operationalCostPercentageInput"
        :invalid="Boolean(fieldError('operationalCostPercentage'))"
        type="number"
      />
    </FormGroup>

    <p class="company-form__notice">
      <Icon :icon="Warning" :size="16" />
      {{ $t('identity.companyRegistration.taxRegimeWarning') }}
    </p>

    <FormGroup
      :error="fieldError('taxRegime')"
      :label="$t('identity.companyRegistration.fields.taxRegime')"
    >
      <Select
        v-model="values.taxRegime"
        :invalid="Boolean(fieldError('taxRegime'))"
        :options="taxRegimeOptions"
        :placeholder="$t('identity.companyRegistration.taxRegimePlaceholder')"
      />
    </FormGroup>

    <Button :disabled="isSubmitting" class="company-form__submit" type="submit">
      {{
        existingCompany
          ? $t('identity.companyRegistration.submitUpdate')
          : $t('identity.companyRegistration.submitCreate')
      }}
    </Button>
  </form>
</template>

<style scoped lang="scss">

.company-form {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}

.company-form__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $spacing-16;
  padding: $spacing-24 0;
  text-align: center;
}

.company-form__submit {
  margin-top: $spacing-8;
}

// Mesmo padrão de `.my-subscription-view__notice` (Billing) —
// puramente informativo, nunca bloqueia o submit: o backend não valida
// nada sobre `tax_regime` (2026-09-08, pedido direto do usuário).
.company-form__notice {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-yellow;
  background-color: color-mix(in srgb, $color-accent-yellow 12%, transparent);
  border-radius: $radius-8;
}
</style>
