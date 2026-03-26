---
name: linkedin-writer
description: Write LinkedIn posts optimized for engagement for Elev8 AI. Use when Brad says "write a LinkedIn post", "LinkedIn content", "post about X on LinkedIn", or needs professional social content.
metadata:
  bashPattern: ["linkedin", "post"]
  filePattern: ["**/outputs/content/*linkedin*"]
  priority: 88
---

# LinkedIn Writer Skill

## When to use
- Brad asks for a LinkedIn post on a specific topic
- Content calendar calls for a LinkedIn post today
- Brad has a hot take or insight to share

## Context to gather first
1. Check recent LinkedIn posts in `outputs/content/` — don't repeat topics
2. If a topic is given, research it briefly for current relevance
3. Review Brad's positioning: AI solutions for SMBs, Tampa Bay market, practical not hype

## Brad's LinkedIn voice
- **Professional but approachable** — not corporate stiff, not bro-marketing
- **Direct opener** — no "In today's rapidly evolving landscape..." garbage
- **Story-driven** — personal experiences, client wins, lessons learned
- **Contrarian when appropriate** — challenge AI myths and hype
- **Always educational** — reader should learn something

## Post structure
```
[Hook line — scroll stopper, max 2 lines]

[Blank line — forces "see more" click]

[Body — 3-5 short paragraphs or bullet points]
[Personal insight or story]
[Practical takeaway]

[CTA — question, invite to DM, or link]

[3-5 relevant hashtags]
```

## Output format
Save to `outputs/content/YYYY-MM-DD-linkedin-post.md`

## Rules
- Max 1300 characters (LinkedIn sweet spot for engagement)
- First line MUST be a hook — question, bold claim, or surprising stat
- No emojis unless Brad specifically asks for them
- Always end with engagement driver (question or CTA)
- Hashtags: #AIforBusiness #SmallBusinessAI #TampaBay #Elev8AI + 1 topic tag
- Never use: "game-changer", "leverage", "synergy", "disrupt"
- Reference real Elev8 AI services when natural
