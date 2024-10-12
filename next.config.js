const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        // Match all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://imageai.sixtyoneeightyai.com",
          },
          {
            key: 'X-Frame-Options',
            value: 'ALLOW-FROM https://imageai.sixtyoneeightyai.com',
          },
        ],
      },
    ];
  },
});

module.exports = nextConfig;