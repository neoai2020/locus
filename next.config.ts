import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for better Docker/VPS deployment
  output: 'standalone',
  
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
