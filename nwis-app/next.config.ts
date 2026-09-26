import type { NextConfig } from "next";

// Backend URL: Set BACKEND_URL env var on Vercel (your Render service URL).
// Falls back to localhost:8000 for local development.
const BACKEND_URL = (process.env.BACKEND_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/ddr/:path*',
        destination: `${BACKEND_URL}/api/ddr/:path*`
      },
      {
        source: '/api/active-well/:path*',
        destination: `${BACKEND_URL}/api/active-well/:path*`
      },
      {
        source: '/api/offset-analysis',
        destination: `${BACKEND_URL}/api/offset-analysis`
      },
      {
        source: '/api/risk-corridor',
        destination: `${BACKEND_URL}/api/risk-corridor`
      }
    ];
  }
};

export default nextConfig;
