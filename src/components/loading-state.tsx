import { SectionContainer, SectionHeader } from '@/components/section';
import { cn } from '@/lib/utils';

function Skeleton({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded bg-muted [animation-duration:1.4s]', className)}
      aria-hidden="true"
    />
  );
}

function CardSkeleton({ compact = false }: { readonly compact?: boolean }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[11px] border border-border bg-card',
        compact ? 'grid grid-cols-[120px_1fr] max-[480px]:grid-cols-[80px_1fr]' : 'flex flex-col',
      )}
    >
      <Skeleton className={compact ? 'min-h-[90px] rounded-none' : 'h-40 rounded-none'} />
      <div className={cn('flex flex-col', compact ? 'justify-center px-4.5 py-3.5' : 'p-5')}>
        <div className="mb-3 flex gap-2.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-14" />
        </div>
        <Skeleton className={cn('mb-2.5 h-4', compact ? 'w-[82%]' : 'w-[90%]')} />
        <Skeleton className={cn('mb-4 h-4', compact ? 'w-[58%]' : 'w-[70%]')} />
        <div className="flex flex-wrap gap-[5px]">
          <Skeleton className="h-5 w-16 rounded border border-border" />
          <Skeleton className="h-5 w-20 rounded border border-border" />
        </div>
      </div>
    </div>
  );
}

export function HomeLoadingState() {
  return (
    <div role="status" aria-label="コンテンツを読み込み中">
      <span className="sr-only">コンテンツを読み込み中</span>
      <SectionContainer>
        <div className="grid min-h-[420px] items-center gap-10 py-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Skeleton className="mb-5 h-4 w-40" />
            <Skeleton className="mb-3 h-12 w-full max-w-[620px]" />
            <Skeleton className="mb-6 h-12 w-[82%] max-w-[520px]" />
            <Skeleton className="mb-8 h-5 w-full max-w-[560px]" />
            <div className="flex gap-3">
              <Skeleton className="h-11 w-36 rounded-md" />
              <Skeleton className="h-11 w-28 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-[320px] rounded-[11px] border border-border bg-card" />
        </div>
      </SectionContainer>

      <SectionContainer alt>
        <SectionHeader label="Latest Articles" title="Recent Articles" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
          {Array.from({ length: 3 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}

export function ArticlesLoadingState() {
  return (
    <div role="status" aria-label="記事一覧を読み込み中">
      <span className="sr-only">記事一覧を読み込み中</span>
      <SectionContainer>
        <SectionHeader
          label="Articles"
          title="All Articles"
          descriptionEn="Field notes from the trenches of developer productivity."
          description="開発生産性の現場から得た知見。"
        />
        <div className="mb-8 grid gap-3 md:grid-cols-[1fr_auto]">
          <Skeleton className="h-11 rounded-md border border-border bg-card" />
          <div className="flex gap-2">
            <Skeleton className="h-11 w-11 rounded-md border border-border bg-card" />
            <Skeleton className="h-11 w-11 rounded-md border border-border bg-card" />
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-5">
          {Array.from({ length: 6 }, (_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </SectionContainer>
    </div>
  );
}

export function ArticleDetailLoadingState() {
  return (
    <div role="status" aria-label="記事を読み込み中">
      <span className="sr-only">記事を読み込み中</span>
      <SectionContainer>
        <div className="mx-auto max-w-[980px]">
          <Skeleton className="mb-5 h-4 w-28" />
          <Skeleton className="mb-3 h-10 w-full" />
          <Skeleton className="mb-6 h-10 w-[72%]" />
          <div className="mb-8 flex flex-wrap gap-2">
            <Skeleton className="h-5 w-20 rounded border border-border" />
            <Skeleton className="h-5 w-24 rounded border border-border" />
          </div>
          <Skeleton className="mb-10 aspect-[1200/630] w-full rounded-[11px] border border-border bg-card" />
          <div className="grid gap-10 lg:grid-cols-[1fr_240px]">
            <div className="space-y-4">
              {Array.from({ length: 7 }, (_, index) => (
                <Skeleton
                  key={index}
                  className={cn('h-4', index % 3 === 2 ? 'w-[76%]' : 'w-full')}
                />
              ))}
            </div>
            <div className="max-lg:hidden">
              <Skeleton className="mb-3 h-4 w-20" />
              <Skeleton className="mb-2 h-3 w-full" />
              <Skeleton className="mb-2 h-3 w-[84%]" />
              <Skeleton className="h-3 w-[68%]" />
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
