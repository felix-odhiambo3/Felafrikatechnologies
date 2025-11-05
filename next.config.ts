import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Place experimental/serverActions under `experimental` to avoid unrecognized top-level keys
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  eslint: {
    // Prevent ESLint circular-structure build errors from failing production builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
