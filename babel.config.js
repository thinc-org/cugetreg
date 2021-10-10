/* eslint-disable @typescript-eslint/no-var-requires */
const p = require('path')
const resolve = require('resolve')

function nodeResolvePath(source, basedir) {
  return resolve.sync(source, {
    basedir,
    // This is here to support the package being globally installed
    // read more: https://github.com/kentcdodds/babel-plugin-macros/pull/138
    paths: [p.resolve(__dirname, '../../')],
  })
}

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      'babel-plugin-macros',
      {
        resolvePath: (source, basedir) => {
          // handle our path alias
          const match = source.match(/@\/(.*)/)
          if (match) {
            return `${__dirname}/src/${match[1]}`
          }
          return nodeResolvePath(source, basedir)
        },
      },
    ],
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ],
  env: {
    production: {
      plugins: [['transform-remove-console', { "exclude": ["error", "warn"] }]],
    },
  },
}
