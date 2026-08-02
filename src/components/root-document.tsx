import { fontVariables } from '@/app/fonts';
import { ThemeProvider } from '@/components/theme-provider';

interface RootDocumentProps {
  /** 配信するロケール。`<html lang>` に入る (WCAG 3.1.1) */
  readonly lang: string;
  readonly children: React.ReactNode;
}

/**
 * `<html>` / `<body>` を含む完全なドキュメントの殻。
 *
 * ルートの `app/layout.tsx` は pass-through (`return children`) なので `<html>` を供給しない。
 * `[locale]` の内外で描画される各エントリポイントが自前でドキュメントを持つ必要があり、
 * その重複を防ぐためにここへ集約する。
 *
 * **`<html>` / `<body>` は 1 ドキュメントにつき必ず 1 個ずつにすること。** 入れ子にすると
 * 内側が HTML パーサに破棄され、`documentElement` が属性なしになって `lang` もフォントも失う。
 */
export function RootDocument({ lang, children }: RootDocumentProps) {
  return (
    <html
      lang={lang}
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
