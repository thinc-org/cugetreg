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
  transpilePackages: ['@cgr/course-utils', '@cgr/codegen'],
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../../'),
  },
}

module.exports = nextConfig
