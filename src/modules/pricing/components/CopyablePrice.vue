<script setup lang="ts">
/**
 * Preço sugerido / preço a anunciar clicável pra copiar (pedido direto
 * do usuário, 2026-09-04) — 1ª versão usava um `Button` ícone-only
 * separado ao lado do preço; o usuário pediu explicitamente pra trocar:
 * "coloque pra copiar clicando em cima do numero e quando passar por
 * cima mostrar o tooltip 'click pra copiar'". O NÚMERO em si vira o
 * gatilho — sem ícone extra, sem botão extra, só um `<button>` nativo
 * estilizado pra parecer texto comum (herda `font`/`color` do contexto:
 * usado tanto no preço PRINCIPAL da barra quanto nas dicas secundárias
 * "Sugerido:"/"Preço a anunciar:", tamanhos de fonte diferentes).
 *
 * Copia só o NÚMERO, sem "R$" (`formatDecimal`, não `formatMoney` —
 * pedido explícito, "só mandar o numero não mandar o R$ junto") — o
 * vendedor cola direto num campo de preço do marketplace, que não
 * aceita o símbolo de moeda junto. O texto exibido continua
 * `formatMoney` (com "R$", igual a qualquer outro preço da tela) —
 * só o valor copiado é diferente do texto visível.
 *
 * Reaproveitado em 6 pontos de `ProductMarketplacePricingView.vue`
 * (preço sugerido + preço a anunciar, nas 2 visões — barra e tabela,
 * praticado e sugerido) — 1º componente do módulo Pricing criado já
 * mirando reuso interno de um view só, não promovido pra `shared/`
 * (critério de promoção só sobe quando um SEGUNDO módulo precisar,
 * seção 2 de `docs/infra/convencoes-frontend-infra.md` — aqui ainda é
 * só uso interno de uma única tela).
 */
import Tooltip from '@/shared/components/ui/Tooltip.vue'
import { useToast } from '@/shared/composables/useToast'
import { formatDecimal, formatMoney } from '@/shared/services/formatNumber'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ value: string }>()

const { t } = useI18n()
const toast = useToast()

async function copy(): Promise<void> {
  try {
    await navigator.clipboard.writeText(formatDecimal(props.value))
    toast.success(t('pricing.productMarketplacePricing.priceCopied'))
  } catch {
    toast.error(t('pricing.productMarketplacePricing.priceCopyFailed'))
  }
}
</script>

<template>
  <Tooltip :text="$t('pricing.productMarketplacePricing.copyPriceTooltip')">
    <button class="copyable-price" type="button" @click="copy">
      {{ formatMoney(value) }}
    </button>
  </Tooltip>
</template>

<style scoped lang="scss">

// Reset de `<button>` nativo pra parecer texto comum — só o cursor e o
// hover denunciam que é clicável, o texto herda `font`/`color` de onde
// o componente é usado (preço principal da barra vs. dica secundária,
// tamanhos diferentes).
.copyable-price {
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    @include focus-ring;
  }
}
</style>
