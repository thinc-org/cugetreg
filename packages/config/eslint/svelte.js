// @ts-check

import eslintPluginSvelte from 'eslint-plugin-svelte'
import globals from 'globals'
import svelteParser from 'svelte-eslint-parser'
import tseslint from 'typescript-eslint'

import base from './base.js'

export default tseslint.config(
  ...base,
  ...eslintPluginSvelte.configs['flat/recommended'],
  ...eslintPluginSvelte.configs['flat/prettier'],
  // https://github.com/sveltejs/eslint-plugin-svelte/issues/732
  {
    files: ['**/*.svelte'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.svelte'],
      },
    },
  },
)
