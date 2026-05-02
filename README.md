# Rymlab

Productivity Engineer "Rym" のポートフォリオ & 技術ブログです。Next.js App Router、React 19、TypeScript、Tailwind CSS v4、shadcn/ui を使って構築しています。

## Tech Stack

| Category  | Technology                                        |
| --------- | ------------------------------------------------- |
| Framework | Next.js 16, App Router                            |
| Runtime   | React 19, TypeScript 6, Bun                       |
| Styling   | Tailwind CSS v4, shadcn/ui New York, lucide-react |
| Theme     | next-themes, light/dark                           |
| Testing   | Storybook 10, Vitest browser project, Playwright  |
| Quality   | ESLint 9, Prettier 3, lefthook                    |
| Deploy    | Vercel                                            |

詳細な設計、ページ構成、デザインルールは [CLAUDE.md](./CLAUDE.md) を参照してください。

## Setup

```bash
bun install
bunx lefthook install
```

`lefthook` は pre-commit で `bun run format:check` と `bun run lint` を実行します。CI や worktree で不要な hook 書き換えを避けるため、`prepare` script では自動インストールしていません。

Claude Code の個人設定を使う場合は、例をコピーしてから必要に応じて調整してください。

```bash
mkdir -p .claude
cp .claude/settings.example.json .claude/settings.local.json
```

`.claude/settings.local.json` は個人設定なので commit しません。

## Commands

```bash
bun run dev          # Start local dev server
bun run build        # Build production app
bun run start        # Start built app
bun run storybook    # Start Storybook on port 6006
bun run build-storybook
bun run format       # Format source files
bun run format:check # Check formatting
bun run lint
bun run lint:fix
bun run typecheck
bun run check        # format:check + lint + typecheck + build
```

`bun run test` は Epic #10 のテスト基盤完了まで未有効です。現時点では意図的に失敗します。

## Design Mock

最終デザインの参照は `design-mock/design-mockup-v12.html` です。ブラウザで確認する場合は、リポジトリルートで以下を実行します。

```bash
python3 -m http.server 8234
```

その後、`http://localhost:8234/design-mock/design-mockup-v12.html` を開きます。実装の CSS 変数やスタイルを変更した場合は、対応するモックも同時に更新してください。

## Quality Gate

通常の変更後は以下を実行します。

```bash
bun run check
```

個別に切り分ける場合は、`bun run format:check`、`bun run lint`、`bun run typecheck`、`bun run build` の順で確認します。

## Agent Entry Points

- [AGENTS.md](./AGENTS.md): Codex や他 agent が最初に読む短い作業ルール
- [CLAUDE.md](./CLAUDE.md): 詳細な仕様、デザイン、実装メモ
- [.agents/skills](./.agents/skills): shadcn、React/Next.js、composition、web design、browser-use などのローカル skill
- [skills-lock.json](./skills-lock.json): installed skills の出所と hash
