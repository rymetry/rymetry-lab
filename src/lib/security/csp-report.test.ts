import { describe, expect, test } from 'bun:test';

import { toCspReportLog } from './csp-report';

describe('toCspReportLog', () => {
  test('extracts stable CSP report fields for operational logging', () => {
    expect(
      toCspReportLog({
        'csp-report': {
          'document-uri': 'https://rymlab.dev/articles',
          'violated-directive': 'script-src-elem',
          'blocked-uri': 'inline',
        },
      }),
    ).toEqual({
      documentUri: 'https://rymlab.dev/articles',
      violatedDirective: 'script-src-elem',
      blockedUri: 'inline',
    });
  });

  test('returns null for non-object or unrecognized payloads', () => {
    expect(toCspReportLog(null)).toBeNull();
    expect(toCspReportLog({})).toBeNull();
  });
});
