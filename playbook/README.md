# Elev8 AI Agent Swarm — Deployment Playbook

## What This Playbook Is

This playbook is the end-to-end operational guide for deploying a customized AI agent swarm for an SMB client under the Elev8 AI Agent Swarm Service. It walks you through every step from pre-sales checklist to go-live confirmation — covering environment setup, template customization, MCP connections, client training, and first-week monitoring. Follow this in order. Each phase has a time estimate so you know what you're walking into before you start.

---

## Prerequisites — Before You Touch Anything

Have all of these in hand before opening a terminal:

- [ ] **Signed contract** — See `contract-template.md`. Must be countersigned and on file.
- [ ] **Tier confirmed** — Self-Serve ($5,000 setup + $500/mo) or Managed ($10,000 setup + $1,500/mo)
- [ ] **Client intake form completed** — Business name, owner name, primary contact, industry vertical, top 3 workflows they want automated
- [ ] **Client API keys / credentials** — Depends on MCPs being connected (e.g., Gmail, Google Calendar, CRM login)
- [ ] **Claude Max subscription** — Self-Serve: client must have their own. Managed: verify your seat covers it.
- [ ] **Access to client machine (Self-Serve)** — Remote session booked (Zoom, TeamViewer, or on-site)
- [ ] **Elev8 AI template repo cloned locally** — `playbook/templates/` must be on your machine
- [ ] **Beta tracking sheet open** — `beta-tracking-checklist.md` — log every deployment against it

---

## Deployment Flow

### Phase 1 — Discovery
**Time: ~30 minutes**

Goal: Understand the client's business well enough to configure their swarm correctly.

1. Open `pre-deployment-checklist.md` and work through it top to bottom.
2. Ask the client (or review intake form) for:
   - Their top 3 daily tasks that eat the most time
   - Tools they already use (email, calendar, CRM, invoicing, etc.)
   - Anyone else on their team who will use the swarm (Self-Serve: just them, or staff too?)
3. Identify which industry vertical applies — first vertical: `industries/home-services/`
4. Note any custom workflows that don't fit the starter templates — flag for Phase 2.
5. Confirm MCP list: which integrations need to be connected (Gmail, GCal, etc.)

Deliverable: A filled-out `pre-deployment-checklist.md` you can reference during Phase 2.

---

### Phase 2 — Deploy
**Time: ~2–3 hours**

Goal: Stand up a fully configured, working agent swarm for the client.

**Step 1 — Clone the template**
```
cp -r playbook/templates/ ~/clients/<client-name>-swarm/
```
Work out of that folder for the rest of Phase 2.

**Step 2 — Customize CLAUDE.md**
- Open `templates/CLAUDE.md.template`
- Fill in: client name, business name, timezone, industry, communication preferences, key contacts
- Add their specific workflows under "What I Need Help With Most"
- Save as `CLAUDE.md` in the client's swarm root

**Step 3 — Configure the agent roster**
- Self-Serve: use `templates/agent-roster-starter.md` — lighter set, client-operated
- Managed: use `templates/agent-roster-managed.md` — full swarm, Brad-operated
- Remove any agents that don't apply to this client's vertical
- Add any custom agents identified in Discovery

**Step 4 — Populate memory files**
All three files in `templates/memory/` need client-specific data:
- `user_profile.md` — owner info, preferences, communication style
- `project_index.md` — active jobs, clients, ongoing work
- `session-log.md` — initialize blank with today's date

**Step 5 — Install skills**
Copy applicable skill templates from `templates/skills/` into the client's `skills/` folder. Review each one and adjust triggers or prompts to match their workflows.

**Step 6 — Connect MCPs**
Follow `mcp-connection-guide.md` exactly. Connect each integration the client needs. Test each connection before moving on — don't assume it worked.

**Step 7 — Verify**
Run through `verification-checklist.md` line by line. Every item must pass before Phase 3. If something fails, fix it now — not during handoff.

---

### Phase 3 — Handoff
**Time: ~1–2 hours | Self-Serve clients only**

Goal: Get the client running independently and confident.

> Managed clients skip this phase — you're operating the swarm yourself.

1. **Install on client machine**
   - Remote in or sit down with them
   - Install Claude Code (if not already present)
   - Copy their swarm folder to their machine
   - Walk them through launching Claude Code and verifying CLAUDE.md loads
2. **Training — cover these three things:**
   - How to start a session ("just open Claude Code and talk to it")
   - How to invoke a skill (show them 2-3 examples from their skill files)
   - What to do if something seems wrong (contact you, don't delete anything)
3. **Demo 3 live tasks** — pick tasks from their top-3 list from Discovery:
   - Run each task in front of them
   - Let them try one on their own with you watching
   - Answer questions as they come up
4. Give them `client-onboarding-doc.md` — their reference guide going forward

---

### Phase 4 — Go-Live Confirmation
**Time: Week 1 (async, ~30 min total)**

Goal: Confirm the swarm is running well and start billing.

- **Day 1**: Send go-live confirmation email. Billing starts today.
- **Day 3**: Check-in message — "How's it going? Any hiccups?"
- **Day 5**: Review any issues reported. Apply fixes. Log changes.
- **Day 7**: Final check-in. If no blockers, mark deployment complete in `beta-tracking-checklist.md`.
- Start scheduling monthly check-ins (Managed) or quarterly health checks (Self-Serve)

If issues come up during Week 1, use `incident-runbook.md` to triage and resolve.

---

## Total Time Estimate

| Tier | Phases | Total |
|------|--------|-------|
| Self-Serve | Discovery + Deploy + Handoff + Go-Live | ~4–6 hours |
| Managed | Discovery + Deploy + Go-Live | ~6–8 hours (ongoing ops after) |

---

## File Reference

All files in this playbook directory:

### Operations
| File | Purpose |
|------|---------|
| `pre-deployment-checklist.md` | Run before every deployment. Confirms contract, credentials, and client info are ready. |
| `mcp-connection-guide.md` | Step-by-step instructions for connecting each supported MCP integration. |
| `verification-checklist.md` | End-of-Phase-2 checklist. Every item must pass before handoff or go-live. |
| `client-onboarding-doc.md` | Client-facing reference doc. Hand this to the client at the end of Phase 3. |
| `contract-template.md` | Standard service agreement. Customize per client before sending. |
| `incident-runbook.md` | Triage guide for Week 1 issues and ongoing incidents. |
| `beta-tracking-checklist.md` | Master tracker for all beta deployments. Log every client here. |
| `gtm-week2-3.md` | Go-to-market actions for weeks 2-3 of the beta rollout. |

### Templates
| File | Purpose |
|------|---------|
| `templates/CLAUDE.md.template` | Base CLAUDE.md. Fill in client details in Phase 2, Step 2. |
| `templates/agent-roster-starter.md` | Starter agent set for Self-Serve clients. |
| `templates/agent-roster-managed.md` | Full agent roster for Managed clients. |
| `templates/memory/user_profile.md` | Client owner profile and preferences. |
| `templates/memory/project_index.md` | Active projects and client jobs index. |
| `templates/memory/session-log.md` | Session memory log — initialize blank at deployment. |
| `templates/skills/` | 5 skill templates covering the most common SMB workflows. |

### Industry Verticals
| File | Purpose |
|------|---------|
| `industries/home-services/overview.md` | Industry context: plumbers, HVAC, electricians — how they work and what they need. |
| `industries/home-services/use-cases.md` | Top automation use cases for home services businesses. |
| `industries/home-services/sample-workflows.md` | Pre-built example workflows ready to drop into a home services swarm. |

---

*Maintained by Brad Powell — Elev8 AI Solutions & Services | elev8ai.org*
