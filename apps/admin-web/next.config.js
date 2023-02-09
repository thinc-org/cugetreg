const path = require('path')

const isProd = process.env.NODE_ENV !== 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: isProd && {
      exclude: ['error', 'warn'],
    },
  },
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
    transpilePackages: ['@cgr/course-utils', '@cgr/codegen'],
  },
}

module.exports = nextConfig
