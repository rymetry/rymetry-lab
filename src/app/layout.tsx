import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { NoiseOverlay } from '@/components/noise-overlay';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_JP } from 'next/font/google';
import localFont from 'next/font/local';
import Link from 'next/link';
import { Suspense } from 'react';
import './globals.css';

const geist = Geist({
  variable: '--font-display',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansJP = Noto_Sans_JP({
  variable: '--font-sans-jp',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const plemolJP = localFont({
  src: './fonts/PlemolJPHS-Regular.woff2',
  variable: '--font-plemol',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Rymlab',
  description: 'Portfolio & Blog by Rym — Productivity Engineer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geist.variable} ${geistMono.variable} ${notoSansJP.variable} ${plemolJP.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* Ensure animated content is visible when JS is disabled */}
        <noscript>
          <style>
            {
              '.anim-up,.reveal,.t-line{opacity:1!important;transform:none!important;animation:none!important}'
            }
          </style>
        </noscript>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            メインコンテンツへスキップ
          </a>
          <Suspense fallback={<HeaderFallback />}>
            <Header />
          </Suspense>
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <NoiseOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg backdrop-saturate-[180%]">
      <div className="mx-auto flex h-15 max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="Rymlab — ホームへ" className="font-mono text-lg font-extrabold">
          Rym<span className="text-primary">lab</span>
        </Link>
      </div>
    </header>
  );
}
