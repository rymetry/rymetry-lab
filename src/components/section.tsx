import { cn } from '@/lib/utils';

interface SectionContainerProps {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly alt?: boolean;
}

export function SectionContainer({ children, className, alt }: SectionContainerProps) {
  const inner = (
    <section
      className={cn(
        'mx-auto max-w-[1200px] px-6 py-18 max-lg:py-14 max-md:px-4 max-md:py-12',
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
  /** @deprecated 静韻デザインではモノスペースのセクションラベルを表示しない (プロトタイプ準拠) */
  readonly label?: string;
  readonly title: string;
  readonly description?: string;
  readonly descriptionEn?: string;
  readonly className?: string;
  /** page = 一覧ページ見出し (26-38px)、section = Home 等のセクション見出し (22-32px) */
  readonly size?: 'section' | 'page';
}

export function SectionHeader({
  title,
  description,
  descriptionEn,
  className,
  size = 'section',
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-10 max-md:mb-7', className)}>
      <h2
        className={cn(
          'mb-3 font-bold tracking-[0.02em] max-md:mb-2',
          size === 'page' ? 'text-[clamp(26px,3.4vw,38px)]' : 'text-[clamp(22px,3vw,32px)]',
        )}
      >
        {title}
      </h2>
      {(descriptionEn ?? description) && (
        <p className="max-w-[600px] text-[15px] leading-[1.7] text-text-secondary">
          {descriptionEn && <span className="font-medium text-foreground">{descriptionEn}</span>}
          {descriptionEn && description && ' — '}
          {description}
        </p>
      )}
    </div>
  );
}
