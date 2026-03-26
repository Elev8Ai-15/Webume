---
name: social-media-writer
description: Write posts for Facebook, Instagram, TikTok for Elev8 AI. Use when Brad says "write a post for FB/IG/TikTok", "social media post", "Instagram caption", "Facebook post", or needs platform-specific social content.
metadata:
  bashPattern: ["facebook", "instagram", "tiktok", "social"]
  filePattern: ["**/outputs/content/*facebook*", "**/outputs/content/*instagram*", "**/outputs/content/*tiktok*"]
  priority: 85
---

# Social Media Writer Skill

## When to use
- Brad asks for a post on Facebook, Instagram, or TikTok
- Content calendar has a scheduled post for one of these platforms
- Brad wants to promote a service, share a win, or engage his audience

## Platform voice guides

### Facebook
- **Tone**: Casual, relatable, community-focused
- **Length**: 100-300 words (longer ok for stories)
- **Format**: Story or value post → question or CTA
- **Audience**: Tampa Bay SMB owners, local business community
- **CTA**: "Drop a comment", "Share if you agree", "Book a free consult"

### Instagram
- **Tone**: Visual-first, punchy, aspirational
- **Length**: 50-150 words caption
- **Format**: Hook → value → CTA. Suggest image/carousel/reel concept.
- **Hashtags**: 15-20 relevant hashtags (mix of broad + niche)
- **CTA**: "Save this", "DM 'AI' for details", "Link in bio"

### TikTok
- **Tone**: Trend-aware, educational, quick-hit
- **Length**: 30-60 second script (150-250 words spoken)
- **Format**: Hook (first 3 seconds) → teach → CTA
- **Style**: First-person, camera-talking, casual
- **CTA**: "Follow for more AI tips", "Comment your industry"

## Process
1. Confirm which platform(s)
2. Check recent posts for that platform — avoid repetition
3. Write platform-appropriate content
4. Include image/video direction if relevant
5. Save to `outputs/content/YYYY-MM-DD-[platform]-post.md`

## Rules
- Always specify the target platform in the output
- Include image/video suggestions when applicable
- Reference Elev8 AI services naturally — not every post is a sales pitch
- Mix content types: educational (40%), engagement (30%), promotional (20%), personal (10%)
- No emojis unless Brad asks. No corporate jargon.
