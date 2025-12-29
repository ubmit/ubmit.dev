# Agent Guidelines for ubmit.dev

## Commands

- **Dev**: `pnpm run dev` (starts at localhost:4321)
- **Build**: `pnpm run build` (runs astro check + build)
- **Format**: `pnpm run format` (Prettier with Astro/Tailwind plugins)
- **Type Check**: `pnpm exec astro check`
- **Visual Tests**: `pnpm run test` (Playwright visual regression tests)
- **Visual Tests UI**: `pnpm run test:ui` (Interactive Playwright UI mode)
- **Update Snapshots**: `pnpm run test:update` (Update visual regression baselines after intentional UI changes)

## Code Style

- **TypeScript**: Strict mode, strict null checks enabled
- **Imports**: Named exports preferred (e.g., `export const SITE_TITLE`)
- **Formatting**: Auto-formatted via Prettier (prettier-plugin-astro, prettier-plugin-tailwindcss)
- **Astro Components**: Use frontmatter (`---`) for imports and logic; keep markup semantic
- **Types**: Explicit types via Zod schemas for content collections; leverage Astro's built-in types

## Styling

- **Tailwind**: Utility-first; use `cn()` helper from `src/utils.ts` for conditional classes
- **Colors**: Custom gray scale (100-1200) via Radix UI Colors (`--gray-1` to `--gray-12`)
- **Typography**: Custom fonts (Commit Mono for mono, Work Sans for sans)
- **Dark Mode**: Handled via CSS `prefers-color-scheme`

## Content

- Blog posts in `src/content/blog/` as MDX/Markdown with frontmatter (title, description, pubDate, etc.)
- Validate using Zod schema in `src/content/config.ts`

## Testing & CI

- **Visual Regression**: Run manually before deploys (`pnpm run test`)
- **Snapshots**: Platform-specific (`*-chromium-darwin.png` for macOS)
- **CI Jobs**: lint-and-format, type-check, build
- **Updating Snapshots After UI Changes**:
  1. Run `pnpm run build` (snapshots test against built site)
  2. Run `pnpm run test:update`
  3. Commit the updated snapshots in `tests/visual.spec.ts-snapshots/`

## Task tracking

Use `bd` for task tracking

## Landing the Plane (Session Completion)

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create tasks for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:

   ```bash
   git pull --rebase
   bd sync
   git push
   git status  # MUST show "up to date with origin"
   ```

5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**

- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
