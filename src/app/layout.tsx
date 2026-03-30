import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="ja" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
