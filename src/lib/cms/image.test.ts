import { describe, expect, test } from 'bun:test';

import { buildMicroCMSImageUrl } from './image';

describe('buildMicroCMSImageUrl', () => {
  test('adds width, height, and format parameters without losing existing parameters', () => {
    expect(
      buildMicroCMSImageUrl('https://images.microcms-assets.io/assets/test/image.png?fit=crop', {
        width: 1200,
        height: 630,
        format: 'webp',
      }),
    ).toBe('https://images.microcms-assets.io/assets/test/image.png?fit=crop&w=1200&h=630&fm=webp');
  });

  test('rejects non-microCMS image hosts', () => {
    expect(() => buildMicroCMSImageUrl('https://example.com/image.png', { width: 800 })).toThrow(
      'Unsupported microCMS image URL host',
    );
  });
});
