import { cn } from '@/lib/utils';

interface SectionContainerProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly alt?: boolean;
  /** compact = padY2 (64/52/44px)。default = 72/56/48px */
  readonly padY?: 'default' | 'compact';
}

export function SectionContainer({
  children,
  className,
  alt,
  padY = 'default',
}: SectionContainerProps) {
  const inner = (
    <section
      className={cn(
        'mx-auto max-w-[1200px] px-6 max-md:px-4',
        padY === 'compact' ? 'py-16 max-lg:py-13 max-md:py-11' : 'py-18 max-lg:py-14 max-md:py-12',
        className,
      )}
    >
      {children}
    </section>
  );

  if (alt) {
    return <div className="border-t border-border bg-secondary">{inner}</div>;
  }

  return inner;
}

interface SectionHeaderProps {
  readonly title: string;
  readonly description?: string;
  readonly descriptionEn?: string;
  readonly className?: string;
  /**
   * page = 一覧ページ見出し (26-38px)、section = Home 等のセクション見出し (22-32px)、
   * sub = 記事フッター等のサブセクション見出し (24px)
   */
  readonly size?: 'section' | 'page' | 'sub';
  /** 見出し先頭の漢字スタンプ (角印)。省略時は非表示 (プロトタイプ default OFF) */
  readonly kanjiStamp?: string;
  /** 説明文 p への追加クラス (例: `max-w-none` で 1 行表示) */
  readonly descriptionClassName?: string;
}

const HEADING_SIZE_CLASSES = {
  page: 'text-[clamp(26px,3.4vw,38px)]',
  section: 'text-[clamp(22px,3vw,32px)]',
  sub: 'text-2xl',
} as const;

export function SectionHeader({
  title,
  description,
  descriptionEn,
  className,
  size = 'section',
  kanjiStamp,
  descriptionClassName,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-10 max-md:mb-7', className)}>
      <h2
        className={cn('mb-3 font-bold tracking-[0.02em] max-md:mb-2', HEADING_SIZE_CLASSES[size])}
      >
        {kanjiStamp && (
          <span
            aria-hidden="true"
            className={cn(
              'mr-3 inline-flex -rotate-3 items-center justify-center rounded-[3px] align-[-4px] font-brand text-[#f4f1e6] [background:var(--accent-gradient)]',
              size === 'page' ? 'size-8 text-[17px]' : 'size-[30px] text-base',
            )}
          >
            {kanjiStamp}
          </span>
        )}
        {title}
      </h2>
      {(descriptionEn ?? description) && (
        <p
          className={cn(
            'max-w-[600px] text-[15px] leading-[1.7] text-text-secondary',
            descriptionClassName,
          )}
        >
          {descriptionEn && <span className="font-medium text-foreground">{descriptionEn}</span>}
          {descriptionEn && description && ' — '}
          {description}
        </p>
      )}
    </div>
  );
}
