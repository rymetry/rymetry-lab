import { describe, expect, test } from 'bun:test';

import { resolveActiveHeadingId } from './article-toc';

describe('resolveActiveHeadingId', () => {
  test('keeps the first heading active when the document is not scrollable', () => {
    const activeId = resolveActiveHeadingId({
      headings: [
        { id: 'intro', top: 300 },
        { id: 'summary', top: 900 },
      ],
      viewportHeight: 1200,
      scrollY: 0,
      documentHeight: 1000,
    });

    expect(activeId).toBe('intro');
  });

  test('uses the last heading when a scrollable document is at the bottom', () => {
    const activeId = resolveActiveHeadingId({
      headings: [
        { id: 'intro', top: -900 },
        { id: 'summary', top: -100 },
      ],
      viewportHeight: 800,
      scrollY: 1200,
      documentHeight: 1999,
    });

    expect(activeId).toBe('summary');
  });

  test('uses the last heading that has passed the active line while scrolling normally', () => {
    const activeId = resolveActiveHeadingId({
      headings: [
        { id: 'intro', top: -20 },
        { id: 'details', top: 80 },
        { id: 'summary', top: 180 },
      ],
      viewportHeight: 800,
      scrollY: 200,
      documentHeight: 2000,
      activeLineOffset: 120,
    });

    expect(activeId).toBe('details');
  });
});
