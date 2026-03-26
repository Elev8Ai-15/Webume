---
name: ops-daily-briefing
description: Produce a concise daily operating brief with priorities, blockers, and action items. Use when Brad says "brief me", "what's on my plate", "daily update", "morning briefing", or starts the day wanting an overview.
metadata:
  bashPattern: ["briefing", "daily", "morning"]
  filePattern: ["**/notes/daily-*.md"]
  priority: 85
---

# Daily Briefing Skill

## When to use
- Start of Brad's workday
- Brad asks "what's going on?" or "what should I focus on?"
- After being away and needing to catch up

## Process
1. **Check email**: Scan recent emails for anything urgent or important
2. **Check calendar**: Look for today's meetings or deadlines (if calendar access available)
3. **Review open items**: Check notes/ for any in-progress tasks or follow-ups
4. **Prioritize**: Rank today's items by urgency and importance
5. **Deliver**: Present the briefing in the format below

## Output format

### Daily Briefing — [Date]
**Good morning, Brad.**

**Top priority today**:
- [The single most important thing to focus on]

**Action items**:
1. [Urgent/important item] — *[context/deadline]*
2. [Next item]
3. [Next item]

**Emails needing attention**:
- [Sender]: [Subject] — [Why it matters / what to do]

**Calendar** (if available):
- [Time]: [Event]

**FYI / low priority**:
- [Anything worth knowing but not urgent]

## Rules
- Keep it scannable — Brad should get the picture in 30 seconds
- Lead with the most important item, not a chronological dump
- Flag anything time-sensitive with a deadline
- If nothing urgent, say so — "Clear day, good time to work on [X]"
- Max 300 words
