// @ts-check

import base from './base.js'

/**
 * @type {import('prettier').Options}
 */
const config = {
  ...base,
  svelteStrictMode: true,
  svelteAllowShorthand: true,
  plugins: [...(base.plugins ?? []), 'prettier-plugin-svelte'],
}

export default config
