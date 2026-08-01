import { describe, expect, test } from 'bun:test';
import { renderToString } from 'react-dom/server';

import type { Tag as TagType } from '@/types/tag';

import { TagList } from './tag';

function tags(count: number): readonly TagType[] {
  return Array.from({ length: count }, (_, index) => ({
    label: `Tag${index + 1}`,
    category: 'frontend' as const,
  }));
}

describe('TagList max prop', () => {
  test('renders every tag without an overflow chip when count equals max', () => {
    const html = renderToString(<TagList tags={tags(3)} max={3} />);

    expect(html).toContain('Tag1');
    expect(html).toContain('Tag3');
    expect(html).not.toContain('+');
  });

  test('collapses the overflow into a +1 chip when count exceeds max by one', () => {
    const html = renderToString(<TagList tags={tags(4)} max={3} />);

    expect(html).toContain('Tag3');
    expect(html).not.toContain('Tag4');
    expect(html).toContain('+<!-- -->1');
  });

  test('renders every tag when max is not specified', () => {
    const html = renderToString(<TagList tags={tags(6)} />);

    expect(html).toContain('Tag1');
    expect(html).toContain('Tag6');
    expect(html).not.toContain('+');
  });
});
