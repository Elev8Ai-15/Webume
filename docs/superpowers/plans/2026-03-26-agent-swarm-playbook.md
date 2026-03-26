# Agent Swarm Service Playbook — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the deployable playbook that lets Brad install a customized AI agent swarm for a home services client in under 6 hours.

**Architecture:** Templatize the existing `ai-agent-swarm` repo into a client-ready package. Add a `playbook/` directory with templates, checklists, and onboarding materials. The first vertical is home services.

**Spec:** `docs/superpowers/specs/2026-03-26-agent-swarm-service-design.md`

---

## File Structure

```
playbook/
├── README.md                          # How to use this playbook (Brad's guide)
├── pre-deployment-checklist.md        # What to confirm before starting
├── templates/
│   ├── CLAUDE.md.template             # Parameterized master config
│   ├── agent-roster-starter.md        # 3-agent roster for Self-serve tier
│   ├── agent-roster-managed.md        # 8-agent roster for Managed tier
│   ├── memory/
│   │   ├── user_client.md.template    # Client profile memory seed
│   │   ├── reference_brand_voice.md.template  # Brand voice memory seed
│   │   └── reference_services.md.template     # Service catalog memory seed
│   └── skills/
│       ├── content-strategist/SKILL.md.template
│       ├── linkedin-writer/SKILL.md.template
│       ├── social-media-writer/SKILL.md.template
│       ├── lead-qualifier/SKILL.md.template
│       └── proposal-writer/SKILL.md.template
├── mcp-connection-guide.md            # Step-by-step MCP setup for each service
├── verification-checklist.md          # Test every agent before handoff
├── client-onboarding-doc.md           # What the client gets (their copy)
├── contract-template.md               # Scope, disclaimer, SLA, pricing
└── industries/
    └── home-services/
        ├── CLAUDE.md.example          # Filled-in example for a plumber
        ├── agent-customizations.md    # Industry-specific agent tweaks
        └── mcp-notes.md              # Which MCPs matter most for this vertical
```

---

### Task 1: Playbook README — Brad's Deployment Guide

**Files:**
- Create: `playbook/README.md`

- [ ] **Step 1: Write the playbook README**

The master guide Brad follows for every client install. References all other files. Covers:
- Prerequisites (what Brad needs before starting)
- Step-by-step deployment flow (mirrors spec Section 4)
- Links to each template and checklist
- Time estimates per phase
- Troubleshooting tips

- [ ] **Step 2: Verify README references all playbook files**

Check every file in the playbook/ directory is linked from the README.

- [ ] **Step 3: Commit**

```bash
git add playbook/README.md
git commit -m "Add playbook README — master deployment guide"
```

---

### Task 2: Pre-Deployment Checklist

**Files:**
- Create: `playbook/pre-deployment-checklist.md`

- [ ] **Step 1: Write the pre-deployment checklist**

Everything Brad confirms BEFORE starting a client install:
- [ ] Client signed contract and paid setup fee
- [ ] Tier confirmed (Self-serve or Managed)
- [ ] Client's business info collected (name, address, services, hours, service area, tone)
- [ ] Client's tool access confirmed (Gmail, GCal, Drive, etc.)
- [ ] OAuth app passwords / tokens created (NOT raw passwords)
- [ ] Client has Claude Max subscription (Self-serve only)
- [ ] Client machine meets minimum specs (Self-serve only): modern Windows/Mac, 8GB RAM, internet
- [ ] Claude Code installed on client machine (Self-serve only)

- [ ] **Step 2: Commit**

```bash
git add playbook/pre-deployment-checklist.md
git commit -m "Add pre-deployment checklist"
```

---

### Task 3: CLAUDE.md Template

**Files:**
- Create: `playbook/templates/CLAUDE.md.template`

- [ ] **Step 1: Write the parameterized CLAUDE.md template**

Based on Brad's own CLAUDE.md but with `{{PLACEHOLDER}}` fields:
- `{{CLIENT_NAME}}` — business name
- `{{CLIENT_CONTACT}}` — owner name and email
- `{{CLIENT_LOCATION}}` — city, state
- `{{CLIENT_TIMEZONE}}` — timezone string
- `{{CLIENT_INDUSTRY}}` — industry vertical
- `{{CLIENT_SERVICES}}` — list of services offered with pricing
- `{{CLIENT_HOURS}}` — business hours
- `{{CLIENT_TONE}}` — communication style description
- `{{CLIENT_EMAIL}}` — primary email address
- `{{TIER}}` — Self-serve or Managed

Include all standard sections: Who I Am, Communication Rules, What I Help With, Important Rules, Operating Rules, Session Memory.

- [ ] **Step 2: Verify all placeholders are documented**

Every `{{PLACEHOLDER}}` must be listed in the pre-deployment checklist as information to collect.

- [ ] **Step 3: Commit**

```bash
git add playbook/templates/CLAUDE.md.template
git commit -m "Add parameterized CLAUDE.md template"
```

---

### Task 4: Agent Roster Templates (Starter + Managed)

**Files:**
- Create: `playbook/templates/agent-roster-starter.md`
- Create: `playbook/templates/agent-roster-managed.md`

- [ ] **Step 1: Write Starter roster (3 agents)**

Based on spec Section 3 — Home Services Starter:
1. Office Manager Agent — daily briefing, scheduling, calendar
2. Customer Comms Agent — inquiry responses, follow-ups, review responses
3. Lead Qualifier Agent — score inquiries, prioritize jobs

Each agent entry includes: role description, tools needed, output format, example prompt, MCP dependencies.

- [ ] **Step 2: Write Managed roster (8 agents)**

All 3 Starter agents plus:
4. Marketing Agent — social posts, seasonal promotions, Google Business
5. Invoice & Estimate Agent — draft estimates, follow up unpaid invoices
6. Dispatch Assistant — optimize schedule, flag double-bookings
7. Review Manager Agent — request reviews, respond to negative reviews
8. Competitor Scout — monitor local competitor pricing

Same format as Starter. Mark which agents are Managed-only.

- [ ] **Step 3: Commit**

```bash
git add playbook/templates/agent-roster-starter.md playbook/templates/agent-roster-managed.md
git commit -m "Add agent roster templates for Starter and Managed tiers"
```

---

### Task 5: Memory System Seed Templates

**Files:**
- Create: `playbook/templates/memory/user_client.md.template`
- Create: `playbook/templates/memory/reference_brand_voice.md.template`
- Create: `playbook/templates/memory/reference_services.md.template`

- [ ] **Step 1: Write client profile memory template**

Based on Brad's `user_brad.md` but parameterized:
- Client name, role, business, location
- Communication preferences (collected during discovery)
- Technical comfort level

- [ ] **Step 2: Write brand voice memory template**

Based on Brad's `reference_brand_voice.md` but parameterized:
- `{{CLIENT_TONE}}` — e.g., "friendly, professional, blue-collar approachable"
- Platform-specific guidelines
- Do/don't lists

- [ ] **Step 3: Write service catalog memory template**

Based on Brad's `reference_service_catalog.md` but parameterized:
- `{{CLIENT_SERVICES}}` — list of services with pricing
- `{{CLIENT_SERVICE_AREA}}` — geographic coverage
- `{{CLIENT_HOURS}}` — availability

- [ ] **Step 4: Commit**

```bash
git add playbook/templates/memory/
git commit -m "Add memory system seed templates"
```

---

### Task 6: Skills Templates

**Files:**
- Create: `playbook/templates/skills/content-strategist/SKILL.md.template`
- Create: `playbook/templates/skills/linkedin-writer/SKILL.md.template`
- Create: `playbook/templates/skills/social-media-writer/SKILL.md.template`
- Create: `playbook/templates/skills/lead-qualifier/SKILL.md.template`
- Create: `playbook/templates/skills/proposal-writer/SKILL.md.template`

- [ ] **Step 1: Templatize each of the 5 existing skills**

Copy from `.claude/skills/` and replace Elev8 AI-specific references with `{{PLACEHOLDER}}` fields:
- `{{CLIENT_NAME}}` for business name
- `{{CLIENT_SERVICES}}` for service catalog references
- `{{CLIENT_TONE}}` for voice/tone
- `{{CLIENT_HASHTAGS}}` for social media hashtags
- `{{CLIENT_CALENDLY}}` or `{{CLIENT_BOOKING_URL}}` for CTAs

Each template must be a working SKILL.md once placeholders are filled.

- [ ] **Step 2: Verify each template has valid SKILL.md frontmatter**

Check: name, description, metadata (bashPattern, filePattern, priority) are all present and correct.

- [ ] **Step 3: Commit**

```bash
git add playbook/templates/skills/
git commit -m "Add templatized skill files for client deployment"
```

---

### Task 7: MCP Connection Guide

**Files:**
- Create: `playbook/mcp-connection-guide.md`

- [ ] **Step 1: Write step-by-step MCP setup guide**

For each MCP server a client might need:
- **Gmail**: How to create OAuth app password, configure MCP server, test connection
- **Google Calendar**: Same pattern
- **Google Drive**: Same pattern
- **Stripe**: API key setup, webhook configuration
- **QuickBooks**: OAuth setup, invoice access (more common than Stripe for home services)
- **Notion**: Integration token, workspace connection

Include "what to do when it breaks" for each MCP: token refresh procedure, common errors, how to test if the connection is still alive.

Each entry includes: prerequisites, step-by-step commands, how to verify it works, common errors and fixes.

- [ ] **Step 2: Commit**

```bash
git add playbook/mcp-connection-guide.md
git commit -m "Add MCP connection guide for client deployments"
```

---

### Task 8: Verification Checklist

**Files:**
- Create: `playbook/verification-checklist.md`

- [ ] **Step 1: Write the verification checklist**

Tests Brad runs before handoff to confirm everything works:
- [ ] CLAUDE.md loads correctly (start Claude Code, verify greeting/context)
- [ ] Each agent responds to a test prompt correctly
- [ ] Each skill triggers when invoked (e.g., `/content-strategist`)
- [ ] Memory files load (check session context)
- [ ] Gmail MCP: can read recent emails
- [ ] GCal MCP: can list today's events
- [ ] Drive MCP: can search files
- [ ] Session log hook works (stop and check notes/session-log.md)
- [ ] Sensitive file write blocker works (attempt .env write, verify block)

Each test includes: what to do, expected result, what to fix if it fails.

- [ ] **Step 2: Commit**

```bash
git add playbook/verification-checklist.md
git commit -m "Add verification checklist for client deployments"
```

---

### Task 9: Client Onboarding Document

**Files:**
- Create: `playbook/client-onboarding-doc.md`

- [ ] **Step 1: Write the client-facing onboarding doc**

This is what the CLIENT gets. Written in plain, non-technical language:
- What is an AI agent swarm? (2-3 sentence explanation)
- What your agents do (list with simple descriptions)
- How to talk to your agents (example prompts for common tasks)
- What to expect (agents draft, you approve. They don't act autonomously.)
- What's included in your monthly plan
- What's NOT included (from spec: no custom dev, no hardware/IT, no social account management, no guaranteed results)
- How to get support (email Brad, response time per tier)
- Important: AI outputs are drafts/recommendations — always review before acting

- [ ] **Step 2: Commit**

```bash
git add playbook/client-onboarding-doc.md
git commit -m "Add client onboarding document"
```

---

### Task 10: Contract Template

**Files:**
- Create: `playbook/contract-template.md`

- [ ] **Step 1: Write the contract template**

Based on spec Section 5. Includes:
- Parties (Elev8 AI Solutions & Services + Client)
- Scope of work (tier, agents, MCP connections — fill per client)
- Client responsibilities
- AI output disclaimer (critical — all decisions are client's responsibility)
- Data handling and privacy (local deployment, NDA for Managed)
- Credential security protocol (OAuth, encrypted storage, breach notification)
- SLA (per tier)
- Pricing and billing terms
- Beta pricing clause (if applicable — 6-month lock, then standard)
- Termination (30 days notice, client keeps setup)
- "Not Included" section (no custom dev, no hardware/IT, no social account management, no guaranteed results)
- Limitation of liability
- Signature blocks

**Note**: This is a working draft. Must be reviewed by FL attorney before first paying client. Attorney review is a GATE — do not sign any client until review is complete.

- [ ] **Step 2: Commit**

```bash
git add playbook/contract-template.md
git commit -m "Add contract template (draft — needs attorney review)"
```

---

### Task 11: Home Services Industry Package

**Files:**
- Create: `playbook/industries/home-services/CLAUDE.md.example`
- Create: `playbook/industries/home-services/agent-customizations.md`
- Create: `playbook/industries/home-services/mcp-notes.md`

- [ ] **Step 1: Write filled-in CLAUDE.md example for a fictional plumber**

"Tampa Bay Pro Plumbing" — complete CLAUDE.md with all fields filled in. This serves as Brad's reference for how a finished config looks.

- [ ] **Step 2: Write industry-specific agent customizations**

How each agent behaves differently for home services:
- Lead Qualifier: burst pipe = emergency (hot), dripping faucet = routine (warm)
- Customer Comms: service call follow-up templates, review request timing (24hr after job)
- Marketing: seasonal content ideas (AC before summer, pipes before winter)
- Dispatch: route optimization considerations for service area

- [ ] **Step 3: Write MCP notes for home services**

Which MCPs matter most, which are optional:
- Gmail: CRITICAL (all customer communication)
- GCal: CRITICAL (scheduling)
- Stripe/QuickBooks: IMPORTANT (invoicing)
- Drive: NICE-TO-HAVE (job photos, permits)
- Notion: OPTIONAL (most plumbers don't use it)

- [ ] **Step 4: Commit**

```bash
git add playbook/industries/home-services/
git commit -m "Add home services industry package with example config"
```

---

### Task 12: Push Everything and Final Verification

- [ ] **Step 1: Verify all files exist and are properly linked**

Run `find playbook/ -type f` and confirm every file from the file structure exists.

- [ ] **Step 2: Push to GitHub**

```bash
git push origin master
```

- [ ] **Step 3: Test the playbook end-to-end**

Walk through the README as if deploying for "Tampa Bay Pro Plumbing". Verify every template can be filled in, every checklist can be followed, every link works.

- [ ] **Step 4: Update agent-swarm-service concept doc**

Mark "Create the standardized setup playbook" as DONE in `notes/agent-swarm-service-concept.md`.

- [ ] **Step 5: Verify attorney review gate**

Confirm: "Attorney has reviewed contract template: [ ]" — this MUST be checked before any client outreach in Week 2.

- [ ] **Step 6: Commit final updates**

```bash
git add playbook/
git commit -m "Complete playbook v1 — ready for first client deployment"
git push origin master
```

---

### Task 13: Incident Runbook

**Files:**
- Create: `playbook/incident-runbook.md`

- [ ] **Step 1: Write the incident runbook**

Top 5 failure modes from the spec, with step-by-step response:
1. **Agent sends bad output to customer** — Managed: all external outputs require Brad's review. Self-serve: client warned in onboarding doc.
2. **API token expires** — symptoms, how to detect, token refresh procedure per MCP
3. **Agent hallucination** — how to spot it, what to tell the client, contract disclaimer protects Brad
4. **Anthropic service outage** — agents don't run, no client harm, resume when service returns, how to check status
5. **Client breaks the setup** — git-backed configs, Brad can restore from last known-good commit, restore procedure

- [ ] **Step 2: Commit**

```bash
git add playbook/incident-runbook.md
git commit -m "Add incident runbook for failure mode response"
```

---

### Task 14: Beta Tracking & Success Criteria

**Files:**
- Create: `playbook/beta-tracking-checklist.md`

- [ ] **Step 1: Write beta tracking checklist**

Covers open questions from the spec that must be monitored during beta:
- **API cost tracking**: daily log of Claude usage per client. Gate: if >$150/mo, revise pricing before second Managed client.
- **Success criteria**: client saves 5+ hrs/week on admin, agents handle 80%+ routine inquiries without major edits, client renews after month 2.
- **Hardware minimum specs**: modern Windows/Mac, 8GB RAM, stable internet, Claude Code installed. Document any issues during beta.
- **Self-serve CLI friction**: track how many support requests relate to CLI confusion. If >50%, consider launcher script or guided UI.
- **Beta pricing terms**: $2,500 setup (50% off), $500/mo locked for 6 months, then standard pricing.

- [ ] **Step 2: Commit**

```bash
git add playbook/beta-tracking-checklist.md
git commit -m "Add beta tracking checklist with success criteria and cost gates"
```

---

### Task 15: GTM Week 2-3 Follow-Up Plan

**Files:**
- Create: `playbook/gtm-week2-3.md`

- [ ] **Step 1: Write GTM execution plan for Weeks 2-3**

This bridges from "playbook complete" to "first client deployed":

**Week 2: Find the first client**
- Build prospect list: 5-10 home services businesses in Tampa Bay
- Craft outreach using existing home services campaign playbook (`notes/campaign-playbooks/04-home-services-playbook.md`)
- Beta offer: $2,500 setup + $500/mo, 6-month rate lock, in exchange for testimonial
- Demo script: 15-min screen share of Brad's own setup doing 3 tasks live
- Follow-up sequence: Day 1 outreach → Day 3 follow-up → Day 7 final touch

**Week 3: Deploy + document**
- Execute playbook for first client (this is the real test)
- Document every deviation from playbook, every question client asks
- Update playbook based on real experience
- Write case study from beta deployment
- Draft service page brief for elev8ai.org

- [ ] **Step 2: Commit**

```bash
git add playbook/gtm-week2-3.md
git commit -m "Add GTM Week 2-3 execution plan"
```

---

## Execution Notes

- **Total tasks**: 15
- **Estimated time**: 3-4 hours
- **Dependencies**: Tasks 1-2 can run in parallel. Tasks 3-6 can run in parallel. Tasks 7-10 can run in parallel. Task 11 depends on 3-6. Tasks 13-14 can run in parallel with 7-10. Task 15 depends on 10 (contract). Task 12 depends on all.
- **Parallelizable groups**: [1,2], [3,4,5,6], [7,8,9,10,13,14], [11,15], [12]
