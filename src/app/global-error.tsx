'use client';

import { useEffect, useRef } from 'react';

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}

/**
 * Last-resort error boundary — replaces the root layout when it crashes.
 * Keeps component/font imports out so it cannot fail for the same reasons the
 * root layout did (ThemeProvider, fonts, etc.).
 */
export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // TODO: Replace with error reporting service (Sentry, etc.)
    console.error('[GlobalError]', error);
  }, [error]);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <html lang="ja">
      <head>
        <title>Error | Rymlab</title>
      </head>
      <body className="m-0 flex min-h-screen items-center justify-center bg-[#09090b] text-[#f4f4f5]">
        <div className="max-w-[480px] px-6 text-center">
          {/* Label */}
          <p className="mb-1.5 font-mono text-xs uppercase opacity-60">{'// '}FATAL_ERROR</p>

          {/* Error — decorative */}
          <p
            aria-hidden="true"
            className="mb-3 bg-[linear-gradient(135deg,oklch(0.34_0.07_154),oklch(0.55_0.10_154))] bg-clip-text font-mono text-[clamp(48px,10vw,80px)] leading-none font-extrabold text-transparent"
          >
            Error
          </p>

          <h1 ref={headingRef} tabIndex={-1} className="mb-3 text-[clamp(20px,3vw,28px)] font-bold">
            Something Went Wrong
          </h1>

          <p className="mb-2 text-[15px] leading-[1.7] opacity-70">
            予期しないエラーが発生しました。ページを再読み込みしてください。
          </p>

          {error.digest && (
            <p className="mb-6 font-mono text-[11px] opacity-40">Error ID: {error.digest}</p>
          )}

          {/* CTA */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={unstable_retry}
              className="cursor-pointer rounded-[9px] border-0 bg-[linear-gradient(135deg,oklch(0.34_0.07_154),oklch(0.55_0.10_154))] px-[22px] py-[11px] text-sm font-semibold text-white"
            >
              リトライ ↻
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error replaces root layout; plain <a> is safer than <Link> */}
            <a
              href="/"
              className="inline-flex items-center rounded-[9px] border-[1.5px] border-[rgba(244,244,245,0.3)] bg-transparent px-[22px] py-[11px] text-sm font-semibold text-[#f4f4f5] no-underline"
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
