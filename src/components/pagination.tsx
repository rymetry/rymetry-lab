import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

export interface PaginationItem {
  readonly href: string;
  readonly label: string;
  readonly content: React.ReactNode;
  readonly active?: boolean;
  readonly disabled?: boolean;
}

interface PaginationProps {
  readonly label: string;
  readonly items: readonly PaginationItem[];
  readonly summary?: string;
}

export function Pagination({ label, items, summary }: PaginationProps) {
  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-1.5" aria-label={label}>
      {items.map((item, index) => (
        <PaginationLink key={`${item.href}-${index}`} item={item} />
      ))}
      {summary && <span className="mx-2 font-mono text-xs text-muted-foreground">{summary}</span>}
    </nav>
  );
}

function PaginationLink({ item }: { readonly item: PaginationItem }) {
  const className = cn(
    'flex size-9 items-center justify-center rounded-[7px] border border-border text-[13px] text-text-secondary transition-colors',
    'hover:border-primary hover:text-primary',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    item.active &&
      'border-transparent bg-[image:var(--accent-gradient)] text-white hover:text-white',
    item.disabled && 'pointer-events-none opacity-45',
  );

  if (item.disabled) {
    return (
      <span className={className} aria-label={item.label} aria-disabled="true">
        {item.content}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={className}
      aria-label={item.label}
      aria-current={item.active ? 'page' : undefined}
    >
      {item.content}
    </Link>
  );
}
