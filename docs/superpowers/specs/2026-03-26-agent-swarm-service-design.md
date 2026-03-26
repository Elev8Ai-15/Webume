# Agent Swarm Service — Design Spec
**Date**: 2026-03-26
**Status**: Approved
**Owner**: Brad Powell, Elev8 AI Solutions & Services

---

## Overview

Productize Brad's personal Claude Code multi-agent assistant as a premium service for SMB clients. Deploy customized AI agent swarms on clients' local machines (or managed by Brad) that handle daily business operations autonomously.

**Approach**: One vertical, one client, prove it — then expand. Build the minimum playbook, deploy for one home services client, use that as the case study to scale.

---

## 1. The Playbook

A step-by-step deployment guide that lives in the `ai-agent-swarm` repo (https://github.com/Elev8Ai-15/ai-agent-swarm). It enables Brad (or eventually a contractor) to deploy a customized swarm for any SMB client in under 6 hours (Self-serve) or 8 hours (Managed).

### Playbook contents:
1. **Pre-deployment checklist** — client requirements, hardware specs, account setup
2. **CLAUDE.md template** — parameterized master config (client name, industry, services, tone)
3. **Agent roster template** — curated agent subset per tier and industry
4. **MCP connection guide** — step-by-step for Gmail, GCal, Notion, Stripe, etc.
5. **Skills template** — 5 business skills customized per client (content strategist, LinkedIn writer, social media writer, lead qualifier, proposal writer)
6. **Memory system seed** — starter memory files (client profile, brand voice, service catalog)
7. **Verification checklist** — test every agent before handoff
8. **Client onboarding doc** — what they get, how to use it, what to expect
9. **Contract template** — scope, disclaimer, SLA, pricing

The playbook is a **working directory template** in the repo, not a PDF.

---

## 2. Delivery Tiers

### Tier 1: Self-Serve Swarm
- **Setup**: $5,000
- **Monthly**: $500/mo
- **Client requirement**: Claude Max subscription (~$100/mo, their own account)
- **What Brad does**: Clone template, customize config + agents, connect MCP servers, 2-hour training session, hand over
- **What client gets**: 3-5 agents, basic skills, memory system
- **Monthly includes**: 1 check-in call, 1 new agent or skill per month, email support (48hr response)
- **Client responsibility**: They interact with Claude Code directly. They own their data and API access.

### Tier 2: Managed Swarm
- **Setup**: $10,000
- **Monthly**: $1,500/mo
- **Client requirement**: None — Brad handles everything
- **What Brad does**: Full deployment + ongoing operation. Runs agents, delivers outputs (content, emails, reports) via email/Notion/Slack.
- **What client gets**: 8-12 agents, all skills, custom workflows, weekly deliverables
- **Monthly includes**: Brad operates the swarm, API costs included, weekly output delivery, 2 new agents/skills per month, priority support (24hr response)
- **Client responsibility**: Review and approve outputs. All business decisions are theirs.

**Key difference**: Self-serve = you install a tool. Managed = you hire a team.

---

## 3. First Vertical: Home Services

### Starter agents (Tier 1):
1. **Office Manager Agent** — daily briefing, appointment scheduling, calendar management
2. **Customer Comms Agent** — draft inquiry responses, follow-up after service calls, review responses (Google/Yelp)
3. **Lead Qualifier Agent** — score incoming calls/form submissions, prioritize urgent jobs

### Managed agents (Tier 2 — all above, plus):
4. **Marketing Agent** — weekly social posts, seasonal promotions, Google Business updates
5. **Invoice & Estimate Agent** — draft estimates from job notes, follow up on unpaid invoices
6. **Dispatch Assistant** — optimize daily route/schedule, flag double-bookings
7. **Review Manager Agent** — request reviews after completed jobs, draft negative review responses
8. **Competitor Scout** — monitor local competitor pricing and promotions

### MCP connections:
- Gmail (customer inquiries, estimates, invoices)
- Google Calendar (scheduling)
- Google Drive (job photos, documents)
- Stripe or QuickBooks (invoicing, if available)

### CLAUDE.md customization points:
- Business name, address, service area
- Services offered with pricing ranges
- Hours of operation, emergency availability
- Tone: friendly, professional, blue-collar approachable

---

## 4. Deployment Process

### Phase 1: Discovery (30 min)
1. Client call: business details, pain points, tools they use
2. Pick tier (Self-serve or Managed)
3. Confirm MCP access — client sets up OAuth app passwords / tokens (NOT raw passwords). Brad guides them through this.
4. Sign contract + collect setup fee

### Phase 2: Deploy (2-3 hours)
1. Clone repo template: `git clone ai-agent-swarm → client-name-swarm`
2. Customize CLAUDE.md (business name, services, tone, hours, service area)
3. Select and customize agent roster for their industry/tier
4. Customize skills (swap Elev8 AI references for client's business)
5. Seed memory system (client profile, brand voice, service catalog)
6. Connect MCP servers (per checklist)
7. Run verification checklist — test each agent with a real task

### Phase 3: Handoff (1-2 hours — Self-serve only)
1. Install Claude Code on client's machine (or cloud VM)
2. Walk through: "Here's how you talk to your agents"
3. Demo 3 common tasks live
4. Hand over onboarding doc
5. Schedule 1-week check-in call

### Phase 4: Go-live confirmation (Week 1)
1. Check-in call: what worked? What didn't?
2. Adjust agents/skills based on feedback
3. Confirm monthly billing starts

**Total Brad time**: ~4-6 hours (Self-serve) or ~6-8 hours (Managed)

---

## 5. Contract & Legal Framework

### Contract covers:
1. **Scope of work** — which agents, skills, MCP connections are included
2. **Client responsibilities**: provide account access, Claude Max sub (Self-serve only), review/approve outputs
3. **Disclaimer**: AI outputs are recommendations/drafts, not professional advice. All business decisions are client's sole responsibility. Elev8 AI not liable for actions taken based on agent-generated content.
4. **Data handling**: local deployment = client owns data. Managed tier = Brad accesses systems under NDA. No data shared with third parties (except API calls to Anthropic).
5. **SLA**: Self-serve = 48hr email response, 1 monthly check-in. Managed = 24hr response, weekly deliverables.
6. **Billing**: Setup fee upfront. Monthly on the 1st. Month-to-month after setup.
7. **Termination**: Either party, 30 days notice. Client keeps their setup.

### Credential security (Managed tier):
- Use OAuth tokens / app passwords instead of raw credentials wherever possible
- All credentials stored in encrypted vault (not plaintext files)
- Access limited to Brad only — no shared drives or unencrypted backups
- Breach notification: Brad notifies client within 24 hours of any suspected credential compromise
- Contract includes credential handling clause

### Failure modes (top 5):
1. **Agent sends bad output to customer** — Managed: all external-facing outputs require Brad's review before sending. Self-serve: onboarding doc warns client to review before acting.
2. **API token expires** — MCP connection fails silently. Monthly check-in catches this. Playbook includes token refresh procedure.
3. **Agent hallucination** — disclaimer in contract covers this. Quality Critic agent reviews outputs in Managed tier.
4. **Service outage (Anthropic down)** — agents simply don't run. No client harm. Resume when service returns.
5. **Client breaks the setup** — Git-backed configs. Brad can restore from last known-good commit.

### Not included:
- Custom software development
- Hardware purchases or IT support
- Social media account management (agents draft, client posts)
- Guaranteed business results

### Follow-up (before first paying client):
- Have a Florida business attorney review the contract template (~$75-150)
- Attorney should check FL requirements for electronic communications on behalf of licensed contractors

---

## 6. Go-to-Market Roadmap

### Week 1: Build the playbook
- Templatize the repo into a deployable client package
- Create CLAUDE.md template with parameterized fields
- Build Home Services agent roster template
- Write client onboarding doc
- Draft contract template

### Week 2: Find the first client
- Reach out to 5-10 home services businesses in Tampa Bay
- Offer beta deal: $2,500 setup (50% off) + $500/mo in exchange for testimonial. Beta rate locked for 6 months, then transitions to standard pricing. Specify in beta contract.
- Use existing home services campaign playbook for outreach
- Demo Brad's own setup on a screen share — that's the pitch

### Week 3: Deploy + document
- Install for first client
- Document every step, pain point, and question
- Update playbook based on real experience
- Write the case study
- Build service page for elev8ai.org

---

## 7. Revenue Model

| Scenario | Clients | Monthly Recurring | Annual |
|----------|---------|-------------------|--------|
| 5 Self-serve | 5 | $2,500/mo | $30,000 + $25,000 setup = $55,000 |
| 3 Managed | 3 | $4,500/mo | $54,000 + $30,000 setup = $84,000 |
| **Combined (8 clients)** | **8** | **$7,000/mo** | **$84,000 recurring + $55,000 setup = $139,000** |

API costs (Managed tier): ~$100/mo per client x 3 = $300/mo = $3,600/yr
**Net after API costs**: ~$135,400/yr from 8 clients

**API cost gate**: Track actual API costs daily during beta. If per-client cost exceeds $150/mo, revise Managed tier pricing before taking a second Managed client.

---

## 8. Open Questions

1. **API cost model validation** — monitor actual Claude usage during beta to confirm $100/mo estimate. Gate: revise pricing if >$150/mo.
2. **Hardware minimum specs** — define for Self-serve tier (likely: any modern Windows/Mac, 8GB RAM, internet)
3. **Scaling beyond Brad** — at what client count does Brad need a contractor? (Likely 10+ managed clients)
4. **Additional verticals** — after home services, expand to: real estate, restaurants, professional services (playbooks already exist)
5. **Anthropic pricing risk** — if Claude Max subscription or API pricing changes, Managed tier pricing may need adjustment
6. **Self-serve CLI friction** — target tech-comfortable clients for Self-serve tier. Consider a launcher script to reduce CLI intimidation. Gauge during beta.
7. **Beta success criteria** — client saves 5+ hours/week on admin tasks, agents handle 80%+ of routine inquiries without major edits, client renews after month 2

---

*This spec is the foundation for the implementation plan. Next step: create the playbook template in the repo.*
