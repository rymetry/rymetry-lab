import { cn } from '@/lib/utils';
import type { Tag as TagType } from '@/types/tag';
import { TAG_CATEGORY_COLORS } from '@/types/tag';

interface TagProps {
  readonly tag: TagType;
  readonly size?: 'default' | 'sm';
  readonly className?: string;
}

export function Tag({ tag, size = 'default', className }: TagProps) {
  const IconComponent = tag.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded border font-mono',
        'bg-[var(--tag-bg)] text-[var(--tag-text)] border-[var(--tag-border)]',
        size === 'default' && 'px-[9px] py-[3px] text-[11px]',
        size === 'sm' && 'px-[7px] py-px text-[10px]',
        className,
      )}
    >
      {IconComponent && (
        <IconComponent
          size={size === 'default' ? 11 : 9}
          className="shrink-0"
          style={{ color: TAG_CATEGORY_COLORS[tag.category] }}
        />
      )}
      {tag.label}
    </span>
  );
}

interface TagListProps {
  readonly tags: readonly TagType[];
  readonly size?: 'default' | 'sm';
  readonly className?: string;
}

export function TagList({ tags, size = 'default', className }: TagListProps) {
  if (tags.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap gap-[5px]', className)}>
      {tags.map((tag) => (
        <Tag key={`${tag.category}-${tag.label}`} tag={tag} size={size} />
      ))}
    </div>
  );
}
