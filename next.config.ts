import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.fontshare.com',
      },
    ],
  },
  
  // Production optimizations
  poweredByHeader: false,
  
  // Strict mode for better development
  reactStrictMode: true,
};

export default nextConfig;
