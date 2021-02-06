// /* eslint-disable @typescript-eslint/no-var-requires */
const withOptimizedImages = require('next-optimized-images')

module.exports = withOptimizedImages({
  // other options here
  env: {
    IS_PULL_REQUEST: process.env.IS_PULL_REQUEST,
  },
})

module.exports = withOptimizedImages()
