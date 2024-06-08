const base = require('./base.js')

/**
 * @type {import('prettier').Options}
 */
module.exports = {
  ...base,
  svelteStrictMode: true,
  svelteAllowShorthand: true,
  plugins: [...base.plugins, 'prettier-plugin-svelte'],
}
