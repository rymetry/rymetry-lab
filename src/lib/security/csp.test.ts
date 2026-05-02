import { describe, expect, test } from 'bun:test';

import { buildContentSecurityPolicy, getSecurityHeaders } from './csp';

describe('buildContentSecurityPolicy', () => {
  test('builds an enforceable CSP with required external image and report endpoints', () => {
    const csp = buildContentSecurityPolicy({ reportOnly: false });

    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain('img-src');
    expect(csp).toContain('https://images.microcms-assets.io');
    expect(csp).toContain('report-uri /api/csp-report');
    expect(csp).not.toContain('Content-Security-Policy-Report-Only');
    expect(csp).not.toContain("'unsafe-eval'");
  });

  test('keeps unsafe-eval limited to development report-only policy', () => {
    expect(buildContentSecurityPolicy({ reportOnly: true })).toContain("'unsafe-eval'");
  });
});

describe('getSecurityHeaders', () => {
  test('uses report-only CSP outside production and HSTS only in production', () => {
    const developmentHeaders = getSecurityHeaders({ isProduction: false });
    const productionHeaders = getSecurityHeaders({ isProduction: true });

    expect(developmentHeaders.some((header) => header.key === 'Content-Security-Policy')).toBe(
      false,
    );
    expect(
      developmentHeaders.some((header) => header.key === 'Content-Security-Policy-Report-Only'),
    ).toBe(true);
    expect(developmentHeaders.some((header) => header.key === 'Strict-Transport-Security')).toBe(
      false,
    );
    expect(productionHeaders.some((header) => header.key === 'Content-Security-Policy')).toBe(true);
    expect(productionHeaders.some((header) => header.key === 'Strict-Transport-Security')).toBe(
      true,
    );
  });
});
