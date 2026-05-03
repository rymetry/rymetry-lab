import createMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';

import { routing } from './i18n/routing';
import { buildContentSecurityPolicy } from './lib/security/csp';

const intlMiddleware = createMiddleware(routing);
const defaultLocaleRewriteHeader = 'x-rymlab-default-locale-rewrite';

export function proxy(request: NextRequest) {
  // next-intl rewrites default-locale public paths like /articles to /ja/articles.
  // In production that internal path can re-enter proxy and trigger the canonical
  // /ja/articles -> /articles redirect, so marked rewrites skip the second pass.
  const response =
    request.headers.get(defaultLocaleRewriteHeader) === '1'
      ? NextResponse.next()
      : intlMiddleware(request);

  if (process.env.NODE_ENV !== 'production') {
    return response;
  }

  const nonce = btoa(crypto.randomUUID());
  const contentSecurityPolicy = buildContentSecurityPolicy({
    nonce,
    reportOnly: false,
  });

  // Production CSP must be dynamic so each request receives a fresh nonce.
  // The request-header override lets Next.js attach that nonce to runtime inline scripts.
  markDefaultLocaleRewrite(response);
  setRequestHeaderOverride(response, 'x-nonce', nonce);
  setRequestHeaderOverride(response, 'content-security-policy', contentSecurityPolicy);
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);

  return response;
}

function markDefaultLocaleRewrite(response: NextResponse): void {
  const rewrite = response.headers.get('x-middleware-rewrite');
  if (!rewrite) return;

  const { pathname } = new URL(rewrite);
  if (
    pathname === `/${routing.defaultLocale}` ||
    pathname.startsWith(`/${routing.defaultLocale}/`)
  ) {
    setRequestHeaderOverride(response, defaultLocaleRewriteHeader, '1');
  }
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
