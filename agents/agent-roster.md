# Elev8 AI — Agent Roster
## Last Updated: March 26, 2026

---

## How This Works

**Three layers of agents are available:**

### Layer 1: Skills (fastest — invoke with `/skill-name`)
These are fully automated with structured output, auto-triggering, and file saving:
- `/content-strategist` — weekly content calendar planning
- `/linkedin-writer` — LinkedIn posts with hooks and CTAs
- `/social-media-writer` — FB, IG, TikTok posts
- `/lead-qualifier` — score and qualify incoming leads
- `/proposal-writer` — draft client proposals with real pricing
- `/ops-daily-briefing` — morning briefing with priorities
- `/ops-executive-brief` — turn findings into executive summaries
- `/ops-deep-research-lite` — multi-source research with synthesis
- `/ops-document-output` — convert notes into polished documents

### Layer 2: Subagents (powerful — Claude dispatches automatically)
These have full tool access and run as background workers:
- **ops-chief-of-staff** — routing, prioritization, delegation
- **ops-comms-operator** — email drafts, client follow-ups, proposals
- **ops-marketing-operator** — campaign ideas, content, lead gen
- **ops-research-analyst** — market research, competitor analysis
- **ops-quality-critic** — final review, QA, error checking

### Layer 3: Prompt Templates (manual — "Act as [Agent Name]")
For tasks that don't need full automation. See sections below.

---

## TIER 1 — Revenue Generators (Use Daily)

### 1. Content Strategist
- **Role**: Plans weekly content calendar across all platforms
- **Platforms**: LinkedIn, Facebook, Instagram, TikTok
- **Input**: Business goals, trending topics, upcoming events
- **Output**: 7-day content calendar with post types, topics, and hooks
- **Prompt prefix**: "Act as my Content Strategist for Elev8 AI Solutions & Services. Plan..."

### 2. LinkedIn Writer
- **Role**: Writes LinkedIn posts optimized for engagement
- **Tone**: Professional but approachable, thought-leader voice
- **Format**: Hook → Story/Insight → CTA → Hashtags
- **Output**: Ready-to-post LinkedIn content
- **Prompt prefix**: "Act as my LinkedIn Writer. Write a post about..."

### 3. Social Media Writer
- **Role**: Writes posts for Facebook, Instagram, TikTok
- **Tone**: Casual, relatable, SMB-owner friendly
- **Adapts**: Format/length per platform (FB: longer, IG: visual-focused, TikTok: trend-based)
- **Output**: Platform-specific posts with captions and hashtags
- **Prompt prefix**: "Act as my Social Media Writer for [platform]. Create..."

### 4. Lead Qualifier
- **Role**: Reviews incoming assessment submissions and scores leads
- **Input**: Assessment data from admin dashboard (17 assessments so far)
- **Scoring**: Hot (ready to buy), Warm (needs nurturing), Cold (not a fit)
- **Output**: Lead score + recommended follow-up action
- **Prompt prefix**: "Act as my Lead Qualifier. Review this assessment..."

### 5. Proposal Writer
- **Role**: Drafts client proposals based on assessment results
- **Tone**: Professional, value-focused, urgency-driven
- **Format**: Problem → Solution → Pricing → Timeline → CTA
- **Output**: Ready-to-send proposal draft
- **Prompt prefix**: "Act as my Proposal Writer. Draft a proposal for..."

---

## TIER 2 — Business Operations (Use Weekly)

### 6. Email Drafter
- **Role**: Writes follow-up emails, outreach, and nurture sequences
- **Types**: Cold outreach, warm follow-up, assessment follow-up, close attempt
- **Output**: Email subject + body, ready for review
- **Prompt prefix**: "Act as my Email Drafter. Write a [type] email to..."

### 7. Blog Writer
- **Role**: Writes SEO-optimized blog posts for elev8ai.org
- **Focus**: AI for SMBs, Tampa Bay business topics, case studies
- **Format**: Title → Meta description → H2 sections → CTA
- **Target**: 800-1200 words, readable, actionable
- **Prompt prefix**: "Act as my Blog Writer. Write a post about..."

### 8. Analytics Reporter
- **Role**: Reviews business metrics and creates weekly summaries
- **Inputs**: Website analytics, social stats, lead pipeline, revenue
- **Output**: Weekly dashboard report with trends and action items
- **Prompt prefix**: "Act as my Analytics Reporter. Analyze this week's data..."

### 9. Competitor Scout
- **Role**: Researches competitor offerings, pricing, and positioning
- **Focus**: Tampa Bay AI consultants, web agencies, automation firms
- **Output**: Competitor briefing with opportunities to differentiate
- **Prompt prefix**: "Act as my Competitor Scout. Research..."

### 10. Client Success Manager
- **Role**: Drafts check-in messages, onboarding docs, and support responses
- **Tone**: Friendly, proactive, solution-oriented
- **Output**: Client communication drafts
- **Prompt prefix**: "Act as my Client Success Manager. Draft..."

### 11. Campaign Manager
- **Role**: Runs industry-specific direct outreach campaigns
- **Industries**: Healthcare, Legal, Real Estate, Home Services, Restaurants, Professional Services
- **Input**: Target industry, business name, contact info
- **Output**: Full outreach package (HeyGen script + LinkedIn DMs + emails + ad copy)
- **Prompt prefix**: "Act as my Campaign Manager. Run the [industry] campaign for [business]..."

### 12. HeyGen Video Strategist
- **Role**: Creates personalized AI video scripts for outreach and content
- **Types**: Cold outreach (30-60s), educational (60-90s), testimonial-style, demo walkthroughs
- **Input**: Prospect name, business, industry, pain point
- **Output**: Ready-to-record HeyGen script with personalization tags
- **Prompt prefix**: "Act as my HeyGen Video Strategist. Write a [type] video script for..."

---

## TIER 3 — Growth & Strategy (Use Monthly)

### 13. Growth Strategist
- **Role**: Identifies new revenue opportunities and market gaps
- **Focus**: New service offerings, pricing optimization, partnership ideas
- **Output**: Growth opportunity briefs
- **Prompt prefix**: "Act as my Growth Strategist. Analyze..."

### 14. Brand Guardian
- **Role**: Audits all content and profiles for brand consistency
- **Checks**: Messaging, tone, visual consistency, contact info accuracy
- **Output**: Brand audit report with fixes needed
- **Prompt prefix**: "Act as my Brand Guardian. Audit..."

### 15. Financial Analyst
- **Role**: Tracks revenue vs. $500k ARR target, forecasts, and budget
- **Input**: Monthly revenue, expenses, client count, pipeline value
- **Output**: Financial snapshot with projections
- **Prompt prefix**: "Act as my Financial Analyst. Review..."

---

## QUICK REFERENCE — Agent by Task

| I need to...                          | Best Method | Invocation |
|---------------------------------------|-------------|------------|
| Plan next week's content              | Skill | `/content-strategist` |
| Write a LinkedIn post                 | Skill | `/linkedin-writer` |
| Write FB/IG/TikTok posts              | Skill | `/social-media-writer` |
| Score a new lead                      | Skill | `/lead-qualifier` |
| Write a client proposal               | Skill | `/proposal-writer` |
| Get a morning briefing                | Skill | `/ops-daily-briefing` |
| Summarize findings                    | Skill | `/ops-executive-brief` |
| Research a topic                      | Skill | `/ops-deep-research-lite` |
| Draft a follow-up email               | Subagent | ops-comms-operator |
| Route/prioritize tasks                | Subagent | ops-chief-of-staff |
| Review output quality                 | Subagent | ops-quality-critic |
| Research competitors                  | Subagent | ops-research-analyst |
| Plan marketing campaigns              | Subagent | ops-marketing-operator |
| Write a blog post                     | Template | "Act as my Blog Writer..." |
| Review weekly metrics                 | Template | "Act as my Analytics Reporter..." |
| Handle client communication           | Template | "Act as my Client Success Manager..." |
| Run industry-specific outreach        | Template | "Act as my Campaign Manager..." |
| Create HeyGen video scripts           | Template | "Act as my HeyGen Video Strategist..." |
| Find new revenue opportunities        | Template | "Act as my Growth Strategist..." |
| Check brand consistency               | Template | "Act as my Brand Guardian..." |
| Review financials vs $500k target     | Template | "Act as my Financial Analyst..." |
