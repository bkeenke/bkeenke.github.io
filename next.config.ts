import type { NextConfig } from "next";

const isStatic = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Use 'export' for GitHub Pages, 'standalone' for Docker
  output: isStatic ? 'export' : 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Proxy API requests in development
  async rewrites() {
    // Disable rewrites for static export
    if (isStatic) {
      return [];
    }
    return [
      {
        source: '/shm/:path*',
        destination: 'https://shm-api.bkcloud.ru/shm/:path*',
      },
    ];
  },
};

export default nextConfig;
