<script setup lang="ts">
import { CheckboxRoot } from 'reka-ui'
import { computed } from 'vue'
import {
  Checkbox as CheckboxEmpty,
  Checkbox2,
  Checkbox3,
  Checkbox5,
  Checkbox6,
  Checkbox8,
} from '@/shared/components/icons/snow-ui.generated'
import Icon from './Icon.vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    label?: string
  }>(),
  {
    disabled: false,
    label: undefined,
  },
)

/**
 * `boolean | 'indeterminate'` é o próprio tipo do Reka UI `CheckboxRoot` —
 * não é um bridging pra um prop separado, segue o primitivo de verdade.
 */
const model = defineModel<boolean | 'indeterminate'>({ default: false })

/**
 * Os ícones `Checkbox`/`Checkbox2`/`Checkbox3`/`Checkbox5`/`Checkbox6`/`Checkbox8`
 * de `docs/icons-snow-ui/` são os estados reais do componente do design
 * system (unchecked/indeterminate/checked × default/disabled) — não é
 * ilustração de referência, é o asset final. Hover (`Checkbox1`/`4`/`7`)
 * não é usado aqui — aproximado via CSS (opacidade), não troca de ícone.
 */
const icon = computed(() => {
  if (model.value === 'indeterminate') return props.disabled ? Checkbox5 : Checkbox3
  if (model.value) return props.disabled ? Checkbox8 : Checkbox6
  return props.disabled ? Checkbox2 : CheckboxEmpty
})

function handleLabelClick(): void {
  if (props.disabled) return
  model.value = model.value === true ? false : true
}
</script>

<template>
  <div :class="['ui-checkbox', { 'ui-checkbox--disabled': disabled }]">
    <CheckboxRoot v-model="model" class="ui-checkbox__root" :disabled="disabled">
      <Icon :icon="icon" :size="20" />
    </CheckboxRoot>
    <span v-if="label" class="ui-checkbox__label" @click="handleLabelClick">{{ label }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '@/core/styles/variables' as *;
@use '@/core/styles/mixins' as *;

.ui-checkbox {
  display: inline-flex;
  align-items: center;
  gap: $spacing-8;

  &--disabled {
    cursor: not-allowed;
  }
}

.ui-checkbox__root {
  all: unset;
  display: inline-flex;
  cursor: pointer;

  &:focus-visible {
    @include focus-ring;
  }

  &[data-disabled] {
    cursor: not-allowed;
  }
}

.ui-checkbox__label {
  font-size: $font-size-md;
  color: $color-ink;
  cursor: pointer;

  .ui-checkbox--disabled & {
    cursor: not-allowed;
  }
}
</style>
