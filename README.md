# Cardora Admin

Next.js (App Router, TypeScript, Tailwind v4) admin console.

## Getting started

```bash
nvm use            # Node 24 (.nvmrc)
cp .env.example .env.local
npm install
npm run dev
```

## Scripts

| Script                            | Purpose                              |
| --------------------------------- | ------------------------------------ |
| `npm run dev` / `build` / `start` | Develop / production build / serve   |
| `npm run typecheck`               | Generate route types + `tsc`         |
| `npm run lint` / `lint:fix`       | ESLint (Next + TS + Prettier compat) |
| `npm run format` / `format:check` | Prettier                             |
| `npm test`                        | Vitest + Testing Library             |

## Structure

```
src/
  app/            Routes only. (auth) and (dashboard) are route groups
  components/
    ui/           Generic, reusable primitives (buttons, inputs…)
    layout/       App shell pieces (sidebar, header)
  features/       One folder per domain (e.g. cards/, users/): components, actions, queries, types
  hooks/          Shared client hooks
  services/       Server-side data access / external API clients
  lib/            env.ts (zod-validated env), utils.ts
  config/         Static site/nav config
  types/          Cross-feature types
  test/           Vitest setup
```

Conventions: import via `@/*`; read config only through `@/lib/env`; keep feature code
inside `features/<name>` and expose it to `app/` routes.

## Production

- `output: "standalone"` + multi-stage `Dockerfile` (non-root user, port 3000).
- Security headers set in `next.config.ts`; `X-Powered-By` disabled.
- CI (`.github/workflows/ci.yml`): format, lint, typecheck, test, build.
- Cache Components is enabled (Next 16): data is dynamic by default; opt in to caching with `use cache`.
