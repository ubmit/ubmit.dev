# ubmit.dev Agent Guide

This app was scaffolded with `remix new`. Use these conventions when continuing to build it out.

## Commands

Use `vp` (Vite+) for all project interactions instead of calling `npm`, `pnpm`, `yarn`, or `npx` directly.

### Development

```sh
vp install          # install dependencies
vp dev              # start the dev server
vp check            # run format, lint, and type checks together
vp lint             # run linting
vp fmt              # run formatting
vp test             # run tests
```

### Running scripts

```sh
vp run <script>     # run a package.json script (e.g., vp run start, vp run typecheck)
```

### Dependencies

```sh
vp add <pkg>        # add a dependency
vp add -D <pkg>     # add a dev dependency
vp remove <pkg>     # remove a dependency
vp update           # update dependencies
vp outdated         # list outdated dependencies
vp dedupe           # deduplicate dependencies
vp why <pkg>        # show why a package is installed
vp info <pkg>       # show package info
```

### Other `vp` commands

```sh
vp exec <bin>       # run a local project binary
vp dlx <pkg>        # download and run a package binary without adding it as a dependency
vp build            # build for production
vp preview          # preview the production build locally
vp cache clean      # clear task cache entries
```

### Package manager passthrough

If you need a package manager command that `vp` does not wrap directly:

```sh
vp pm <command>     # call the underlying package manager directly
```

## Building Features

Refer to ./agents/skills/remix/SKILL.md

## Starter Layout

- `app/controllers/home.tsx` owns the home page
- `app/controllers/auth.tsx` owns the auth page
- `app/routes.ts` defines the route contract
- `app/router.ts` wires routes to route handlers
- `app/ui/` holds the shared document and layout wrappers
- `app/utils/render.tsx` centralizes HTML response rendering

## Route Ownership

- Start from `app/routes.ts` and map each route to the narrowest owner on disk.
- Keep simple pages in flat files like `app/controllers/home.tsx` and `app/controllers/auth.tsx`.
- Promote a route into a controller folder with `controller.tsx` only when it gains nested routes, multiple actions, or route-owned modules.
- Keep route-owned page modules next to the route that owns them.
- Move shared UI to `app/ui/`, not `app/controllers/`.

## Build-Out Notes

- This starter intentionally begins small; add directories like `app/data/`, `app/middleware/`, `public/`, and `test/` only when you need them.
- Prefer putting code in the narrowest owner before introducing shared modules.
- Avoid generic dumping-ground directories like `app/lib/` or `app/components/`.
