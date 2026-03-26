# Lega-C-Lok Master Plan: Audit Fixes + Manus Migration + AI Upgrades

**Date:** 2026-03-24
**Owner:** Brad / Elev8 AI Solutions & Services
**Status:** Ready for execution

---

## Current State Summary

### What Works
- Frontend renders (React 19 + Vite + Tailwind + Reown AppKit)
- Backend compiles and serves (Express + tRPC + Drizzle ORM)
- Build succeeds (Vite frontend + esbuild backend)
- TypeScript compiles clean (zero errors)
- 17/17 unit tests pass
- Mock vault service works for demo mode
- Wallet connection works (MetaMask, WalletConnect, etc.)
- All 23 prior audit issues fixed
- All 13 NEW security issues fixed (this session)

### What's Broken / Missing
1. **Manus OAuth** — Auth system depends on a dead platform
2. **Manus CDN** — All logos hosted on manuscdn.com (will go offline)
3. **Manus debug tooling** — vite-plugin-manus-runtime, debug-collector.js
4. **Manus LLM/notification APIs** — Forge API for AI + notifications
5. **Smart contracts not deployed** — App runs in demo mode only
6. **ZKP not integrated** — snarkjs/circom not wired up
7. **No production database** — needs MySQL provisioned
8. **Windows dev issues** — `NODE_ENV=development` syntax in npm scripts

---

## Execution Plan: 5 Phases

### PHASE 1: Stabilize & De-Manus (Week 1-2)
**Goal:** Remove all Manus dependencies, get app running independently

#### 1.1 Replace Manus OAuth with Clerk
**Why Clerk:** Native Vercel Marketplace, auto-provisioned env vars, pre-built UI, middleware auth
**Files to modify:**
- `server/_core/sdk.ts` — DELETE entirely (Manus SDK client)
- `server/_core/oauth.ts` — REWRITE for Clerk webhook/callback
- `server/_core/types/manusTypes.ts` — DELETE
- `server/_core/context.ts` — Update to use Clerk session
- `client/src/contexts/AuthContext.tsx` — Replace with Clerk `useUser()`/`useAuth()`
- `client/src/components/ManusDialog.tsx` — DELETE
- `client/src/pages/Login.tsx` — Replace with Clerk `<SignIn />`
- `client/src/pages/Register.tsx` — Replace with Clerk `<SignUp />`
- `client/src/_core/hooks/useAuth.ts` — Remove `manus-runtime-user-info` localStorage
- `drizzle/schema.ts` — Keep `openId` field, map to Clerk `userId`

**New packages:** `@clerk/clerk-react`, `@clerk/express`
**Remove packages:** (none to remove — Manus SDK is custom code, not a package)

#### 1.2 Remove Manus Debug Tooling
**Files to modify:**
- `vite.config.ts` — Remove `vitePluginManusRuntime()`, remove `vitePluginManusDebugCollector()`, remove `.manus*` allowedHosts
- `client/public/__manus__/` — DELETE entire directory
- `client/index.html` — Remove `<script src="/__manus__/debug-collector.js">`
- `package.json` — Remove `vite-plugin-manus-runtime` dependency

#### 1.3 Move Assets Off Manus CDN
**Files with manuscdn.com references:**
- `client/src/pages/Landing.tsx` — logo URL
- `client/src/pages/Login.tsx` — logo URL
- `client/src/pages/Register.tsx` — logo URL
- `client/src/pages/NotFound.tsx` — logo URL
- `client/src/components/DashboardLayout.tsx` — logo URL
- `client/src/lib/blockchain.ts` — metadata icon URL
- `client/index.html` — apple-touch-icon

**Action:** Download logos, store in `client/public/images/`, update all references to relative paths

#### 1.4 Replace Manus Forge API
**Files:**
- `server/_core/llm.ts` — Replace Forge API with Vercel AI Gateway (model strings)
- `server/_core/notification.ts` — Replace Manus notification with Resend email API
- `server/_core/env.ts` — Remove `forgeApiUrl`, `forgeApiKey`, add Clerk/Resend vars

#### 1.5 Fix Windows Development
**Files:**
- `package.json` — Add `cross-env` to dev scripts
  - `"dev": "cross-env NODE_ENV=development tsx watch server/_core/index.ts"`
  - `"start": "cross-env NODE_ENV=production node dist/index.js"`

**New dev dependency:** `cross-env`

#### 1.6 Provision Database
**Options (in order of preference):**
1. **Neon Postgres** (via Vercel Marketplace) — serverless, branching, auto-scaling
   - Requires migrating schema from MySQL to Postgres
   - Change `drizzle.config.ts` from `mysql2` to `@neondatabase/serverless`
2. **PlanetScale** (MySQL-compatible) — keep existing schema as-is
3. **Local MySQL** (Brad's existing setup) — use for now, migrate later

**Recommendation:** Use Brad's local MySQL NOW, plan Neon migration for Phase 3

---

### PHASE 2: Deploy Smart Contracts (Week 2-3)
**Goal:** Get the blockchain layer actually working on testnet

#### 2.1 Deploy to Polygon Amoy Testnet
**Prerequisites:**
- Deployer wallet with test POL (faucet: https://faucet.polygon.technology/)
- Hardhat project (separate repo: `digital-legacy-vault`)

**Contracts to deploy:**
1. `DigitalLegacyVaultV2.sol` — Main vault contract
2. `MockOracle.sol` — Chainlink oracle mock
3. `ZKPIdentityVerifier.sol` — ZKP verifier (placeholder)
4. `Groth16Verifier.sol` — Proof verification

**Post-deploy:**
- Update `CONTRACT_ADDRESSES` in `client/src/lib/blockchain.ts`
- Test full flow: create vault → check in → add guardian → set beneficiary

#### 2.2 Wire Up ZKP (Phase 2a — Placeholder)
- Install `snarkjs` and `circomlibjs`
- Replace keccak256 identity commitment with Poseidon hash
- Generate Groth16 proof for claim initiation
- Deploy `Groth16Verifier.sol` generated from circuit

**Note:** Full ZKP can be deferred — guardian-only claims work without it

---

### PHASE 3: Production Infrastructure (Week 3-4)
**Goal:** Deploy to Vercel, set up production services

#### 3.1 Vercel Deployment
- `vercel link` → connect to Vercel project
- Migrate from Express to Next.js App Router (or deploy Express as Vercel Function)
- Set up environment variables via `vercel env`
- Configure custom domain (legaclok.com or similar)

#### 3.2 Database Migration to Neon
- Migrate Drizzle schema from MySQL to Postgres
- Update `drizzle.config.ts` and `server/db.ts`
- Run migration on Neon via `drizzle-kit migrate`

#### 3.3 Production Auth (Clerk)
- `vercel integration add clerk`
- Configure sign-in/sign-up URLs
- Set up Clerk middleware

#### 3.4 Email Notifications (Resend)
- `vercel integration add resend`
- Set up transactional emails: vault alerts, claim notifications, guardian invites

---

### PHASE 4: AI Integration (Week 4-8)
**Goal:** Add AI-powered features that differentiate Lega-C-Lok

#### 4.1 Estate Planning AI Advisor (HIGH IMPACT, EASY)
**What:** Conversational AI that guides users through estate planning
**Tech:** Vercel AI SDK v6 + AI Gateway + RAG over legal knowledge base
**Implementation:**
- New route: `POST /api/chat` (streamText with AI Gateway)
- Frontend: `useChat` + AI Elements for chat UI
- Knowledge base: State probate laws, RUFADAA, estate planning guides
- Vector store: Pinecone or Upstash Vector
**Feasibility: 5/5 | Impact: 5/5**

#### 4.2 Legal Document Processing (HIGH IMPACT, MEDIUM)
**What:** Upload wills, trusts, death certificates — AI extracts key data
**Tech:** Gemini via AI Gateway (native PDF/document understanding)
**Implementation:**
- Upload endpoint (Vercel Blob for file storage)
- AI extraction: beneficiaries, executors, asset lists, conditions
- Auto-populate vault configuration from extracted will data
**Feasibility: 5/5 | Impact: 5/5**

#### 4.3 Voice/Video Legacy Messages (HIGH IMPACT, EASY)
**What:** Record voice/video messages for beneficiaries, create AI voice clones
**Tech:** ElevenLabs API (voice cloning) + HeyGen API (video avatars)
**Implementation:**
- New "Legacy Messages" page in dashboard
- Record voice/video, store encrypted on IPFS via CID
- Optional: Create AI voice clone from recordings
- Beneficiaries can play messages after claim is released
**Feasibility: 5/5 | Impact: 5/5 | Emotional differentiator**

#### 4.4 Identity Verification for Claims (CRITICAL, MEDIUM)
**What:** Biometric liveness check when beneficiary initiates a claim
**Tech:** Veriff or iProov API
**Implementation:**
- Embed verification SDK in ClaimFlow.tsx step 1
- Server-side webhook validates verification result
- Store verification ID in claims table
**Feasibility: 4/5 | Impact: 5/5**

#### 4.5 Social Media Death Management (HIGH IMPACT, HARD)
**What:** Automated memorialization/deletion requests across platforms
**Tech:** Custom API integrations per platform
**Implementation:**
- Dashboard section: "Digital Accounts" — list all accounts
- For each platform, show death policy and required actions
- Auto-generate memorialization request forms
- Track status of each request
- Platforms with APIs: Facebook Graph API (memorialization), Google Inactive Account Manager
- Platforms without APIs: Generate pre-filled PDF forms for manual submission
**Feasibility: 3/5 | Impact: 5/5**

#### 4.6 Will-to-Smart-Contract AI Translation (THE MOAT)
**What:** AI reads a will document and auto-configures the vault
**Tech:** Gemini structured output + smart contract parameter mapping
**Implementation:**
- Upload will → AI extracts: beneficiaries, conditions, distribution %
- Map to vault params: guardianThreshold, checkInInterval, beneficiary addresses
- Preview screen: "Here's what your smart contract will do"
- One-click deploy to Polygon
**Feasibility: 3/5 | Impact: 5/5 | ZERO competitors have this**

#### 4.7 Digital Footprint Discovery (MEDIUM IMPACT, HARD)
**What:** Auto-discover all of a person's online accounts
**Tech:** Mine/SayMine API + email header scanning
**Implementation:**
- Connect email account (OAuth)
- Scan for account creation/verification emails
- Build list of discovered accounts
- User confirms and adds to vault
**Feasibility: 2/5 | Impact: 4/5**

---

### PHASE 5: Webume Integration (Week 8-10)
**Goal:** Connect Lega-C-Lok's blockchain verification to Webume

#### 5.1 Shared Verification API
- Expose verified identity endpoint from Lega-C-Lok
- Webume consumes: "This person's identity is blockchain-verified"
- On-chain proof of credential authenticity

#### 5.2 Legacy Portfolio Page
- Public memorial page backed by vault data
- Displays: verified identity, legacy messages, digital footprint
- Accessible via Legacy Passport lifetime token

#### 5.3 Death Notification Bridge
- When vault status changes to "claimed" → notify Webume
- Auto-update profile status
- Display memorial badge

---

## Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Manus CDN goes offline (logos break) | HIGH | HIGH | Phase 1.3 — move assets immediately |
| Smart contract bugs on mainnet | MEDIUM | CRITICAL | Testnet-only until audited |
| Legal AI gives wrong advice | HIGH | HIGH | Mandatory disclaimers, citation-backed RAG |
| ZKP integration complexity | MEDIUM | MEDIUM | Guardian-only claims work as fallback |
| Voice cloning ethics/legal issues | LOW | MEDIUM | Explicit user consent, terms of service |
| Database migration data loss | LOW | HIGH | Backup before migration, test on branch |

---

## Dependency Order (Critical Path)

```
Phase 1.2 (Remove Manus debug) ──┐
Phase 1.3 (Move assets)         ──┤
Phase 1.5 (Fix Windows)         ──┼── Can run in parallel
Phase 1.4 (Replace Forge API)   ──┘
                                   │
Phase 1.1 (Replace OAuth) ────────┤── Depends on nothing
Phase 1.6 (Database) ─────────────┘
                                   │
Phase 2.1 (Deploy contracts) ─────┤── Depends on Phase 1 complete
Phase 2.2 (Wire ZKP) ─────────────┘
                                   │
Phase 3 (Production infra) ───────── Depends on Phase 1 + 2
                                   │
Phase 4.1 (AI advisor) ───────────┐
Phase 4.2 (Doc processing) ──────┤
Phase 4.3 (Voice/video) ─────────┼── Can run in parallel after Phase 3
Phase 4.4 (Identity verification) ┤
Phase 4.5 (Social media) ────────┘
                                   │
Phase 4.6 (Will-to-contract) ────── Depends on Phase 2 + 4.2
Phase 4.7 (Footprint discovery) ─── Independent, can start anytime
                                   │
Phase 5 (Webume integration) ────── Depends on Phase 3 + 4
```

---

## Immediate Next Steps (This Week)

1. **TODAY:** Download logos from manuscdn.com before they disappear
2. **TODAY:** Remove Manus debug tooling (Phase 1.2) — zero risk, pure cleanup
3. **THIS WEEK:** Replace Manus OAuth with Clerk (Phase 1.1) — biggest blocker
4. **THIS WEEK:** Fix Windows dev scripts with cross-env (Phase 1.5)
5. **Brad to provide:** MySQL connection info for Phase 1.6
6. **Decision needed:** Domain name for production deployment
