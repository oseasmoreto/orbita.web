<script setup lang="ts">
/**
 * Pedido direto do usuário, 2026-09-01 ("crie um componente de textarea
 * pq esses inputs tao paia pra texto grande") — `Input.vue` é sempre
 * uma linha só; qualquer campo de texto livre mais longo (mensagem de
 * chamado, corpo de resposta na thread) precisava disso. Mesmo
 * tratamento visual de Input-A/B (padding/borda/fundo/raio, variante
 * `label` — caixa "boxed" com legenda dentro), só trocando `<input>` por
 * `<textarea>` com auto-grow (cresce com o conteúdo até `maxRows`, depois
 * rola) — sem alça de resize manual, mais parecido com o composer de um
 * chat do que com um campo de formulário tradicional.
 */
import { nextTick, useId, useTemplateRef, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    invalid?: boolean
    label?: string
    /** Cresce até esse número de linhas antes de rolar internamente. */
    maxRows?: number
    placeholder?: string
    /** Altura inicial, em linhas — antes de qualquer digitação. */
    rows?: number
  }>(),
  {
    disabled: false,
    invalid: false,
    label: undefined,
    maxRows: 8,
    placeholder: undefined,
    rows: 3,
  },
)

const model = defineModel<string>({ default: '' })

const textareaId = useId()
const textareaRef = useTemplateRef<HTMLTextAreaElement>('textarea')

async function resize(): Promise<void> {
  const el = textareaRef.value

  if (!el) {
    return
  }

  await nextTick()
  el.style.height = 'auto'
  el.style.height = `${el.scrollHeight}px`
}

watch(model, resize)
</script>

<template>
  <div :class="['ui-textarea-wrapper', { 'ui-textarea-wrapper--labeled': label }]">
    <label v-if="label" :for="textareaId" class="ui-textarea-label">{{ label }}</label>
    <textarea
      :id="label ? textareaId : undefined"
      ref="textarea"
      v-model="model"
      :class="['ui-textarea', { 'ui-textarea--invalid': invalid }]"
      :disabled="disabled"
      :placeholder="placeholder"
      :rows="rows"
      :style="{ '--ui-textarea-max-rows': maxRows }"
      @input="resize()"
    />
  </div>
</template>

<style scoped lang="scss">

.ui-textarea-wrapper {
  width: 100%;
  padding: $spacing-8 $spacing-16;
  background-color: $color-bg-1;
  border: 1px solid $color-ink-10;
  border-radius: $radius-8;

  &:has(.ui-textarea:focus-visible) {
    @include focus-ring;
  }

  &:has(.ui-textarea:disabled) {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &--labeled {
    display: flex;
    flex-direction: column;
    gap: $spacing-4;
    padding: $spacing-16 $spacing-20;
  }
}

.ui-textarea-label {
  font-size: $font-size-sm;
  color: $color-ink-40;
}

.ui-textarea {
  display: block;
  width: 100%;
  max-height: calc(var(--ui-textarea-max-rows) * 1.5 * #{$font-size-md});
  overflow-y: auto;
  font-family: inherit;
  font-size: $font-size-md;
  line-height: 1.5;
  color: $color-ink;
  resize: none;
  background-color: transparent;
  border: none;

  &::placeholder {
    color: $color-ink-40;
  }

  &:focus-visible {
    outline: none;
  }
}

.ui-textarea-wrapper:has(.ui-textarea--invalid) {
  border-color: $color-accent-red;
}
</style>
