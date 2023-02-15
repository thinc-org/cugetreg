// @ts-check

/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'next/core-web-vitals',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    '@typescript-eslint/no-empty-function': 'off',
  },
  settings: {
    react: {
      version: '18.2.0',
    },
    next: {
      rootDir: ['apps/*/'],
    },
  },
}

module.exports = config
