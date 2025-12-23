# ubmit.dev

## 🚀 Project Structure

```text
├── public/
├── src/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                    | Action                                           |
| :------------------------- | :----------------------------------------------- |
| `pnpm install`             | Installs dependencies                            |
| `pnpm run dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm run build`           | Build your production site to `./dist/`          |
| `pnpm run preview`         | Preview your build locally, before deploying     |
| `pnpm run format`          | Format code with Prettier                        |
| `pnpm run format:check`    | Check code formatting without modifying files    |
| `pnpm run test`            | Run visual regression tests with Playwright      |
| `pnpm run test:ui`         | Run tests in interactive UI mode                 |
| `pnpm run test:update`     | Update visual regression snapshots               |
| `pnpm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm run astro -- --help` | Get help using the Astro CLI                     |

## 🧪 Visual Regression Testing

This project uses Playwright for visual regression testing to ensure UI consistency. Tests are run manually before deploys.

### Running Tests

```sh
# Build site first (tests run against built output)
pnpm run build

# Run visual regression tests
pnpm run test

# Run tests in interactive UI mode
pnpm run test:ui

# Update snapshots after intentional UI changes
pnpm run test:update
```

### Updating Snapshots

After making intentional UI changes:

1. Run `pnpm run build`
2. Run `pnpm run test:update`
3. Commit the updated snapshots in `tests/visual.spec.ts-snapshots/`
