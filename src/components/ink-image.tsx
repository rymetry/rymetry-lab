import Image from 'next/image';

import { cn } from '@/lib/utils';

/* public/images/ink/ の 6 枚は全て同一サイズ */
const INK_WIDTH = 1672;
const INK_HEIGHT = 941;

const SOURCES = {
  fine: { light: '/images/ink/ink-fine-light.png', dark: '/images/ink/ink-fine-dark.png' },
  flow: { light: '/images/ink/ink-flow-light.png', dark: '/images/ink/ink-flow-dark.png' },
  vortex: { light: '/images/ink/ink-vortex-light.png', dark: '/images/ink/ink-vortex-dark.png' },
} as const;

export type InkKind = keyof typeof SOURCES;

interface InkImageProps {
  readonly kind: InkKind;
  readonly className?: string;
  readonly sizes?: string;
}

/**
 * 静韻の墨流しテクスチャ (装飾専用)。ライト/ダークで別画像のため 2 枚描画し、
 * next-themes の hydration 問題を避けて CSS (`dark:`) でのみ切り替える。
 */
export function InkImage({ kind, className, sizes }: InkImageProps) {
  const source = SOURCES[kind];

  return (
    <>
      <Image
        src={source.light}
        alt=""
        aria-hidden="true"
        width={INK_WIDTH}
        height={INK_HEIGHT}
        sizes={sizes}
        className={cn(className, 'dark:hidden')}
      />
      <Image
        src={source.dark}
        alt=""
        aria-hidden="true"
        width={INK_WIDTH}
        height={INK_HEIGHT}
        sizes={sizes}
        className={cn(className, 'hidden dark:block')}
      />
    </>
  );
}

/** 一覧ページ見出し背後の透かし。親要素に relative + overflow-hidden が必要 */
export function PageInk({ className }: { readonly className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute -right-[110px] -top-[130px] w-[720px] opacity-[0.13] dark:opacity-[0.18]',
        className,
      )}
    >
      <InkImage kind="flow" className="h-auto w-full" sizes="720px" />
    </div>
  );
}

/*
 * カードサムネイル用の見え方バリエーション。同一画像を object-position / scale /
 * scaleX(-1) で変化させ、一覧で隣り合っても同じ絵に見えないようにする (プロトタイプ準拠)。
 */
const INK_THUMB_VARIANTS = [
  '[object-position:20%_30%]',
  '[object-position:80%_40%] [transform:scale(1.5)_scaleX(-1)]',
  '[object-position:50%_60%] [transform:scale(1.2)]',
  '[object-position:35%_75%] [transform:scale(1.8)_scaleX(-1)]',
  '[object-position:65%_20%] [transform:scale(1.35)]',
  '[object-position:90%_65%] [transform:scale(1.6)_scaleX(-1)]',
] as const;

/** slug から決定的にバリエーションを選ぶ (記事ごとに固定) */
export function inkThumbVariant(slug: string): string {
  const sum = [...slug].reduce((acc, char) => acc + (char.codePointAt(0) ?? 0), 0);
  return INK_THUMB_VARIANTS[sum % INK_THUMB_VARIANTS.length] ?? INK_THUMB_VARIANTS[0];
}
