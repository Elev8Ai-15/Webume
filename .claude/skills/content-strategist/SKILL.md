---
name: content-strategist
description: Plan weekly content calendar across LinkedIn, Facebook, Instagram, TikTok for Elev8 AI. Use when Brad says "plan content", "content calendar", "what should I post", "weekly content", or needs social media planning.
metadata:
  bashPattern: ["content", "calendar", "social"]
  filePattern: ["**/outputs/content/**"]
  priority: 90
---

# Content Strategist Skill

## When to use
- Brad asks for this week's content plan
- Start of a new content cycle (typically Monday)
- Brad wants to brainstorm post ideas
- Preparing a batch of content in advance

## Context to gather first
1. Read `workflows/weekly-marketing-cycle.md` for the current cycle structure
2. Read `workflows/marketing-plan.md` for strategic themes
3. Check `outputs/content/` for recent posts (avoid repetition)
4. Check today's date to align with any events, holidays, or trends

## Process
1. **Review strategy**: What themes/campaigns are active this week?
2. **Check recent posts**: What was posted in the last 7 days? Don't repeat.
3. **Generate calendar**: 7 days × 4 platforms = up to 28 slots (not all need filling)
4. **Prioritize**: LinkedIn and Facebook get the most attention (Brad's primary channels)
5. **Include hooks**: Every post needs a scroll-stopping first line
6. **Save output**: Write to `outputs/content/week-of-YYYY-MM-DD-calendar.md`

## Output format

### Content Calendar — Week of [Date]

**Theme**: [Weekly theme or campaign focus]

| Day | Platform | Post Type | Topic/Hook | CTA |
|-----|----------|-----------|------------|-----|
| Mon | LinkedIn | Thought leadership | [Hook] | [CTA] |
| Mon | Instagram | Carousel/Reel | [Hook] | [CTA] |
| Tue | Facebook | Story/Value post | [Hook] | [CTA] |
| ... | ... | ... | ... | ... |

**Notes**:
- [Any special timing, events, or tie-ins]
- [Image/video needs]

## Rules
- LinkedIn: Professional, thought-leader tone. 1-2 posts/week minimum.
- Facebook: Conversational, SMB-friendly. 2-3 posts/week.
- Instagram: Visual-first. Reels or carousels preferred. 2-3/week.
- TikTok: Trend-aware, educational, short. 1-2/week.
- Every post must have a clear CTA (book a call, visit site, DM, comment)
- Reference Elev8 AI's real services and pricing when relevant
- Avoid generic AI hype — focus on practical SMB value
