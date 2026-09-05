# Webume

**Never rebuild your resume again.** Webume turns a resume into a living career profile: build it once, update it forever, share it as a link in any job application.

Canonical product decisions live in the PDR (`dev/my-assistant/notes/webume-build/00-PDR-canonical.md` on Brad's machine). Read §5 locked rules before changing product behavior. Headlines: NOT social media (no feed/posts/likes), public profiles have no signup wall, users own and can delete their data, employer-side AI is decision-support only.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 + shadcn/ui · Prisma 7 + Neon Postgres · Clerk (auth) · Vercel Blob (uploads) · Stripe (subscriptions) · Claude Opus 5 via `@ai-sdk/anthropic` (resume parsing, tailoring)

## Architecture notes

- **Experiences are relational rows** (`Experience`, `ExperienceMetric`, `Document`, `MediaAsset.experienceId`), not JSON — so media/metrics/testimonials attach per-job and future employer search can query them. Header data (basics, skills, education, achievements, certifications) stays in `User.profileData` JSON. `src/lib/profile/profile.service.ts` assembles the combined `ProfileData` shape all renderers consume.
- **Testimonial model is W3C Verifiable-Credential-shaped** (issuer / subject / claims / `vcJwt` signature slot) per PDR amendment A7. UI ships at Gate C; the shape is locked now.
- Server actions follow the `ActionState` pattern: Clerk `auth()` check first, zod validation, `revalidatePath` after writes.

## Setup

```bash
npm install
cp .env.example .env.local   # fill in real values
npx prisma generate
npx prisma migrate deploy    # or: npx prisma db push (dev)
npm run dev
```

If the database predates `prisma/migrations/0001_init` (it was managed with `db push`), baseline it once instead of running deploy blindly:

```bash
npx prisma migrate resolve --applied 0001_init
```

## Verify

```bash
npx tsc --noEmit
npm test        # vitest — pure-function checks (profile assembly)
npm run build
```

## Webhooks (production)

- Clerk → `/api/webhooks/clerk` (svix-signed, `CLERK_WEBHOOK_SECRET`)
- Stripe → `/api/stripe/webhook` (`STRIPE_WEBHOOK_SECRET`)
