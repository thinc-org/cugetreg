// @ts-check

const base = require('./base')

/** @type {import('eslint').Linter.Config} */
const config = {
  ...base,
  extends: [...(base.extends ?? []), 'next/core-web-vitals'],
}

module.exports = config
