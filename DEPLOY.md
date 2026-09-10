# Careerory — DEPLOY

Vercel project `webume` (team `bradgpowell1123-2659s-projects`), GitHub-linked to `Elev8Ai-15/Webume` `main`. Push to `main` = production deploy. Manual: `vercel --prod --cwd C:/Users/bradg/dev/Webume`.

## Env (Production)

| Key | Source | Status |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store `webume` (store_X1RD8tnhvUaKNEth), auto-injected | set 2026-09-05 |
| `DATABASE_URL` | Neon via Vercel Marketplace, resource `webume`, auto-injected | set 2026-09-05 |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk app "Careerory", dashboard.clerk.com → API Keys | set 2026-09-05 |
| `CLERK_WEBHOOK_SECRET` | Clerk → Webhooks → endpoint `https://<prod-url>/api/webhooks/clerk`, event `user.created`/`user.updated`/`user.deleted` | after first deploy |
| `ANTHROPIC_API_KEY` | shared Anthropic org | set 2026-09-05 |
| `NEXT_PUBLIC_APP_URL` | https://webume-bradgpowell1123-2659s-projects.vercel.app | set 2026-09-05 |
| `STRIPE_*` | not needed until Pro checkout ships | skip |

Add with `vercel env add <KEY> production --cwd C:/Users/bradg/dev/Webume` (value from stdin, never on the command line).

## Database

Migrations run automatically on every Vercel build (`build` script = `prisma generate && prisma migrate deploy && next build`; the generated client is gitignored). No local DB access needed.

## Build

`next build`. Prisma client is gitignored and generated at build time.

## L4 check (real request, after deploy)

1. Open `https://<prod-url>/` — landing page renders.
2. Sign up → dashboard loads (proves Clerk + DB).
3. Publish profile → open `https://<prod-url>/p/<slug>` logged out on a phone.
4. `vercel logs <deployment-url>` shows the `/p/<slug>` request.

## Access

Vercel Authentication is OFF for this project (free plan has no preview-only mode; Standard blocks every *.vercel.app URL). Production URL: https://webume-bradgpowell1123-2659s-projects.vercel.app

## Rollback

Vercel dashboard → Deployments → previous → Promote to Production.
