# Weekly Marketing Cycle
## Runs: Every Tuesday morning (or first weekday of the week)
## Goal: Generate, design, and post a full week of content across all platforms
## Automated by: Claude Code + Chrome + Gamma

---

## STEP 1 — Plan (Tuesday, 10 min)
**Agent**: Claude (Content Strategist mode)
**Automated**: Yes

**What Claude does**:
1. Read last week's calendar from `outputs/content/` for context
2. Generate a 5-day content calendar (Tue-Fri + overflow) with:
   - Platform (LinkedIn, Facebook, Instagram, TikTok)
   - Post type (educational, case study, behind-scenes, CTA, trending topic)
   - Topic/hook (one-line summary)
   - Best time to post
3. Mix: 2-3 LinkedIn, 2 Facebook, 2 Instagram, 1-2 TikTok minimum (8 posts total)
4. Pick a weekly theme based on current events, season, or business goals

**Business context** (always included):
- We sell AI chatbots, automation, and websites to Tampa Bay SMBs
- Target: service businesses (healthcare, legal, real estate, home services)
- Differentiator: only 3 new clients/month, done-for-you, live in 48 hours
- Current goal: $500k ARR by Dec 2026
- Owner: Brad Powell, New Port Richey FL

**Output**: Save to `outputs/content/week-of-[DATE]-calendar.md`

---

## STEP 2 — Write All Posts (Tuesday, 15 min)
**Agent**: Claude (Platform-specific writer mode)
**Automated**: Yes

**What Claude does**:
For each post in the calendar, write the full draft with:
- Platform-appropriate tone and length
- Brand voice: Professional but approachable, Tampa Bay local angle
- Clear CTA (book assessment, visit elev8ai.org, DM me)
- Hashtags: LinkedIn 3-5, Instagram 10-15, TikTok 5-7
- Character limits: LinkedIn 1300 | FB 500 | IG 2200 | TikTok 150
- Visual notes for posts requiring images/carousels/video concepts

**Output**: Save each post to `outputs/content/[DATE]-[platform]-post.md`

---

## STEP 3 — Generate Graphics (Tuesday, 10 min)
**Agent**: Claude via Gamma + ChatGPT
**Automated**: Yes

**What Claude does**:
1. For each post that needs a graphic (Instagram carousels, LinkedIn feature images, Facebook graphics):
   - Use **Gamma** (social format) for carousel slides and branded graphics
   - Use **ChatGPT/DALL-E** via Chrome for standalone images
2. Download generated images to `outputs/content/images/`
3. For Instagram carousels: generate individual slides with consistent branding
4. For TikTok: generate concept notes and text overlay scripts (video recorded by Brad)

**Image style guide**:
- Dark navy/deep blue backgrounds with AI/tech visual elements
- Bold white text headlines
- "ELEV8 AI" branding in bottom right corner
- Clean, professional, no stock photos of people
- Consistent color palette across all posts

**Output**: Images saved to `outputs/content/images/week-of-[DATE]/`

---

## STEP 4 — Review & Approve (Tuesday, 10 min)
**Brad reviews**:
1. Read through all post drafts
2. Check generated graphics
3. Flag any edits needed
4. Say "approved" or provide specific changes

---

## STEP 5 — Post to Platforms (Throughout week, automated)
**Agent**: Claude via Chrome browser
**Automated**: Yes (with Brad's confirmation before each post)

**What Claude does**:
1. Open each platform (LinkedIn, Facebook, Instagram) via Chrome
2. For each day's scheduled posts:
   - Navigate to the platform
   - Create new post
   - Paste the approved text (via JavaScript injection for shadow DOM editors)
   - Upload the generated image (via file_upload to shadow DOM file inputs)
   - Ask Brad for confirmation before clicking "Post"
3. Track posted status in the calendar file

**Platform login requirements**:
- LinkedIn: logged in via Chrome (Brad Powell account)
- Instagram: logged in via Chrome (elev8aisolutions account)
- Facebook: logged in via Chrome (Elev8 AI page)
- TikTok: Brad posts manually (video content)

**Posting workflow per platform**:
- **LinkedIn**: Click "Start a post" > inject text via shadow DOM > upload image > confirm > Post
- **Instagram**: Click "+" > upload image > add caption > confirm > Share
- **Facebook**: Navigate to page > Create post > paste text > upload image > confirm > Post
- **TikTok**: Brad records and posts manually using the script from the post file

---

## STEP 6 — Measure (Friday, 10 min)
**Agent**: Claude (Analytics Reporter mode)
**Automated**: Yes

**What Claude does**:
1. Open each platform via Chrome and collect engagement data
2. Generate weekly performance report comparing to last week
3. Identify top/worst performing posts and why
4. Recommend one thing to try next week

**Output**: Save to `outputs/reports/week-of-[DATE]-marketing-report.md`

---

## SCHEDULED TASK
This workflow is triggered automatically every Tuesday morning via:
- **Scheduled task**: `monday-content-planning` (runs Tuesday mornings)
- **Claude Code command**: "Run the Weekly Marketing Cycle for the week of [DATE]"

---

## WEEKLY TIME COMMITMENT
| Step              | Time   | Who        | Automated? |
|-------------------|--------|------------|------------|
| Plan calendar     | 10 min | Claude     | Yes        |
| Write all posts   | 15 min | Claude     | Yes        |
| Generate graphics | 10 min | Claude     | Yes        |
| Review & approve  | 10 min | Brad       | No         |
| Post to platforms | 5 min  | Claude     | Yes (w/ confirm) |
| TikTok video      | 15 min | Brad       | No         |
| Measure           | 10 min | Claude     | Yes        |
| **Total**         | **~1.25 hrs/week** | | **70% automated** |

---

## TOOLS USED
- **Claude Code**: Content planning, writing, and orchestration
- **Chrome (Claude in Chrome)**: Posting to LinkedIn, Instagram, Facebook
- **Gamma**: Social media graphics and carousel generation
- **ChatGPT/DALL-E**: AI image generation for post visuals
- **File system**: All content saved to `outputs/content/` for tracking
