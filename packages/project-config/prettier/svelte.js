const config = require('./base')

module.exports = {
  ...config,
  plugins: [...config.plugins, 'prettier-plugin-svelte'],
  svelteStrictMode: true,
}
