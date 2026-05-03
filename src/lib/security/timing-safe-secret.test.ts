import { describe, expect, test } from 'bun:test';

import { isTimingSafeEqual } from './timing-safe-secret';

describe('isTimingSafeEqual', () => {
  test('accepts exact secrets and rejects missing or different values', () => {
    expect(isTimingSafeEqual('secret-token', 'secret-token')).toBe(true);
    expect(isTimingSafeEqual(null, 'secret-token')).toBe(false);
    expect(isTimingSafeEqual('secret-token', '')).toBe(false);
    expect(isTimingSafeEqual('secret-token', 'other-token')).toBe(false);
  });
});
