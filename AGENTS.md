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

- **Visual Regression**: Automated in CI on every push/PR
- **Snapshots**: Platform-specific (chromium-darwin for local, chromium-linux for CI)
- **CI Jobs**: lint-and-format, type-check, build, visual-regression (run in parallel)
- **Failure Artifacts**: Test reports and diff images uploaded on visual test failures
- **Snapshot Updates**: Run `pnpm run test:update` locally after intentional UI changes, commit updated snapshots
