# Rymlab — Portfolio & Blog

## Overview
Productivity Engineer "Rym" のポートフォリオ & 技術ブログ。Site: Rymlab / Handle: rymetry / Deploy: Vercel / CMS: microCMS

## Tech Stack
| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router, `'use cache'`) |
| Runtime | React 19, TypeScript 5 (strict), Bun |
| Styling | Tailwind CSS v4, shadcn/ui (New York), Iconify (lucide + simple-icons) |
| CMS | microCMS → unified (rehype-sanitize, rehype-prism-plus) |
| Testing | Bun test (unit) + Playwright (E2E) + Storybook 10 (@storybook/nextjs-vite) |
| Lint | ESLint 9 (flat config) + Prettier 3 |
| i18n | next-intl (Phase 3) / Dark Mode: next-themes |

## Fonts
- **Display/EN**: Geist (`next/font/local`) → `--font-display`, `--font-sans`
- **JP**: Noto Sans JP (`next/font/google`)
- **Code**: PlemolJP HS (`next/font/local`, fallback: Geist Mono) → `--font-mono`

## Design System
最終デザイン: `design-mock/design-mockup-v11.html` (ブラウザで確認可能、コントロールバーでページ/テーマ切替)

### Colors (CSS Variables)
**Light** — bg: #fafafa / card: #fff / accent: #0c6b58 / accent-2: #14b890 / gradient: #084c3e→#14b890
**Dark** — bg: #09090b / card: #1a1a1f / accent: #5cd8c8 (teal) / accent-2: #94ede0 / gradient: #0e8a7a→#5cd8c8
text-muted は WCAG AA 準拠。カラーは意図的に Tailwind プリセットからずらしている。

### Tags
| Category | Color | Icon |
|----------|-------|------|
| Frontend | #10b981 | lucide:monitor |
| Backend | #3b82f6 | lucide:server / database |
| Infra/DevOps | #8b5cf6 | lucide:cloud / git-branch |
| Languages | #f59e0b | lucide:code |
| Tools/DX | #ec4899 | lucide:wrench / sparkles |
| Perf/Metrics | #06b6d4 | lucide:gauge / bar-chart-3 |
| Testing | #f97316 | lucide:flask-conical |
| Release | #a855f7 | lucide:rocket |

### Animations
- Hero: staggered fadeUp (0s/0.12s/0.24s/0.36s) + terminal typewriter (0.3s間隔) + float (6s, ±6px)
- Cards: hover translateY(-2px) + green top bar + arrow + icon scale(1.08) rotate(-2deg)
- Scroll: IntersectionObserver → .reveal → .visible
- Noise: SVG fractalNoise overlay (1.8%, mix-blend-mode)
- `prefers-reduced-motion` を尊重すること

### Responsive
1024px: グリッド調整, TOC非表示 / 768px: ハンバーガー (☰↔✕ + overlay), padding 16px / 480px: 1カラム

### Social Links
GitHub, X, LinkedIn, Zenn, Qiita, RSS — simple-icons:* + lucide:rss

## Pages
| Route | Content |
|-------|---------|
| `/` | Hero (terminal animations) + Featured Work (非対称1大+2小) + Recent Articles (section-alt) |
| `/projects` | プロジェクトグリッド (auto-fill) |
| `/articles` | 検索 + タグフィルタ + ページネーション + Grid/List切替 |
| `/articles/[slug]` | アイキャッチ + TOC (sticky 240px) + 関連記事 + 前後ナビ |
| `/about` | Profile + Engineering Principles (4カード) + Tech Stack |

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

## Claude Code Config
- **Permissions**: bun, bunx, git, gh, ls, cat, find — 自動許可 (.claude/settings.local.json)
- **Skills**: `.agents/skills/` — Vercel skills (react-best-practices, composition-patterns, web-design-guidelines, browser-use)
- **Rules**: グローバル `~/.claude/rules/common/` に委任。プロジェクト固有ルールは `.claude/rules/` に追加
- **Plugins**: everything-claude-code (skills/agents), superpowers, frontend-design, playwright, pr-review-toolkit, context7 (グローバル)
- **Hooks** (#44完了後): PostToolUse Prettier自動フォーマット + PreToolUse .env保護

## Implementation Notes
- 実装順: セットアップ (#11-#16,#42) → Story 先行 → コンポーネント → ページ組み立て
- Storybook: @storybook/nextjs-vite v10.3.x (Next.js 16 対応済), Tailwind v4 は @tailwindcss/vite で統合
- Iconify: 実装時は @iconify/json でバンドル (CDN は FOUC リスク)
- Geist: next/font/local 必須 (Google Fonts 非対応, モックは CDN 代用)
- モック確認: `python3 -m http.server 8234` → localhost:8234/design-mock/design-mockup-v11.html

## Commands
```bash
bun dev / bun build / bun test / bun storybook / bun lint / bun format
```
