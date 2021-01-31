/* eslint-disable @typescript-eslint/no-var-requires */
const withOptimizedImages = require('next-optimized-images')

module.exports = withOptimizedImages({
  // other options here
  env: {
    IS_PULL_REQUEST: process.env.IS_PULL_REQUEST,
  },
})
const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
})

module.exports = withOptimizedImages(
  withMDX({
    pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  })
)
