# Agent Guidelines for ubmit.dev

## Commands
- **Dev**: `npm run dev` (starts at localhost:4321)
- **Build**: `npm run build` (runs astro check + build)
- **Format**: `npm run format` (Prettier with Astro/Tailwind plugins)
- **Type Check**: `astro check`
- **No test suite** currently configured

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
