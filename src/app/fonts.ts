import { Geist, Geist_Mono, Kaisei_Tokumin, Noto_Sans_JP } from 'next/font/google';
import localFont from 'next/font/local';

/**
 * `next/font` はモジュールスコープで一度だけ初期化する必要があるため、定義を 1 ファイルに集約する
 * (Next.js 公式の font definitions file パターン)。
 *
 * ルートレイアウトは pass-through (`return children`) で `<html>` を持たないため、
 * `[locale]/layout.tsx` と root の not-found / error がそれぞれ `<html>` を描画する。
 * どれも同じフォント変数クラスを必要とするので、ここから `fontVariables` を共有する。
 */
const geist = Geist({
  variable: '--font-display',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansJP = Noto_Sans_JP({
  variable: '--font-sans-jp',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const kaiseiTokumin = Kaisei_Tokumin({
  variable: '--font-kaisei',
  subsets: ['latin'],
  weight: ['400', '500', '700', '800'],
  display: 'swap',
});

const plemolJP = localFont({
  src: './fonts/PlemolJPHS-Regular.woff2',
  variable: '--font-plemol',
  display: 'swap',
});

export const fontVariables = `${geist.variable} ${geistMono.variable} ${notoSansJP.variable} ${plemolJP.variable} ${kaiseiTokumin.variable}`;
