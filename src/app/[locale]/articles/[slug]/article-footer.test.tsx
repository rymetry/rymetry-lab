import { describe, expect, test } from 'bun:test';
import { CodeIcon } from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import { renderToString } from 'react-dom/server';

import type { ArticleDetail } from '@/types/article';

import { ArticleFooter } from './article-footer';

function article(slug: string, title: string, publishedAt: string): ArticleDetail {
  return {
    slug,
    title,
    description: `${title} description`,
    excerpt: `${title} excerpt`,
    content: '<p>body</p>',
    ogpImage: {
      url: `https://images.microcms-assets.io/assets/test/${slug}.png`,
      width: 1200,
      height: 630,
    },
    publishedAt,
    updatedAt: publishedAt,
    readingTime: '1 min',
    thumbnailIcon: CodeIcon,
    tags: [
      {
        label: 'React',
        category: 'frontend',
        icon: CodeIcon,
      },
    ],
  };
}

describe('ArticleFooter', () => {
  test('renders previous and next article labels from the design mock', () => {
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ArticleFooter
          relatedArticles={[]}
          previousArticle={article('newer', 'Newer article title', '2026-04-05')}
          nextArticle={article('older', 'Older article title', '2026-04-03')}
          navigationLabel="Article navigation"
          previousLabel="Previous Article"
          nextLabel="Next Article"
          relatedLabel="Related"
          relatedTitle="Related Articles"
          relatedDescription="Selected articles"
        />
      </NextIntlClientProvider>,
    );

    expect(html).toContain('Previous Article');
    expect(html).toContain('Next Article');
    expect(html).toContain('Newer article title');
    expect(html).toContain('Older article title');
    expect(html).not.toContain('Newer article</span>');
    expect(html).not.toContain('Older article</span>');
  });

  test('renders nav entries with the same thumbnail card structure as related articles', () => {
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ArticleFooter
          relatedArticles={[]}
          previousArticle={article('previous', 'Previous title', '2026-04-05')}
          nextArticle={article('next', 'Next title', '2026-04-03')}
          navigationLabel="Article navigation"
          previousLabel="Previous Article"
          nextLabel="Next Article"
          relatedLabel="Related"
          relatedTitle="Related Articles"
          relatedDescription="Selected articles"
        />
      </NextIntlClientProvider>,
    );

    expect(html.match(/grid-cols-\[120px_1fr\]/g)).toHaveLength(2);
    expect(html.match(/min-h-\[90px\] bg-secondary/g)).toHaveLength(2);
  });
});
