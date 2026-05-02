import { describe, expect, test } from 'bun:test';

import { readSafeJson } from './safe-json';

describe('readSafeJson', () => {
  test('returns parsed JSON when content type and body size are acceptable', async () => {
    const request = new Request('https://rymlab.dev/api/csp-report', {
      method: 'POST',
      headers: {
        'content-type': 'application/csp-report',
      },
      body: JSON.stringify({ 'csp-report': { 'blocked-uri': 'inline' } }),
    });

    await expect(readSafeJson(request)).resolves.toEqual({
      'csp-report': { 'blocked-uri': 'inline' },
    });
  });

  test('returns null for invalid JSON', async () => {
    const request = new Request('https://rymlab.dev/api/csp-report', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: '{',
    });

    await expect(readSafeJson(request)).resolves.toBeNull();
  });

  test('returns null when the declared content length exceeds the limit', async () => {
    const request = new Request('https://rymlab.dev/api/csp-report', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'content-length': '2049',
      },
      body: '{}',
    });

    await expect(readSafeJson(request, { maxBytes: 2048 })).resolves.toBeNull();
  });
});
