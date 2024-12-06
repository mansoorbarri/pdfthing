import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false, // Prevent Next.js from bundling the Node.js 'canvas'
    };
    return config;
  },
};

export default nextConfig;
