import type { Article } from '@/types/article';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  BarChart3Icon,
  BotIcon,
  GaugeIcon,
  GitBranchIcon,
  InfinityIcon,
  SparklesIcon,
} from 'lucide-react';
import { NextIntlClientProvider } from 'next-intl';
import { expect } from 'storybook/test';
import messages from '../../messages/ja.json';
import { ArticleCard } from './article-card';

const sampleArticle: Article = {
  slug: 'github-actions-cache',
  title: 'GitHub Actions のキャッシュ戦略を徹底的に最適化する',
  publishedAt: '2026-03-15',
  updatedAt: '2026-03-20',
  readingTime: '8 min',
  tags: [
    { label: 'CI/CD', category: 'infra', icon: GitBranchIcon },
    { label: 'Performance', category: 'performance', icon: GaugeIcon },
  ],
};

const sampleArticles: Article[] = [
  sampleArticle,
  {
    slug: 'developer-onboarding',
    title: '開発者オンボーディングを自動化して定着率を改善した話',
    publishedAt: '2026-03-01',
    updatedAt: '2026-03-05',
    readingTime: '12 min',
    tags: [
      { label: 'DevEx', category: 'tools', icon: SparklesIcon },
      { label: 'Automation', category: 'infra', icon: BotIcon },
    ],
  },
  {
    slug: 'dora-metrics',
    title: 'DORA メトリクスを導入して開発チームの健全性を可視化する',
    publishedAt: '2026-02-18',
    updatedAt: '2026-02-22',
    readingTime: '10 min',
    tags: [
      { label: 'Metrics', category: 'performance', icon: BarChart3Icon },
      { label: 'DevOps', category: 'devops', icon: InfinityIcon },
    ],
  },
];

const meta = {
  title: 'Components/ArticleCard',
  component: ArticleCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '記事カード。サムネイル (microCMS の ogpImage を imgix スマートクロップで表示、未設定のデモデータは slug から決まる墨テクスチャ 6 バリエーション) + メタ情報 + タイトル + タグ。list variant はタグ 3 個 + 「+N」・タイトル line-clamp-2。hover は border/shadow + translateY(-2px)。',
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="ja" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="max-w-sm p-4">
        <Story />
      </div>
    ),
  ],
  args: {
    article: sampleArticle,
  },
};

export const ThumbnailVariants: Story = {
  args: { article: sampleArticle },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 p-4">
      {sampleArticles.map((a) => (
        <ArticleCard key={a.slug} article={a} />
      ))}
    </div>
  ),
};

export const ListVariant: Story = {
  args: { article: sampleArticle, variant: 'list' },
  decorators: [
    (Story) => (
      <div className="max-w-3xl p-4">
        <Story />
      </div>
    ),
  ],
};

export const DarkMode: Story = {
  args: { article: sampleArticle },
  globals: { theme: 'dark' },
  render: () => (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5 rounded-lg bg-background p-4">
      {sampleArticles.map((a) => (
        <ArticleCard key={a.slug} article={a} />
      ))}
    </div>
  ),
};

/**
 * list サムネの Art Direction 帯 (Issue #108)。`<source media>` の解決順は実ブラウザの
 * メディアクエリ解釈に依存するため、ハンドロールしたパーサではなく Chromium 自身に
 * 評価させて「どの幅でも一致する source が高々 1 つ」であることを担保する。
 *
 * `matchMedia` は実ビューポート幅で評価されるので、幅を指定した iframe を挿し、その
 * contentWindow で評価する。ogpImage は microCMS ホストにする — 他ホストだと
 * `buildCardThumbnailUrl` が素通しして 3 つの source が同一 URL になり検証にならない
 * (Storybook では画像自体は解決しないが、media/srcset の検証には不要)。
 */
export const ArtDirectionBands: Story = {
  args: {
    article: {
      ...sampleArticle,
      ogpImage: {
        url: 'https://images.microcms-assets.io/assets/storybook/github-actions-cache.png',
        width: 1200,
        height: 630,
      },
    },
    variant: 'list',
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl p-4">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const sources = [...canvasElement.querySelectorAll('picture source')];
    await expect(sources).toHaveLength(2);

    // Storybook のローダーは microCMS の URL を素のまま srcset に載せるが、アプリ側は
    // /_next/image のクエリにエンコードして載せる。どちらでも読めるよう復号してから見る
    const crop = (source: Element | undefined): string =>
      decodeURIComponent(source?.getAttribute('srcset') ?? '');

    await expect(crop(sources[0])).toContain('w=240&h=400');
    await expect(crop(sources[1])).toContain('w=300&h=360');

    const queries = sources.map((source) => source.getAttribute('media') ?? '');
    const probe = document.createElement('iframe');
    probe.setAttribute('aria-hidden', 'true');
    probe.style.cssText = 'position:fixed;left:-9999px;height:100px;border:0';
    document.body.append(probe);

    try {
      for (const width of [320, 375, 479, 480, 600, 767, 768, 1280]) {
        probe.style.width = `${width}px`;
        const view = probe.contentWindow;
        if (!view) throw new Error('probe iframe has no contentWindow');

        const matched = queries.filter((query) => view.matchMedia(query).matches);
        await expect({ width, matched: matched.length }).toEqual({
          width,
          matched: width < 768 ? 1 : 0,
        });
      }
    } finally {
      probe.remove();
    }
  },
};
