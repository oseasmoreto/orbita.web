<script setup lang="ts">
/**
 * Coleta `store_name` + os 3 percentuais informativos por canal (tarefa
 * 65) pra conectar (create) OU editar (update) uma conexão — mesmo
 * padrão de `DocumentPromptModal.vue` (Billing): reset do form
 * disparado por um `watch(open, ...)`, não pelo `defineProps` direto (o
 * modal é reaproveitado pro grid INTEIRO de cards, `MarketplacesView.vue`
 * só troca as props antes de abrir).
 */
import { watch } from 'vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import { useUserMarketplaceForm } from '../../composables/useUserMarketplaceForm'
import type { UserMarketplace } from '../../types/userMarketplace.type'

const props = defineProps<{
  connection: UserMarketplace | null
  marketplaceId: string
  marketplaceName: string
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{ saved: [connection: UserMarketplace] }>()

const open = defineModel<boolean>({ default: false })

const { errors, isSubmitting, reset, submit, values } = useUserMarketplaceForm()

const adsPercentageInput = useNumberFieldModel(values, 'adsPercentage', { nullable: true })
const campaignDiscountPercentageInput = useNumberFieldModel(values, 'campaignDiscountPercentage', {
  nullable: true,
})
const affiliatePercentageInput = useNumberFieldModel(values, 'affiliatePercentage', {
  nullable: true,
})

/**
 * Achado real, 2026-08-31: sem `immediate: true`, a PRIMEIRA vez que
 * este componente monta (`v-if="activeCard"` em `MarketplacesView.vue`)
 * a prop `open` já nasce `true` — `activeCard`/`isModalOpen` são
 * setados juntos, na mesma função síncrona, antes do component sequer
 * existir. Um `watch` sem `immediate` só dispara numa MUDANÇA de valor;
 * nesse primeiro mount não há mudança nenhuma pra ele ver, então
 * `values.marketplaceId` nunca era setado e o `POST /user-marketplaces`
 * saía com `marketplace_id: ""` (422 `errorMessageValidation`,
 * confirmado inspecionando o payload real da requisição). Reaberturas
 * seguintes funcionavam (o componente já estava montado, `open`
 * realmente transiciona false→true) — só o primeiro clique "Conectar"
 * de toda a sessão quebrava.
 */
watch(
  open,
  (isOpen) => {
    if (!isOpen) {
      return
    }

    if (props.mode === 'edit' && props.connection) {
      reset(props.connection)
      return
    }

    reset()
    values.marketplaceId = props.marketplaceId
  },
  { immediate: true },
)

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.mode === 'edit' ? (props.connection ?? undefined) : undefined)

  if (saved) {
    open.value = false
    emit('saved', saved)
  }
}
</script>

<template>
  <Modal
    v-model="open"
    :title="
      mode === 'create'
        ? $t('pricing.marketplaces.connectModal.connectTitle', { name: marketplaceName })
        : $t('pricing.marketplaces.connectModal.editTitle', { name: marketplaceName })
    "
  >
    <div class="connect-marketplace-modal__fields">
      <FormGroup
        :error="errors.storeName"
        :label="$t('pricing.marketplaces.connectModal.fields.storeName')"
      >
        <Input
          v-model="values.storeName"
          :invalid="Boolean(errors.storeName)"
          @keyup.enter="handleSubmit"
        />
      </FormGroup>

      <FormGroup
        :error="errors.adsPercentage"
        :label="$t('pricing.marketplaces.connectModal.fields.adsPercentage')"
        :label-tooltip="$t('pricing.marketplaces.connectModal.tooltips.adsPercentage')"
      >
        <Input
          v-model="adsPercentageInput"
          :invalid="Boolean(errors.adsPercentage)"
          type="number"
        />
      </FormGroup>

      <FormGroup
        :error="errors.campaignDiscountPercentage"
        :label="$t('pricing.marketplaces.connectModal.fields.campaignDiscountPercentage')"
        :label-tooltip="
          $t('pricing.marketplaces.connectModal.tooltips.campaignDiscountPercentage')
        "
      >
        <Input
          v-model="campaignDiscountPercentageInput"
          :invalid="Boolean(errors.campaignDiscountPercentage)"
          type="number"
        />
      </FormGroup>

      <FormGroup
        :error="errors.affiliatePercentage"
        :label="$t('pricing.marketplaces.connectModal.fields.affiliatePercentage')"
        :label-tooltip="$t('pricing.marketplaces.connectModal.tooltips.affiliatePercentage')"
      >
        <Input
          v-model="affiliatePercentageInput"
          :invalid="Boolean(errors.affiliatePercentage)"
          type="number"
        />
      </FormGroup>
    </div>

    <template #footer>
      <Button variant="outline" @click="open = false">
        {{ $t('common.actions.cancel') }}
      </Button>
      <Button :disabled="isSubmitting" variant="primary" @click="handleSubmit">
        {{
          mode === 'create'
            ? $t('pricing.marketplaces.connectModal.submitConnect')
            : $t('pricing.marketplaces.connectModal.submitSave')
        }}
      </Button>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.connect-marketplace-modal__fields {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
}
</style>
