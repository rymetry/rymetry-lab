import { DraftModeIndicator } from '@/components/draft-mode-indicator';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { NoiseOverlay } from '@/components/noise-overlay';
import { ThemeProvider } from '@/components/theme-provider';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{
    readonly locale: string;
  }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);
  const [messages, t] = await Promise.all([getMessages(), getTranslations('Layout')]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NextIntlClientProvider messages={messages}>
        <a
          href="#main-content"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[100] focus-visible:rounded focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {t('skipToMain')}
        </a>
        <Suspense fallback={<HeaderFallback />}>
          <Header />
        </Suspense>
        <DraftModeIndicator />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <NoiseOverlay />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}

function HeaderFallback() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg backdrop-saturate-[180%]">
      <div className="mx-auto flex h-15 max-w-[1200px] items-center justify-between px-4 md:px-6">
        <Link href="/" aria-label="Rymlab" className="font-mono text-lg font-extrabold">
          Rym<span className="text-primary">lab</span>
        </Link>
      </div>
    </header>
  );
}
