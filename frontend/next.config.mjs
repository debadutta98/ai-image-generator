/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: ''
      }
    ]
  },
  experimental: {
    proxyTimeout: 60_000,
    staleTimes: {
      dynamic: 0,
    },
  },
  httpAgentOptions: {
    keepAlive: true
  },
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${process.env.BACKEND_URL}/api/:path*` },
      { source: '/auth/:path*', destination: `${process.env.BACKEND_URL}/auth/:path*` }
    ];
  },
  async redirects() {
    return [
      { source: '/feed', destination: '/feed/1', permanent: true },
      { source: '/history', destination: '/history/1', permanent: true },
      { source: '/collection', destination: '/collection/1', permanent: true }
    ]
  }
};

export default nextConfig;
