# Webume — HANDOFF (rolling)

## 1. State (2026-09-05)
LIVE at https://webume-bradgpowell1123-2659s-projects.vercel.app (public, Vercel Authentication OFF). Gate A shipped. Plan of record = `dev/my-assistant/notes/webume-build/07-vision-plan-v2-2026-09-05.md`. PDR §5 locked rules still govern.

## 2. Infra
- Vercel project `webume`, team `bradgpowell1123-2659s-projects`, GitHub-linked to `Elev8Ai-15/Webume` main (push = deploy).
- DB: Neon free via Vercel Marketplace, resource `webume` (env auto-injected). Migrations run in the build script.
- Blob store `webume` (store_X1RD8tnhvUaKNEth). Clerk app "Webume" (test instance keys). AI = Claude Opus 5 via `@ai-sdk/anthropic@3` (pinned to match `ai@6`).
- Env set on Production: DATABASE_URL (+Neon set), BLOB_READ_WRITE_TOKEN, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, ANTHROPIC_API_KEY, NEXT_PUBLIC_APP_URL. NOT set: CLERK_WEBHOOK_SECRET, STRIPE_*.

## 3. Done this session
- Pushed the July Gate A commits; provider swap Gemini → Claude; truth-rails parse prompt (no estimating); `ensureUser` in `(app)/layout.tsx` creates the DB row from Clerk on first visit (webhook optional); `createUserFromClerk` shared with the webhook; build = `prisma generate && prisma migrate deploy && next build`; DEPLOY.md.

## 4. Evidence
- L4: `curl /` → 200 with "Never rebuild your resume again"; `/sign-up` → 200; `/p/nobody-here` → 404 (DB lookup path live). Build log: "Generated Prisma Client (7.6.0)", "No pending migrations to apply".
- NOT yet proven: real signup → dashboard → publish → public profile. That is Brad's founding-profile run.

## 5. Gotchas
- Vercel Authentication had to be turned OFF (free plan has no preview-only option; Standard blocks all *.vercel.app URLs). Previews are public too.
- `.env.local` is gitignored and holds Brad's keys; Abe is blocked from writing/reading secrets across projects. Keys reach Vercel via `vercel env add` from stdin.
- Clerk keys are pk_test/sk_test (dev instance). Fine on vercel.app; a production Clerk instance is needed once webume.com exists.
- The MCP Vercel token cannot change project settings (403); the CLI token can, but changing protection is Brad-only.

## 6. Next
1. Brad signs up, builds profile (manual or PDF upload), publishes, opens `/p/<slug>` on his phone. Fix whatever he hits.
2. Register Clerk webhook (`/api/webhooks/clerk`, user.updated/deleted) + set CLERK_WEBHOOK_SECRET. Not urgent: ensureUser covers create.
3. Then Vision Plan v2 §4: A-prove (10 profiles) → Gate B Career Tree.

## 7. Blocked on Brad
- Founding profile run (above). Career Tree section pick (4 vs 8). OK the §5 deletion list in the vision plan. 10 names.
