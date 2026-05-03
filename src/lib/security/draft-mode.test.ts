import { describe, expect, test } from 'bun:test';

import {
  createDraftModeDisableToken,
  getDraftModeSecret,
  isDraftModeDisableToken,
  isDraftModeSecret,
} from './draft-mode';

describe('getDraftModeSecret', () => {
  test('uses DRAFT_MODE_SECRET as the primary draft secret', () => {
    expect(
      getDraftModeSecret({
        DRAFT_MODE_SECRET: ' primary ',
        MICROCMS_PREVIEW_SECRET: 'legacy',
      }),
    ).toBe('primary');
  });

  test('falls back to MICROCMS_PREVIEW_SECRET for existing environments', () => {
    expect(getDraftModeSecret({ MICROCMS_PREVIEW_SECRET: ' legacy ' })).toBe('legacy');
  });
});

describe('isDraftModeSecret', () => {
  test('accepts the configured secret and rejects missing or mismatched tokens', () => {
    const env = { DRAFT_MODE_SECRET: 'secret-token' };

    expect(isDraftModeSecret('secret-token', env)).toBe(true);
    expect(isDraftModeSecret('other-token', env)).toBe(false);
    expect(isDraftModeSecret(null, env)).toBe(false);
  });
});

describe('draft mode disable token', () => {
  test('creates a server-verifiable disable token without accepting arbitrary values', () => {
    const token = createDraftModeDisableToken('secret-token');

    expect(token).toHaveLength(64);
    expect(isDraftModeDisableToken(token, 'secret-token')).toBe(true);
    expect(isDraftModeDisableToken(token, 'other-token')).toBe(false);
    expect(isDraftModeDisableToken('bad-token', 'secret-token')).toBe(false);
  });
});
