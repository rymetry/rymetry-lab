'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { startTransition, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/i18n/navigation';

import { buildArticlesHref, type ArticlesQuery } from './articles-query';

interface SearchFormProps {
  readonly query: ArticlesQuery;
}

export function SearchForm({ query }: SearchFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      role="search"
      className="relative min-w-[min(100%,260px)] flex-1"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const q = String(formData.get('q') ?? '');

        startTransition(() => {
          router.push(buildArticlesHref(query, { q }));
        });
      }}
    >
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={inputRef}
        name="q"
        type="search"
        defaultValue={query.q}
        aria-label="Search articles"
        placeholder="Search articles..."
        className="h-11 rounded-[7px] bg-card pl-9 pr-10 text-[13px] shadow-none"
      />
      {query.q && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          onClick={() => {
            if (inputRef.current) inputRef.current.value = '';
            startTransition(() => {
              router.push(buildArticlesHref(query, { q: '' }));
            });
          }}
        >
          <XIcon aria-hidden="true" />
        </Button>
      )}
    </form>
  );
}
