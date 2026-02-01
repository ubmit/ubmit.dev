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
- frontend tasks: use `/frontend-design`
- framework: Astro (SSG sites), React + TanStack Start if app needed

## Code style
- TS strict, no `any`, no default exports, inline `export`
- avoid new abstractions unless needed; prefer clear names over comments
- avoid helpers for trivial expressions; avoid `useEffect` unless required
- no `try/catch` unless necessary
- file names: kebab-case for `.ts`/`.tsx`/`.jsx`
- Astro: use frontmatter (`---`), keep markup semantic
- formatting: Prettier (astro + tailwind plugins)

## UI + styling
- Tailwind v4 only; use built-ins; rare globals; use `cn()` in `src/utils.ts`
- colors: Radix gray scale `--gray-1`…`--gray-12`
- fonts: Commit Mono (mono), Work Sans (sans)
- dark mode: `prefers-color-scheme`
- UI lib: project DS first; else `shadcn/ui` w/ Base UI

## Content
- blog: `src/content/blog/` (MD/MDX + frontmatter)
- validate via Zod in `src/content/config.ts`

## Tests + CI
- CI jobs: lint-and-format, type-check, build

## Git
- commits: Conventional Commits, small + intentional
- branches: prefix `gui/`
