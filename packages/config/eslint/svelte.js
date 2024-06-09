// @ts-check

const base = require('./base.js')

const eslintPluginSvelte = require('eslint-plugin-svelte')

const svelteConfig = eslintPluginSvelte.configs['recommended']

/** @type {Record<string, import('eslint').Linter.RuleLevel>} */
// @ts-expect-error Force Typecast, Insufficient type information
const svConfigRules = svelteConfig.rules

/** @satisfies {import('eslint').Linter.Config} */
const config = {
  ...base,
  extends: [...svelteConfig.extends, ...(base.extends ?? [])],
  plugins: base.plugins,
  rules: {
    ...base.rules,
    ...svConfigRules,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: 'props|^\\$\\$',
      },
    ],
  },
  overrides: [
    ...(base.overrides ?? []),
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      rules: {
        'no-inner-declarations': 'off',
      },
    },
    // ...
  ],
}

module.exports = config
