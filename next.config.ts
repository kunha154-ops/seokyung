import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  allowedDevOrigins: [
    'initiatives-alter-satisfy-tail.trycloudflare.com',
    'modern-walls-send.loca.lt',
    'seven-corners-move.loca.lt'
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: '300mb',
    },
  },
};

export default nextConfig;
