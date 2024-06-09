// @ts-check

/** @satisfies {import('eslint').Linter.Config} */
const config = {
  ...require('@repo/config/eslint/base.js'),
  root: true,
}

module.exports = config
