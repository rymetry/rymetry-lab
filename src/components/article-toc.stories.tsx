import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArticleToc } from './article-toc';

const TOC_ITEMS = [
  { id: 'intro', level: 2, text: 'はじめに' },
  { id: 'cache-basics', level: 2, text: 'キャッシュの基本戦略' },
  { id: 'parallel', level: 2, text: '並列実行の最適化' },
  { id: 'results', level: 2, text: '計測結果' },
  { id: 'summary', level: 2, text: 'まとめ' },
] as const;

const meta = {
  title: 'Components/ArticleToc',
  component: ArticleToc,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          '記事詳細の目次。lg 以上は sticky サイドバー、1024px 未満は本文上の折りたたみ (details、デフォルト閉)。スクロール位置に連動して現在の見出しをアクセント色でハイライトする。DOM 上は本文より前に置き、lg では order で右列に配置する (実ページと同構造)。',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="grid grid-cols-[minmax(0,1fr)_240px] gap-10">
        {/* 実ページと同じく TOC を DOM 上先頭に置き、lg:order-last で右列へ */}
        <Story />
        <div className="grid gap-6">
          {TOC_ITEMS.map((item) => (
            <section key={item.id}>
              <h2 id={item.id} className="scroll-mt-24 text-[21px] font-bold">
                {item.text}
              </h2>
              <p className="mt-3 h-48 text-text-secondary">
                GitHub Actions のビルドが遅い — これは多くのチームが抱える課題です。
              </p>
            </section>
          ))}
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ArticleToc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: TOC_ITEMS,
    label: 'INDEX',
  },
};

export const DarkMode: Story = {
  args: {
    items: TOC_ITEMS,
    label: 'INDEX',
  },
  globals: { theme: 'dark' },
};
