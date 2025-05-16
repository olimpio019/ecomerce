/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'allokershop.com',
      },
      {
        protocol: 'https',
        hostname: 'tnsdomr.com.br',
      },
      {
        protocol: 'https',
        hostname: 'http2.mlstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'tse3.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'sp.yimg.com',
      },
      {
        protocol: 'https',
        hostname: 'acdn-us.mitiendanube.com',
      },
      {
        protocol: 'https',
        hostname: 'img.joomcdn.net',
      },
      {
        protocol: 'https',
        hostname: 'imgnike-a.akamaihd.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dooca.store',
      },
      {
        protocol: 'https',
        hostname: 'cdna.lystit.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      {
        source: '/api/produtos/:path*',
        destination: '/api/produtos/:path*',
      }
    ];
  },
};

module.exports = nextConfig;
