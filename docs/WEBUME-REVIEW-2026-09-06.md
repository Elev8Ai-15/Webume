# Webume: concept review and executive refinement

Reviewed September 6, 2026. Base: `5c65208` on `Elev8Ai-15/Webume/main`.
These findings come from the repository and the supplied September 6 project notes. Production database contents and live user journeys were not inspected.

## The concept

Webume's core is a living professional record: one profile that develops with a person's career and can be shared in an application. The public portfolio is the product. The dashboard helps its owner maintain it.

The distinctive idea is the Career Tree. An employer becomes a chapter containing the role, scope, measurable results, supporting material, and people who worked with the candidate. This gives an employer more context than a flat resume without forcing them to read everything. The value depends on the quality and credibility of that evidence, not just presentation.

The September notes supersede the old blockchain and social-network descriptions in the repository's generic CLAUDE.md and early documents. The current direction is one design system; a free profile and public link; optional paid application tools; no signup wall on public profiles; and owner-approved testimonials. The latest handoff places full employer pages after Gate A.

My assessment: the existing relational Experience, Metric, Document, and Testimonial models support this direction well. The implementation remains an early portfolio product. The schema is ahead of the user experience: having document and testimonial tables does not mean the attachment, invitation, verification, or moderation workflows exist.

The practical priority is to make creating, reviewing, publishing, and sharing one truthful profile dependable. A beautiful profile is useful only when a recruiter can quickly establish who this person is, what they have done, and how to contact them.

## Interface changes in this branch

- Retained Career Ink: deep ink surfaces, lighter maroon accents, Fraunces headings, and Manrope body text. No gold palette or invented career claims.
- Widened the portfolio with an editorial introduction, portrait/initials treatment, restrained depth, and section navigation.
- Replaced dense job cards with numbered chapters. Role, company, dates, description, and metrics remain visible; responsibilities, company context, and day-in-the-role details expand on demand. The first chapter starts open. Native details/summary supports keyboard use without client-side state.
- Attributed headline metrics to their companies. Empty education and expertise containers no longer render.
- Rebuilt the dashboard around the owner's actual next step, a draft/published profile summary, real counts, and a short setup sequence.
- Added grouped desktop navigation and a mobile drawer with active-route state, keyboard focus handling, and a close control. Nested profile-edit routes retain the Profile selection.
- Added a skip link, clearer focus states, wrapping actions/contact links, responsive chapter spacing, and reduced-motion behavior.
- Restyled resume import, made replacement consequences explicit, and linked successful imports directly to the editor.
- Extended spacing, input, and card treatment through the shared app shell. The landing page's established composition remains; its general motion and focus behavior benefit from the shared changes.

This improves the current chapters. It does not claim to ship the full Career Tree: separate employer pages, per-job evidence uploads, and complete testimonial workflows remain future work.

## Confirmed issues and corrections

| Finding | Correction |
| --- | --- |
| No navigation below the desktop breakpoint | Added an accessible mobile drawer using the installed Sheet component |
| `npm ci` failed because two transitive lockfile entries were missing | Repaired only the missing entries; clean install now succeeds |
| New original resumes were saved to public Blob URLs even for private profiles | Parse source files in memory; do not create public copies of new resume uploads |
| Import silently replaced profile headers and all experience rows | Require explicit replacement confirmation on both the form and server action |
| Advertised 5 MB resumes / 10 MB photos exceeded Vercel's request limit; Next's default action limit was lower still | Use 4 MB files, client/server validation, and a 4.5 MB action request limit |
| Public visibility could be enabled without a usable profile | Validate a saved profile name and public URL before publishing; preserve the ability to make incomplete profiles private |
| Visibility and import changes did not invalidate the public path | Revalidate the affected public profile after changes |
| Legacy public endorsements did not have an owner-approval gate | Public page now reads only approved Testimonial records and selects no issuer email |
| Duplicate IDs could pass experience-reordering validation | Require a unique complete set of owned IDs |
| Generic profile patch action accepted malformed runtime data | Validate header patches with the existing schema |
| Clerk webhook verification reserialized the signed body | Verify the original request text |
| Concurrent first visits/webhooks could both attempt user creation | On a unique-constraint race, return the existing Clerk user's row before retrying a slug |
| Public slug race could surface a database exception | Return an actionable taken-slug message on P2002 |
| ATS keyword matching included JSON property names | Match actual candidate content instead; label the score as a heuristic, not a real ATS test |
| Tailoring instructions encouraged unsupported skills and metrics | Explicitly prohibit invented facts and treat job text as untrusted reference data; add input limits |
| Clipboard failure produced no recovery guidance | Catch failures and explain how to copy the public address manually |
| Settings URL depended on window during rendering | Use a stable relative preview to avoid server/client text mismatch |
| Database SSL regex contained a backspace character | Restore the intended word-boundary escape |
| Uploaded gallery values were cast to File without runtime validation | Require an actual File before processing |

Vercel's documented function body cap is 4.5 MB: https://vercel.com/docs/functions/limitations . The 4 MB file cap leaves room for multipart form overhead. Larger uploads would require a different upload design.

## Follow-up fixes authorized by “fix remaining issues”

- Stripe's signed webhook is reachable without Clerk login. It verifies the raw payload, retries failed synchronization, retrieves the current subscription instead of trusting delayed event snapshots, and serializes updates per owner. Active/trialing status is required for paid access. Scheduled cancellation preserves access until the subscription ends. Unknown prices grant no paid entitlement.
- Pricing presents Free and Pro only. Legacy enterprise subscriptions retain active entitlement but are not newly sold. Checkout requires configured keys and price, reuses existing customers, uses retry idempotency, and prevents checkout when a nonterminal subscription is already recorded. Billing Portal provides subscription management. No payments were made.
- Each saved career chapter has a dedicated public page and an authenticated owner preview. Pages verify profile visibility and chapter ownership; evidence queries also scope by owner and chapter.
- Owners can attach external document sharing links and associate gallery images with a chapter. Link protocols and chapter ownership are validated. Education, certifications, and achievements now have manual editors.
- Owners can generate a random, one-use, seven-day recommendation link and approve or keep responses private. Responses start pending, and public views select approved text without issuer email. Invitations do not independently verify the contributor's identity or employment. No invitation messages are sent automatically.
- Tailored resumes now render in a review screen with a copy option. Deterministic checks reject new employment history, unsupported qualifications, and new numeric claims within job prose. These checks do not establish semantic truth; the user must review the generated wording.

## Remaining runtime verification and product decisions

1. **Production proof is required.** Real signup → manual entry/import → edit → publish → anonymous view → unpublish has not been run in this environment. Repeat for chapter evidence, recommendation submission/moderation, paid PDF export, and Stripe's test-mode checkout/webhook/cancellation lifecycle before launch. Provider credentials and a runtime database are unavailable here.
2. **Previously public source files remain.** New imports no longer create public raw resume objects. Existing source URLs need a separate Blob-store inventory and cleanup; no stored files were deleted.
3. **AI cost policy remains open.** Input limits and paid tailoring gates exist, but durable per-user usage quotas do not. Select and implement a usage policy before broad acquisition.
4. **Files have their own sharing permissions.** Gallery images remain public Blob objects even when the portfolio is private. External document links remain governed by their host. These distinctions are disclosed in the editor. Removing a portfolio reference does not delete the underlying file.
5. **Import replacement detaches chapter relationships.** Replacing the work history creates new experience rows; existing evidence is preserved by the schema but no longer assigned to those deleted chapters. Review and reattach it after a replacement import.
6. **Pending checkout concurrency needs live testing.** The guard and idempotency key reduce duplicate checkout creation; they do not guarantee prevention across separate hourly retry windows before webhook persistence.

## Validation and delivery

- Clean dependency install passed after lockfile repair in the first pass.
- Final follow-up: `npx tsc --noEmit`, `npm run lint`, `npm test` (42 tests across nine files), and `git diff --check` passed.
- Tests cover profile assembly and HTML rendering, publishing guards, replacement consent, upload validation/privacy, owned ordering, slug races, paid status, signed Stripe events and retry failures, subscription synchronization, invitation replay/moderation, document ownership/protocol validation, and deterministic AI factual checks.
- Earlier `npx next build` completed compilation and TypeScript, then stopped during page-data collection because DATABASE_URL was missing. The migration-running build script was not invoked.
- A temporary browser preview could not start because its isolated runtime could not resolve dependencies. No screenshots or real responsive browser checks are claimed.
- No production database migrations, deployment, payment transactions, invitation sends, or stored-file deletions were performed.
- GitHub write connectivity is restored. Delivery targets `codex/webume-executive-refinement` and a draft pull request, preserving main for review and configured runtime checks.

## Next verification order

Review the branch, then prove one real profile on desktop and phone in a configured preview. Verify private/public transitions, career evidence and one-use recommendations. Exercise Stripe test-mode lifecycle events and review the cost policy before enabling paid acquisition. Preserve the free public link and anonymous recruiter access throughout.
