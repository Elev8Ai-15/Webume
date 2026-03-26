# Lead Pipeline Workflow
## Runs: When new assessment comes in + weekly review
## Goal: Convert assessment submissions into paying clients

---

## TRIGGER: New Assessment Submitted
Check admin dashboard at elev8ai.manus.space/admin/assessments

---

## STEP 1 — Score the Lead (5 min)
**Agent**: Lead Qualifier

**Prompt**:
```
Act as my Lead Qualifier for Elev8 AI Solutions & Services.

Score this lead based on their assessment:
- Business name: [NAME]
- Industry: [INDUSTRY]
- Business size: [SIZE]
- Top AI solution recommended: [FROM DASHBOARD]
- Their pain points: [WHAT THEY SAID]

Score as:
- HOT (ready to buy): Has budget, urgent need, good fit for our services
- WARM (needs nurturing): Interested but needs education or has objections
- COLD (not a fit): Wrong industry, no budget, or tire-kicker

Provide:
1. Lead score (Hot/Warm/Cold)
2. Why this score
3. Recommended next action
4. Suggested follow-up timeline
```

**Output**: Save to `outputs/leads/[DATE]-[business-name].md`

---

## STEP 2 — Follow Up (Same day for Hot, 2 days for Warm)
**Agent**: Email Drafter

**For HOT leads**:
```
Act as my Email Drafter for Elev8 AI Solutions & Services.
Write a follow-up email to a HOT lead.

Lead info:
- Name: [NAME]
- Business: [BUSINESS]
- Top recommendation: [AI SOLUTION]
- Pain point: [THEIR PROBLEM]

Email should:
- Reference their specific assessment answers
- Highlight the exact solution we'd build for them
- Create urgency (only 3 client slots/month)
- CTA: book a 15-min call this week
- Tone: confident, helpful, not salesy
- From: Brad Powell, Founder
```

**For WARM leads**:
```
Act as my Email Drafter for Elev8 AI Solutions & Services.
Write a nurture email to a WARM lead.

Lead info: [SAME AS ABOVE]

Email should:
- Thank them for the assessment
- Share one quick win they could implement now
- Include a relevant blog post or case study link
- Soft CTA: "Reply if you'd like to explore this further"
- Tone: educational, no pressure
```

**Output**: Save to `outputs/leads/[DATE]-[business-name]-email.md`

---

## STEP 3 — Proposal (After call, for qualified leads)
**Agent**: Proposal Writer

**Prompt**:
```
Act as my Proposal Writer for Elev8 AI Solutions & Services.

Create a proposal for:
- Client: [NAME / BUSINESS]
- Solution: [WHAT WE'RE BUILDING]
- Their problem: [PAIN POINT]
- Call notes: [KEY POINTS FROM DISCOVERY CALL]

Proposal structure:
1. Executive Summary (their problem in their words)
2. Proposed Solution (what we'll build, plain English)
3. How It Works (3-step process)
4. Timeline (48-hour launch promise where applicable)
5. Investment (pricing tier from our packages)
6. What's Included (deliverables list)
7. Next Steps (how to get started)

Tone: Professional, confident, value-focused.
Emphasize ROI and time savings, not technical jargon.
```

**Output**: Save to `outputs/leads/[DATE]-[business-name]-proposal.md`

---

## WEEKLY PIPELINE REVIEW (Friday, 10 min)
**Prompt**:
```
Act as my Lead Qualifier. Review the current pipeline:

This week's new leads: [LIST]
Follow-ups sent: [LIST]
Calls booked: [LIST]
Proposals sent: [LIST]
Deals closed: [LIST]

Summarize:
1. Pipeline health (growing/shrinking/stale)
2. Leads that need attention (overdue follow-ups)
3. Projected revenue from current pipeline
4. One thing to improve next week
```

**Output**: Save to `outputs/reports/week-of-[DATE]-pipeline-report.md`

---

## LEAD STAGES
| Stage           | Action Required          | Timeline        |
|-----------------|--------------------------|-----------------|
| New Assessment  | Score + qualify           | Same day        |
| Hot Lead        | Personal email + call CTA | Same day        |
| Warm Lead       | Nurture email             | Within 2 days   |
| Call Booked     | Prep discovery questions  | Before call     |
| Proposal Sent   | Follow up if no response  | 3 days after    |
| Negotiation     | Handle objections         | As needed       |
| Closed Won      | Onboarding kickoff        | Within 24 hours |
| Closed Lost     | Add to nurture sequence   | Monthly touches  |
