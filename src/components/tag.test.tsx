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

/**
 * 「+N」チップは muted の枠付き span。タグ本体 (tag-bg 系) と区別する。
 * SSR 文字列全体から '+' を探す判定は、Tailwind クラスに '+' が入るだけで
 * 無関係に落ちるため使わない。
 */
function overflowChipCount(html: string): number {
  return html.match(/border-border font-mono text-muted-foreground/g)?.length ?? 0;
}

describe('TagList max prop', () => {
  test('renders every tag without an overflow chip when count equals max', () => {
    const html = renderToString(<TagList tags={tags(3)} max={3} />);

    expect(html).toContain('Tag1');
    expect(html).toContain('Tag3');
    expect(overflowChipCount(html)).toBe(0);
  });

  test('collapses the overflow into a +1 chip when count exceeds max by one', () => {
    const html = renderToString(<TagList tags={tags(4)} max={3} />);

    expect(html).toContain('Tag3');
    expect(html).not.toContain('Tag4');
    expect(overflowChipCount(html)).toBe(1);
    // 部分一致だと +11 や +100 でも通るため、チップの閉じタグまで含めて固定する
    expect(html).toMatch(/\+(<!-- -->)?1<\/span>/);
  });

  test('reports the full remaining count when many tags overflow', () => {
    const html = renderToString(<TagList tags={tags(13)} max={3} />);

    expect(html).toMatch(/\+(<!-- -->)?10<\/span>/);
  });

  test('renders every tag when max is not specified', () => {
    const html = renderToString(<TagList tags={tags(6)} />);

    expect(html).toContain('Tag1');
    expect(html).toContain('Tag6');
    expect(overflowChipCount(html)).toBe(0);
  });

  test('treats max=0 as a limit rather than "no limit"', () => {
    const html = renderToString(<TagList tags={tags(3)} max={0} />);

    expect(html).not.toContain('Tag1');
    expect(html).toMatch(/\+(<!-- -->)?3<\/span>/);
  });
});
