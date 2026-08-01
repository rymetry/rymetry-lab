import { CalendarIcon, ClockIcon, PenLineIcon } from 'lucide-react';

import { InkImage, inkThumbVariant } from '@/components/ink-image';
import { TagList } from '@/components/tag';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import type { Article } from '@/types/article';

interface ArticleCardProps {
  readonly article: Article;
  readonly href?: string;
  readonly className?: string;
  readonly variant?: 'grid' | 'list';
}

function ArticleThumbnail({
  slug,
  layout,
}: {
  readonly slug: string;
  readonly layout: ArticleCardProps['variant'];
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden bg-secondary',
        layout === 'list'
          ? 'h-full min-h-[140px] border-r border-border max-[1024px]:min-h-[100px]'
          : 'h-[150px] border-b border-border',
      )}
    >
      <InkImage
        kind="fine"
        className={cn(
          'absolute inset-0 h-full w-full object-cover opacity-90',
          inkThumbVariant(slug),
        )}
        sizes="(max-width: 480px) 100vw, 320px"
      />
    </div>
  );
}

export function ArticleCard({ article, href, className, variant = 'grid' }: ArticleCardProps) {
  const isList = variant === 'list';

  return (
    <Link
      href={href ?? `/articles/${article.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-[11px] border border-border bg-card',
        isList
          ? 'grid grid-cols-[200px_1fr] max-[1024px]:grid-cols-[140px_1fr] max-[480px]:grid-cols-1'
          : 'flex flex-col',
        'transition-all duration-[250ms]',
        'hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--card-shadow-hover)]',
        'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[3px] before:bg-[image:var(--accent-gradient)] before:opacity-0 before:transition-opacity before:duration-[250ms]',
        'hover:before:opacity-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
    >
      <ArticleThumbnail slug={article.slug} layout={variant} />

      <div className={cn(isList ? 'flex flex-col justify-center px-6 py-5' : 'p-5')}>
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
