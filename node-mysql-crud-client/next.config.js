const apiTarget = (process.env.API_PROXY_TARGET || 'http://localhost:3456').replace(/\/+$/, '')

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
