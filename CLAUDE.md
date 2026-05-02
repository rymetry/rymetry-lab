# Rymlab — Portfolio & Blog

## Overview

Productivity Engineer "Rym" のポートフォリオ & 技術ブログ。Site: Rymlab / Handle: rymetry / Deploy: Vercel / CMS: microCMS

## Tech Stack

| Category  | Technology                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, `'use cache'`)                                                           |
| Runtime   | React 19, TypeScript 6 (strict), Bun                                                             |
| Styling   | Tailwind CSS v4, shadcn/ui (New York), Iconify (lucide + simple-icons)                           |
| CMS       | microCMS → unified (rehype-sanitize, rehype-prism-plus)                                          |
| Testing   | Vitest (unit/component via Storybook) + Playwright (E2E) + Storybook 10 (@storybook/nextjs-vite) |
| Lint      | ESLint 9 (flat config) + Prettier 3                                                              |
| i18n      | next-intl (Phase 3) / Dark Mode: next-themes                                                     |

## Fonts

- **Display/EN**: Geist (`next/font/google`) → `--font-display`
- **JP**: Noto Sans JP (`next/font/google`) → `--font-sans-jp`
- **Code**: PlemolJP HS (`next/font/local`, fallback: Geist Mono) → `--font-plemol` (composited as `--font-mono`)

## Design System

最終デザイン: `design-mock/design-mockup-v12.html` (ブラウザで確認可能、コントロールバーでページ/テーマ切替)

### Colors — Palette D: Balanced Green 156°/154° (oklch)

**Light** — bg: #fafafa / card: #fff / accent: oklch(0.52 0.11 156) / accent-2: oklch(0.55 0.12 156) / gradient: oklch(0.35 0.08 156)→oklch(0.55 0.12 156)
**Dark** — bg: #09090b / card: #1a1a1f / accent: oklch(0.75 0.10 154) / accent-2: oklch(0.82 0.07 154) / gradient: oklch(0.34 0.07 154)→oklch(0.55 0.10 154)
ダークモードは Hunt 効果補正で hue 154° (Light 156° から -2°)。アクセント・タグカテゴリ色は oklch 統一。ニュートラルトークン (bg, border 等) は hex 維持。text-muted は WCAG AA 準拠。

### Tags

| Category     | Color                | Icon                       |
| ------------ | -------------------- | -------------------------- |
| Frontend     | oklch(0.70 0.15 156) | lucide:monitor             |
| Backend      | oklch(0.62 0.19 260) | lucide:server / database   |
| Infra/DevOps | oklch(0.61 0.22 293) | lucide:cloud / git-branch  |
| Languages    | oklch(0.77 0.16 70)  | lucide:code                |
| Tools/DX     | oklch(0.66 0.21 354) | lucide:wrench / sparkles   |
| Security     | oklch(0.64 0.21 25)  | lucide:shield              |
| Perf/Metrics | oklch(0.71 0.13 215) | lucide:gauge / bar-chart-3 |
| Testing      | oklch(0.70 0.19 48)  | lucide:flask-conical       |
| Release      | oklch(0.63 0.23 304) | lucide:rocket              |

### Animations

- Hero: staggered fadeUp (0s/0.12s/0.24s/0.36s) + terminal typewriter (0.3s間隔) + float (6s, ±6px)
- Cards: hover translateY(-2px) + green top bar + arrow + icon scale(1.08) rotate(-2deg)
- Scroll: IntersectionObserver → .reveal → .visible
- Noise: SVG fractalNoise overlay (1.8%, mix-blend-mode)
- `prefers-reduced-motion` を尊重すること

### Responsive

1024px: グリッド調整, TOC非表示 / 768px: ハンバーガー (☰↔✕ + overlay), padding 16px / 480px: 1カラム

### Social Links

GitHub, X, LinkedIn, Zenn, Qiita, RSS — simple-icons:\* + lucide:rss

## Pages

| Route              | Content                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------ |
| `/`                | Hero (terminal animations) + Featured Work (非対称1大+2小) + Recent Articles (section-alt) |
| `/projects`        | プロジェクトグリッド (auto-fill)                                                           |
| `/articles`        | 検索 + タグフィルタ + ページネーション + Grid/List切替                                     |
| `/articles/[slug]` | アイキャッチ + TOC (sticky 240px) + 関連記事 + 前後ナビ                                    |
| `/about`           | Profile + Engineering Principles (4カード) + Tech Stack                                    |

## Architecture

```
microCMS → SDK → adaptArticle()/adaptTag() → 'use cache' (cacheLife 300s) → Component
                                                ↓
                                    rehype (sanitize → highlight → TOC)
```

- Adapter パターンで CMS スキーマとアプリ型を分離
- テンプレート参照: github.com/rymetry/nextjs-portfolio-blog-template

## Accessibility

focus-visible (緑アウトライン), aria-label (全アイコンボタン), skip link, 検索 aria-label

## GitHub Issues

Epics #1-#10 (`epic`), Tasks #11-#44 (`task`)

- Phase 1 (Core): #1,#2,#3,#4,#6 → #11-#27,#32,#42-#44
- Phase 2 (Content): #5,#7,#9 → #28-#31,#33-#35,#38,#39
- Phase 3 (Polish): #8,#10 → #36,#37,#40,#41

## Claude Code / Agent Config

- **Agent entrypoint**: `AGENTS.md` — Codex/agent 向けの短い作業ルール。詳細仕様はこの `CLAUDE.md` を source of truth とする
- **Permissions example**: `.claude/settings.example.json` — コピーして `.claude/settings.local.json` として使う。個人設定は commit しない
- **Skills**: `.agents/skills/` — shadcn, react-best-practices, composition-patterns, web-design-guidelines, browser-use
- **Rules**: project-specific rules は `AGENTS.md` と `.agents/skills/*/rules` に集約する。unsupported な独自 rules ディレクトリは増やさない
- **Hooks example**: `.claude/settings.example.json` に PostToolUse Prettier 自動フォーマットと PreToolUse `.env` 保護の例を含める

## Implementation Notes

- 実装順: セットアップ (#11-#16,#42) → Story 先行 → コンポーネント → ページ組み立て
- Storybook: @storybook/nextjs-vite v10.3.x (Next.js 16 対応済), Tailwind v4 は @tailwindcss/vite で統合
- lefthook: pre-commit で `format:check` + `lint` を自動実行
- Iconify: 実装時は @iconify/json でバンドル (CDN は FOUC リスク)。現状は lucide-react + インライン SVG (social icons) で統一

## Storybook Story ルール

- **データはモック準拠**: Story のサンプルデータ（タイトル、説明、日付等）は `design-mock/design-mockup-v12.html` からコピーする。適当なプレースホルダーを使わない
- **ThemeProvider は最小限**: `useTheme()` を直接/間接的に使用するコンポーネント (ThemeToggle, および ThemeToggle を内包する Header) のみ ThemeProvider でラップ。他は `preview.tsx` の `WithThemeClass` デコレータ + `globals: { theme: 'dark' }` でテーマ制御
- **DarkMode Story**: 全コンポーネントに DarkMode variant を用意し、`globals: { theme: 'dark' }` を必ず設定する
- **モック変更時は双方更新**: 実装の CSS 変数やスタイルを変更したら、モック HTML も同時に更新する
- Geist: next/font/google (Next.js 16 で Google Fonts 対応済, モックは CDN 代用)
- モック確認: `python3 -m http.server 8234` → localhost:8234/design-mock/design-mockup-v12.html

## Hooks Setup

Claude Code hooks are opt-in local settings. To enable the documented permissions and hooks:

```bash
mkdir -p .claude
cp .claude/settings.example.json .claude/settings.local.json
```

`.claude/settings.local.json` is ignored and must not be committed.

## Commands

```bash
bun run dev / bun run build / bun run storybook / bun run lint / bun run format
bun run typecheck / bun run check
```

`bun run test` is intentionally disabled until Epic #10 completes.
