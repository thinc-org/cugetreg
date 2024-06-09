// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'turbo',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'unused-imports',
    'simple-import-sort',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  ignorePatterns: ['.next', 'dist'],
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
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
  overrides: [
    {
      files: ['*.js', '*.cjs'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'no-undef': 'off',
      },
    },
  ],
}

module.exports = config
