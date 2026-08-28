<script setup lang="ts">
// Vitrine temporária dos componentes de UI já implementados
// (docs/design/catalogo-componentes.md) — existe só pra validação visual
// enquanto o dashboard de precificação real (módulo Pricing) não é
// implementado. Some daqui assim que a Fase 4 tiver conteúdo de verdade.
import { TabsContent } from 'reka-ui'
import { ref } from 'vue'
import {
  ArrowRight,
  Bell,
  CalendarBlank,
  Check,
  Clipboard,
  DotsThreeOutlineVertical,
  Download,
  PencilSimpleLine,
  Plus,
  Star,
  Trash,
} from '@/shared/components/icons/regular.generated'
import AvatarGroup from '@/shared/components/blocks/AvatarGroup.vue'
import ChartCard from '@/shared/components/blocks/ChartCard.vue'
import ConfirmDialog from '@/shared/components/blocks/ConfirmDialog.vue'
import AppFooter from '@/core/layouts/AppFooter.vue'
import DataTable from '@/shared/components/blocks/DataTable.vue'
import FormGroup from '@/shared/components/blocks/FormGroup.vue'
import ListToolbar from '@/shared/components/blocks/ListToolbar.vue'
import PaginationNav from '@/shared/components/blocks/PaginationNav.vue'
import StatCard from '@/shared/components/blocks/StatCard.vue'
import Avatar from '@/shared/components/ui/Avatar.vue'
import Badge from '@/shared/components/ui/Badge.vue'
import Breadcrumb from '@/shared/components/ui/Breadcrumb.vue'
import Button from '@/shared/components/ui/Button.vue'
import Checkbox from '@/shared/components/ui/Checkbox.vue'
import DatePicker from '@/shared/components/ui/DatePicker.vue'
import DropdownMenu from '@/shared/components/ui/DropdownMenu.vue'
import Drawer from '@/shared/components/ui/Drawer.vue'
import Icon from '@/shared/components/ui/Icon.vue'
import IconTile from '@/shared/components/ui/IconTile.vue'
import Input from '@/shared/components/ui/Input.vue'
import Modal from '@/shared/components/ui/Modal.vue'
import Search from '@/shared/components/ui/Search.vue'
import Select from '@/shared/components/ui/Select.vue'
import Spinner from '@/shared/components/ui/Spinner.vue'
import StatusDot from '@/shared/components/ui/StatusDot.vue'
import TabBar from '@/shared/components/ui/TabBar.vue'
import TagsInput from '@/shared/components/ui/TagsInput.vue'
import Toggle from '@/shared/components/ui/Toggle.vue'
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import type { BreadcrumbItem } from '@/shared/components/ui/types/breadcrumb.type'
import type {
  DataTableColumn,
  DataTableSortDirection,
} from '@/shared/components/ui/types/dataTable.type'
import type { DropdownMenuOption } from '@/shared/components/ui/types/dropdownMenu.type'
import type { FooterLink } from '@/core/layouts/types/footer.type'
import type { TabBarOption } from '@/shared/components/ui/types/tabBar.type'
import type { ChartMetricOption } from '@/shared/components/blocks/types/chartCard.type'
import type { AvatarGroupPerson } from '@/shared/components/blocks/types/avatarGroup.type'

const checkboxUnchecked = ref(false)
const checkboxChecked = ref(true)
const checkboxIndeterminate = ref<boolean | 'indeterminate'>('indeterminate')
const checkboxDisabled = ref(false)

const toggleOff = ref(false)
const toggleOn = ref(true)
const toggleDisabled = ref(false)
const toggleBoxed = ref(true)

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

const datePickerEmpty = ref('')
const datePickerFilled = ref('2026-08-27')

const tagsInputEmpty = ref<string[]>([])
const tagsInputBoxed = ref<string[]>(['Tag', 'Tag'])
const tagsInputDisabled = ref<string[]>([])

const formGroupValue = ref('')

const modalOpen = ref(false)
const confirmDialogOpen = ref(false)
const confirmDialogResult = ref('')

const drawerSmOpen = ref(false)
const drawerMdOpen = ref(false)
const drawerLgOpen = ref(false)

interface ProductRow {
  createdAt: string
  id: string
  margin: 'ok' | 'low'
  marketplace: string
  name: string
  price: string
}

const productColumns: DataTableColumn[] = [
  { key: 'name', sortable: true, title: 'Produto' },
  { key: 'price', sortable: true, title: 'Preço' },
  { key: 'margin', title: 'Margem' },
  { key: 'marketplace', title: 'Marketplace' },
  { key: 'createdAt', sortable: true, title: 'Cadastrado em' },
  { key: 'operations', title: '' },
]

const rowActions: DropdownMenuOption[] = [
  { icon: PencilSimpleLine, key: 'edit', label: 'Editar' },
  { icon: Download, key: 'download', label: 'Baixar' },
  { icon: Trash, key: 'delete', label: 'Excluir', separatorBefore: true },
]

const productRows: ProductRow[] = [
  {
    createdAt: '12/08/2026',
    id: '1',
    margin: 'ok',
    marketplace: 'Shopee',
    name: 'Camiseta azul',
    price: 'R$ 59,90',
  },
  {
    createdAt: '10/08/2026',
    id: '2',
    margin: 'low',
    marketplace: 'Mercado Livre',
    name: 'Tênis esportivo',
    price: 'R$ 199,90',
  },
  {
    createdAt: '08/08/2026',
    id: '3',
    margin: 'ok',
    marketplace: 'Amazon',
    name: 'Fone de ouvido',
    price: 'R$ 89,90',
  },
]

const selectedProductIds = ref<string[]>([])
const lastSortEvent = ref('nenhuma')
const lastRowAction = ref('nenhuma')

function handleRowAction(productName: string, actionKey: string): void {
  lastRowAction.value = `${actionKey} (${productName})`
}

function handleSort(key: string, direction: DataTableSortDirection): void {
  lastSortEvent.value = direction ? `${key} (${direction})` : 'nenhuma'
}

const toolbarSearch = ref('')
const lastToolbarAction = ref('nenhuma')
const currentPage = ref(1)

interface TaskRow {
  assignedTo: string
  status: 'in-progress' | 'complete' | 'pending'
  timeSpent: string
  title: string
}

const taskColumns: DataTableColumn[] = [
  { key: 'title', title: 'Título' },
  { key: 'assignedTo', title: 'Responsável' },
  { key: 'timeSpent', title: 'Tempo gasto' },
  { key: 'status', title: 'Status' },
]

const taskRows: TaskRow[] = [
  {
    assignedTo: 'Ana Barbosa',
    status: 'in-progress',
    timeSpent: '3h 20min',
    title: 'Página de detalhe',
  },
  {
    assignedTo: 'Oseas Moreto',
    status: 'complete',
    timeSpent: '12h 21min',
    title: 'Gráficos de consumo',
  },
  {
    assignedTo: 'Ana Barbosa',
    status: 'pending',
    timeSpent: '78h 5min',
    title: 'App de desenvolvimento',
  },
]

/**
 * Cobertura das variantes de célula do `COMPONENT_SET "Table Components"`
 * do Figma, pedida diretamente pelo usuário em 2026-08-28 com captura
 * real do frame inteiro — não são tipos novos inventados, são os mesmos
 * já citados desde a Tier 6 (`docs/design/catalogo-componentes.md`):
 * Title/Text/Text-Icon/User/Users/Date/Status/Operation/Activity. Uma
 * linha só, igual à captura (que mostra 1 exemplo de cada tipo lado a
 * lado, não uma tabela de dados de verdade).
 */
const statusColor: Record<TableComponentsRow['status'], 'gray' | 'green' | 'indigo' | 'yellow'> = {
  approved: 'yellow',
  complete: 'green',
  'in-progress': 'indigo',
  rejected: 'gray',
}

const statusLabel: Record<TableComponentsRow['status'], string> = {
  approved: 'Approved',
  complete: 'Complete',
  'in-progress': 'In Progress',
  rejected: 'Rejected',
}

interface TableComponentsRow {
  activity: string
  date: string
  id: string
  status: 'approved' | 'complete' | 'in-progress' | 'rejected'
  text: string
  textIcon: string
  title: string
  user: string
  users: AvatarGroupPerson[]
}

const tableComponentsColumns: DataTableColumn[] = [
  { key: 'menu', title: '' },
  { key: 'title', title: 'Title' },
  { key: 'text', title: 'Text' },
  { key: 'textIcon', title: 'Text + Icon' },
  { key: 'user', title: 'User' },
  { key: 'users', title: 'Users' },
  { key: 'date', title: 'Date' },
  { key: 'status', title: 'Status' },
  { key: 'download', title: '' },
  { key: 'activity', title: 'Activity' },
]

const tableComponentsRows: TableComponentsRow[] = [
  {
    activity: 'Editar produto',
    date: '12/08/2026',
    id: '1',
    status: 'in-progress',
    text: 'Dashboard de precificação',
    textIcon: 'Relatório mensal',
    title: 'Design system',
    user: 'Kate Morrison',
    users: [
      { name: 'Kate Morrison' },
      { name: 'Oseas Moreto' },
      { name: 'Ana Barbosa' },
      { name: 'Lucas Prado' },
      { name: 'Bianca Reis' },
    ],
  },
]

const footerLinks: FooterLink[] = [
  { label: 'About', to: { name: 'home' } },
  { label: 'Support', to: { name: 'home' } },
  { label: 'Contact Us', to: { name: 'home' } },
]

const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Dashboards', to: { name: 'home' } },
  { label: 'Marketplaces', to: { name: 'home' } },
  { label: 'Shopee' },
]

const tabs: TabBarOption[] = [
  { key: 'overview', label: 'Visão geral' },
  { key: 'products', label: 'Produtos' },
  { key: 'settings', label: 'Configurações' },
]
const activeTab = ref('overview')

const chartMetrics: ChartMetricOption[] = [
  { key: 'price', label: 'Preço sugerido' },
  { key: 'margin', label: 'Margem' },
]
const activeChartMetric = ref('price')
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
      <div class="showcase__row showcase__row--wrap">
        <Toggle v-model="toggleBoxed" label="Allowed" title="Title" />
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
      <h2>DatePicker</h2>
      <div class="showcase__row showcase__row--wrap">
        <DatePicker v-model="datePickerEmpty" placeholder="Selecione uma data" />
        <DatePicker v-model="datePickerFilled" label="Data de lançamento" />
        <DatePicker disabled placeholder="Desabilitado" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>TagsInput</h2>
      <div class="showcase__row showcase__row--wrap">
        <TagsInput v-model="tagsInputEmpty" placeholder="Adicionar tag" />
        <TagsInput v-model="tagsInputBoxed" label="Title" />
        <TagsInput v-model="tagsInputDisabled" disabled placeholder="Desabilitado" />
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
      <h2>DataTable</h2>
      <p>
        Selecionados: {{ selectedProductIds.length }} · Última ordenação: {{ lastSortEvent }} ·
        Última ação da toolbar: {{ lastToolbarAction }} · Última ação de linha:
        {{ lastRowAction }}
      </p>
      <ListToolbar
        v-model:search="toolbarSearch"
        search-placeholder="Buscar produto"
        @add="lastToolbarAction = 'adicionar'"
        @filter="lastToolbarAction = 'filtrar'"
        @sort="lastToolbarAction = 'ordenar'"
      />
      <DataTable
        v-model:selected="selectedProductIds"
        :columns="productColumns"
        row-key="id"
        :rows="productRows"
        selectable
        @sort="handleSort"
      >
        <template #cell-margin="{ row }">
          <Badge :variant="row.margin === 'ok' ? 'gray' : 'ghost'">
            {{ row.margin === 'ok' ? 'Dentro da margem' : 'Fora da margem' }}
          </Badge>
        </template>
        <template #cell-marketplace="{ row }">
          <div class="showcase__cell-marketplace">
            <Avatar :name="row.marketplace" :size="20" />
            <span>{{ row.marketplace }}</span>
          </div>
        </template>
        <template #cell-operations="{ row }">
          <DropdownMenu :options="rowActions" @select="(key) => handleRowAction(row.name, key)">
            <Button aria-label="Ações" :icon-before="DotsThreeOutlineVertical" variant="ghost" />
          </DropdownMenu>
        </template>
      </DataTable>
      <PaginationNav v-model:current-page="currentPage" :total-pages="5" />
    </section>

    <section class="showcase__section">
      <h2>DataTable (variante simples, sem seleção)</h2>
      <DataTable :columns="taskColumns" :rows="taskRows">
        <template #cell-assignedTo="{ row }">
          <div class="showcase__cell-marketplace">
            <Avatar :name="row.assignedTo" :size="20" />
            <span>{{ row.assignedTo }}</span>
          </div>
        </template>
        <template #cell-status="{ row }">
          <Badge variant="ghost">
            {{
              { complete: 'Completo', 'in-progress': 'Em andamento', pending: 'Pendente' }[
                row.status
              ]
            }}
          </Badge>
        </template>
      </DataTable>
    </section>

    <section class="showcase__section">
      <h2>Table Components (cobertura de células)</h2>
      <p>
        Uma linha só, cobrindo os tipos de célula do
        <code>COMPONENT_SET "Table Components"</code> do Figma — Title/Text/Text-Icon/User/
        Users/Date/Status/Operation/Activity.
      </p>
      <DataTable :columns="tableComponentsColumns" :rows="tableComponentsRows">
        <template #cell-menu="{ row }">
          <DropdownMenu :options="rowActions" @select="(key) => handleRowAction(row.title, key)">
            <Button aria-label="Ações" :icon-before="DotsThreeOutlineVertical" variant="ghost" />
          </DropdownMenu>
        </template>
        <template #cell-title="{ value }">
          <span class="showcase__cell-title">{{ value }}</span>
        </template>
        <template #cell-textIcon="{ value }">
          <div class="showcase__cell-marketplace">
            <Icon :icon="Clipboard" :size="14" />
            <span>{{ value }}</span>
          </div>
        </template>
        <template #cell-user="{ row }">
          <div class="showcase__cell-marketplace">
            <Avatar :name="row.user" :size="20" />
            <span>{{ row.user }}</span>
          </div>
        </template>
        <template #cell-users="{ row }">
          <AvatarGroup :max="2" :people="row.users" :size="24" />
        </template>
        <template #cell-date="{ value }">
          <div class="showcase__cell-marketplace">
            <Icon :icon="CalendarBlank" :size="14" />
            <span>{{ value }}</span>
          </div>
        </template>
        <template #cell-status="{ row }">
          <StatusDot :color="statusColor[row.status]">{{ statusLabel[row.status] }}</StatusDot>
        </template>
        <template #cell-download="{ row }">
          <Button
            aria-label="Baixar"
            :icon-before="Download"
            variant="ghost"
            @click="lastRowAction = `baixar (${row.title})`"
          />
        </template>
        <template #cell-activity="{ value }">
          <div class="showcase__cell-marketplace">
            <IconTile :icon="PencilSimpleLine" :icon-size="14" :size="24" tint="blue" />
            <span>{{ value }}</span>
          </div>
        </template>
      </DataTable>
    </section>

    <section class="showcase__section">
      <h2>Breadcrumb</h2>
      <Breadcrumb :items="breadcrumbItems" />
    </section>

    <section class="showcase__section">
      <h2>TabBar</h2>
      <TabBar v-model="activeTab" :tabs="tabs">
        <TabsContent value="overview">Conteúdo de "Visão geral".</TabsContent>
        <TabsContent value="products">Conteúdo de "Produtos".</TabsContent>
        <TabsContent value="settings">Conteúdo de "Configurações".</TabsContent>
      </TabBar>
    </section>

    <section class="showcase__section">
      <h2>StatCard / ChartCard</h2>
      <p>
        Casca pronta pra Fase 4 — conteúdo real (preço sugerido) segue bloqueado pelo gap de
        backend (<code>PricingCalculator</code> nunca exposto em rota).
      </p>
      <div class="showcase__row">
        <StatCard
          label="Produtos cadastrados"
          tint="blue"
          :trend="{ direction: 'up', value: '+12%' }"
          value="128"
        />
        <StatCard label="Marketplaces conectados" tint="purple" value="3" />
      </div>
      <div class="showcase__row showcase__row--charts">
        <ChartCard
          :labels="['Shopee', 'TikTok', 'Amazon', 'ML', 'Magalu', 'Outros']"
          :series="[{ label: 'Produtos', values: [18, 32, 22, 40, 12, 26] }]"
          title="Produtos por marketplace (exemplo)"
          type="bar"
        />
        <ChartCard
          :labels="['Shopee', 'Mercado Livre', 'Amazon', 'Outros']"
          :series="[{ label: 'Produtos', values: [52, 23, 14, 11] }]"
          title="Produtos por marketplace (exemplo)"
          type="doughnut"
        />
      </div>
      <div class="showcase__row showcase__row--charts">
        <ChartCard
          v-model:active-metric="activeChartMetric"
          :labels="['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul']"
          :metrics="chartMetrics"
          :series="[
            { label: 'Este ano', values: [42, 45, 41, 48, 50, 47, 49] },
            { dashed: true, label: 'Ano passado', values: [38, 40, 44, 43, 46, 45, 48] },
          ]"
          title="Preço sugerido"
          type="line"
        />
      </div>
    </section>

    <section class="showcase__section">
      <h2>Spinner</h2>
      <div class="showcase__row">
        <Spinner :size="16" />
        <Spinner :size="24" />
        <Spinner :size="32" />
      </div>
    </section>

    <section class="showcase__section">
      <h2>StatusDot</h2>
      <div class="showcase__status-list">
        <StatusDot color="indigo">In Progress</StatusDot>
        <StatusDot color="green">Complete</StatusDot>
        <StatusDot color="cyan">Pending</StatusDot>
        <StatusDot color="yellow">Approved</StatusDot>
        <StatusDot color="gray">Rejected</StatusDot>
      </div>
    </section>
  </main>

  <AppFooter :links="footerLinks" />
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

.showcase__cell-marketplace {
  display: flex;
  align-items: center;
  gap: $spacing-8;
}

// Célula "Title" da captura do usuário aparece em cinza apagado (estado
// vazio/placeholder), diferente da célula "Text" ao lado (cor cheia) —
// mesma cor de placeholder já usada em Input/Select (`{colors.ink-40}`).
.showcase__cell-title {
  color: $color-ink-40;
}

.showcase__row--charts {
  align-items: stretch;
}

.showcase__row--charts > * {
  flex: 1 1 320px;
  max-width: 480px;
}

.showcase__status-list {
  display: flex;
  flex-direction: column;
  gap: $spacing-8;
}
</style>
