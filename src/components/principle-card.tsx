import type { Principle } from '@/data/about';
import { cn } from '@/lib/utils';

interface PrincipleCardProps {
  readonly principle: Principle;
  readonly className?: string;
}

export function PrincipleCard({ principle, className }: PrincipleCardProps) {
  return (
    <div
      className={cn(
        'rounded-[11px] border border-border bg-card p-[22px]',
        'transition-[border-color,box-shadow] duration-200',
        'hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        className,
      )}
    >
      <div className="mb-2.5 text-[28px]" aria-hidden="true">
        {principle.emoji}
      </div>
      <h3 className="mb-1.5 text-[15px] font-bold">{principle.title}</h3>
      <p className="text-[13.5px] leading-[1.6] text-text-secondary">{principle.description}</p>
    </div>
  );
}
