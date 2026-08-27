import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vueTsConfig from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  // ── Global ignores ────────────────────────────────────────────────────────
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**', '*.d.ts', '**/*.generated.ts'],
  },

  // ── Vue files ─────────────────────────────────────────────────────────────
  // projectService is intentionally omitted here — it causes the TS language
  // service to build a full type graph for every .vue file, which hangs on
  // large projects in WSL2. Type safety in .vue is covered by `npm run typecheck`
  // (vue-tsc --noEmit). Type-aware unsafe rules are therefore also omitted.
  ...pluginVue.configs['flat/recommended'],
  ...vueTsConfig(),
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: tsParser,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // TS in Vue files — non-type-aware only (type-aware rules run via vue-tsc)
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          // props/emits captured via defineProps/withDefaults are used in templates
          varsIgnorePattern: '^_|^props$|^emit$',
        },
      ],
      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
      'vue/comma-dangle': 'off',

      // Vue component structure
      'vue/component-api-style': ['error', ['script-setup', 'composition']],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/define-emits-declaration': ['error', 'type-based'],
      'vue/define-props-declaration': ['error', 'type-based'],
      'vue/first-attribute-newline': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/html-indent': 'off',
      'vue/html-quotes': 'off',
      // ── Formatting rules disabled (Biome handles formatting) ───────────────
      'vue/html-self-closing': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/no-multi-spaces': 'off',
      'vue/no-required-prop-with-default': 'error',
      'vue/no-unused-refs': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/no-v-html': 'error',
      'vue/object-curly-spacing': 'off',
      'vue/prefer-true-attribute-shorthand': 'error',
      'vue/require-typed-ref': 'error',
      'vue/singleline-html-element-content-newline': 'off',
    },
  },

  // ── Design-system atoms ───────────────────────────────────────────────────
  // Nome de átomo (Button, Icon, Input...) é de propósito uma palavra só —
  // seção 3.1 de docs/infra/convencoes-frontend-infra.md.
  {
    files: ['src/shared/components/ui/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  // ── TypeScript files ──────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/await-thenable': 'error',

      // Style
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Type-aware rules
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/return-await': ['error', 'in-try-catch'],
      eqeqeq: ['error', 'always'],

      // Base ESLint rules
      // console.error é o canal sancionado do app.config.errorHandler (seção 14
      // de docs/infra/convencoes-frontend-infra.md) — console.log/warn seguem banidos.
      'no-console': ['warn', { allow: ['error'] }],
      'no-debugger': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
    },
  },

  // ── Test files ────────────────────────────────────────────────────────────
  // Uses an explicit project reference (not projectService) so that
  // tsconfig.test.json is NOT included in tsconfig.json references and is
  // therefore excluded from vue-tsc -b (the pre-push build check).
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.test.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/require-await': 'off',
      'no-console': 'off',
    },
  },

  // ── Config files (Node context) ───────────────────────────────────────────
  {
    files: [
      'vite.config.ts',
      'vitest.config.ts',
      'eslint.config.ts',
      'pwa-assets.config.ts',
      'playwright.config.ts',
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
]
