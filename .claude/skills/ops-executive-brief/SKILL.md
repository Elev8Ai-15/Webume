---
name: ops-executive-brief
description: Turn messy findings into an executive-grade brief with summary, key findings, recommendations, and risks. Use when Brad says "brief me", "summarize this", "give me the highlights", or needs a polished summary of anything.
metadata:
  bashPattern: ["brief", "summarize", "executive"]
  filePattern: ["**/notes/*.md", "**/outputs/*.md"]
  priority: 80
---

# Executive Brief Skill

## When to use
- Brad asks for a summary, brief, or highlights of any topic
- After research is complete and needs to be distilled
- Before a meeting or decision point
- When raw notes need to become a polished deliverable

## Process
1. Gather all relevant input (research, notes, documents, conversation context)
2. Identify the 3-5 most important points
3. Write the brief in the format below
4. Run through ops-quality-critic if the brief is client-facing

## Output format

### Executive Brief: [Topic]
**Date**: [today's date]
**Prepared for**: Brad Powell, Elev8 AI

**Bottom line**: [1-2 sentence summary of the most important takeaway]

**Key findings**:
1. [Most important finding]
2. [Second most important]
3. [Third]

**Recommended actions**:
- [Action 1 — who, what, by when]
- [Action 2]

**Risks & considerations**:
- [Risk or caveat]

**Sources**: [List sources if applicable]

## Rules
- Lead with the conclusion, not the process
- Keep under 1 page equivalent (~400 words max)
- Use plain language — no jargon unless Brad's audience requires it
- Save to notes/ folder when instructed
