# Agent Working Rules

This file is the short entry point for Codex and other coding agents. Use [CLAUDE.md](./CLAUDE.md) as the detailed source of truth for product context, design rules, routes, and implementation notes.

## Project Shape

- App: Next.js 16 App Router, React 19, TypeScript 6, Bun.
- Styling: Tailwind CSS v4, shadcn/ui New York, lucide-react.
- Data today is mostly local static data under `src/data`; future CMS work is documented in `CLAUDE.md`.
- Do not change runtime APIs, routes, component props, or data shapes when the task is only agent/tooling readiness.

## Skills And Rules

- Use `.agents/skills/shadcn` when adding or changing shadcn/ui components.
- Use `.agents/skills/vercel-react-best-practices` for React/Next.js implementation and performance-sensitive changes.
- Use `.agents/skills/vercel-composition-patterns` when changing reusable component APIs or component architecture.
- Use `.agents/skills/web-design-guidelines` for UI/accessibility review work.
- Use `.agents/skills/browser-use` or the available browser tooling for local visual verification.
- Keep project-specific rules in this file and in `.agents/skills/*/rules`; do not add unsupported ad hoc rules directories.

## Implementation Defaults

- Prefer existing local patterns and components before introducing new abstractions.
- Keep Storybook stories aligned with the Seiin prototype (`design-mock/handoff-seiin/4a 現行×静韻.dc.html`) or the app's `messages/ja.json` / `src/data`; do not invent placeholder copy for stories.
- Check `design-mock/handoff-seiin/DIVERGENCE.md` before "fixing" any difference from the prototype — 🎯 entries are intentional divergences.
- Add a `DarkMode` story variant for new visual components and set `globals: { theme: 'dark' }`.
- Wrap only components that directly or indirectly call `useTheme()` with `ThemeProvider` in stories.
- Respect `prefers-reduced-motion` for animation work.
- Never edit real `.env` files. Use `.env.example` only when an example is needed.

## Verification

Run the narrowest relevant checks while working. Before handing off a normal code or docs/config change, run:

```bash
bun run format:check
bun run lint
bun run typecheck
bun run test
bun run build
```

`bun run check` runs the same quality gate in sequence (plus `check:document-shell`).
CI's Unit Test job runs `bun run test:coverage`, which enforces **80% line and 80% function
coverage** via `scripts/check-coverage.ts` — `bun run check` does not, so a change that only
passes locally can still fail CI on coverage. See the Coverage ゲート section of `CLAUDE.md`.
Unit tests cover both `src` and `scripts`.
Storybook component tests are separate: `bunx vitest run --project=storybook` (real Chromium).
