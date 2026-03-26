# Lega-C-Lok — Next Session Quick Start

## First thing to say in new chat:
```
Read my session log at ~/Documents/my-assistant/notes/session-log.md and the quickstart at ~/Documents/my-assistant/notes/legaclok-next-session-quickstart.md — then continue where we left off on Lega-C-Lok.
```

## What Brad needs to do BEFORE next session:
1. **Unpause Supabase project**: Go to https://supabase.com/dashboard → `supabase-orange-apple` → click "Restore project"
2. **Note the Supabase password** (set when project was created — try `15Maholes$`)

## What Claude does next:
1. Update `.env` DATABASE_URL to Supabase connection string
2. Push Drizzle schema to Supabase cloud DB
3. Create Vercel serverless config (`vercel.json` + `api/index.ts`)
4. Set Vercel env vars and deploy
5. Run LockUp security scan on the deployed app
6. Then: deploy smart contracts to Polygon Amoy testnet

## Current state:
- All code is committed and pushed to GitHub: https://github.com/Elev8Ai-15/Lega-C-Lok
- Latest commit: `8b1870f` — full platform overhaul
- 44 tests passing (17 server + 27 contract)
- Build succeeds
- App works locally on localhost:3000
- `serverless-http` already installed for Vercel deployment
- Everything is ready — just needs cloud DB + deploy
