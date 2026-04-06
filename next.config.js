/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api/app': ['./data/**'],
    },
  },
}
module.exports = nextConfig
