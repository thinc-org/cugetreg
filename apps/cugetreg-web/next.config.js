//@ts-check
const path = require('path')

const { withNx } = require('@nrwl/next/plugins/with-nx')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    svgr: true,
  },
  productionBrowserSourceMaps: true,
  env: {
    IS_PULL_REQUEST: process.env.IS_PULL_REQUEST,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) config.resolve.fallback.fs = false
    return config
  },
  async rewrites() {
    if (process.env.NODE_ENV !== 'development') return []
    return [
      {
        source: '/apiProxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ]
  },
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}

module.exports = withNx({
  nx: { svgr: false },
  ...withBundleAnalyzer(nextConfig),
})
