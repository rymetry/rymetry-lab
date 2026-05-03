# PR78 Follow-Up Decisions

Issue #79 tracks residual PR #78 review items that were intentionally kept out
of the merge-blocking PR. This document records the decisions behind the
follow-up changes so future review does not have to infer them from code shape.

## CMS Article Cache Ownership

`src/lib/cms/articles.ts` owns CMS article and tag fetching, Next `cacheLife`
configuration, and CMS cache tags. Route-local helpers may compose those public
functions for page needs, but they should not duplicate CMS fetches or define a
second cache lifetime for the same article/tag data.

Article detail lookup validates slugs before entering the cached microCMS
lookup. The accepted slug form is lowercase ASCII letters or digits separated by
single hyphens, for example `github-actions-cache`. Invalid slugs return `null`
before any microCMS filter string is built.

## microCMS Image Helper Boundary

`src/lib/cms/image.ts` intentionally does not import `server-only`. It is a pure
URL helper that validates the public microCMS image host and appends image
transformation query parameters. It does not read credentials, create a CMS
client, fetch data, or depend on request-only state.

Keeping it runtime-neutral preserves straightforward Bun unit tests. Server-only
boundaries remain on modules that handle CMS credentials or server-only request
work, such as `src/lib/cms/microcms.ts` and `src/lib/cms/articles.ts`.

## Coverage Gate

`bun run test:coverage` writes LCOV through Bun and then runs
`scripts/check-coverage.ts`. The enforced gate is 80% function coverage. Bun's
reported LCOV line coverage is printed as a reference value only because its
line accounting has been less useful for this codebase than function coverage.

Do not treat the printed line coverage as a failing threshold unless the script
is intentionally changed to enforce it.

## Playwright Browser Coverage

Playwright E2E remains Chromium-only for now. The current E2E suite is a smoke
suite for routing and core page behavior, and adding WebKit would increase local
and CI runtime without a current WebKit-specific compatibility requirement.

Add WebKit in a focused follow-up when the suite expands to browser-sensitive UI
or rendering behavior.

## CSP And SRI Maintenance

The app uses a production CSP generated per request in `src/proxy.ts`. The
policy relies on a nonce for Next.js runtime inline scripts/styles and keeps the
small set of observed stable Next.js bootstrap hashes in
`src/lib/security/csp.ts`.

`experimental.sri` is not kept in `next.config.ts` because it did not provide a
documented verification path for the current nonce/hash CSP strategy. When
upgrading Next.js, keep CSP unit tests and production browser smoke coverage in
sync with any changed inline bootstrap behavior.
