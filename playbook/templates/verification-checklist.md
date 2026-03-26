# Agent Swarm Verification Checklist

**Purpose**: Run every test below before handing off to the client. If any test fails, fix it before proceeding. Do not skip tests — a failed handoff costs more time than a thorough verification.

**When to use**: After Phase 2 (Deploy) is complete, before Phase 3 (Handoff).

---

## 1. CLAUDE.md Validation

- [ ] All {{PLACEHOLDER}} fields replaced with real client values
- [ ] No remaining template syntax in the file
- [ ] Business name, address, service area are correct
- [ ] Tone/communication style matches discovery call notes
- [ ] Timezone is correct
- [ ] Contact email and phone are correct
- [ ] Hours of operation are correct
- [ ] Agent roster section lists only the agents enabled for this tier

**Test**: Ask Claude "Who are you and who do you work for?" — response should mention client name, industry, and services.

---

## 2. MCP Connection Tests

### Gmail
- [ ] Connected and authenticated
- [ ] **Test**: "Search my last 5 emails" — returns real results
- [ ] **Test**: "Draft an email to test@example.com saying hello" — draft created (do NOT send)
- [ ] Confirm correct account is connected (not Brad's personal email)

### Google Calendar
- [ ] Connected and authenticated
- [ ] **Test**: "What's on my calendar today?" — returns real events or confirms empty
- [ ] **Test**: "Create a test event tomorrow at 9am called 'Verification Test'" — event created
- [ ] Delete test event after verification

### Google Drive
- [ ] Connected and authenticated
- [ ] **Test**: "Search for a recent document" — returns results
- [ ] Confirm correct drive is connected (personal vs shared)

### Stripe (if applicable)
- [ ] Connected and authenticated
- [ ] **Test**: "List my recent invoices" — returns results
- [ ] Confirm TEST MODE vs LIVE MODE — warn client before live connection
- [ ] Verify API key has appropriate permission scope (read-only preferred for initial setup)

### Notion (if applicable)
- [ ] Connected and authenticated
- [ ] **Test**: "Search my Notion workspace" — returns results

**MCP Summary**: ___/5 connected | ___/5 verified

---

## 3. Agent Tests (Tier 1 — Self-Serve)

### Office Manager Agent
- [ ] **Test**: "Brief me on today" — returns calendar summary + email highlights
- [ ] **Test**: "Schedule a callback with John Smith tomorrow at 2pm" — creates calendar event
- [ ] Confirm agent uses correct tone and client name
- [ ] Confirm agent references correct business hours

### Customer Comms Agent
- [ ] **Test**: "Draft a reply to this customer inquiry: 'How much does a drain cleaning cost?'" — generates appropriate response
- [ ] **Test**: "Write a follow-up email thanking a customer for choosing us" — professional, on-brand
- [ ] Confirm pricing references match service catalog
- [ ] Confirm email tone matches brand voice

### Lead Qualifier Agent
- [ ] **Test**: "Score this lead: Emergency burst pipe at 123 Main St, homeowner, needs help ASAP" — should score HIGH priority
- [ ] **Test**: "Score this lead: Thinking about upgrading my water heater sometime next year" — should score LOW priority
- [ ] Confirm scoring criteria are reasonable
- [ ] Confirm service area check works (in-area vs out-of-area)

---

## 4. Agent Tests (Tier 2 — Managed, additional agents)

### Marketing Agent
- [ ] **Test**: "Write 3 social media posts for this week" — on-brand, relevant to season/services
- [ ] Confirm no competitor mentions or inappropriate claims

### Invoice & Estimate Agent
- [ ] **Test**: "Draft an estimate for a water heater replacement" — includes realistic pricing from catalog
- [ ] Confirm Stripe/QuickBooks connection works (if applicable)

### Dispatch Assistant Agent
- [ ] **Test**: "What does tomorrow's schedule look like? Any conflicts?" — reads calendar accurately
- [ ] Confirm double-booking detection works

### Review Manager Agent
- [ ] **Test**: "Draft a review request email for a customer who just had their AC serviced" — professional, not pushy
- [ ] **Test**: "Draft a response to this 2-star review: 'Took too long to arrive'" — empathetic, professional

### Competitor Scout Agent
- [ ] **Test**: "What are other plumbers in {{SERVICE_AREA}} charging for drain cleaning?" — returns web search results
- [ ] Confirm agent doesn't make claims it can't verify

---

## 5. Memory System Validation

- [ ] `memory/MEMORY.md` index file exists and links are correct
- [ ] `memory/client-profile.md` — all fields populated, accurate
- [ ] `memory/brand-voice.md` — tone matches discovery call
- [ ] `memory/service-catalog.md` — services and pricing are correct
- [ ] **Test**: "What services do we offer and what do they cost?" — should reference service catalog accurately

---

## 6. Skills Validation (if applicable)

- [ ] Each enabled skill references the correct client name (not Elev8 AI)
- [ ] **Test**: Run each skill once and verify output quality
- [ ] Confirm skill trigger phrases work as expected

---

## 7. Session Memory Test

- [ ] **Test**: End a session, start a new one, ask "What did we do last time?" — should reference session log
- [ ] Confirm session-log.md is being written to

---

## 8. Safety & Security

- [ ] No API keys or tokens visible in plaintext files
- [ ] No Brad credentials mixed with client credentials
- [ ] `.env` files are in `.gitignore`
- [ ] Client's Claude Code is logged into their own account (not Brad's)
- [ ] Confirm "always ask before sending" rule is working

---

## Sign-Off

| Item | Pass/Fail | Notes |
|------|-----------|-------|
| CLAUDE.md | | |
| MCP connections | | |
| Tier agents | | |
| Memory system | | |
| Skills | | |
| Session memory | | |
| Security | | |

**Verified by**: _______________
**Date**: _______________
**Tier**: Self-Serve / Managed
**Client**: _______________

**Result**: ☐ PASS — Ready for handoff | ☐ FAIL — Fix items above before proceeding
