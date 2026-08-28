<script setup lang="ts">
/**
 * Wrapper de gráfico — seção 3.2 de docs/infra/convencoes-frontend-infra.md
 * ("wrapper de gráfico ser sempre um block"). Grounded em 3 screenshots
 * reais enviados pelo usuário em 2026-08-27 (telas de exemplo do mesmo
 * arquivo Figma, fora da página "Components" já em cache — não foi
 * possível confirmar valores exatos via API por rate limit em curso,
 * medidas abaixo são aproximação visual documentada, não pixel exato):
 * - "Traffic by Device": barras com cor por categoria, topo bem
 *   arredondado (estilo cápsula).
 * - "Traffic by Location": donut + legenda (bullet + label + %).
 * - "Total Users": linha sólida preenchida (série atual) + linha
 *   tracejada sem preenchimento (série de comparação), com seletor de
 *   métrica no cabeçalho (`metrics`) — o mesmo padrão "BlockTab" que a
 *   Tier 8 descartou como "não é navegação de verdade" na verdade tem
 *   um uso real aqui: seletor de métrica de gráfico, não navegação de
 *   página. **Extraído pra `BlockTab.vue` (`shared/components/ui/`) em
 *   2026-08-28**, a pedido do usuário — o markup/CSS vivia solto aqui
 *   dentro até então; agora é o mesmo átomo, reutilizável fora de
 *   gráfico.
 *
 * Casca pronta pra Fase 4 — conteúdo real (preço sugerido ao longo do
 * tempo) segue bloqueado pelo mesmo gap de backend do `StatCard`
 * (`PricingCalculator` nunca exposto em rota). Nunca decide o que
 * mostrar: `metrics`/`series` chegam prontos, o clique em `metrics` só
 * emite `update:activeMetric` — quem decide o que fazer com isso é o
 * composable do módulo consumidor.
 */
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import type { ScriptableContext } from 'chart.js'
import { computed, onMounted, ref } from 'vue'
import { Bar, Doughnut, Line } from 'vue-chartjs'
import BlockTab from '../ui/BlockTab.vue'
import type { ChartMetricOption, ChartSeriesConfig } from './types/chartCard.type'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
)

const props = withDefaults(
  defineProps<{
    title: string
    type: 'bar' | 'line' | 'doughnut'
    labels: string[]
    series: ChartSeriesConfig[]
    metrics?: ChartMetricOption[]
  }>(),
  {
    metrics: undefined,
  },
)

const activeMetric = defineModel<string>('activeMetric', { default: '' })

// `<canvas>` não resolve `var()` em cadeia sozinho (achado real, ver
// design-system.md seção Components → ChartCard) — os tokens usados aqui
// são lidos via elementos-sonda reais (aplicando a variável como `color`,
// uma propriedade CSS de verdade força a resolução completa da cadeia),
// nunca via leitura direta da custom property.
const TOKENS = [
  '--color-ink',
  '--color-ink-10',
  '--color-ink-40',
  '--color-paper',
  '--color-accent-indigo',
  '--color-accent-mint',
  '--color-accent-blue',
  '--color-accent-purple',
  '--color-accent-green',
] as const

const resolvedColors = ref<Record<string, string>>({})

onMounted(() => {
  const probeContainer = document.createElement('div')
  probeContainer.style.position = 'absolute'
  probeContainer.style.width = '0'
  probeContainer.style.height = '0'
  probeContainer.style.overflow = 'hidden'
  document.body.appendChild(probeContainer)

  const resolved: Record<string, string> = {}
  for (const token of TOKENS) {
    const probe = document.createElement('span')
    probe.style.color = `var(${token})`
    probeContainer.appendChild(probe)
    resolved[token] = getComputedStyle(probe).color
  }
  resolvedColors.value = resolved

  probeContainer.remove()
})

const inkColor = computed(() => resolvedColors.value['--color-ink'] ?? '#000000')
const gridColor = computed(() => resolvedColors.value['--color-ink-10'] ?? '#e5e5e5')
const textColor = computed(() => resolvedColors.value['--color-ink-40'] ?? '#999999')
const paperColor = computed(() => resolvedColors.value['--color-paper'] ?? '#ffffff')

// Paleta categórica (barras, segmentos de donut) — grounded nas cores
// vistas em "Traffic by Device"/"Traffic by Location" (aproximação: são
// os acentos pastel já existentes no design system, não valores exatos
// medidos do Figma).
const categoricalPalette = computed(() => [
  resolvedColors.value['--color-accent-indigo'] ?? '#adadfb',
  resolvedColors.value['--color-accent-mint'] ?? '#6be6d3',
  inkColor.value,
  resolvedColors.value['--color-accent-blue'] ?? '#7dbbff',
  resolvedColors.value['--color-accent-purple'] ?? '#b899eb',
  resolvedColors.value['--color-accent-green'] ?? '#71dd8c',
])

function categoricalColor(index: number): string {
  const palette = categoricalPalette.value
  return palette[index % palette.length] ?? inkColor.value
}

// Área sob a linha sólida é um gradiente de verdade no Figma (escuro no
// topo, esmaecendo pra transparente perto do eixo), não uma cor
// translúcida chapada — achado real, reportado pelo usuário em 2026-08-27
// com screenshot de comparação lado a lado contra a implementação
// anterior. `{colors.ink-10}` (já um token com alfa) como stop inicial +
// `"transparent"` (palavra-chave CSS/Canvas válida) como stop final evita
// qualquer parsing de string de cor resolvida — só 2 valores já seguros.
function createAreaGradient(context: ScriptableContext<'line'>): CanvasGradient | string {
  const { chart } = context
  const { chartArea, ctx } = chart
  if (!chartArea) return gridColor.value

  const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
  gradient.addColorStop(0, gridColor.value)
  gradient.addColorStop(1, 'transparent')
  return gradient
}

const showHeaderLegend = computed(() => props.type === 'line' && props.series.length > 1)
const showDoughnutLegend = computed(() => props.type === 'doughnut')

const doughnutTotal = computed(() =>
  (props.series[0]?.values ?? []).reduce((sum, value) => sum + value, 0),
)

function doughnutPercentage(index: number): string {
  const value = props.series[0]?.values[index] ?? 0
  if (doughnutTotal.value === 0) return '0%'
  return `${((value / doughnutTotal.value) * 100).toFixed(1)}%`
}

// Achado real, reportado pelo usuário com referência "Traffic by Location":
// o maior segmento do donut ganha um gradiente escuro (não cor sólida) —
// mesmo destaque visual já usado em outro lugar do design system pro maior
// valor de uma métrica. Índice calculado aqui (não fixo), pra funcionar com
// qualquer conjunto de dados, não só o exemplo da vitrine.
const doughnutMaxIndex = computed(() => {
  const values = props.series[0]?.values ?? []
  let maxIndex = 0
  for (let index = 1; index < values.length; index += 1) {
    if ((values[index] ?? 0) > (values[maxIndex] ?? 0)) maxIndex = index
  }
  return maxIndex
})

function createDarkArcGradient(context: ScriptableContext<'doughnut'>): CanvasGradient | string {
  const { chart } = context
  const { chartArea, ctx } = chart
  if (!chartArea) return inkColor.value

  const gradient = ctx.createLinearGradient(
    chartArea.left,
    chartArea.top,
    chartArea.right,
    chartArea.bottom,
  )
  gradient.addColorStop(0, inkColor.value)
  gradient.addColorStop(1, textColor.value)
  return gradient
}

function doughnutSegmentColor(context: ScriptableContext<'doughnut'>): CanvasGradient | string {
  const index = context.dataIndex
  return index === doughnutMaxIndex.value ? createDarkArcGradient(context) : categoricalColor(index)
}

// Um computed por tipo de gráfico (não um union type genérico) — o
// `<Bar>`/`<Line>`/`<Doughnut>` do vue-chartjs esperam o `ChartData<T>`
// específico do próprio tipo, um retorno unificado com `if`s internos
// não tipa bem contra os 3 ao mesmo tempo.
const barData = computed(() => ({
  datasets: [
    {
      backgroundColor: props.labels.map((_, index) => categoricalColor(index)),
      // Barras bem mais largas/próximas que a v1 — achado real, reportado
      // pelo usuário: a referência do Figma tem barras "gordas" (quase
      // sem vão entre categorias), a v1 ficou fina e espaçada demais.
      barPercentage: 0.9,
      // Achado real, 2ª correção pixel-perfect: a referência tem
      // arredondamento suave nos 4 cantos (topo E base), não só o topo
      // em pill total (999) — usuário comparou lado a lado e apontou que
      // a v2 (só topo, 999) não bate com o Figma real.
      borderRadius: 12,
      borderSkipped: false,
      categoryPercentage: 0.7,
      data: props.series[0]?.values ?? [],
    },
  ],
  labels: props.labels,
}))

const doughnutData = computed(() => ({
  datasets: [
    {
      backgroundColor: doughnutSegmentColor,
      // Segmentos separados por vão + pontas arredondadas — achado real,
      // reportado pelo usuário: a v1 tinha os segmentos colados, sem
      // arredondamento, a referência ("Traffic by Location") mostra os
      // dois claramente.
      borderRadius: 8,
      borderWidth: 0,
      data: props.series[0]?.values ?? [],
      spacing: 4,
    },
  ],
  labels: props.labels,
}))

// Achado real, reportado pelo usuário com referência "Total Users": a
// linha de comparação tracejada é sempre azul claro no Figma, não a cor
// categórica cíclica (a v1 usava `categoricalColor(0)`, que caía no
// indigo/roxo — errado). Fixo, não cíclico, porque só existe 1 papel de
// "série de comparação" no padrão visto na referência.
const dashedSeriesColor = computed(() => resolvedColors.value['--color-accent-blue'] ?? '#7dbbff')

const lineData = computed(() => ({
  datasets: props.series.map((series, index) => ({
    backgroundColor: series.dashed ? 'transparent' : createAreaGradient,
    borderColor: series.dashed ? dashedSeriesColor.value : inkColor.value,
    // Traço mais curto/fino que a v1 (6,6) — a referência tem um pontilhado
    // delicado, não um tracejado grosso.
    borderDash: series.dashed ? [3, 4] : undefined,
    borderWidth: series.dashed ? 1.5 : 2,
    data: series.values,
    fill: !series.dashed,
    label: series.label,
    // primeira série sempre por cima, mesmo se registrada antes
    order: index,
    pointBackgroundColor: series.dashed ? dashedSeriesColor.value : inkColor.value,
    pointBorderColor: 'transparent',
    pointHitRadius: 8,
    // Sem ponto em repouso (mesma referência), mas com feedback visual no
    // hover — sem isso o cursor sobre a linha não confirma em qual ponto
    // exato o tooltip está ancorado.
    pointHoverRadius: 4,
    pointRadius: 0,
    tension: 0.35,
  })),
  labels: props.labels,
}))

const chartOptions = computed(() => ({
  // Achado real: 65% deixava o anel fino demais — a referência
  // ("Traffic by Location") tem um anel bem mais grosso, aproximação
  // visual a partir do screenshot (sem medida exata via API).
  cutout: props.type === 'doughnut' ? '50%' : undefined,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    // Default do chart.js é uma caixa preta sem raio, fora do design
    // system — achado real na revisão pixel-perfect: o tooltip nunca tinha
    // sido estilizado, destoando de todo o resto do card.
    tooltip: {
      backgroundColor: inkColor.value,
      bodyColor: paperColor.value,
      bodyFont: { family: 'Inter Variable', size: 12 },
      boxPadding: 4,
      cornerRadius: 8,
      displayColors: props.type !== 'line',
      padding: 8,
      titleColor: paperColor.value,
      titleFont: { family: 'Inter Variable', size: 12, weight: 'bold' as const },
    },
  },
  responsive: true,
  scales:
    props.type === 'doughnut'
      ? undefined
      : {
          x: {
            // `border` é a linha do próprio eixo (em y=0/x=0), separada
            // de `grid` (as linhas de referência) — achado real, 5ª
            // correção: remover só `grid` deixava a linha do eixo em si
            // ainda visível. A referência não tem nenhuma linha, só os
            // labels.
            border: { display: false },
            grid: { display: false },
            // Sem rotação nunca — a referência do Figma mantém os rótulos
            // sempre na horizontal, mesmo quando o texto é mais longo
            // (achado real: a v1 deixava o chart.js rotacionar
            // automaticamente por overflow, resultado feio e diferente
            // do Figma). `autoSkip: false` é obrigatório junto —
            // **2º achado real**: sem rotação disponível, o chart.js por
            // padrão esconde rótulos alternados pra evitar overlap
            // (`autoSkip: true` é o default), sem aviso nenhum — 3 das 6
            // categorias sumiam silenciosamente do eixo. Categoria sem
            // rótulo visível é pior que rótulo apertado.
            ticks: {
              autoSkip: false,
              color: textColor.value,
              maxRotation: 0,
              minRotation: 0,
            },
          },
          y: {
            // Achado real, 2ª correção pixel-perfect: a referência
            // "Traffic by Device" não tem nenhuma linha de grade atrás
            // das barras, só os labels do eixo. **Achado real, 4ª
            // correção**: a referência "Total Users" (linha) também não
            // tem grade nenhuma — suposição anterior de que o gráfico de
            // linha manteria uma grade horizontal como guia de leitura
            // era especulação sem grounding, contrariada pelo screenshot
            // real. Sem grade em nenhum tipo de eixo cartesiano.
            border: { display: false },
            grid: { display: false },
            ticks: { color: textColor.value },
          },
        },
}))
</script>

<template>
  <div class="chart-card">
    <div class="chart-card__header">
      <BlockTab v-if="metrics && metrics.length > 0" v-model="activeMetric" :options="metrics" />
      <p v-else class="chart-card__title">{{ title }}</p>

      <div v-if="showHeaderLegend" class="chart-card__legend chart-card__legend--inline">
        <span class="chart-card__divider" />
        <span
          v-for="seriesItem in props.series"
          :key="seriesItem.label"
          class="chart-card__legend-item"
        >
          <span class="chart-card__legend-dot" />
          {{ seriesItem.label }}
        </span>
      </div>
    </div>

    <div :class="['chart-card__body', { 'chart-card__body--doughnut': type === 'doughnut' }]">
      <div class="chart-card__canvas">
        <Bar v-if="type === 'bar'" :data="barData" :options="chartOptions" />
        <Line v-else-if="type === 'line'" :data="lineData" :options="chartOptions" />
        <Doughnut v-else :data="doughnutData" :options="chartOptions" />
      </div>

      <ul v-if="showDoughnutLegend" class="chart-card__legend chart-card__legend--list">
        <li v-for="(label, index) in labels" :key="label">
          <span
            class="chart-card__legend-dot"
            :style="{ backgroundColor: categoricalColor(index) }"
          />
          <span class="chart-card__legend-label">{{ label }}</span>
          <span class="chart-card__legend-value">{{ doughnutPercentage(index) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;

// Fundo levemente acinzentado (não branco puro, sem borda) — grounded nos
// 3 screenshots de referência, os 3 cards usam o mesmo fundo sutil contra
// uma página branca.
.chart-card {
  padding: $spacing-24;
  background-color: $color-bg-2;
  border-radius: $radius-16;
}

.chart-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $spacing-16;
}

.chart-card__title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-ink;
}

.chart-card__legend {
  display: flex;
  align-items: center;
  gap: $spacing-16;
}

.chart-card__legend--inline {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.chart-card__divider {
  width: 1px;
  height: 16px;
  background-color: $color-ink-10;
}

.chart-card__legend-item {
  display: inline-flex;
  align-items: center;
  gap: $spacing-4;
}

.chart-card__legend-dot {
  flex-shrink: 0;
  // Achado real, 4ª correção pixel-perfect: a referência "Total Users"
  // usa o mesmo bullet neutro (preto, pequeno) tanto pra série sólida
  // quanto pra tracejada — a distinção de série é feita pela própria
  // linha (cor + tracejado), não pelo marcador da legenda. A v1 colorina
  // o bullet da série tracejada, o que não bate com a referência.
  width: $spacing-4;
  height: $spacing-4;
  background-color: $color-ink;
  border-radius: $radius-80;
}

.chart-card__body {
  display: flex;
  align-items: center;
  gap: $spacing-24;
}

.chart-card__canvas {
  position: relative;
  flex: 1;
  height: 240px;
}

.chart-card__body--doughnut .chart-card__canvas {
  flex: 0 0 auto;
  width: 160px;
  height: 160px;
}

.chart-card__legend--list {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: $spacing-12;
  padding: 0;
  margin: 0;
  list-style: none;
}

.chart-card__legend--list li {
  display: flex;
  align-items: center;
  gap: $spacing-8;
  font-size: $font-size-md;
  color: $color-ink;
}

.chart-card__legend-label {
  flex: 1;
}

.chart-card__legend-value {
  color: $color-ink-40;
}
</style>
