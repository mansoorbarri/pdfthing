import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  webpack: (config) => {
    config.module.rules.push({
      test: /pdf\.worker\.min\.js$/,
      use: "worker-loader",
    });
    return config;
  },
};

module.exports = nextConfig;

export default nextConfig;
