import type { Header } from 'next/dist/lib/load-custom-routes';

const NEXT_STATIC_INLINE_SCRIPT_HASHES = [
  "'sha256-7mu4H06fwDCjmnxxr/xNHyuQC6pLTHr4M2E4jXw5WZs='",
  "'sha256-wkjS4zijHQljbuQzwpQdd2Wvq3fpRtpxgPGRt+U5jFY='",
] as const;

export interface BuildCspOptions {
  readonly reportOnly: boolean;
  readonly nonce?: string;
}

interface GetSecurityHeadersOptions {
  readonly isProduction: boolean;
}

export function buildContentSecurityPolicy({ nonce, reportOnly }: BuildCspOptions): string {
  const scriptSrc = nonce
    ? ['script-src', "'self'", `'nonce-${nonce}'`, ...NEXT_STATIC_INLINE_SCRIPT_HASHES]
    : reportOnly
      ? ['script-src', "'self'", "'unsafe-inline'", "'unsafe-eval'"]
      : ['script-src', "'self'"];
  const styleSrc = nonce
    ? ['style-src', "'self'", `'nonce-${nonce}'`]
    : reportOnly
      ? ['style-src', "'self'", "'unsafe-inline'"]
      : ['style-src', "'self'"];
  const directives = [
    ['default-src', "'self'"],
    ['base-uri', "'self'"],
    ['frame-ancestors', "'none'"],
    ['object-src', "'none'"],
    ['form-action', "'self'"],
    ['img-src', "'self'", 'data:', 'blob:', 'https://images.microcms-assets.io'],
    ['font-src', "'self'", 'data:'],
    styleSrc,
    scriptSrc,
    ['connect-src', "'self'", 'https://*.microcms.io'],
    ['upgrade-insecure-requests'],
    ['report-uri', '/api/csp-report'],
  ];

  const policy = directives.map((directive) => directive.join(' ')).join('; ');
  return reportOnly ? policy.replace('; upgrade-insecure-requests', '') : policy;
}

export function getSecurityHeaders({ isProduction }: GetSecurityHeadersOptions): Header['headers'] {
  return [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'X-Frame-Options', value: 'DENY' },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    },
    {
      key: isProduction ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only',
      value: buildContentSecurityPolicy({ reportOnly: !isProduction }),
    },
    ...(isProduction
      ? [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=15552000; includeSubDomains',
          },
        ]
      : []),
  ];
}
