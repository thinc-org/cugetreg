const base = require('./base.js')
const { defineConfig } = require('eslint-define-config')
const eslintPluginSvelte = require('eslint-plugin-svelte')

const config = eslintPluginSvelte.configs['recommended']

module.exports = defineConfig({
  ...base,
  extends: [...base.extends, ...config.extends],
  plugins: base.plugins,
  rules: {
    ...base.rules,
    ...config.rules,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'props|^\\$\\$',
      },
    ],
  },
  overrides: [
    ...base.overrides,
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
    // ...
  ],
})
