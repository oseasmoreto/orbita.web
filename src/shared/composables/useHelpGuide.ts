import { computed, ref } from 'vue'
import { fetchHelpGuide } from '../services/fetchHelpGuide'
import type { HelpGuide, HelpGuideStep } from '../types/help.type'

/**
 * Trava o índice do passo atual dentro de `[0, length - 1]` — nunca
 * negativo, nunca além do último passo. `length === 0` (guia ainda não
 * carregado, ou vazio) sempre resolve pra `0`, um índice seguro mesmo
 * sem nenhum passo pra apontar.
 */
export function clampStepIndex(index: number, length: number): number {
  if (length === 0) {
    return 0
  }

  return Math.min(Math.max(index, 0), length - 1)
}

export interface GroupedHelpStep {
  id: string
  index: number
  title: string
}

export interface HelpStepGroup {
  key: string
  steps: GroupedHelpStep[]
}

/**
 * Agrupa os passos por `group`, preservando a ordem de primeira
 * aparição (não ordena alfabeticamente) — é assim que o JSON já vem
 * organizado (empresa → marketplace → produto → vínculo → precificação,
 * a ordem real da jornada), agrupar não deveria embaralhar isso.
 * `index` de cada passo é o índice ORIGINAL na lista completa (o que
 * `goTo()` espera), não a posição dentro do grupo.
 */
export function groupHelpSteps(steps: HelpGuideStep[]): HelpStepGroup[] {
  const groups: HelpStepGroup[] = []

  steps.forEach((step, index) => {
    const entry: GroupedHelpStep = { id: step.id, index, title: step.title }
    const group = groups.find((candidate) => candidate.key === step.group)

    if (group) {
      group.steps.push(entry)
    } else {
      groups.push({ key: step.group, steps: [entry] })
    }
  })

  return groups
}

export function useHelpGuide(path: string) {
  const guide = ref<HelpGuide | null>(null)
  const isLoading = ref(false)
  const error = ref<unknown>(null)
  const currentIndex = ref(0)

  async function load(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      guide.value = await fetchHelpGuide(path)
      currentIndex.value = 0
    } catch (caught) {
      error.value = caught
    } finally {
      isLoading.value = false
    }
  }

  const steps = computed(() => guide.value?.steps ?? [])
  const currentStep = computed(() => steps.value[currentIndex.value] ?? null)
  const isFirst = computed(() => currentIndex.value === 0)
  const isLast = computed(() => currentIndex.value === steps.value.length - 1)
  const groupedSteps = computed(() => groupHelpSteps(steps.value))

  function goTo(index: number): void {
    currentIndex.value = clampStepIndex(index, steps.value.length)
  }

  function next(): void {
    goTo(currentIndex.value + 1)
  }

  function previous(): void {
    goTo(currentIndex.value - 1)
  }

  return {
    currentIndex,
    currentStep,
    error,
    goTo,
    groupedSteps,
    guide,
    isFirst,
    isLast,
    isLoading,
    load,
    next,
    previous,
    steps,
  }
}
