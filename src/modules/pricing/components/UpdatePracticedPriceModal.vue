<script setup lang="ts">
/**
 * Só `practicedPrice` (`UpdateProductMarketplaceRequest`) — categoria
 * continua imutável, trocar de canal continua sendo sempre DELETE + POST
 * de novo (decisão da tarefa 46, não revista). `Modal`, não `Drawer` —
 * mesmo raciocínio de `EditUserRoleModal.vue`/`OverrideSubscriptionModal.vue`:
 * 1 campo, ação pontual.
 *
 * Não emite a linha atualizada — o preço praticado muda TAMBÉM lucro/
 * margem/`meetsTargetMargin` (calculados no backend,
 * `ProductMarketplacePricingCalculator`), então o consumidor sempre
 * refaz `list.refresh()` inteiro depois de `saved`, nunca tenta
 * recalcular isso no cliente.
 *
 * Reaproveitado por 2 telas — `ProductMarketplacePricingView.vue`
 * (tabela POR CONEXÃO) e `ProductMarketplacesView.vue` (tabela POR
 * PRODUTO) — por isso `row` aceita só o mínimo (`PracticedPriceTarget`),
 * não o `ProductMarketplacePricing` inteiro (que só existe na 1ª tela).
 * `label` é o subtítulo do modal, decidido por CADA consumidor (nome do
 * produto numa tela, nome do marketplace/loja na outra) — o modal não
 * sabe de onde veio a linha.
 */
import { watch } from 'vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import {
  type PracticedPriceTarget,
  useUpdatePracticedPriceForm,
} from '../composables/useUpdatePracticedPriceForm'

const props = defineProps<{
  label?: string
  row: PracticedPriceTarget | null
}>()

const emit = defineEmits<{ saved: [] }>()

const open = defineModel<boolean>({ default: false })

const { errors, isSubmitting, reset, submit, values } = useUpdatePracticedPriceForm()
const practicedPriceModel = useNumberFieldModel(values, 'practicedPrice', { nullable: true })

// Mesmo achado real já documentado em `EditUserRoleModal.vue`/
// `ConnectMarketplaceModal.vue` — `immediate: true` porque `open` já
// pode nascer `true` no mesmo tick em que `row` é setada.
watch(
  open,
  (isOpen) => {
    if (isOpen && props.row) {
      reset(props.row)
    }
  },
  { immediate: true },
)

async function handleSubmit(): Promise<void> {
  if (!props.row) {
    return
  }

  const success = await submit(props.row)

  if (success) {
    open.value = false
    emit('saved')
  }
}
</script>

<template>
  <Modal
    v-model="open"
    :description="label"
    :title="$t('pricing.productMarketplacePricing.editModal.title')"
  >
    <FormGroup
      :error="errors.practicedPrice"
      :label="$t('pricing.productMarketplacePricing.editModal.fields.practicedPrice')"
    >
      <Input
        v-model="practicedPriceModel"
        :invalid="Boolean(errors.practicedPrice)"
        :placeholder="$t('pricing.productMarketplacePricing.editModal.placeholder')"
        type="number"
      />
    </FormGroup>

    <template #footer>
      <Button variant="outline" @click="open = false">
        {{ $t('common.actions.cancel') }}
      </Button>
      <Button :disabled="isSubmitting" variant="primary" @click="handleSubmit">
        {{ $t('common.actions.save') }}
      </Button>
    </template>
  </Modal>
</template>
