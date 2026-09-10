<script setup lang="ts">
/**
 * `practicedPrice` sempre editável (`UpdateProductMarketplaceRequest`).
 * `categoryId` (2026-09-10, virou mutável via `PATCH`) só aparece quando
 * o consumidor passa `categoryOptions` — hoje só `ProductMarketplacesView.vue`
 * (tabela POR PRODUTO, tem a coluna "Categoria"); `ProductMarketplacePricingView.vue`
 * (tabela POR CONEXÃO) não mostra categoria e não passa a prop, então o
 * campo simplesmente não renderiza ali — nunca um fork de componente só
 * por causa de 1 campo opcional num dos 2 consumidores. Categoria só
 * TROCA, nunca LIMPA de volta pra vazio (mesma régua de
 * `updateProductMarketplace`, `pricingApi.ts`) — `Select` sem opção de
 * "nenhuma". `Modal`, não `Drawer` — mesmo raciocínio de
 * `EditUserRoleModal.vue`/`OverrideSubscriptionModal.vue`: ação pontual.
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
import { computed, watch } from 'vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Select from '@/shared/components/ui/Select.vue'
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import {
  type PracticedPriceTarget,
  useUpdatePracticedPriceForm,
} from '../composables/useUpdatePracticedPriceForm'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{
  categoryOptions?: SelectOption[]
  label?: string
  row: PracticedPriceTarget | null
}>()

const emit = defineEmits<{ saved: [] }>()

const open = defineModel<boolean>({ default: false })

const { errors, isSubmitting, reset, submit, values } = useUpdatePracticedPriceForm()
const practicedPriceModel = useNumberFieldModel(values, 'practicedPrice', { nullable: true })

// Mesmo sentinela `''`↔`null` já usado em `taxRegime`/`storeDocumentType`
// (`Select.vue` não modela `null` nativamente).
const categoryIdModel = computed<string>({
  get: () => values.categoryId ?? '',
  set: (value) => {
    values.categoryId = value === '' ? null : value
  },
})

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

    <FormGroup
      v-if="categoryOptions && categoryOptions.length > 0"
      :error="errors.categoryId"
      :label="$t('pricing.productMarketplacePricing.editModal.fields.category')"
    >
      <Select
        v-model="categoryIdModel"
        :options="categoryOptions"
        :placeholder="$t('pricing.productMarketplacePricing.editModal.categoryPlaceholder')"
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
