# Elev8 AI — Agent Workflow System
## Master Reference

---

## FOLDER STRUCTURE
```
my-assistant/
  agents/
    agent-roster.md          <- All agent roles and how to invoke them
  workflows/
    SYSTEM.md                <- THIS FILE (master reference)
    weekly-marketing-cycle.md <- Monday content planning + Friday metrics
    lead-pipeline.md         <- Assessment → Score → Follow-up → Close
    monthly-business-review.md <- Revenue tracking vs $500k ARR target
    marketing-tracker.md     <- Weekly/monthly metrics tracking + 90-day targets
    marketing-plan.md        <- Aggressive 90-day marketing strategy
    industry-campaigns/      <- Industry-specific campaign playbooks
  outputs/
    content/                 <- Generated posts, calendars, blog drafts
    reports/                 <- Weekly/monthly performance reports
    leads/                   <- Lead scores, emails, proposals
    campaigns/               <- Industry campaign materials and outreach
    videos/                  <- HeyGen video scripts and tracking
  notes/                     <- Research, guides, audit reports (in Documents/)
```

---

## DAILY ROUTINE (15 min/day)
1. Check email for new assessment notifications
2. If new assessment → Run Lead Pipeline Step 1 (score it)
3. Review and post today's scheduled content
4. Respond to any social media engagement

## WEEKLY ROUTINE
| Day       | Task                              | Workflow                  | Time   |
|-----------|-----------------------------------|---------------------------|--------|
| Monday    | Plan week's content               | Weekly Marketing Cycle    | 15 min |
| Mon-Tue   | Write all posts for the week      | Weekly Marketing Cycle    | 30 min |
| Daily     | Review + post content             | Weekly Marketing Cycle    | 5 min  |
| As needed | Score + follow up on leads        | Lead Pipeline             | 10 min |
| Friday    | Weekly marketing report           | Marketing Tracker         | 10 min |
| Friday    | Weekly pipeline review            | Lead Pipeline             | 10 min |
| As needed | HeyGen outreach videos            | Industry Campaigns        | 15 min |
| As needed | Direct outreach (LinkedIn/email)  | Industry Campaigns        | 15 min |

## MONTHLY ROUTINE
| Task                              | Workflow                  | Time   |
|-----------------------------------|---------------------------|--------|
| Monthly business review           | Monthly Business Review   | 20 min |
| Brand audit (quarterly)           | Monthly Business Review   | 15 min |

---

## QUICK START — "What do I say to Claude?"

### Monday morning:
"Run the Weekly Marketing Cycle. Plan content for the week of [date]. Theme: [optional]."

### New assessment comes in:
"Run the Lead Pipeline. Score this lead: [paste assessment details]."

### Hot lead needs follow-up:
"Act as my Email Drafter. Write a hot lead follow-up for [name] at [business]."

### Friday afternoon:
"Run the marketing tracker. Here are this week's numbers: [paste stats]."

### Direct outreach:
"Run the [healthcare/legal/real estate/home services] campaign. Target: [business name]."

### HeyGen video:
"Write a HeyGen outreach script for [name] at [business] in [industry]."

### End of month:
"Run the Monthly Business Review for [month]. Revenue: $X, clients: X."

---

## NAMING CONVENTIONS FOR OUTPUT FILES
- Content calendar: `outputs/content/week-of-YYYY-MM-DD-calendar.md`
- Social posts: `outputs/content/YYYY-MM-DD-[platform]-post.md`
- Lead scores: `outputs/leads/YYYY-MM-DD-[business-name].md`
- Lead emails: `outputs/leads/YYYY-MM-DD-[business-name]-email.md`
- Proposals: `outputs/leads/YYYY-MM-DD-[business-name]-proposal.md`
- Weekly reports: `outputs/reports/week-of-YYYY-MM-DD-[type]-report.md`
- Monthly reviews: `outputs/reports/MM-YYYY-business-review.md`
- Brand audits: `outputs/reports/QX-YYYY-brand-audit.md`
- Campaign outreach: `outputs/campaigns/YYYY-MM-DD-[industry]-[business-name].md`
- HeyGen scripts: `outputs/videos/YYYY-MM-DD-[type]-[business-name].md`
