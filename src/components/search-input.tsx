'use client';

import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';
import { forwardRef } from 'react';

interface SearchInputProps {
  readonly name?: string;
  readonly defaultValue?: string;
  readonly ariaLabel: string;
  readonly placeholder: string;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { name = 'q', defaultValue, ariaLabel, placeholder },
  ref,
) {
  return (
    <>
      <SearchIcon
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        ref={ref}
        name={name}
        type="search"
        defaultValue={defaultValue}
        aria-label={ariaLabel}
        placeholder={placeholder}
        className="h-11 rounded-[7px] bg-card pl-9 pr-10 text-[13px] shadow-none"
      />
    </>
  );
});
