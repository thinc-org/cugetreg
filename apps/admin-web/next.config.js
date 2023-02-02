const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: {
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
