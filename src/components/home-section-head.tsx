import { ArrowRightIcon } from 'lucide-react';

import { SectionHeader } from '@/components/section';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface HomeSectionHeadProps {
  readonly title: string;
  readonly description?: string;
  readonly descriptionEn?: string;
  /** viewAllHref + viewAllLabel が揃ったときのみ View all リンクを表示 (md 限定) */
  readonly viewAllHref?: string;
  readonly viewAllLabel?: string;
  /** ScrollRevealList の cloneElement が注入する reveal 等を受け取る */
  readonly className?: string;
  /** 説明文 p への追加クラス (例: `max-w-none` で 1 行表示) */
  readonly descriptionClassName?: string;
}

/**
 * Home セクションの見出しセル。lg (3列)・モバイル (1列) では全幅の行、
 * md (2列) ではグリッド1マス目に入りカード3枚と 2×2 モジュールを構成する。
 * View all リンクは md 時のみ表示 (プロトタイプ準拠)。
 */
export function HomeSectionHead({
  title,
  description,
  descriptionEn,
  viewAllHref,
  viewAllLabel,
  className,
  descriptionClassName,
}: HomeSectionHeadProps) {
  return (
    <div
      className={cn(
        'col-span-full mb-5 md:max-lg:col-span-1 md:max-lg:mb-0 md:max-lg:flex md:max-lg:flex-col md:max-lg:justify-center md:max-lg:pb-5 md:max-lg:pr-3',
        className,
      )}
    >
      <SectionHeader
        title={title}
        description={description}
        descriptionEn={descriptionEn}
        className="mb-0 max-md:mb-0"
        descriptionClassName={descriptionClassName}
      />
      {viewAllHref && viewAllLabel && (
        <Link
          href={viewAllHref}
          className="mt-4 hidden items-center gap-1.5 font-brand text-sm font-medium tracking-[0.03em] text-primary transition-colors hover:text-foreground md:max-lg:inline-flex"
        >
          {viewAllLabel}
          <ArrowRightIcon size={13} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
