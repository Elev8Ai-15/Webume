# Webume — DEPLOY

Vercel project `webume` (team `bradgpowell1123-2659s-projects`), GitHub-linked to `Elev8Ai-15/Webume` `main`. Push to `main` = production deploy. Manual: `vercel --prod --cwd C:/Users/bradg/dev/Webume`.

## Env (Production)

| Key | Source | Status |
|---|---|---|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store `webume` (store_X1RD8tnhvUaKNEth), auto-injected | set 2026-09-05 |
| `DATABASE_URL` | Postgres (Neon via Vercel Marketplace or Supabase) | pending |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Clerk app "Webume", dashboard.clerk.com → API Keys | pending (Brad) |
| `CLERK_WEBHOOK_SECRET` | Clerk → Webhooks → endpoint `https://<prod-url>/api/webhooks/clerk`, event `user.created`/`user.updated`/`user.deleted` | after first deploy |
| `ANTHROPIC_API_KEY` | shared Anthropic org (same key ResolveAI uses) | Abe sets |
| `NEXT_PUBLIC_APP_URL` | production URL, no trailing slash | after first deploy |
| `STRIPE_*` | not needed until Pro checkout ships | skip |

Add with `vercel env add <KEY> production --cwd C:/Users/bradg/dev/Webume` (value from stdin, never on the command line).

## Database

First time: `npx prisma migrate deploy` from the repo with `DATABASE_URL` in `.env.local`. Migration `0001_init` creates everything.

## Build

`next build`. Prisma client is committed under `src/generated/prisma`; regenerate with `npx prisma generate` after any schema change.

## L4 check (real request, after deploy)

1. Open `https://<prod-url>/` — landing page renders.
2. Sign up → dashboard loads (proves Clerk + DB).
3. Publish profile → open `https://<prod-url>/p/<slug>` logged out on a phone.
4. `vercel logs <deployment-url>` shows the `/p/<slug>` request.

## Rollback

Vercel dashboard → Deployments → previous → Promote to Production.
