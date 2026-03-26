# Agent Roster Template: Home Services

> **Industry**: Home Services (HVAC, plumbing, electrical, landscaping, pest control, etc.)
> **Template version**: 1.0
> **Last updated**: 2026-03-26

This document defines which agents ship at each tier for Home Services clients of the Elev8 AI Agent Swarm Service. All agent definitions use placeholder variables so they can be stamped out per client.

---

## Placeholder Variables

| Variable | Description |
|---|---|
| `{{CLIENT_NAME}}` | Business name (e.g., "Sunshine Plumbing") |
| `{{INDUSTRY}}` | Sub-industry (e.g., "HVAC", "Plumbing") |
| `{{TONE}}` | Communication tone from client CLAUDE.md |
| `{{SERVICE_AREA}}` | Geographic coverage (e.g., "Pasco County, FL") |
| `{{SERVICES_LIST}}` | Comma-separated services offered |

---

## Tier 1: Self-Serve

**Pricing**: $5,000 setup + $500/mo
**Agent count**: 3

### 1. Office Manager Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/office-manager.md` |
| **Purpose** | Daily briefing, appointment scheduling, calendar management |
| **Trigger phrases** | "brief me", "what's on my plate", "schedule", "morning update" |
| **MCP dependencies** | Google Calendar, Gmail |

**Example tasks**:
- Morning briefing with today's appointments and any overnight messages
- Schedule a new job for a specific date/time
- Reschedule a callback window
- Flag same-day cancellations

---

### 2. Customer Comms Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/customer-comms.md` |
| **Purpose** | Draft responses to inquiries, follow-up after service calls, review responses |
| **Trigger phrases** | "respond to", "follow up with", "draft a reply", "customer email" |
| **MCP dependencies** | Gmail |

**Example tasks**:
- Draft reply to a service inquiry from the website
- Send follow-up thank-you after a completed job
- Draft a professional response to a Google or Yelp review
- Compose a "we missed you" message for no-show customers

---

### 3. Lead Qualifier Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/lead-qualifier.md` |
| **Purpose** | Score incoming leads, prioritize urgent jobs |
| **Trigger phrases** | "score this lead", "qualify this", "new inquiry", "prioritize" |
| **MCP dependencies** | Gmail (to read incoming inquiries) |

**Scoring criteria**:

| Factor | Weight | Examples |
|---|---|---|
| Urgency | High | Emergency (burst pipe, no AC in summer) vs. routine maintenance |
| Service match | Medium | Does the request match `{{SERVICES_LIST}}`? |
| Location | Medium | Is the customer within `{{SERVICE_AREA}}`? |
| Budget signals | Low | Mentions price sensitivity, asks for premium service, etc. |

**Output**: Lead score (1-10) with a one-line rationale and recommended action (call now, email quote, decline).

---

## Tier 2: Managed

**Pricing**: $10,000 setup + $1,500/mo
**Agent count**: 8 (all Tier 1 agents + 5 below)

> Includes agents 1-3 from Tier 1 above.

### 4. Marketing Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/marketing.md` |
| **Purpose** | Weekly social posts, seasonal promotions, Google Business updates |
| **Trigger phrases** | "plan content", "write a post", "seasonal promotion" |
| **MCP dependencies** | None (outputs drafts for client to post) |

**Example tasks**:
- Create this week's social media posts (Facebook, Instagram, Nextdoor)
- Write a summer AC tune-up promotion
- Draft a Google Business Profile update for holiday hours
- Generate before/after job spotlight content

---

### 5. Invoice & Estimate Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/invoice-estimate.md` |
| **Purpose** | Draft estimates from job notes, follow up on unpaid invoices |
| **Trigger phrases** | "draft estimate", "invoice follow-up", "unpaid invoices" |
| **MCP dependencies** | Stripe or QuickBooks (if available), Gmail |

**Example tasks**:
- Draft an estimate from technician job notes
- Send a friendly reminder for invoices 7+ days overdue
- Generate a weekly unpaid-invoice summary
- Create a quote for a multi-service bundle

---

### 6. Dispatch Assistant Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/dispatch-assistant.md` |
| **Purpose** | Optimize daily route/schedule, flag double-bookings |
| **Trigger phrases** | "optimize route", "check schedule conflicts", "plan tomorrow" |
| **MCP dependencies** | Google Calendar |

**Example tasks**:
- Build tomorrow's route to minimize drive time
- Flag any double-bookings or overlapping windows
- Suggest rescheduling options when a job runs long
- Identify open slots for same-day emergency calls

---

### 7. Review Manager Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/review-manager.md` |
| **Purpose** | Request reviews after jobs, draft responses to negative reviews |
| **Trigger phrases** | "request a review", "respond to review", "check reviews" |
| **MCP dependencies** | Gmail |

**Example tasks**:
- Send a review request 24 hours after job completion
- Draft a professional, empathetic response to a 1-star review
- Generate a weekly review summary with sentiment trends
- Identify top customers to ask for video testimonials

---

### 8. Competitor Scout Agent

| Field | Value |
|---|---|
| **Agent file** | `.claude/agents/competitor-scout.md` |
| **Purpose** | Monitor local competitor pricing and promotions |
| **Trigger phrases** | "check competitors", "competitor pricing", "what are others charging" |
| **MCP dependencies** | Web search |

**Example tasks**:
- Report competitor pricing for AC tune-ups in `{{SERVICE_AREA}}`
- Summarize competitor promotions running this month
- Flag new competitors appearing in Google Maps results
- Compare client's Google rating against top 5 local competitors

---

## Agent Customization Notes

- All agent `.md` files use the placeholder variables listed above
- Tone in all agents matches the `{{TONE}}` setting in the client's `CLAUDE.md`
- Each agent has a corresponding verification test in `playbook/checklists/verification-home-services.md`
- Tier 1 agents are a strict subset of Tier 2 -- upgrading a client means adding agents 4-8 without touching existing configs
- Agent files are generated during onboarding by the setup script and stored in the client's local `.claude/agents/` directory

---

## Onboarding Checklist Reference

Before marking a Home Services deployment as complete, verify:

- [ ] All agent files created with correct placeholders resolved
- [ ] MCP connections tested (Google Calendar, Gmail, Stripe/QuickBooks)
- [ ] Each agent responds correctly to its trigger phrases
- [ ] Lead Qualifier scoring produces reasonable results on 5 sample leads
- [ ] Morning briefing runs successfully with real calendar data
- [ ] Customer Comms drafts match client's brand voice
- [ ] (Tier 2) Marketing agent generates on-brand social content
- [ ] (Tier 2) Dispatch optimization produces valid route suggestions
