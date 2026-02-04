# Agent Guide — ubmit.dev

## Comms
- be extremely concise, drop grammar if needed

## Commands (pnpm)
- dev: `pnpm run dev` (localhost:4321)
- build: `pnpm run build` (astro check + build)
- format: `pnpm run format`
- typecheck: `pnpm exec astro check`

## Stack + tools
- package mgr: pnpm
- github: gh
- web automation: `agent-browser` (see `agent-browser --help`)
- use `agent-browser` for UI validation only after larger UI changes or a batch of small tweaks; skip for tiny single change if confident
- frontend tasks: use `/frontend-design`

## Code style
- TS strict, no `any`, no default exports, inline `export`
- avoid new abstractions unless needed; prefer clear names over comments
- avoid helpers for trivial expressions
- no `try/catch` unless necessary
- Astro: use frontmatter (`---`), keep markup semantic
- formatting: Prettier (astro + tailwind plugins)

## UI + styling
- Tailwind v4 only; use built-ins; rare globals
- avoid custom CSS classes/vars for typography if Tailwind utilities suffice; prefer components with inline utilities
- colors: Radix gray scale `--gray-1`…`--gray-12`
- fonts: Commit Mono (mono), Work Sans (sans)
- dark mode: `prefers-color-scheme`

## Content
- blog: `src/content/blog/` (MD/MDX + frontmatter)
- validate via Zod in `src/content/config.ts`

## Tests + CI
- CI jobs: lint-and-format, type-check, build

## Git
- commits: Conventional Commits, small + intentional
- branches: prefix `gui/`
