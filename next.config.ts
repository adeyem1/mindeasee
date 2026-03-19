import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images-3.listennotes.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
  eslint: {
    // Skip ESLint during production builds on CI (like Vercel).
    // This prevents lint warnings/errors from failing the build.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
