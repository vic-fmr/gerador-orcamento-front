import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.API_BASE_URL || 'http://localhost:8080';
    const cleanBackendUrl = backendUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');

    return [
      {
        source: '/api/:path*',
        destination: `${cleanBackendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
