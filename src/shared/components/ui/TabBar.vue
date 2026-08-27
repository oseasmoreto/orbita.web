<script setup lang="ts">
/**
 * Grounded no padrão "TopTab" do frame "Tabs" do Figma — trigger
 * `{spacing.4} {spacing.8}`, inativo `14 Regular` em `{colors.ink-40}`,
 * ativo `14 Semibold` em `{colors.primary}` com sublinhado de 2px na
 * mesma cor. Construído sobre o primitivo `Tabs*` da Reka UI
 * (`TabsRoot`/`TabsList`/`TabsTrigger`) — o painel de conteúdo
 * (`TabsContent`) não é envolvido aqui, o consumidor importa direto de
 * `reka-ui` e usa dentro do slot default, já que o conteúdo de cada aba é
 * sempre específico da tela.
 *
 * **Fora de escopo, de propósito**: o padrão "BlockTab" do mesmo frame
 * (grupo de rótulos tipo "Total Users"/"Total Projects" misturado com
 * `Badge-Tag` de filtro de data "Current Week"/"Previous Week") não é
 * navegação de verdade — é mais um seletor de estatística combinado com
 * filtro, sem nenhum caso de uso no roadmap do Orbita hoje. Só o padrão
 * de navegação por abas (`TopTab`) foi implementado.
 */
import { TabsList, TabsRoot, TabsTrigger } from 'reka-ui'
import type { TabBarOption } from './types/tabBar.type'

defineProps<{
  tabs: TabBarOption[]
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <TabsRoot v-model="model">
    <TabsList class="ui-tab-bar">
      <TabsTrigger v-for="tab in tabs" :key="tab.key" class="ui-tab-bar__trigger" :value="tab.key">
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <slot />
  </TabsRoot>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

.ui-tab-bar {
  display: flex;
  align-items: center;
  gap: $spacing-16;
}

.ui-tab-bar__trigger {
  padding: $spacing-4 $spacing-8;
  font-size: $font-size-md;
  color: $color-ink-40;
  cursor: pointer;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;

  &[data-state='active'] {
    font-weight: $font-weight-semibold;
    color: $color-primary;
    border-bottom-color: $color-primary;
  }
}
</style>
