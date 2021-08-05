const path = require('path')
const toPath = (filePath) => path.join(process.cwd(), filePath)

module.exports = {
  stories: ['../src/!(lib)/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-knobs', '@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-jest'],
  webpackFinal: async (config) => {
    config.resolve.alias['fs'] = path.resolve(__dirname, 'fsMock.js')
    config.resolve.alias['@'] = path.resolve('src')

    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': toPath('node_modules/@emotion/react'),
          'emotion-theming': toPath('node_modules/@emotion/react'),
        },
      },
    }
  },
}
