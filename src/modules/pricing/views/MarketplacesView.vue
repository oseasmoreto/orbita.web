<script setup lang="ts">
/**
 * "Canais de venda" — grid de cards pedido direto pelo usuário (2026-08-31,
 * referência visual de outro produto: ícone + nome + toggle + botão),
 * adaptado aos campos reais de `MARKETPLACE`/`USER_MARKETPLACE` (sem os
 * badges/tags e o link externo da referência — não existe dado análogo
 * no domínio da Orbita). Um único card por marketplace cobre os 2 nós do
 * fluxo original ("Canais disponíveis" + "Minhas conexões",
 * `core/layouts/config/navigation.ts`): sem conexão → botão "Conectar";
 * conectado → nome da loja + toggle de `active` + "Gerenciar"/desconectar.
 *
 * `active` (toggle) e desconectar (`DELETE`) são ações DIFERENTES de
 * propósito — `active: false` só pausa (bloqueia NOVOS vínculos de
 * produto, mantém os existentes, `docs/negocio/contexto-plataforma-precificacao.md`
 * seção 3), enquanto `DELETE` remove a conexão de vez E cascade-deleta
 * os vínculos de produto já feitos (`DeleteUserMarketplaceAction`,
 * backend) — por isso só o `DELETE` pede confirmação.
 */
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Storefront, Trash } from '@/shared/components/icons/regular.generated'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import Button from '@/shared/components/ui/Button.vue'
import IconTile from '@/shared/components/ui/IconTile.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import ConnectMarketplaceModal from '../components/blocks/ConnectMarketplaceModal.vue'
import {
  type MarketplaceConnectionCard,
  useMarketplaceConnections,
} from '../composables/useMarketplaceConnections'
import { useMarketplaceLimit } from '../composables/useMarketplaceLimit'
import { deleteUserMarketplace, updateUserMarketplace } from '../services/pricingApi'
import type { UserMarketplace } from '../types/userMarketplace.type'

const { t } = useI18n()
const toast = useToast()
const { resolveMessage } = useApiMessage()

const connections = useMarketplaceConnections()
onMounted(connections.refresh)

const marketplaceLimit = useMarketplaceLimit(() => connections.connectedCount.value)

const isModalOpen = ref(false)
const modalMode = ref<'create' | 'edit'>('create')
const activeCard = ref<MarketplaceConnectionCard | null>(null)

function openConnect(card: MarketplaceConnectionCard): void {
  modalMode.value = 'create'
  activeCard.value = card
  isModalOpen.value = true
}

function openManage(card: MarketplaceConnectionCard): void {
  modalMode.value = 'edit'
  activeCard.value = card
  isModalOpen.value = true
}

function handleSaved(): void {
  void connections.refresh()
}

async function handleToggleActive(card: MarketplaceConnectionCard, active: boolean): Promise<void> {
  if (!card.connection) {
    return
  }

  try {
    await updateUserMarketplace(card.connection.id, { active })
    toast.success(
      active ? t('pricing.marketplaces.activateSuccess') : t('pricing.marketplaces.pauseSuccess'),
    )
  } catch (caughtError) {
    toast.error(resolveMessage(parseApiError(caughtError).messageKey))
  } finally {
    await connections.refresh()
  }
}

const disconnectConfirmation = useConfirmAction<UserMarketplace>()

async function handleDisconnect(): Promise<void> {
  await disconnectConfirmation.confirm(async (target) => {
    await deleteUserMarketplace(target.id)
    toast.success(t('pricing.marketplaces.disconnectSuccess'))
    await connections.refresh()
  })
}
</script>

<template>
  <div class="marketplaces-view">
    <h1 class="marketplaces-view__title">{{ $t('pricing.marketplaces.title') }}</h1>

    <p v-if="connections.error.value" class="marketplaces-view__error" role="alert">
      {{ resolveMessage(parseApiError(connections.error.value).messageKey) }}
    </p>

    <p v-if="marketplaceLimit.maxMarketplaces.value !== null" class="marketplaces-view__limit">
      {{
        $t('pricing.marketplaces.usage', {
          max: marketplaceLimit.maxMarketplaces.value,
          total: connections.connectedCount.value,
        })
      }}
    </p>

    <div class="marketplaces-view__grid">
      <div v-for="card in connections.cards.value" :key="card.marketplace.id" class="marketplaces-view__card">
        <div class="marketplaces-view__card-header">
          <IconTile :icon="Storefront" :icon-size="24" :size="48" tint="blue" />
          <Toggle
            :disabled="!card.connection"
            :model-value="card.connection?.active ?? false"
            @update:model-value="(active) => handleToggleActive(card, active)"
          />
        </div>

        <p class="marketplaces-view__card-title">{{ card.marketplace.name }}</p>
        <p v-if="card.connection" class="marketplaces-view__card-subtitle">
          {{ card.connection.storeName }}
        </p>

        <div class="marketplaces-view__card-actions">
          <Button
            v-if="!card.connection"
            :disabled="marketplaceLimit.isLimitReached.value"
            variant="primary"
            @click="openConnect(card)"
          >
            {{ $t('pricing.marketplaces.connectButton') }}
          </Button>
          <template v-else>
            <Button variant="outline" @click="openManage(card)">
              {{ $t('pricing.marketplaces.manageButton') }}
            </Button>
            <Button
              :icon-before="Trash"
              variant="ghost"
              @click="disconnectConfirmation.request(card.connection)"
            >
              {{ $t('common.actions.delete') }}
            </Button>
          </template>
        </div>
      </div>
    </div>

    <ConnectMarketplaceModal
      v-if="activeCard"
      v-model="isModalOpen"
      :connection="activeCard.connection"
      :marketplace-id="activeCard.marketplace.id"
      :marketplace-name="activeCard.marketplace.name"
      :mode="modalMode"
      @saved="handleSaved"
    />

    <ConfirmDialog
      v-model:open="disconnectConfirmation.isOpen.value"
      :cancel-label="$t('common.actions.cancel')"
      :confirm-label="$t('common.actions.delete')"
      :description="$t('pricing.marketplaces.disconnectConfirm.description')"
      :title="$t('pricing.marketplaces.disconnectConfirm.title')"
      @cancel="disconnectConfirmation.cancel()"
      @confirm="handleDisconnect()"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.marketplaces-view {
  display: flex;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-24;
}

.marketplaces-view__title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.marketplaces-view__limit {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.marketplaces-view__error {
  padding: $spacing-12 $spacing-16;
  font-size: $font-size-sm;
  color: $color-accent-red;
  background-color: color-mix(in srgb, $color-accent-red 12%, transparent);
  border-radius: $radius-8;
}

.marketplaces-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: $spacing-16;
}

.marketplaces-view__card {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
  padding: $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

.marketplaces-view__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.marketplaces-view__card-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.marketplaces-view__card-subtitle {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.marketplaces-view__card-actions {
  display: flex;
  gap: $spacing-8;
  margin-top: $spacing-8;
}
</style>
