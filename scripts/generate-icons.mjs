// Gera src/shared/components/icons/{regular,duotone,snow-ui}.generated.ts a
// partir dos SVGs em docs/icons-regular/, docs/icons-duotone/ e
// docs/icons-snow-ui/. Rodar de novo sempre que esses SVGs mudarem
// (`npm run generate:icons`) — os arquivos gerados nunca são editados à mão
// (mesmo espírito de core/api/schema.d.ts).
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

// Cor placeholder usada pelo export do Figma em TODOS os três conjuntos —
// só ela vira currentColor. Qualquer outro fill literal (ex.: "white" nos
// cutouts de Checkbox/Toggle marcados) é preservado de propósito, ver
// createIcon.ts.
const PLACEHOLDER_FILL = '#1c1c1c'

// Categorias exportadas por engano do Figma (banner de título de seção,
// texto renderizado como path, não um ícone) — existem só em
// docs/icons-regular/, nunca em docs/icons-duotone/. Confirmado por diff
// entre as duas pastas + inspeção de conteúdo (viewBox largo tipo
// "0 0 3224 88", sem nenhum <path> parecido com pictograma).
const EXCLUDED_FILES = new Set([
  'Arrows.svg',
  'Brands.svg',
  'Commerce.svg',
  'Communication.svg',
  'Design.svg',
  'Development.svg',
  'Education.svg',
  'Games.svg',
  'Header.svg',
  'Health & Wellness.svg',
  'Maps & Travel.svg',
  'Math & Finance.svg',
  'Media.svg',
  'Office & Editing.svg',
  'People.svg',
  'Security & Warnings.svg',
  'System & Devices.svg',
  'Time.svg',
  'Weather & Nature.svg',
])

const SVG_EXTENSION_PATTERN = /\.svg$/
const NON_IDENTIFIER_CHAR_PATTERN = /[^A-Za-z0-9]/g
const VIEW_BOX_PATTERN = /viewBox="([^"]*)"/
// path/circle são os únicos elementos usados nos três exports (confirmado
// via grep) — qualquer outro elemento (ex.: <foreignObject> do hack de
// gradiente cônico do Figma em docs/icons-snow-ui/Loading-1.svg) não casa
// e o arquivo acaba sem elemento nenhum extraído, ver skip abaixo.
const ELEMENT_TAG_PATTERN = /<(path|circle)\s+([^>]*)\/>/g
const ATTR_PATTERN = /([a-zA-Z-]+)="([^"]*)"/g
const DEFS_BLOCK_PATTERN = /<defs>[\s\S]*?<\/defs>/g

function toIdentifier(filename) {
  return filename.replace(SVG_EXTENSION_PATTERN, '').replace(NON_IDENTIFIER_CHAR_PATTERN, '')
}

function extractViewBox(svg) {
  return svg.match(VIEW_BOX_PATTERN)?.[1] ?? '0 0 32 32'
}

// <defs> só guarda definição reaproveitável (clipPath, gradiente...), nunca
// forma visível — extrair path/circle de dentro duplicaria silhueta com o
// elemento visível de verdade (achado real: docs/icons-snow-ui/Loading-1.svg
// tem o mesmo <path> uma vez visível, outra dentro de <clipPath>).
function stripDefs(svg) {
  return svg.replace(DEFS_BLOCK_PATTERN, '')
}

function extractElements(svg) {
  return [...svg.matchAll(ELEMENT_TAG_PATTERN)].map(([, tag, attrString]) => {
    const attrs = {}
    for (const [, name, value] of attrString.matchAll(ATTR_PATTERN)) {
      if (name === 'fill' && value.toLowerCase() === PLACEHOLDER_FILL) {
        continue // sempre currentColor no render (default do createIcon.ts)
      }
      if (name.startsWith('data-figma')) {
        continue // metadado de gradiente/efeito não suportado (ver Loading-1.svg) — inerte, só lixo
      }
      attrs[name] = value
    }
    return [tag, attrs]
  })
}

function generateModule(dir) {
  if (!existsSync(dir)) {
    // biome-ignore lint/suspicious/noConsole: script CLI, saída de status é o propósito
    console.warn(`[generate-icons] "${dir}" não existe — pulando, .generated.ts atual mantido`)
    return null
  }

  const files = readdirSync(dir)
    .filter((file) => file.endsWith('.svg') && !EXCLUDED_FILES.has(file))
    .sort()

  const seen = new Set()
  const lines = [
    '// GERADO AUTOMATICAMENTE por scripts/generate-icons.mjs — nunca editar à mão.',
    "import { createIcon } from './createIcon'",
    '',
  ]

  for (const file of files) {
    const id = toIdentifier(file)

    if (seen.has(id)) {
      // biome-ignore lint/suspicious/noConsole: script CLI, saída de status é o propósito
      console.warn(`[generate-icons] identificador duplicado "${id}" (${file}) — pulado`)
      continue
    }

    const content = readFileSync(join(dir, file), 'utf-8')
    const viewBox = extractViewBox(content)
    const elements = extractElements(stripDefs(content))

    if (elements.length === 0) {
      // biome-ignore lint/suspicious/noConsole: script CLI, saída de status é o propósito
      console.warn(
        `[generate-icons] "${file}" não tem <path>/<circle> extraível (provável gradiente/efeito do Figma não suportado) — pulado`,
      )
      continue
    }

    seen.add(id)

    // /* @__PURE__ */ é o que permite o bundler (Rollup/esbuild) eliminar
    // ícones não importados — sem essa anotação ele não sabe que
    // createIcon() não tem efeito colateral e mantém todos os ícones do
    // módulo, mesmo quando só 1 é importado (achado real, ver
    // plano-implementacao.md).
    lines.push(
      `export const ${id} = /* @__PURE__ */ createIcon(${JSON.stringify(elements)}, '${viewBox}')`,
    )
  }

  return `${lines.join('\n')}\n`
}

const outDir = join(ROOT, 'src/shared/components/icons')

const modules = [
  ['docs/icons-regular', 'regular.generated.ts'],
  ['docs/icons-duotone', 'duotone.generated.ts'],
  ['docs/icons-snow-ui', 'snow-ui.generated.ts'],
]

const updated = []

for (const [sourceDir, outFile] of modules) {
  const generated = generateModule(join(ROOT, sourceDir))

  if (generated !== null) {
    writeFileSync(join(outDir, outFile), generated)
    updated.push(outFile)
  }
}

// biome-ignore lint/suspicious/noConsole: script CLI, saída de status é o propósito
console.log(`[generate-icons] atualizado: ${updated.join(', ')}`)
