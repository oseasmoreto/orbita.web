<script setup lang="ts">
// Vitrine temporária dos componentes de UI já implementados
// (docs/design/catalogo-componentes.md) — existe só pra validação visual
// enquanto o dashboard de precificação real (módulo Pricing) não é
// implementado. Some daqui assim que a Fase 4 tiver conteúdo de verdade.
import { ref } from 'vue'
import {
  ArrowRight,
  Bell,
  Check,
  Download,
  Plus,
  Star,
  Trash,
} from '@/shared/components/icons/regular.generated'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import Avatar from '@/shared/components/ui/Avatar.vue'
import Badge from '@/shared/components/ui/Badge.vue'
import Button from '@/shared/components/ui/Button.vue'
import Checkbox from '@/shared/components/ui/Checkbox.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Search from '@/shared/components/ui/Search.vue'
import Select from '@/shared/components/ui/Select.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'

const checkboxUnchecked = ref(false)
const checkboxChecked = ref(true)
const checkboxIndeterminate = ref<boolean | 'indeterminate'>('indeterminate')
const checkboxDisabled = ref(false)

const toggleOff = ref(false)
const toggleOn = ref(true)
const toggleDisabled = ref(false)

const selectValue = ref('')
const selectLabeledValue = ref('shopee')

const marketplaceOptions = [
  { label: 'Shopee', value: 'shopee' },
  { label: 'TikTok Shop', value: 'tiktok' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'Mercado Livre', value: 'mercado-livre' },
]

const searchEmpty = ref('')
const searchFilled = ref('produto azul')

const formGroupValue = ref('')

const modalOpen = ref(false)
const confirmDialogOpen = ref(false)
const confirmDialogResult = ref('')

const drawerSmOpen = ref(false)
const drawerMdOpen = ref(false)
const drawerLgOpen = ref(false)
</script>

<template>
  <main class="showcase">
    <header class="showcase__intro">
      <h1>Vitrine de componentes</h1>
      <p>
        Página temporária de validação — reúne tudo que já foi implementado contra a spec
        real do Figma (ver <code>docs/design/catalogo-componentes.md</code>). Some quando o
        dashboard de precificação de verdade existir.
      </p>
    </header>

    <section class="showcase__section">
      <h2>Button</h2>
      <div class="showcase__row">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
      <div class="showcase__row">
        <Button size="large" variant="primary">Large primary</Button>
        <Button :icon-before="Plus" variant="secondary">Com ícone antes</Button>
        <Button :icon-after="ArrowRight" variant="outline">Com ícone depois</Button>
        <Button aria-label="Favoritar" :icon-before="Star" variant="ghost" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>Input</h2>
      <div class="showcase__row showcase__row--wrap">
        <Input placeholder="Input-A (sem label)" />
        <Input label="Nome do produto" placeholder="Input-B (com label)" />
        <Input invalid label="Preço de venda" model-value="-10" />
        <Input disabled label="Desabilitado" model-value="Somente leitura" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>Checkbox</h2>
      <div class="showcase__row">
        <Checkbox v-model="checkboxUnchecked" label="Não marcado" />
        <Checkbox v-model="checkboxChecked" label="Marcado" />
        <Checkbox v-model="checkboxIndeterminate" label="Indeterminado" />
        <Checkbox v-model="checkboxDisabled" disabled label="Desabilitado" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>Toggle</h2>
      <div class="showcase__row">
        <Toggle v-model="toggleOff" />
        <Toggle v-model="toggleOn" />
        <Toggle v-model="toggleDisabled" disabled />
      </div>
    </section>

    <section class="showcase__section">
      <h2>Select</h2>
      <div class="showcase__row showcase__row--wrap">
        <Select
          v-model="selectValue"
          :options="marketplaceOptions"
          placeholder="Selecione um marketplace"
        />
        <Select v-model="selectLabeledValue" label="Marketplace" :options="marketplaceOptions" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>Badge</h2>
      <div class="showcase__row">
        <Badge variant="ghost">Ghost</Badge>
        <Badge variant="gray">Gray</Badge>
        <Badge :icon-before="Check" variant="gray">Com ícone</Badge>
        <Badge size="sm" variant="ghost">Small</Badge>
      </div>
    </section>

    <section class="showcase__section">
      <h2>Avatar</h2>
      <div class="showcase__row">
        <Avatar name="Oseas Moreto" />
        <Avatar name="Ana Barbosa" :size="48" />
        <Avatar name="X" src="https://invalid-url-should-fallback.test/img.png" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>Tooltip</h2>
      <div class="showcase__row">
        <Tooltip shortcut="⌘N" text="Ver notificações">
          <Button :icon-before="Bell" variant="secondary">Passe o mouse aqui</Button>
        </Tooltip>
        <Tooltip text="Excluir produto">
          <Button aria-label="Excluir" :icon-before="Trash" variant="ghost" />
        </Tooltip>
        <Tooltip text="Baixar relatório">
          <Button aria-label="Baixar" :icon-before="Download" variant="outline" />
        </Tooltip>
      </div>
    </section>

    <section class="showcase__section">
      <h2>Search</h2>
      <div class="showcase__row">
        <Search v-model="searchEmpty" placeholder="Buscar produto" shortcut="⌘/" />
        <Search v-model="searchFilled" placeholder="Buscar produto" />
        <Search disabled placeholder="Desabilitado" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>FormGroup</h2>
      <div class="showcase__row showcase__row--wrap">
        <FormGroup label="Nome do produto">
          <Input v-model="formGroupValue" placeholder="Sem label interna, label vem do FormGroup" />
        </FormGroup>
        <FormGroup error="Selecione ao menos um marketplace">
          <Select :options="marketplaceOptions" placeholder="Marketplace" />
        </FormGroup>
      </div>
    </section>

    <section class="showcase__section">
      <h2>Modal / ConfirmDialog</h2>
      <div class="showcase__row">
        <Button variant="secondary" @click="modalOpen = true">Abrir Modal</Button>
        <Button variant="outline" @click="confirmDialogOpen = true">Abrir ConfirmDialog</Button>
        <span v-if="confirmDialogResult">Resultado: {{ confirmDialogResult }}</span>
      </div>

      <Modal
        v-model="modalOpen"
        description="Conteúdo livre no corpo, ações no footer."
        title="Editar produto"
      >
        <Input label="Nome do produto" model-value="Camiseta azul" />
        <template #footer>
          <Button variant="outline" @click="modalOpen = false">Cancelar</Button>
          <Button variant="primary" @click="modalOpen = false">Salvar</Button>
        </template>
      </Modal>

      <ConfirmDialog
        v-model="confirmDialogOpen"
        cancel-label="Voltar"
        confirm-label="Excluir"
        description="Essa ação não pode ser desfeita."
        title="Excluir produto?"
        @cancel="confirmDialogResult = 'cancelado'"
        @confirm="confirmDialogResult = 'confirmado'"
      />
    </section>

    <section class="showcase__section">
      <h2>Drawer</h2>
      <div class="showcase__row">
        <Button variant="secondary" @click="drawerSmOpen = true">Abrir sm</Button>
        <Button variant="secondary" @click="drawerMdOpen = true">Abrir md</Button>
        <Button variant="secondary" @click="drawerLgOpen = true">Abrir lg</Button>
      </div>

      <Drawer v-model="drawerSmOpen" size="sm" title="Painel pequeno">
        <p>Conteúdo do painel (320px).</p>
      </Drawer>
      <Drawer v-model="drawerMdOpen" size="md" title="Painel médio">
        <p>Conteúdo do painel (480px).</p>
        <template #footer>
          <Button variant="outline" @click="drawerMdOpen = false">Cancelar</Button>
          <Button variant="primary" @click="drawerMdOpen = false">Salvar</Button>
        </template>
      </Drawer>
      <Drawer v-model="drawerLgOpen" size="lg" title="Painel grande">
        <p>Conteúdo do painel (640px).</p>
      </Drawer>
    </section>

    <section class="showcase__section">
      <h2>Spinner</h2>
      <div class="showcase__row">
        <Spinner :size="16" />
        <Spinner :size="24" />
        <Spinner :size="32" />
      </div>
    </section>
  </main>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.showcase {
  display: flex;
  flex-direction: column;
  gap: $spacing-40;
  padding: $spacing-24;
}

.showcase__intro {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;

  h1 {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    color: $color-ink;
  }

  p {
    max-width: 60ch;
    color: $color-ink-40;

    code {
      font-size: $font-size-sm;
    }
  }
}

.showcase__section {
  display: flex;
  flex-direction: column;
  gap: $spacing-12;

  h2 {
    font-size: $font-size-lg;
    font-weight: $font-weight-semibold;
    color: $color-ink;
  }
}

.showcase__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $spacing-16;
}

.showcase__row--wrap > * {
  min-width: 220px;
}
</style>
