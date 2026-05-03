import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface FilterTagProps {
  readonly href: string;
  readonly active?: boolean;
  readonly children: React.ReactNode;
}

export function FilterTag({ href, active = false, children }: FilterTagProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-[7px] border border-border px-3.5 text-[12.5px] text-text-secondary transition-colors',
        'hover:border-primary hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        active && 'border-[var(--tag-border)] bg-[var(--tag-bg)] text-[var(--tag-text)]',
      )}
      aria-current={active ? 'true' : undefined}
    >
      {children}
    </Link>
  );
}
