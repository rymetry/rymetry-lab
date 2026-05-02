import { describe, expect, test } from 'bun:test';

import { normalizeSafeRedirectPath } from './safe-redirect';

describe('normalizeSafeRedirectPath', () => {
  test('accepts same-origin relative paths', () => {
    expect(normalizeSafeRedirectPath('/articles?page=2#top')).toBe('/articles?page=2#top');
  });

  test('falls back for absolute, protocol-relative, and control-character paths', () => {
    expect(normalizeSafeRedirectPath('https://evil.example/path')).toBe('/');
    expect(normalizeSafeRedirectPath('//evil.example/path')).toBe('/');
    expect(normalizeSafeRedirectPath('/articles\nSet-Cookie: bad')).toBe('/');
  });
});
