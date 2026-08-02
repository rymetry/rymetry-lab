import { CalendarIcon, ClockIcon, PenLineIcon } from 'lucide-react';
import Image, { getImageProps } from 'next/image';

import { InkImage, inkThumbVariant } from '@/components/ink-image';
import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { buildCardThumbnailUrl } from '@/lib/cms/image';
import { cn } from '@/lib/utils';
import type { Article, ArticleImage } from '@/types/article';

/**
 * grid variant の sizes プリセット。カラムが切り替わる viewport がページごとに違うため
 * (Home = Tailwind md/lg、Articles = auto-fill minmax(320px) の 692/1048px) 呼び出し側で選ぶ。
 * どちらも最終段は max-w-[1200px] 内の 3 カラム = (1152-40)/3 ≒ 371px。
 *
 * 境界は Media Queries Level 4 の range 構文で書く。Tailwind が出力する
 * `@media (width >= 48rem)` の否定と厳密に一致し、max-width + 端数による近似で生じる
 * 境界直前の未カバー区間をなくせるため (baseline: Safari 16.4+ — globals.css 参照)。
 * Home を rem にするのは、既定フォントサイズを上げた環境で md/lg の実発火位置と
 * ズレて過小申告になる (= 画像がぼやける) のを防ぐため。
 * Articles の 692/1048px は minmax(320px)+gap から決まる px 由来なので px のまま
 * (Tailwind のグローバル breakpoint には追加しない)。
 * 33vw ではなく 32vw なのは、vw=1199 で 33.3vw=400px となり 384w ではなく 640w 候補に飛ぶため。
 */
export const ARTICLE_GRID_SIZES = {
  home: '(width < 48rem) 100vw, (width < 64rem) 50vw, (width < 1200px) 32vw, 371px',
  articles: '(width < 692px) 100vw, (width < 1048px) 50vw, (width < 1200px) 32vw, 371px',
} as const;

/**
 * list variant のサムネ列幅 (ink フォールバック用)。Tailwind 側 (grid-cols-[...] の
 * max-[480px] / max-md) と同じ排他レンジ・同じ単位で宣言する。
 *
 * 768px 以上の 220px は `grid-cols-[minmax(140px,220px)_1fr]` の**上限**であり、
 * surface によって実寸が違う (2026-08-02 実測):
 * - `/articles?view=list` — コンテナが広いため常に上限の 220px
 * - 記事詳細の Prev/Next — `max-w-[1040px]` 内の `md:grid-cols-2` で圧縮され、
 *   innerWidth 768px で 145px / 1280px で 220px
 *
 * 広い側 (220px) に合わせて宣言する。Prev/Next では過大申告になるが、狭い側に
 * 合わせると `/articles` のリスト表示が過小申告になりぼやけるため、こちらを取る
 * (通信量の問題であって画質劣化ではない)。
 */
const LIST_THUMBNAIL_SIZES = '(width < 480px) 80px, (width < 48rem) 100px, 220px';

/**
 * list サムネの広帯 (>=768px) プロファイル。表示ボックス比が surface で違うため 2 種類ある。
 *
 * - `standard` — `/articles?view=list` と Related。全 11 記事 × 768/1024/1280px の実測で
 *   箱比は 1.83 単一。要求も 1.83 に合わせると元画像の可視幅が 79% → 96% に増える。
 * - `split-nav` — 記事詳細の Prev/Next。`max-w-[1040px]` 内の `md:grid-cols-2` で圧縮され、
 *   同じ viewport でも本文量で箱比が 0.92〜1.83 と揺れる (実測)。実効密度は
 *   `(配信幅 / 箱幅) × min(1, 箱比 / 要求比)` なので「どの箱比でも現行を下回らない」条件は
 *   **要求比 <= 1.5**。構図は要求比が大きいほど良いので 1.5 = 現行の 480x320 が最適解になる。
 */
export type ListThumbnailProfile = 'standard' | 'split-nav';

/**
 * 狭帯は 2 つの surface で箱比が一致するため共有する (実測: <480px = 0.43〜0.59 /
 * 480-767px = 0.83 単一)。`media` は**重なりを持たせない** — `<picture>` は最初に
 * 一致した `<source>` を採るため、`(width < 480px)` と `(width < 48rem)` のように
 * 包含関係にすると配列順の入れ替えで無言に誤クロップになる (Chromium で再現確認済み)。
 */
const LIST_NARROW_BANDS = [
  { media: '(width < 480px)', sizes: '80px', width: 240, height: 400 },
  { media: '(width >= 480px) and (width < 48rem)', sizes: '100px', width: 300, height: 360 },
] as const;

const LIST_WIDE_BAND = {
  standard: { sizes: '220px', width: 660, height: 360 },
  'split-nav': { sizes: '220px', width: 480, height: 320 },
} as const satisfies Record<ListThumbnailProfile, { sizes: string; width: number; height: number }>;

/**
 * list サムネの Art Direction。`sizes` は srcset 候補の選択にしか効かずクロップを変えないため、
 * 帯ごとに別クロップの URL を `<source media>` で出し分ける。`fill: true` を維持するのは、
 * width/height 付きの `<img>` になるとグリッド行高に画像が参加してカード高と border 位置が
 * 変わるため。
 */
function ListThumbnailPicture({
  src,
  profile,
}: {
  readonly src: string;
  readonly profile: ListThumbnailProfile;
}) {
  const wide = LIST_WIDE_BAND[profile];
  const {
    props: { srcSet: wideSrcSet, ...wideProps },
  } = getImageProps({
    src: buildCardThumbnailUrl(src, wide),
    alt: '',
    fill: true,
    sizes: wide.sizes,
    className: 'object-cover',
  });

  return (
    <picture>
      {LIST_NARROW_BANDS.map((band) => {
        const { props } = getImageProps({
          src: buildCardThumbnailUrl(src, band),
          alt: '',
          fill: true,
          sizes: band.sizes,
        });

        return (
          <source key={band.media} media={band.media} srcSet={props.srcSet} sizes={props.sizes} />
        );
      })}
      <img {...wideProps} srcSet={wideSrcSet} alt="" />
    </picture>
  );
}

interface ArticleCardProps {
  readonly article: Article;
  readonly href?: string;
  readonly className?: string;
  readonly variant?: 'grid' | 'list';
  /** grid variant のみ有効。ARTICLE_GRID_SIZES から表示ページに合うものを渡す */
  readonly gridSizes?: string;
  /** list variant のみ有効。Prev/Next のように広帯で圧縮される surface は 'split-nav' */
  readonly listThumbnailProfile?: ListThumbnailProfile;
}

function ArticleThumbnail({
  slug,
  image,
  layout,
  gridSizes,
  listThumbnailProfile,
}: {
  readonly slug: string;
  readonly image?: ArticleImage;
  readonly layout: ArticleCardProps['variant'];
  readonly gridSizes?: string;
  readonly listThumbnailProfile: ListThumbnailProfile;
}) {
  // list のサムネ列は最大 220px (768px 未満 100px / 480px 未満 80px)。
  // grid と同じ sizes を流用すると狭幅で 100vw 分の候補をフェッチしてしまう。
  // 境界は grid と同じく range 構文で書く。Tailwind v4 の `max-*` は排他レンジ
  // (`max-md` = `(width < 48rem)`) なので、`(max-width: 768px)` だと 768px ちょうどで
  // `/articles?view=list` の実サムネ 220px に対して 100px を申告してしまい、
  // 候補が 1 段足りなくなる。単位は Tailwind 側に合わせる
  // (`max-md` = rem / `max-[480px]` = px)。surface ごとの実寸差は
  // LIST_THUMBNAIL_SIZES の注記を参照。
  const sizes = layout === 'list' ? LIST_THUMBNAIL_SIZES : (gridSizes ?? ARTICLE_GRID_SIZES.home);

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-secondary',
        layout === 'list'
          ? 'h-full min-h-[120px] border-r border-border'
          : 'h-[150px] border-b border-border',
      )}
    >
      {image && layout === 'list' ? (
        <ListThumbnailPicture src={image.url} profile={listThumbnailProfile} />
      ) : image ? (
        <Image
          // 表示ボックスの実効アスペクト比に合わせた中央クロップ (2x 相当の実寸)
          src={buildCardThumbnailUrl(image.url, { width: 960, height: 400 })}
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
        />
      ) : (
        <InkImage
          kind="fine"
          className={cn(
            'absolute inset-0 h-full w-full object-cover opacity-90',
            inkThumbVariant(slug),
          )}
          sizes={sizes}
        />
      )}
    </div>
  );
}

export function ArticleCard({
  article,
  href,
  className,
  variant = 'grid',
  gridSizes,
  listThumbnailProfile = 'standard',
}: ArticleCardProps) {
  const isList = variant === 'list';

  return (
    <Link
      href={href ?? `/articles/${article.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-[4px] border border-border bg-card',
        isList
          ? // max-md と max-[480px] は CSS 出力順で 480px 側が先になり打ち消されるため、範囲を重ねない
            'grid grid-cols-[minmax(140px,220px)_1fr] min-[480px]:max-md:grid-cols-[100px_1fr] max-[480px]:grid-cols-[80px_1fr]'
          : 'flex flex-col',
        'transition-all duration-[250ms]',
        'hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <ArticleThumbnail
        slug={article.slug}
        image={article.ogpImage}
        layout={variant}
        gridSizes={gridSizes}
        listThumbnailProfile={listThumbnailProfile}
      />

      <div className={cn(isList ? 'flex flex-col justify-center p-5' : 'p-5')}>
        {/* Meta */}
        <div className="mb-2.5 flex items-center gap-3.5 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon size={12} aria-hidden="true" />
            {article.publishedAt}
          </span>
          {article.updatedAt && (
            <span className="inline-flex items-center gap-1">
              <PenLineIcon size={12} aria-hidden="true" />
              {article.updatedAt}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ClockIcon size={12} aria-hidden="true" />
            {article.readingTime}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'mb-2 text-base font-bold leading-snug tracking-[-0.01em]',
            isList && 'line-clamp-2',
          )}
        >
          {article.title}
        </h3>

        {/* Tags — リスト表示は行の高さ暴発を防ぐため 3 個 + 「+N」に制限 */}
        <TagList tags={article.tags} max={isList ? 3 : undefined} />
      </div>
    </Link>
  );
}
