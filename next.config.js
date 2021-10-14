/* eslint-disable @typescript-eslint/no-var-requires */
const withOptimizedImages = require('next-optimized-images')

module.exports = withOptimizedImages({
  // other options here
  env: {
    IS_PULL_REQUEST: process.env.IS_PULL_REQUEST,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: 'empty',
      }
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://dev.cugetreg.com/api/:path*'
      }
    ]
  }
})
