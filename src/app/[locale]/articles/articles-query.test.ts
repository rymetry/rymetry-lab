import { describe, expect, test } from 'bun:test';

import { buildArticlesHref, normalizeArticlesQuery } from './articles-query';

describe('normalizeArticlesQuery', () => {
  test('normalizes empty search params to the default article query', () => {
    expect(normalizeArticlesQuery({})).toEqual({
      q: '',
      tag: '',
      page: 1,
      view: 'grid',
    });
  });

  test('trims q and tag, accepts positive integer page, and keeps list view', () => {
    expect(
      normalizeArticlesQuery({
        q: '  cache strategy  ',
        tag: '  Performance ',
        page: '3',
        view: 'list',
      }),
    ).toEqual({
      q: 'cache strategy',
      tag: 'Performance',
      page: 3,
      view: 'list',
    });
  });

  test('falls back for invalid page and view values', () => {
    expect(
      normalizeArticlesQuery({
        page: '0',
        view: 'cards',
      }),
    ).toEqual({
      q: '',
      tag: '',
      page: 1,
      view: 'grid',
    });
  });

  test('uses the first value when a search param is repeated', () => {
    expect(
      normalizeArticlesQuery({
        q: ['devex', 'ignored'],
        tag: ['Tools', 'Performance'],
        page: ['2', '9'],
        view: ['list', 'grid'],
      }),
    ).toEqual({
      q: 'devex',
      tag: 'Tools',
      page: 2,
      view: 'list',
    });
  });

  test('strips control characters from textual query parameters', () => {
    expect(
      normalizeArticlesQuery({
        q: 'cache\u0000\nstrategy',
        tag: 'Perf\u007formance',
      }),
    ).toEqual({
      q: 'cachestrategy',
      tag: 'Performance',
      page: 1,
      view: 'grid',
    });
  });
});

describe('buildArticlesHref', () => {
  test('omits default values from the generated URL', () => {
    expect(buildArticlesHref({ q: '', tag: '', page: 1, view: 'grid' })).toBe('/articles');
  });

  test('preserves active filters and view while changing page', () => {
    expect(
      buildArticlesHref({ q: 'cache', tag: 'Performance', page: 1, view: 'list' }, { page: 2 }),
    ).toBe('/articles?q=cache&tag=Performance&page=2&view=list');
  });

  test('resets page to one when q, tag, or view changes', () => {
    expect(
      buildArticlesHref(
        { q: 'cache', tag: 'Performance', page: 4, view: 'grid' },
        { tag: 'DevOps' },
      ),
    ).toBe('/articles?q=cache&tag=DevOps');

    expect(
      buildArticlesHref(
        { q: 'cache', tag: 'Performance', page: 4, view: 'grid' },
        { view: 'list' },
      ),
    ).toBe('/articles?q=cache&tag=Performance&view=list');
  });
});
