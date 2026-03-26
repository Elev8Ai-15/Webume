---
name: lead-qualifier
description: Score and qualify incoming leads from website assessments or inquiries. Use when Brad says "score this lead", "qualify this lead", "new lead came in", "check the assessment", or needs to evaluate a prospect.
metadata:
  bashPattern: ["lead", "qualify", "assessment", "prospect"]
  filePattern: ["**/workflows/lead-pipeline*"]
  priority: 92
---

# Lead Qualifier Skill

## When to use
- New assessment submission comes in from elev8ai.org
- Brad forwards a lead or inquiry
- Reviewing the lead pipeline
- Brad asks "who should I follow up with?"

## Scoring framework

### HOT (Score 8-10) — Follow up within 24 hours
- Has a specific problem they need solved now
- Budget signals present (asked about pricing, mentioned budget)
- Decision-maker (owner, CEO, GM)
- Tampa Bay local (easier to close)
- Industry Elev8 AI has case studies for

### WARM (Score 5-7) — Nurture within 48 hours
- Interested but no urgency
- Exploring options / comparing providers
- May need education on what AI can do
- Has potential but needs qualifying conversation

### COLD (Score 1-4) — Low-touch follow-up
- Just curious / tire-kicker signals
- No clear problem or budget
- Outside service area or target market
- Unrealistic expectations ("I want AGI for $100")

## Process
1. Review all available lead data (assessment answers, email, source)
2. Score each criteria:
   - **Need clarity** (1-10): How clear and urgent is their problem?
   - **Budget signals** (1-10): Can they afford Elev8 AI services?
   - **Decision authority** (1-10): Are they the buyer?
   - **Fit** (1-10): Does Elev8 AI serve their industry/need?
3. Calculate average score → assign Hot/Warm/Cold
4. Recommend specific follow-up action

## Output format

### Lead Score: [Name/Business]
- **Score**: [X/10] — **[HOT/WARM/COLD]**
- **Need**: [What they need in 1 sentence]
- **Budget signal**: [Yes/No — evidence]
- **Authority**: [Decision-maker? Evidence]
- **Fit**: [Which Elev8 AI service matches]
- **Recommended action**: [Exact next step — email template, call script, or pass]
- **Timeline**: Follow up by [date]

## Rules
- Always recommend a specific next action — never just "follow up"
- Reference Elev8 AI's actual service catalog and pricing
- If it's a hot lead, draft the follow-up email right away
- Flag any red flags (unrealistic expectations, no budget, etc.)
- Save qualified leads to `workflows/lead-pipeline.md`
