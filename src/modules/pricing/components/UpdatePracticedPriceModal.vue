<script setup lang="ts">
/**
 * `practicedPrice`/`status` sempre editáveis (`UpdateProductMarketplaceRequest`).
 * `categoryId` (2026-09-10, virou mutável via `PATCH`) só aparece quando
 * o consumidor passa `categoryOptions` — hoje só `ProductMarketplacesView.vue`
 * (tabela POR PRODUTO, tem a coluna "Categoria"); `ProductMarketplacePricingView.vue`
 * (tabela POR CONEXÃO) não mostra categoria e não passa a prop, então o
 * campo simplesmente não renderiza ali — nunca um fork de componente só
 * por causa de 1 campo opcional num dos 2 consumidores. Categoria só
 * TROCA, nunca LIMPA de volta pra vazio (mesma régua de
 * `updateProductMarketplace`, `pricingApi.ts`) — `Select` sem opção de
 * "nenhuma". `status` (mesmo dia) é o oposto: SEMPRE visível nos 2
 * consumidores — todo vínculo já nasce com um valor real (`not_sent`
 * default), sem caso condicional pra esconder. Opções estáticas, mesmo
 * padrão de `roleOptions`/`statusOptions` em `EditUserRoleModal.vue`
 * (enum fixo pequeno, sem necessidade de Zod validar formato — só o
 * `Select` já restringe o valor possível). `Modal`, não `Drawer` — mesmo
 * raciocínio de `EditUserRoleModal.vue`/`OverrideSubscriptionModal.vue`:
 * ação pontual.
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
 *
 * **Preview de lucro/margem, 2026-09-11** (pedido direto do usuário —
 * "testar um preço hipotético antes de aplicar de verdade, sem risco de
 * esquecer de reverter"): digitar um preço aqui chama `GET .../simulate`
 * (debounced 300ms, `usePracticedPriceSimulation.ts` — mesma convenção
 * de debounce em quem consome, seção 4 de
 * `docs/infra/convencoes-frontend-infra.md`) e mostra lucro/margem
 * calculados SEM gravar nada — só o botão "Salvar" persiste de verdade
 * (`PATCH` de sempre). Fechar o modal sem salvar não muda nada no
 * servidor, mesmo tendo digitado vários preços de teste no meio.
 */
import { computed, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Select from '@/shared/components/ui/Select.vue'
import { useNumberFieldModel } from '@/shared/composables/useNumberFieldModel'
import { formatMoney, formatPercent } from '@/shared/services/formatNumber'
import {
  type PracticedPriceTarget,
  useUpdatePracticedPriceForm,
} from '../composables/useUpdatePracticedPriceForm'
import { usePracticedPriceSimulation } from '../composables/usePracticedPriceSimulation'
import { outcomeTone } from '../services/pricingBreakdown'
import type { ProductMarketplaceStatus } from '../types/productMarketplace.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{
  categoryOptions?: SelectOption[]
  label?: string
  row: PracticedPriceTarget | null
}>()

const { t } = useI18n()

const statusOptions: SelectOption[] = [
  { label: t('pricing.productMarketplaceStatus.notSent'), value: 'not_sent' },
  { label: t('pricing.productMarketplaceStatus.pending'), value: 'pending' },
  { label: t('pricing.productMarketplaceStatus.sent'), value: 'sent' },
]

const emit = defineEmits<{ saved: [] }>()

const open = defineModel<boolean>({ default: false })

const { errors, isSubmitting, reset, submit, values } = useUpdatePracticedPriceForm()
const practicedPriceModel = useNumberFieldModel(values, 'practicedPrice', { nullable: true })

const simulation = usePracticedPriceSimulation()
const debouncedPracticedPrice = refDebounced(
  computed(() => values.practicedPrice),
  300,
)

watch(debouncedPracticedPrice, (price) => {
  if (props.row) {
    void simulation.simulate(props.row.productId, props.row.id, price)
  }
})

const previewMarginToneClass = computed(() =>
  simulation.preview.value
    ? `update-practiced-price-modal__preview-margin--${outcomeTone(
        simulation.preview.value.practicedProfit ?? '0',
        simulation.preview.value.meetsTargetMargin,
      )}`
    : '',
)

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
      simulation.reset()
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

    <p v-if="simulation.isSimulating.value" class="update-practiced-price-modal__preview-loading">
      {{ $t('pricing.productMarketplacePricing.editModal.simulating') }}
    </p>
    <div v-else-if="simulation.preview.value" class="update-practiced-price-modal__preview">
      <p class="update-practiced-price-modal__preview-row">
        <span>{{ $t('pricing.productMarketplacePricing.editModal.previewProfit') }}</span>
        <span
          class="update-practiced-price-modal__preview-margin"
          :class="previewMarginToneClass"
        >
          {{ formatMoney(simulation.preview.value.practicedProfit ?? '0') }}
          ({{ formatPercent(Number(simulation.preview.value.practicedMarginPercentage ?? '0'), 1) }})
        </span>
      </p>
      <p
        class="update-practiced-price-modal__preview-row"
        :class="{
          'update-practiced-price-modal__preview-row--warning':
            !simulation.preview.value.meetsTargetMargin,
        }"
      >
        {{
          simulation.preview.value.meetsTargetMargin
            ? $t('pricing.productMarketplacePricing.editModal.previewMeetsTargetYes')
            : $t('pricing.productMarketplacePricing.editModal.previewMeetsTargetNo')
        }}
      </p>
    </div>

    <FormGroup
      :error="errors.status"
      :label="$t('pricing.productMarketplacePricing.editModal.fields.status')"
    >
      <Select
        :model-value="values.status"
        :options="statusOptions"
        @update:model-value="(value) => (values.status = value as ProductMarketplaceStatus)"
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

<style scoped lang="scss">

.update-practiced-price-modal__preview-loading {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.update-practiced-price-modal__preview {
  display: flex;
  flex-direction: column;
  gap: $spacing-4;
  padding: $spacing-12;
  background-color: $color-bg-2;
  border-radius: $radius-8;
}

.update-practiced-price-modal__preview-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $font-size-sm;
  color: $color-ink;
}

// Mesma paleta de `ProductMarketplacePricingView.vue`
// (`.product-marketplace-pricing-view__product-margin--*`) — tom vem de
// `outcomeTone` (`pricingBreakdown.ts`), mesma função, só a classe CSS é
// local a este componente.
.update-practiced-price-modal__preview-margin--positive {
  color: $color-accent-green;
}

.update-practiced-price-modal__preview-margin--neutral {
  color: $color-accent-yellow;
}

.update-practiced-price-modal__preview-margin--negative {
  color: $color-accent-red;
}

.update-practiced-price-modal__preview-row--warning {
  color: $color-accent-yellow;
}
</style>
