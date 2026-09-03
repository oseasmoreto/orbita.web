import { clampStepIndex, groupHelpSteps } from '@/shared/composables/useHelpGuide'
import type { HelpGuideStep } from '@/shared/types/help.type'

describe('clampStepIndex', () => {
  it('keeps an in-range index unchanged', () => {
    expect(clampStepIndex(2, 5)).toBe(2)
  })

  it('clamps a negative index to 0', () => {
    expect(clampStepIndex(-1, 5)).toBe(0)
  })

  it('clamps an index past the end to the last valid index', () => {
    expect(clampStepIndex(10, 5)).toBe(4)
  })

  it('returns 0 when there are no steps at all', () => {
    expect(clampStepIndex(3, 0)).toBe(0)
  })
})

describe('groupHelpSteps', () => {
  const steps: HelpGuideStep[] = [
    { description: '', group: 'empresa', id: 'a', image: '', title: 'Empresa A' },
    { description: '', group: 'empresa', id: 'b', image: '', title: 'Empresa B' },
    { description: '', group: 'marketplace', id: 'c', image: '', title: 'Marketplace C' },
    { description: '', group: 'empresa', id: 'd', image: '', title: 'Empresa D (fora de ordem)' },
  ]

  it('groups steps by their group key, preserving first-appearance order', () => {
    const groups = groupHelpSteps(steps)

    expect(groups.map((group) => group.key)).toEqual(['empresa', 'marketplace'])
  })

  it('keeps the original list index on each grouped step, not the position within the group', () => {
    const groups = groupHelpSteps(steps)
    const empresaGroup = groups.find((group) => group.key === 'empresa')

    expect(empresaGroup?.steps.map((step) => step.index)).toEqual([0, 1, 3])
  })

  it('returns an empty array for an empty step list', () => {
    expect(groupHelpSteps([])).toEqual([])
  })
})
