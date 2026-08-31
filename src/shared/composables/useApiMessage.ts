import { useI18n } from 'vue-i18n'

/**
 * Resolve uma ApiMessageKey/NotificationMessageKey catalogada pra texto
 * pt-BR, ou devolve o texto como veio quando a chave é desconhecida (texto
 * livre vindo do backend) — docs/infra/convencoes-frontend-infra.md seção 6.3.
 * Nunca usar `$t`/switch manual direto no componente, sempre por aqui.
 */
export function useApiMessage() {
  const { t, te } = useI18n()

  function resolveMessage(key: string): string {
    return te(key) ? t(key) : key
  }

  /**
   * Achado real, 2026-08-31: `errors` de validação do backend NÃO vêm
   * como frase pronta — vêm chaveados pelo NOME DA REGRA que falhou
   * (`Str::snake(class_basename($rule))`, `bootstrap/app.php`: `required`/
   * `min`/`max`/`closure_validation_rule`...), no mesmo espírito de
   * catálogo do `ApiMessageKey`. Sem essa resolução, `fieldError()` de
   * todo `useXForm.ts` mostrava a chave crua embaixo do campo (ex.:
   * "closure_validation_rule" sob um EAN inválido).
   *
   * Duas camadas de dicionário, checadas nessa ordem:
   * 1. `errors.validation.byField.<field>.<rule>` — só existe pros casos
   *    ambíguos: QUALQUER regra `Closure` custom colapsa pro mesmo nome
   *    genérico de classe (`closure_validation_rule`), então só um
   *    dicionário POR CAMPO consegue diferenciar "EAN inválido" de "NCM
   *    inválido" de "CPF/CNPJ inválido" — o nome da regra sozinho não
   *    carrega informação suficiente pra esses 3 casos reais
   *    (`CreateProductRequest`/`UpdateProductRequest`/`SubscribeToPlanRequest`).
   * 2. `errors.validation.<rule>` — genérico, cobre as regras nativas do
   *    Laravel usadas no backend (`required`/`min`/`max`/`numeric`/
   *    `email`/`unique`/...), sem precisar de uma entrada por campo.
   *
   * Sem entrada em nenhuma camada, devolve a `rule` como veio — mesma
   * régua de `resolveMessage` pra texto livre/desconhecido (nunca
   * esconde a informação, só não traduz o que ainda não foi catalogado).
   */
  function resolveFieldError(field: string, rule: string): string {
    const fieldSpecificKey = `errors.validation.byField.${field}.${rule}`

    if (te(fieldSpecificKey)) {
      return t(fieldSpecificKey)
    }

    const genericKey = `errors.validation.${rule}`

    return te(genericKey) ? t(genericKey) : rule
  }

  return { resolveFieldError, resolveMessage }
}
