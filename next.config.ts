import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Uncomment if deploying to a subdirectory, e.g., /webapp
  // basePath: isProd ? '/webapp' : '',
  // assetPrefix: isProd ? '/webapp/' : '',
};

export default nextConfig;
