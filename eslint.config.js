import js from '@eslint/js'
import globals from 'globals'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    ignores: ['node_modules', 'dist', 'build', '.git', 'coverage'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      // Reglas recomendadas de ESLint
      ...js.configs.recommended.rules,

      // Integración de Prettier (formato)
      ...prettierConfig.rules,

      // === Variables ===
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-shadow': 'error',

      // === Mejores prácticas ===
      'no-console': 'off',
      eqeqeq: ['error', 'always'],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      // === Async/Await ===
      'no-async-promise-executor': 'error',

      // === Imports ===
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-duplicates': 'error',

      // === Código limpio ===
      'no-unneeded-ternary': 'error',
      'prefer-template': 'warn',
      'no-useless-concat': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],

      // === Seguridad ===
      'no-caller': 'error',
      'no-extend-native': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': ['warn', { props: false }],
    },
  },
]
