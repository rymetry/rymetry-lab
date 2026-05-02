import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

import { getSecurityHeaders } from './src/lib/security/csp';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ['127.0.0.1'],

  // Enable 'use cache' directive for server component and function caching
  cacheComponents: true,

  experimental: {
    sri: {
      algorithm: 'sha256',
    },
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io',
      },
    ],
  },

  async headers() {
    const securityHeaders = getSecurityHeaders({
      isProduction: process.env.NODE_ENV === 'production',
    });

    return [
      {
        source: '/(.*)',
        headers:
          process.env.NODE_ENV === 'production'
            ? securityHeaders.filter((header) => !header.key.startsWith('Content-Security-Policy'))
            : securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
