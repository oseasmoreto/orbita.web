<script setup lang="ts">
/**
 * "Canais de venda" — grid de cards pedido direto pelo usuário (2026-08-31,
 * referência visual de outro produto: logo + link do site + nome +
 * descrição + tags + botão + toggle). Um único card por marketplace
 * cobre os 2 nós do fluxo original ("Canais disponíveis" + "Minhas
 * conexões", `core/layouts/config/navigation.ts`): sem conexão → botão
 * "Conectar"; conectado → nome da loja + toggle de `active` +
 * "Gerenciar"/desconectar.
 *
 * `logoUrl`/`description`/`tags`/`websiteUrl` — pedidos pro backend no
 * mesmo dia pra fechar o gap real de "pixel perfect" que a v1 tinha
 * (`{colors.tint-1}` + ícone `Storefront` genérico igual pra todo card,
 * sem descrição/tags/link — não existia dado nenhum pra isso). Logo é
 * `MarketplaceLogo.vue` (`modules/pricing/components/`, extraído depois
 * que este card, `AdminMarketplacesView.vue` e `ProductMarketplacesView.vue`
 * precisaram da mesma lógica de imagem+fallback) — nunca inventar
 * logo/cor que não existe.
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
import { useRouter } from 'vue-router'
import {
  ArrowsDownUp,
  ArrowSquareOut,
  ChartBar,
  Trash,
} from '@/shared/components/icons/regular.generated'
import Badge from '@/shared/components/ui/Badge.vue'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import Button from '@/shared/components/ui/Button.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'
import { useApiMessage } from '@/shared/composables/useApiMessage'
import { useConfirmAction } from '@/shared/composables/useConfirmAction'
import { useToast } from '@/shared/composables/useToast'
import { parseApiError } from '@/shared/services/parseApiError'
import ConnectMarketplaceModal from '../components/blocks/ConnectMarketplaceModal.vue'
import MarketplaceLogo from '../components/MarketplaceLogo.vue'
import {
  type MarketplaceConnectionCard,
  useMarketplaceConnections,
} from '../composables/useMarketplaceConnections'
import { useMarketplaceLimit } from '../composables/useMarketplaceLimit'
import { deleteUserMarketplace, updateUserMarketplace } from '../services/pricingApi'
import type { UserMarketplace } from '../types/userMarketplace.type'

/**
 * Só o hostname (`"shopee.com.br"`, não a URL inteira) pro link externo
 * do card — mesmo formato "webflow.com" da referência. `URL` nativa,
 * sem lib externa; `try/catch` porque `website_url` vem de fora
 * (cadastro do admin) e não passa por validação de novo aqui.
 */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

const { t } = useI18n()
const router = useRouter()
const toast = useToast()
const { resolveMessage } = useApiMessage()

function openPricing(card: MarketplaceConnectionCard): void {
  if (!card.connection) {
    return
  }

  void router.push({
    name: 'marketplace-pricing',
    params: { userMarketplaceId: card.connection.id },
  })
}

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
        <div v-if="card.marketplace.comingSoon" class="marketplaces-view__card-ribbon">
          {{ $t('pricing.marketplaces.comingSoonBadge') }}
        </div>

        <div class="marketplaces-view__card-header">
          <MarketplaceLogo :logo-url="card.marketplace.logoUrl" :name="card.marketplace.name" :size="48" />

          <a
            v-if="card.marketplace.websiteUrl"
            class="marketplaces-view__card-link"
            :href="card.marketplace.websiteUrl"
            rel="noopener noreferrer"
            target="_blank"
          >
            {{ hostnameOf(card.marketplace.websiteUrl) }}
            <Icon :icon="ArrowSquareOut" :size="12" />
          </a>
        </div>

        <p class="marketplaces-view__card-title">{{ card.marketplace.name }}</p>
        <p v-if="card.marketplace.description" class="marketplaces-view__card-description">
          {{ card.marketplace.description }}
        </p>
        <p v-if="card.connection" class="marketplaces-view__card-subtitle">
          {{ card.connection.storeName }}
        </p>

        <div
          v-if="card.marketplace.tags && card.marketplace.tags.length > 0"
          class="marketplaces-view__card-tags"
        >
          <Badge v-for="tag in card.marketplace.tags" :key="tag" variant="gray">{{ tag }}</Badge>
        </div>

        <div class="marketplaces-view__card-footer">
          <div class="marketplaces-view__card-actions">
            <Button
              v-if="!card.connection"
              :disabled="marketplaceLimit.isLimitReached.value || card.marketplace.comingSoon"
              :icon-before="ArrowsDownUp"
              variant="outline"
              @click="openConnect(card)"
            >
              {{ $t('pricing.marketplaces.connectButton') }}
            </Button>
            <template v-else>
              <Button :icon-before="ArrowsDownUp" variant="outline" @click="openManage(card)">
                {{ $t('pricing.marketplaces.manageButton') }}
              </Button>
              <Button
                :aria-label="$t('pricing.marketplaces.pricingButton')"
                :icon-before="ChartBar"
                variant="outline"
                @click="openPricing(card)"
              />
              <Button
                :aria-label="$t('common.actions.delete')"
                :icon-before="Trash"
                variant="ghost"
                @click="disconnectConfirmation.request(card.connection)"
              />
            </template>
          </div>

          <Toggle
            :disabled="!card.connection"
            :model-value="card.connection?.active ?? false"
            @update:model-value="(active) => handleToggleActive(card, active)"
          />
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
  padding: $spacing-16;
  overflow: hidden;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-16;
}

// "Tarja" no topo do card, não uma tag solta perto do título (pedido
// direto do usuário — a versão anterior, um `Badge` cinza ao lado do
// nome, "parecia só uma tag do canal", igual às tags de categoria logo
// abaixo). Sangra até as bordas do card via margem negativa (mesma
// técnica de `logo_url`/preview de outros forms) — o `overflow: hidden`
// do card corta os 2 cantos de cima da tarja de volta pro `{radius.16}`
// do próprio card, sem precisar de `border-radius` duplo calculado à
// mão. Fundo tingido (`color-mix`, mesma técnica de `StatusDot`
// `variant="pill"`) em vez de cor sólida — mantém a mesma linguagem de
// "acento pastel, nunca decorativo" do resto do design system, não uma
// cor saturada gritando por cima do card.
.marketplaces-view__card-ribbon {
  padding: $spacing-4 $spacing-16;
  margin: calc(-1 * #{$spacing-16}) calc(-1 * #{$spacing-16}) 0;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $color-accent-yellow;
  text-align: center;
  background-color: color-mix(in srgb, $color-accent-yellow 20%, transparent);
}

.marketplaces-view__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: $spacing-4;
}

.marketplaces-view__card-link {
  display: flex;
  align-items: center;
  gap: $spacing-4;
  font-size: $font-size-xs;
  color: $color-ink-40;
  text-decoration: none;

  &:hover {
    color: $color-ink;
  }
}

.marketplaces-view__card-title {
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.marketplaces-view__card-description {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.marketplaces-view__card-subtitle {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.marketplaces-view__card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-4;
}

// `margin-top: auto` — dentro do card `flex-direction: column`, empurra
// o rodapé (botão + toggle) sempre pra base, alinhando os cards entre si
// mesmo quando um tem `card-subtitle` (nome da loja) e outro não.
.marketplaces-view__card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: $spacing-16;
}

.marketplaces-view__card-actions {
  display: flex;
  flex-wrap: wrap;
  gap: $spacing-8;
}
</style>
