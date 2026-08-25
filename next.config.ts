import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const isDev = process.env.NODE_ENV === 'development';
    const backendUrl = isDev 
      ? 'http://localhost:8080' 
      : (process.env.API_BASE_URL || '');

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
