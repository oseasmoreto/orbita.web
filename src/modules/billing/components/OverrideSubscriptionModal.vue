<script setup lang="ts">
/**
 * Só `status`/`end_date` (`OverrideSubscriptionRequest`) — correção
 * manual de suporte via `OverrideSubscriptionAction` (backend), nunca
 * nome/plano/usuário (isso é o fluxo normal de assinatura, do PRÓPRIO
 * usuário). `Modal`, não `Drawer` — mesmo raciocínio de
 * `EditUserRoleModal.vue`: 2 campos, ação pontual.
 */
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import DatePicker from '@/shared/components/ui/DatePicker.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Select from '@/shared/components/ui/Select.vue'
import { useOverrideSubscriptionForm } from '../composables/useOverrideSubscriptionForm'
import type { AdminSubscription, SubscriptionStatus } from '../types/subscription.type'
import type { SelectOption } from '@/shared/components/ui/types/select.type'

const props = defineProps<{
  subscription: AdminSubscription | null
}>()

const emit = defineEmits<{ saved: [subscription: AdminSubscription] }>()

const open = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { isSubmitting, reset, submit, values } = useOverrideSubscriptionForm()

// Mesmo achado real já documentado em `EditUserRoleModal.vue`/
// `ConnectMarketplaceModal.vue` — `immediate: true` porque `open` já
// pode nascer `true` no mesmo tick em que `subscription` é setada.
watch(
  open,
  (isOpen) => {
    if (isOpen && props.subscription) {
      reset(props.subscription)
    }
  },
  { immediate: true },
)

const statusOptions: SelectOption[] = [
  { label: t('billing.mySubscription.status.pending'), value: 'pending' },
  { label: t('billing.mySubscription.status.active'), value: 'active' },
  { label: t('billing.mySubscription.status.canceled'), value: 'canceled' },
  { label: t('billing.mySubscription.status.expired'), value: 'expired' },
  { label: t('billing.mySubscription.status.payment_failed'), value: 'payment_failed' },
]

async function handleSubmit(): Promise<void> {
  if (!props.subscription) {
    return
  }

  const updated = await submit(props.subscription)

  if (updated) {
    open.value = false
    emit('saved', updated)
  }
}
</script>

<template>
  <Modal v-model="open" :title="$t('billing.admin.subscriptions.editModal.title')">
    <FormGroup :label="$t('billing.admin.subscriptions.editModal.fields.status')">
      <Select
        :model-value="values.status"
        :options="statusOptions"
        @update:model-value="(value) => (values.status = value as SubscriptionStatus)"
      />
    </FormGroup>

    <FormGroup :label="$t('billing.admin.subscriptions.editModal.fields.endDate')">
      <DatePicker v-model="values.endDate" />
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
