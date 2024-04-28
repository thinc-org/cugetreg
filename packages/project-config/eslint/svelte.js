// @ts-check

const base = require('./base')

/** @type {import('eslint').Linter.Config} */
const config = {
  ...base,
  extends: [...(base.extends ?? []), 'plugin:svelte/recommended'],
  overrides: [
    ...(base.overrides ?? []),
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
}

module.exports = config
