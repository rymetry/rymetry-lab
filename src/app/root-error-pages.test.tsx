import { describe, expect, test } from 'bun:test';

import { renderToString } from 'react-dom/server';

import ErrorPage from './error';
import NotFound from './not-found';

/**
 * Regression: app/not-found.tsx / app/error.tsx render OUTSIDE the [locale]
 * segment, so NextIntlClientProvider is not available. They must not depend on
 * next-intl (e.g. Link from @/i18n/navigation), otherwise every unmatched URL
 * throws "No intl context found" and falls back to global-error.
 */
describe('root error pages render without NextIntlClientProvider', () => {
  test('not-found.tsx renders standalone', () => {
    const html = renderToString(<NotFound />);

    expect(html).toContain('404');
    expect(html).toContain('href="/"');
    expect(html).toContain('href="/articles"');
  });

  test('error.tsx renders standalone', () => {
    const html = renderToString(
      <ErrorPage
        error={Object.assign(new Error('boom'), { digest: 'TEST_DIGEST' })}
        unstable_retry={() => undefined}
      />,
    );

    expect(html).toContain('Something Went Wrong');
    expect(html).toContain('TEST_DIGEST');
    expect(html).toContain('href="/"');
  });
});
