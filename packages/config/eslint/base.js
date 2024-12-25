// @ts-check

import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^(_|\\$)',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effect imports.
            ['^\\u0000'],
            // Node.js builtins prefixed with `node:`.
            ['^node:'],
            // Packages. Things that start with a letter (or digit or underscore), or `@` followed by a letter.
            ['^@?\\w'],
            // Absolute imports within same package.
            ['^\\$?\\w'],
            // Internal Packages. Things that start with a letter (or digit or underscore), or `@repo` followed by a letter.
            ['^@repo?\\w'],
            // Absolute imports and other imports such as Vue-style `@/foo`.  Anything not matched in another group.
            ['^'],
            // Relative imports. Anything that starts with a dot.
            ['^\\.'],
          ],
        },
      ],
    },
  },
  {
    ignores: [
      '**/build',
      '**/.svelte-kit',
      '**/package',
      '**/storybook-static',
      '**/dist',
    ],
  },
  eslintPluginPrettierRecommended,
)
