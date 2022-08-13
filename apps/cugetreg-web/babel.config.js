module.exports = {
  presets: ['next/babel'],
  plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]],

  env: {
    production: {
      plugins: [['transform-remove-console', { exclude: ['error', 'warn'] }]],
    },
  },
}
