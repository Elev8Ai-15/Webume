---
name: ops-deep-research-lite
description: Run a lean multi-source research workflow with synthesis. Use when Brad says "research this", "look into", "what's the deal with", "find out about", or needs information gathered from multiple sources.
metadata:
  bashPattern: ["research", "investigate", "analyze"]
  filePattern: ["**/notes/research-*.md"]
  priority: 75
---

# Deep Research Lite Skill

## When to use
- Brad asks to research a topic, market, competitor, or technology
- Any question that requires checking multiple sources
- Before making a business decision that needs data

## Process
1. **Clarify scope**: Confirm what Brad needs to know and why (skip if obvious)
2. **Search phase**: Query 3-5 sources (web search, documents, emails as relevant)
3. **Cross-reference**: Check if sources agree or conflict
4. **Synthesize**: Combine into a structured summary
5. **Deliver**: Present findings using the output format below
6. **Save**: Store to notes/research-[topic]-[date].md if instructed

## Output format

### Research: [Topic]
**Date**: [today's date]
**Requested by**: Brad

**Summary**: [2-3 sentence overview of what we found]

**Detailed findings**:
1. **[Sub-topic A]**: [What we found] — *Source: [link/name]*
2. **[Sub-topic B]**: [What we found] — *Source: [link/name]*
3. **[Sub-topic C]**: [What we found] — *Source: [link/name]*

**Conflicting information**: [Note any disagreements between sources]

**Gaps**: [What we couldn't find or verify]

**So what?**: [What this means for Brad / Elev8 AI — actionable takeaway]

## Rules
- Always cite sources. No unsourced claims.
- Distinguish facts from opinions explicitly.
- Flag low-confidence findings with "[unverified]".
- Keep total output under 600 words unless Brad asks for more depth.
- Don't pad with filler — if there's not much to find, say so.
