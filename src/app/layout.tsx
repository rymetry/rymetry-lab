import { createPageMetadata, getSiteUrl } from '@/lib/seo/metadata';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_JP } from 'next/font/google';
import localFont from 'next/font/local';
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

export const metadata: Metadata = createPageMetadata({
  title: 'Rymlab',
  description: 'Portfolio & Blog by Rym — Productivity Engineer',
  path: '/',
  siteUrl: getSiteUrl(),
  locale: 'ja',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      data-scroll-behavior="smooth"
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
        {children}
      </body>
    </html>
  );
}
