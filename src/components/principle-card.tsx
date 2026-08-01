import type { Principle } from '@/data/about';
import { cn } from '@/lib/utils';

interface PrincipleCardProps {
  readonly principle: Principle;
  readonly className?: string;
}

export function PrincipleCard({ principle, className }: PrincipleCardProps) {
  return (
    <div className={cn('rounded-[4px] border border-border bg-card p-[22px]', className)}>
      <h3 className="mb-1.5 text-[15px] font-bold">{principle.title}</h3>
      <p className="text-[13.5px] leading-[1.6] text-text-secondary">{principle.description}</p>
    </div>
  );
}
