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
  readonly label: string;
  readonly title: string;
  readonly description?: string;
  readonly descriptionEn?: string;
  readonly className?: string;
}

export function SectionHeader({
  label,
  title,
  description,
  descriptionEn,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('mb-10 max-md:mb-7', className)}>
      <p className="mb-1.5 font-mono text-xs uppercase tracking-[0.1em] text-primary">
        {'// '}
        {label}
      </p>
      <h2 className="mb-3 text-[clamp(22px,3vw,32px)] font-bold tracking-[-0.025em] max-md:mb-2">
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
