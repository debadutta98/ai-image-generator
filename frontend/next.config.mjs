/** @type {import('next').NextConfig} */

const nextConfig = {
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
      },
      {
        protocol:'https',
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
      { source: '/auth/:path*', destination: `${process.env.BACKEND_URL}/auth/:path*`}
    ];
  },
};

export default nextConfig;
