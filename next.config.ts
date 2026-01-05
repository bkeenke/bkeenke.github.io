import type { NextConfig } from "next";

const isStatic = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  // Use 'export' for GitHub Pages, 'standalone' for Docker
  output: isStatic ? 'export' : 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
