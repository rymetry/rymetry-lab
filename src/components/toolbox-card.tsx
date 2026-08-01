import type { ToolboxCategory } from '@/data/about';
import { cn } from '@/lib/utils';

interface ToolboxCardProps {
  readonly category: ToolboxCategory;
  readonly className?: string;
}

export function ToolboxCard({ category, className }: ToolboxCardProps) {
  return (
    <div className={cn('rounded-[4px] border border-border bg-card p-5', className)}>
      <h3 className="mb-3.5 flex items-center gap-[7px] text-[13px] font-semibold">
        <span aria-hidden="true">{category.emoji}</span>
        {category.title}
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {category.items.map((item) => (
          <span
            key={item}
            className={cn(
              'rounded-[2px] border border-border bg-secondary px-[11px] py-[5px]',
              'font-mono text-[12.5px] text-text-secondary',
              'transition-[border-color,color] duration-200',
              'hover:border-primary hover:text-primary',
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
