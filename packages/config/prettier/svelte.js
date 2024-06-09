// @ts-check

const base = require('./base.js')

/**
 * @type {import('prettier').Options}
 */
const config = {
  ...base,
  svelteStrictMode: true,
  svelteAllowShorthand: true,
  plugins: [...(base.plugins ?? []), 'prettier-plugin-svelte'],
}

module.exports = config
