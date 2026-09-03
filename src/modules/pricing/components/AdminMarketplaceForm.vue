<script setup lang="ts">
/**
 * Formulário único de criação E edição — mesmo padrão de
 * `ProductForm.vue` (Catalog), renderizado dentro do `Drawer.vue` lateral
 * direito por `AdminMarketplacesView.vue`. Cadastro de marketplace é
 * exclusivo do admin (`docs/negocio/contexto-plataforma-precificacao.md`
 * seção 3) — esta view só é alcançável por `admin_master`
 * (`meta.roles`, `routes.ts`).
 *
 * `websiteUrl`/`description` (`Input.vue` só expõe `v-model` de
 * `string`, mas os 2 campos são nullable na API) usam uma ponte
 * string↔null local — `''` vira `null` na borda, mesmo raciocínio de
 * `useNumberFieldModel` (`shared/composables/`) mas pra texto. Só este
 * form usa isso nesta rodada, não justifica ainda um composable genérico
 * (sobe pra `shared/` só quando um SEGUNDO form precisar do mesmo
 * padrão).
 *
 * **Logo é upload real, não link externo** — mudança de contrato pedida
 * pelo usuário em 2026-08-31 ("não podemos ficar dependendo de links
 * externos"), depois de uma primeira rodada que aceitava `logo_url`
 * colado. Primeiro upload de arquivo do projeto — sem componente
 * `FileInput` no design system ainda (nenhum outro form precisou disso
 * até aqui), então é um `<input type="file">` nativo, escondido
 * visualmente e disparado por um `Button` normal (`fileInputRef.click()`),
 * convertido pra base64 via `FileReader` antes de entrar em
 * `values.logoBase64`. Preview mostra o arquivo recém-escolhido, ou o
 * `logo_url` já existente (edição) quando nenhum arquivo novo foi
 * escolhido ainda, ou o `IconTile` de fallback quando não há nenhum dos
 * dois — mesmo fallback visual de `MarketplacesView.vue`.
 */
import { computed, ref } from 'vue'
import { Storefront } from '@/shared/components/icons/regular.generated'
import { useAdminMarketplaceForm } from '../composables/useAdminMarketplaceForm'
import type { MarketplaceFormValues } from '../schemas/marketplaceFormSchema'
import type { AdminMarketplace } from '../types/marketplace.type'
import CrudFormActions from '@/shared/components/blocks/CrudFormActions.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Button from '@/shared/components/ui/Button.vue'
import IconTile from '@/shared/components/ui/IconTile.vue'
import Input from '@/shared/components/ui/Input.vue'
import TagsInput from '@/shared/components/ui/TagsInput.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'

const props = defineProps<{
  marketplace: AdminMarketplace | null
  mode: 'create' | 'edit'
}>()

const emit = defineEmits<{
  cancel: []
  saved: [marketplace: AdminMarketplace]
}>()

const { errors, isSubmitting, reset, submit, values } = useAdminMarketplaceForm()

reset(props.marketplace ?? undefined)

const websiteUrlInput = computed<string>({
  get: () => values.websiteUrl ?? '',
  set: (raw) => {
    values.websiteUrl = raw === '' ? null : raw
  },
})

const descriptionInput = computed<string>({
  get: () => values.description ?? '',
  set: (raw) => {
    values.description = raw === '' ? null : raw
  },
})

const logoFileInput = ref<HTMLInputElement | null>(null)
const logoPreview = computed(() => values.logoBase64 ?? props.marketplace?.logoUrl ?? null)

function openLogoFilePicker(): void {
  logoFileInput.value?.click()
}

function handleLogoFileChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0]

  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    values.logoBase64 = typeof reader.result === 'string' ? reader.result : null
  }
  reader.readAsDataURL(file)
}

function fieldError(key: keyof MarketplaceFormValues): string | undefined {
  return errors.value[key]
}

async function handleSubmit(): Promise<void> {
  const saved = await submit(props.marketplace ?? undefined)

  if (saved) {
    emit('saved', saved)
  }
}
</script>

<template>
  <form class="admin-marketplace-form" @submit.prevent="handleSubmit">
    <div class="admin-marketplace-form__fields">
      <FormGroup :error="fieldError('name')" :label="$t('pricing.admin.marketplaces.form.fields.name')">
        <Input v-model="values.name" :invalid="Boolean(fieldError('name'))" />
      </FormGroup>

      <FormGroup :label="$t('pricing.admin.marketplaces.form.fields.logo')">
        <div class="admin-marketplace-form__logo">
          <img
            v-if="logoPreview"
            :alt="values.name"
            class="admin-marketplace-form__logo-preview"
            :src="logoPreview"
          />
          <IconTile v-else :icon="Storefront" :icon-size="24" :size="48" tint="blue" />

          <input
            ref="logoFileInput"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            class="admin-marketplace-form__logo-file-input"
            type="file"
            @change="handleLogoFileChange"
          />
          <Button type="button" variant="outline" @click="openLogoFilePicker">
            {{ $t('pricing.admin.marketplaces.form.fields.chooseLogo') }}
          </Button>
        </div>
      </FormGroup>

      <FormGroup
        :error="fieldError('websiteUrl')"
        :label="$t('pricing.admin.marketplaces.form.fields.websiteUrl')"
      >
        <Input
          v-model="websiteUrlInput"
          :invalid="Boolean(fieldError('websiteUrl'))"
          :placeholder="$t('pricing.admin.marketplaces.form.placeholders.websiteUrl')"
          type="url"
        />
      </FormGroup>

      <FormGroup
        :error="fieldError('description')"
        :label="$t('pricing.admin.marketplaces.form.fields.description')"
      >
        <Input v-model="descriptionInput" :invalid="Boolean(fieldError('description'))" />
      </FormGroup>

      <FormGroup :label="$t('pricing.admin.marketplaces.form.fields.tags')">
        <TagsInput v-model="values.tags" />
      </FormGroup>

      <Toggle v-model="values.active" :label="$t('pricing.admin.marketplaces.form.fields.active')" />
      <Toggle
        v-model="values.comingSoon"
        :label="$t('pricing.admin.marketplaces.form.fields.comingSoon')"
      />
    </div>

    <CrudFormActions
      :cancel-label="$t('common.actions.cancel')"
      :is-submitting="isSubmitting"
      :submit-label="
        props.mode === 'create'
          ? $t('pricing.admin.marketplaces.form.submitCreate')
          : $t('pricing.admin.marketplaces.form.submitEdit')
      "
      @cancel="emit('cancel')"
    />
  </form>
</template>

<style scoped lang="scss">

.admin-marketplace-form {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.admin-marketplace-form__fields {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: $spacing-16;
  padding: $spacing-4;
  margin: calc(-1 * #{$spacing-4});
  overflow-y: auto;
}

.admin-marketplace-form__logo {
  display: flex;
  align-items: center;
  gap: $spacing-16;
}

.admin-marketplace-form__logo-preview {
  width: $size-48;
  height: $size-48;
  object-fit: cover;
  border-radius: $radius-8;
}

// Nativo, sem estilo do design system pra `type="file"` — escondido
// visualmente (não `display: none`, que tiraria do fluxo de tab/foco de
// teclado) e disparado pelo `Button` visível via `.click()`.
.admin-marketplace-form__logo-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  white-space: nowrap;
  clip-path: inset(50%);
  border: 0;
}
</style>
