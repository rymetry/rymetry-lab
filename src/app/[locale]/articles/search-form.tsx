'use client';

import { SearchInput } from '@/components/search-input';
import { XIcon } from 'lucide-react';
import { startTransition, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

import { buildArticlesHref, type ArticlesQuery } from './articles-query';

interface SearchFormProps {
  readonly query: ArticlesQuery;
}

export function SearchForm({ query }: SearchFormProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('Articles.search');

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
      <SearchInput
        ref={inputRef}
        defaultValue={query.q}
        ariaLabel={t('label')}
        placeholder={t('placeholder')}
      />
      {query.q && (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={t('clear')}
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
