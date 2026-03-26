---
name: proposal-writer
description: Draft client proposals based on assessment results or discovery calls. Use when Brad says "write a proposal", "draft a proposal", "send a proposal to X", or needs to create a client-facing offer.
metadata:
  bashPattern: ["proposal", "quote", "estimate"]
  filePattern: ["**/outputs/proposals/**"]
  priority: 90
---

# Proposal Writer Skill

## When to use
- Brad has a qualified lead and needs a proposal
- After a discovery call or assessment review
- Brad says "put together a proposal for [client]"

## Context to gather first
1. Lead qualification data (from lead-qualifier skill or Brad's notes)
2. Client's industry, size, and specific pain points
3. Which Elev8 AI services match their needs
4. Any budget signals or constraints mentioned

## Elev8 AI Service Catalog (current pricing)
- **AI Chatbot / Virtual Assistant**: $1,299 setup
- **Landing Page**: $199
- **Website (full)**: Custom quote
- **AI Agent Swarm (Starter)**: $5,000 setup + $500/mo
- **AI Agent Swarm (Business)**: $10,000-$15,000 setup + $1,000/mo
- **AI Agent Swarm (Enterprise)**: $25,000+ setup + $2,500/mo
- **Consultation**: Free initial / $150/hr ongoing
- **Custom AI Integration**: Quote based on scope

## Proposal structure
```
# Proposal for [Client Name]
**Prepared by**: Brad Powell, Elev8 AI Solutions & Services
**Date**: [Date]

## Understanding Your Challenge
[2-3 sentences showing you understand their specific problem]

## Recommended Solution
[Which Elev8 AI service(s) solve this, explained in their language]

### What's Included
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

### Timeline
- [Phase 1]: [Duration]
- [Phase 2]: [Duration]
- **Total**: [X weeks/days]

## Investment
| Item | Price |
|------|-------|
| [Service] | $X |
| [Add-on] | $X |
| **Total** | **$X** |

*Monthly maintenance (optional): $X/mo*

## Why Elev8 AI
- 48-hour turnaround on most projects
- Brad uses the same tools he builds for clients
- Local Tampa Bay — available for in-person meetings
- No long-term contracts required

## Next Steps
1. Reply to confirm or ask questions
2. Schedule a 15-min walkthrough: [Calendly link]
3. We can start within 48 hours of approval
```

## Output
- Save to `outputs/proposals/YYYY-MM-DD-[client-name]-proposal.md`
- Always present to Brad for review before sending

## Rules
- Use the client's language, not tech jargon
- Lead with their problem, not your features
- Always include a clear price — no "contact for pricing"
- Include a specific timeline — clients want to know when
- End with a low-friction next step (Calendly link, reply to email)
- **NEVER send without Brad's approval** — present draft first
