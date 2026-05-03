import { describe, expect, test } from 'bun:test';

import { routing } from './routing';

describe('routing', () => {
  test('uses Japanese as the default locale and supports English', () => {
    expect(routing.defaultLocale).toBe('ja');
    expect(routing.locales).toEqual(['ja', 'en']);
    expect(routing.localePrefix).toBe('as-needed');
  });
});
