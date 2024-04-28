const config = require('@cgr/project-config/prettier/svelte')

module.exports = {
  ...config,
  plugins: [...config.plugins, 'prettier-plugin-svelte'],
  svelteStrictMode: true,
}
