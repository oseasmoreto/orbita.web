import { useI18n } from 'vue-i18n'
import { useResourceForm } from '@/shared/composables/useResourceForm'
import {
  createMarketplaceFormSchema,
  type MarketplaceFormValues,
} from '../schemas/marketplaceFormSchema'
import { createAdminMarketplace, updateAdminMarketplace } from '../services/pricingApi'
import type { AdminMarketplace } from '../types/marketplace.type'

function emptyFormValues(): MarketplaceFormValues {
  return { active: true, description: null, logoBase64: null, name: '', tags: [], websiteUrl: null }
}

/**
 * `logoBase64` NUNCA vem populado por `toFormValues` — só existe pra
 * carregar um arquivo NOVO escolhido nesta sessão de edição
 * (`AdminMarketplaceForm.vue`, via `FileReader`). O logo já existente
 * (`marketplace.logoUrl`) é só exibido como preview, nunca reconvertido
 * de volta pra base64.
 */
function toFormValues(marketplace: AdminMarketplace): MarketplaceFormValues {
  return {
    active: marketplace.active,
    description: marketplace.description,
    logoBase64: null,
    name: marketplace.name,
    tags: marketplace.tags ?? [],
    websiteUrl: marketplace.websiteUrl,
  }
}

/**
 * `logo_base64` só entra no payload quando o admin realmente escolheu um
 * arquivo novo — omitir a chave (não mandar `null`) em vez de mandar
 * "limpar o logo" implicitamente em toda edição que não mexeu nisso,
 * mesmo padrão já usado pra senha opcional em
 * `useUpdateProfileForm.ts` (`...(values.password ? {...} : {})`).
 */
function toRequestPayload(values: MarketplaceFormValues) {
  return {
    active: values.active,
    description: values.description,
    name: values.name,
    tags: values.tags,
    website_url: values.websiteUrl,
    ...(values.logoBase64 ? { logo_base64: values.logoBase64 } : {}),
  }
}

/**
 * Formulário único pra criar E editar marketplace (mesmo padrão de
 * `useProductForm.ts`, em cima de `useResourceForm`,
 * `shared/composables/`) — cadastro de marketplace é exclusivo do admin
 * (`docs/negocio/contexto-plataforma-precificacao.md` seção 3).
 * `description`/`tags`/`websiteUrl` adicionados em 2026-08-31;
 * `logoBase64` (upload real) substituiu `logoUrl` (link externo) no
 * mesmo dia, mudança de contrato pedida pelo usuário — ver
 * `marketplaceFormSchema.ts`.
 */
export function useAdminMarketplaceForm() {
  const { t } = useI18n()

  return useResourceForm<
    MarketplaceFormValues,
    AdminMarketplace,
    ReturnType<typeof toRequestPayload>
  >({
    create: createAdminMarketplace,
    emptyValues: emptyFormValues,
    schema: createMarketplaceFormSchema(t),
    successMessage: (mode) =>
      mode === 'create'
        ? t('pricing.admin.marketplaces.form.createSuccess')
        : t('pricing.admin.marketplaces.form.updateSuccess'),
    toFormValues,
    toRequestPayload,
    update: (existing, payload) => updateAdminMarketplace(existing.id, payload),
  })
}
