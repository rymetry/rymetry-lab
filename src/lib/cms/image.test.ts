import { describe, expect, test } from 'bun:test';

import { buildCardThumbnailUrl, buildMicroCMSImageUrl } from './image';

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

  test('adds fit=crop for aspect-ratio cropping', () => {
    expect(
      buildMicroCMSImageUrl('https://images.microcms-assets.io/assets/test/image.png', {
        width: 960,
        height: 400,
        fit: 'crop',
      }),
    ).toBe('https://images.microcms-assets.io/assets/test/image.png?w=960&h=400&fit=crop');
  });

  test('rejects non-microCMS image hosts', () => {
    expect(() => buildMicroCMSImageUrl('https://example.com/image.png', { width: 800 })).toThrow(
      'Unsupported microCMS image URL host',
    );
  });
});

describe('buildCardThumbnailUrl', () => {
  test('crops microCMS images to the display aspect with entropy smart crop', () => {
    expect(
      buildCardThumbnailUrl('https://images.microcms-assets.io/assets/test/image.png', {
        width: 480,
        height: 320,
      }),
    ).toBe(
      'https://images.microcms-assets.io/assets/test/image.png?w=480&h=320&fit=crop&crop=entropy',
    );
  });

  test('returns non-microCMS URLs unchanged (static demo data etc.)', () => {
    expect(
      buildCardThumbnailUrl('https://example.com/image.png', { width: 480, height: 320 }),
    ).toBe('https://example.com/image.png');
  });

  test('returns invalid URLs unchanged instead of throwing', () => {
    expect(buildCardThumbnailUrl('not-a-url', { width: 480, height: 320 })).toBe('not-a-url');
  });
});
