import { CalendarIcon, ClockIcon, PenLineIcon } from 'lucide-react';

import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Article } from '@/types/article';

interface ArticleCardProps {
  readonly article: Article;
  readonly href?: string;
  readonly className?: string;
}

function ArticleThumbnail({
  icon: Icon,
  variant = 'v1',
}: {
  readonly icon: Article['thumbnailIcon'];
  readonly variant?: Article['thumbnailVariant'];
}) {
  return (
    <div className="relative h-40 overflow-hidden bg-secondary">
      {/* Gradient overlay */}
      <div
        className={cn(
          'absolute inset-0',
          variant === 'v1' && 'bg-[image:var(--thumb-gradient-v1)]',
          variant === 'v2' && 'bg-[image:var(--thumb-gradient-v2)]',
          variant === 'v3' && 'bg-[image:var(--thumb-gradient-v3)]',
        )}
      />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:18px_18px]" />
      {/* Icon */}
      <div
        className={cn(
          'absolute opacity-15 text-foreground',
          variant === 'v1' && 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
          variant === 'v2' && 'left-[60%] top-[40%] -translate-x-1/2 -translate-y-1/2',
          variant === 'v3' && 'left-[40%] top-[55%] -translate-x-1/2 -translate-y-1/2',
        )}
      >
        <Icon size={36} />
      </div>
    </div>
  );
}

export function ArticleCard({ article, href, className }: ArticleCardProps) {
  return (
    <Link
      href={href ?? `/articles/${article.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[11px] border border-border bg-card',
        'transition-all duration-[250ms]',
        'hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[3px] before:bg-[image:var(--accent-gradient)] before:opacity-0 before:transition-opacity before:duration-[250ms]',
        'hover:before:opacity-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <ArticleThumbnail icon={article.thumbnailIcon} variant={article.thumbnailVariant} />

      <div className="p-5">
        {/* Meta */}
        <div className="mb-2.5 flex items-center gap-3.5 font-mono text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarIcon size={12} aria-hidden="true" />
            {article.publishedAt}
          </span>
          {article.updatedAt && (
            <span className="inline-flex items-center gap-1">
              <PenLineIcon size={12} aria-hidden="true" />
              {article.updatedAt}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <ClockIcon size={12} aria-hidden="true" />
            {article.readingTime}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-bold leading-snug tracking-[-0.01em] transition-colors duration-200 group-hover:text-primary">
          {article.title}
          <span className="ml-1 inline-block text-[0.85em] text-primary opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100">
            →
          </span>
        </h3>

        {/* Tags */}
        <TagList tags={article.tags} />
      </div>
    </Link>
  );
}
