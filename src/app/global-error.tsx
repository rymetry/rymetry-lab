'use client';

import { useEffect, useRef } from 'react';

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly unstable_retry: () => void;
}

/**
 * Last-resort error boundary — replaces the root layout when it crashes.
 * Uses only inline styles and zero component/font/CSS imports so it cannot
 * fail for the same reasons the root layout did (ThemeProvider, fonts, etc.).
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
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: '#09090b',
          color: '#f4f4f5',
        }}
      >
        <div style={{ maxWidth: 480, textAlign: 'center', padding: '0 24px' }}>
          {/* Label */}
          <p
            style={{
              fontFamily: 'monospace',
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              opacity: 0.6,
              marginBottom: 6,
            }}
          >
            {'// '}FATAL_ERROR
          </p>

          {/* Error — decorative */}
          <p
            aria-hidden="true"
            style={{
              fontFamily: 'monospace',
              fontSize: 'clamp(48px, 10vw, 80px)',
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, oklch(0.34 0.07 154), oklch(0.55 0.10 154))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: 12,
            }}
          >
            Error
          </p>

          <h1
            ref={headingRef}
            tabIndex={-1}
            style={{
              fontSize: 'clamp(20px, 3vw, 28px)',
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Something Went Wrong
          </h1>

          <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.7, marginBottom: 8 }}>
            予期しないエラーが発生しました。ページを再読み込みしてください。
          </p>

          {error.digest && (
            <p
              style={{
                fontFamily: 'monospace',
                fontSize: 11,
                opacity: 0.4,
                marginBottom: 24,
              }}
            >
              Error ID: {error.digest}
            </p>
          )}

          {/* CTA */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: 24,
            }}
          >
            <button
              type="button"
              onClick={unstable_retry}
              style={{
                padding: '11px 22px',
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, oklch(0.34 0.07 154), oklch(0.55 0.10 154))',
                border: 'none',
                borderRadius: 9,
                cursor: 'pointer',
              }}
            >
              リトライ ↻
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- global-error replaces root layout; plain <a> is safer than <Link> */}
            <a
              href="/"
              style={{
                padding: '11px 22px',
                fontSize: 14,
                fontWeight: 600,
                color: '#f4f4f5',
                background: 'transparent',
                border: '1.5px solid rgba(244, 244, 245, 0.3)',
                borderRadius: 9,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              ホームに戻る
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
