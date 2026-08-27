// Gera src/shared/components/icons/{regular,duotone}.generated.ts a partir
// dos SVGs em docs/icons-regular/ e docs/icons-duotone/. Rodar de novo
// sempre que esses SVGs mudarem (`npm run generate:icons`) — os dois
// arquivos gerados nunca são editados à mão (mesmo espírito de
// core/api/schema.d.ts).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname

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
const PATH_TAG_PATTERN = /<path\s+([^>]*)\/>/g
const PATH_ATTR_PATTERN = /([a-zA-Z-]+)="([^"]*)"/g

function toIdentifier(filename) {
  return filename.replace(SVG_EXTENSION_PATTERN, '').replace(NON_IDENTIFIER_CHAR_PATTERN, '')
}

function extractViewBox(svg) {
  return svg.match(VIEW_BOX_PATTERN)?.[1] ?? '0 0 32 32'
}

function extractPaths(svg) {
  return [...svg.matchAll(PATH_TAG_PATTERN)].map(([, attrString]) => {
    const attrs = {}
    for (const [, name, value] of attrString.matchAll(PATH_ATTR_PATTERN)) {
      if (name === 'fill') {
        continue // sempre currentColor no render, ver createIcon.ts
      }
      attrs[name] = value
    }
    return attrs
  })
}

function generateModule(dir) {
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

    seen.add(id)

    const content = readFileSync(join(dir, file), 'utf-8')
    const viewBox = extractViewBox(content)
    const paths = extractPaths(content)

    // /* @__PURE__ */ é o que permite o bundler (Rollup/esbuild) eliminar
    // ícones não importados — sem essa anotação ele não sabe que
    // createIcon() não tem efeito colateral e mantém todos os 1248, mesmo
    // quando só 1 é importado (achado real, ver plano-implementacao.md).
    lines.push(
      `export const ${id} = /* @__PURE__ */ createIcon(${JSON.stringify(paths)}, '${viewBox}')`,
    )
  }

  return `${lines.join('\n')}\n`
}

const outDir = join(ROOT, 'src/shared/components/icons')

writeFileSync(
  join(outDir, 'regular.generated.ts'),
  generateModule(join(ROOT, 'docs/icons-regular')),
)
writeFileSync(
  join(outDir, 'duotone.generated.ts'),
  generateModule(join(ROOT, 'docs/icons-duotone')),
)

// biome-ignore lint/suspicious/noConsole: script CLI, saída de status é o propósito
console.log('[generate-icons] regular.generated.ts e duotone.generated.ts atualizados.')
