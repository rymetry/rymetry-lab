import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import { ArticleCard } from '@/components/article-card';
import { SectionContainer, SectionHeader } from '@/components/section';
import { cn } from '@/lib/utils';
import type { ArticleDetail } from '@/types/article';

export function ArticleFooter({
  relatedArticles,
  previousArticle,
  nextArticle,
  navigationLabel,
  previousLabel,
  nextLabel,
  relatedTitle,
  relatedDescription,
}: {
  readonly relatedArticles: readonly ArticleDetail[];
  readonly previousArticle: ArticleDetail | null;
  readonly nextArticle: ArticleDetail | null;
  readonly navigationLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly relatedTitle: string;
  readonly relatedDescription: string;
}) {
  return (
    <SectionContainer
      alt
      className="pt-12 pb-16 max-lg:pt-12 max-lg:pb-16 max-md:pt-12 max-md:pb-16"
    >
      <div className="mx-auto max-w-[1040px]">
        {relatedArticles.length > 0 ? (
          <>
            <SectionHeader
              size="sub"
              title={relatedTitle}
              description={relatedDescription}
              className="mb-5"
            />
            <div className="grid gap-2.5">
              {relatedArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} variant="list" />
              ))}
            </div>
          </>
        ) : null}

        {previousArticle || nextArticle ? (
          <nav
            aria-label={navigationLabel}
            className={cn('grid gap-3.5 md:grid-cols-2', relatedArticles.length > 0 && 'mt-10')}
          >
            <ArticleNavCard label={previousLabel} article={previousArticle} direction="previous" />
            <ArticleNavCard label={nextLabel} article={nextArticle} direction="next" />
          </nav>
        ) : null}
      </div>
    </SectionContainer>
  );
}

function ArticleNavCard({
  label,
  article,
  direction,
}: {
  readonly label: string;
  readonly article: ArticleDetail | null;
  readonly direction: 'previous' | 'next';
}) {
  if (!article) {
    return <div className="hidden md:block" />;
  }

  const Icon = direction === 'previous' ? ArrowLeftIcon : ArrowRightIcon;

  return (
    <div>
      <p
        className={cn(
          'mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground',
          direction === 'next' && 'justify-end',
        )}
      >
        {direction === 'previous' ? <Icon aria-hidden="true" className="size-[11px]" /> : null}
        {label}
        {direction === 'next' ? <Icon aria-hidden="true" className="size-[11px]" /> : null}
      </p>
      <ArticleCard article={article} variant="list" />
    </div>
  );
}
