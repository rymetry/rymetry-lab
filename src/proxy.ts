import createMiddleware from 'next-intl/middleware';
import type { NextRequest, NextResponse } from 'next/server';

import { routing } from './i18n/routing';
import { buildContentSecurityPolicy } from './lib/security/csp';

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const response = intlMiddleware(request);

  if (process.env.NODE_ENV !== 'production') {
    return response;
  }

  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = buildContentSecurityPolicy({
    nonce,
    reportOnly: false,
  });

  setRequestHeaderOverride(response, 'x-nonce', nonce);
  setRequestHeaderOverride(response, 'content-security-policy', contentSecurityPolicy);
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);

  return response;
}

function setRequestHeaderOverride(response: NextResponse, key: string, value: string): void {
  const normalizedKey = key.toLowerCase();
  const overrideHeader = 'x-middleware-override-headers';
  const overrideKeys = new Set(
    (response.headers.get(overrideHeader) ?? '')
      .split(',')
      .map((header) => header.trim())
      .filter(Boolean),
  );

  overrideKeys.add(normalizedKey);
  response.headers.set(`x-middleware-request-${normalizedKey}`, value);
  response.headers.set(overrideHeader, [...overrideKeys].join(','));
}

export const config = {
  matcher: '/((?!api|feed.xml|sitemap.xml|robots.txt|_next|_vercel|.*\\..*).*)',
};
