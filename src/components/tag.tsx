import { cn } from '@/lib/utils';
import type { Tag as TagType } from '@/types/tag';
import { TAG_CATEGORY_TEXT_CLASSES } from '@/types/tag';

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
        'inline-flex items-center gap-1 rounded-[2px] border font-mono',
        'bg-[var(--tag-bg)] text-[var(--tag-text)] border-[var(--tag-border)]',
        size === 'default' && 'px-[9px] py-[3px] text-[11px]',
        size === 'sm' && 'px-[7px] py-px text-[10px]',
        className,
      )}
    >
      {IconComponent && (
        <IconComponent
          size={size === 'default' ? 11 : 10}
          className={cn('shrink-0', TAG_CATEGORY_TEXT_CLASSES[tag.category])}
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
  /** 表示するタグ数の上限。超過分は「+N」チップにまとめる (カードの高さ暴発防止) */
  readonly max?: number;
}

export function TagList({ tags, size = 'default', className, max }: TagListProps) {
  if (tags.length === 0) return null;

  const visibleTags = max ? tags.slice(0, max) : tags;
  const overflowCount = tags.length - visibleTags.length;

  return (
    <div className={cn('flex flex-wrap gap-[5px]', className)}>
      {visibleTags.map((tag) => (
        <Tag key={`${tag.category}-${tag.label}`} tag={tag} size={size} />
      ))}
      {overflowCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center rounded-[2px] border border-border font-mono text-muted-foreground',
            size === 'default' ? 'px-[9px] py-[3px] text-[11px]' : 'px-[7px] py-px text-[10px]',
          )}
        >
          +{overflowCount}
        </span>
      )}
    </div>
  );
}
