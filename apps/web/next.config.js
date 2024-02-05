//@ts-check
const path = require('path')

// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// })

const isProd = process.env.NODE_ENV !== 'development'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  productionBrowserSourceMaps: true,
  // env: {
  //   IS_PULL_REQUEST: process.env.IS_PULL_REQUEST,
  // },
  compiler: {
    removeConsole: isProd && {
      exclude: ['error', 'warn'],
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) config.resolve.fallback.fs = false
    return config
  },
  async rewrites() {
    if (isProd) return []
    return [
      {
        source: '/apiProxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ]
  },
  output: 'standalone',
  transpilePackages: ['@cgr/course-utils', '@cgr/codegen'],
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
