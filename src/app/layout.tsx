import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = createPageMetadata({
  title: 'Rymlab',
  description: 'Portfolio & Blog by Rym — Productivity Engineer',
  path: '/',
  siteUrl: getSiteUrl(),
  locale: 'ja',
});

/**
 * pass-through なルートレイアウト (Issue #106)。
 *
 * `<html lang>` は配信するロケールに一致させる必要がある (WCAG 3.1.1) が、このレイアウトは
 * `[locale]` セグメントの外側なのでロケールを知らない。ここで `<html>` を描画すると
 * `/en` まで `lang="ja"` で配信されてしまう。
 *
 * そこで `<html>` の供給を下位 (`[locale]/layout.tsx` と root の not-found / error) に委ね、
 * ここは children を素通しする。`app/not-found.tsx` が存在する限りルートレイアウト自体は
 * 必須なので、**このファイルを削除してはいけない** (削除すると Next.js が属性なしの
 * `<html>` を補完し、`lang`・フォント変数・テーマがまとめて落ちる)。
 *
 * `metadata` はロケール非依存の既定値としてここに残す。各ページの `generateMetadata` が上書きする。
 */
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
