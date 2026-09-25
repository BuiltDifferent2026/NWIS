import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/ddr/:path*',
        destination: 'http://127.0.0.1:8000/api/ddr/:path*'
      },
      {
        source: '/api/active-well/:path*',
        destination: 'http://127.0.0.1:8000/api/active-well/:path*'
      },
      {
        source: '/api/offset-analysis',
        destination: 'http://127.0.0.1:8000/api/offset-analysis'
      },
      {
        source: '/api/risk-corridor',
        destination: 'http://127.0.0.1:8000/api/risk-corridor'
      }
    ];
  }
};

export default nextConfig;
