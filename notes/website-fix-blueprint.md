# Elev8 AI Website Fix Blueprint
## Created: March 13, 2026
## Status: NEEDS FIX — Manus burned 300 credits, pasted Genspark images as full-page visuals

---

## SITE ARCHITECTURE
- **Host**: Manus Space (elev8ai.manus.space, redirected from elev8ai.org)
- **Stack**: React 19 app, NOT Next.js/Vercel as previously thought
- **Image CDN**: CloudFront (d2xsxph8kpxj0f.cloudfront.net)
- **GitHub repo**: Does NOT exist publicly (elev8-ai-website repo is private or Manus-internal)
- **Deployment**: Manus controls deployment — no direct code access via GitHub or Vercel

---

## HOMEPAGE IMAGES (10 total)

### OVERSIZED / PROBLEM IMAGES (4 — these are the Manus damage)

| # | Filename | Natural Size | Display Size | Section | Problem |
|---|----------|-------------|-------------|---------|---------|
| 1 | `ai_technology_abstract_c714205c.png` | 896x1200 | 432x579 | Hero area (right side, below service cards) | Huge AI brain/neural network visual dumped as standalone image |
| 2 | `data_analytics_visualization_6606306d.png` | 1200x896 | 768x573 | Below testimonials carousel | Full-width analytics dashboard image, doesn't belong |
| 3 | `industry_specific_solutions_17d553f7.png` | 1264x848 | 896x601 | "AI Integration Across Industries" section | Full-width banner image pasted between feature cards and process section |
| 4 | `workflow_process_diagram_05d39f5c.png` | 1376x768 | 928x518 | Below "From Call to Booked Jobs" process steps | Full-width 4-step process infographic overlaying the clean step cards |

### ACCEPTABLE IMAGES (6 — leave these alone)

| # | Filename | Natural Size | Display Size | Section | Status |
|---|----------|-------------|-------------|---------|--------|
| 0 | `elev8ai-hero-new-kpTfQRp7DnJHqATmahibU5.webp` | 1920x1920 | 384x384 | Hero area left side (elev8ai.org branded banner) | OK — brand banner, properly sized |
| 2 | `testimonial-electrician_93ab2e62.png` | 2048x2048 | 53x53 | Testimonials carousel (avatar) | OK — displays as small avatar |
| 6 | `shawn-moving-logo.png` | 0x0 | 229x27 | Portfolio showcase cards | OK |
| 7 | `staunch-properties-logo.png` | 0x0 | 197x27 | Portfolio showcase cards | OK |
| 8 | `dj-cease-logo.png` | 0x0 | 123x27 | Portfolio showcase cards | OK |
| 9 | `victoria-avatar.jpg` | 323x334 | 40x40 | Victoria chatbot avatar | OK |

---

## OTHER PAGE ISSUES

### Portfolio Page (`/portfolio`)
- **Status**: ALL 4 TABS EMPTY (Logos & Images, Social Ads, AI Credentials, Build Projects)
- **Fix needed**: Populate with actual portfolio content or placeholder images

### Services Page (`/services`)
- **Status**: 404 — Page Not Found
- **Note**: "Services" in nav scrolls to homepage section (#services), but direct URL is broken
- **Fix**: This may be by design (anchor-based), but the 404 page is ugly

### About Page (`/about`)
- **Status**: CLEAN — no oversized images, text-based with icon accents

### Blog Page (`/blog`)
- **Not checked yet**

---

## GENSPARK VISUAL ASSETS AVAILABLE
**Zip file**: `C:\Users\bradg\Downloads\elev8ai_visual_assets_20260312_154646.zip` (42.2 MB, 30 files)

### Feature Icons (9 files) — for service/feature cards:
- `24_7_availability_icon.png` — 24/7 support feature
- `ai_automation_icon.png` — AI automation feature
- `client_success_badge.png` — client success/results
- `cost_savings_icon.png` — cost savings feature
- `integration_compatibility_icon.png` — integrations
- `rapid_deployment_icon.png` — 48-hour deployment
- `roi_growth_icon.png` — ROI/growth metrics
- `scalability_growth_icon.png` — scalability
- `security_encryption_icon.png` — security features

### Backgrounds (6 files) — for section backgrounds:
- `cta_background_gradient.png` — CTA section
- `footer_background_dark.png` — footer
- `hero_banner_background.png` — hero section
- `portfolio_showcase_background.png` — portfolio
- `section_divider_waves.png` — section transitions
- `testimonial_background.png` — testimonials

### Service Icons (15 files) — for Express Lane & service cards:
- `3d_logo_icon.png` — 3D logo service
- `ada_shield_icon.png` — ADA compliance
- `automatic_followup_icon.png` — auto follow-up
- `explainer_video_icon.png` — explainer videos
- `full_business_site_icon.png` — full business website
- `instant_response_icon.png` — instant response
- `landing_page_icon.png` — landing pages
- `lead_qualification_icon.png` — lead qualification
- `lockup_security_icon.png` — LockUp security
- `performance_insights_icon.png` — performance analytics
- `scheduling_invoicing_icon.png` — scheduling/invoicing
- `setup_support_icon.png` — setup support
- `social_ad_pack_icon.png` — social ad pack
- `viral_video_icon.png` — viral video
- `website_creation_icon.png` — website creation

---

## FIX STRATEGY

### What needs to happen:
1. **REMOVE** the 4 oversized Genspark images that were pasted as standalone full-page visuals
2. **REPLACE** them with either:
   - The correct Genspark icons used at proper sizes (as widget visuals in cards/sections)
   - Or simply remove them to restore the clean pre-Manus-damage layout
3. **POPULATE** the Portfolio page tabs with actual content
4. **Optional**: Use Genspark backgrounds as subtle section backgrounds (not standalone images)

### Image-to-Section Mapping (where Genspark assets SHOULD go):

| Site Section | Current State | Ideal Genspark Asset | Usage |
|-------------|---------------|---------------------|-------|
| Hero banner | Has branded elev8ai.org image (OK) | `hero_banner_background.png` | Could replace as subtle background |
| Service cards (Website, ADA, LockUp) | Small orange icons (OK) | `website_creation_icon.png`, `ada_shield_icon.png`, `lockup_security_icon.png` | Could replace emoji icons |
| Feature cards (Instant Response, Follow-Up, Lead Qual) | Simple line icons (OK) | `instant_response_icon.png`, `automatic_followup_icon.png`, `lead_qualification_icon.png` | Could replace line icons |
| Express Lane products | Emoji icons (OK) | `social_ad_pack_icon.png`, `full_business_site_icon.png`, `explainer_video_icon.png`, etc. | Could replace emoji icons |
| Testimonials section | Clean (OK) | `testimonial_background.png` | Background image |
| CTA section | Gradient background (OK) | `cta_background_gradient.png` | Background replacement |
| Process steps | Currently has OVERSIZED infographic dumped | REMOVE the image, keep the clean numbered steps | Delete `workflow_process_diagram_05d39f5c.png` |
| Industries section | Currently has OVERSIZED banner dumped | REMOVE `industry_specific_solutions_17d553f7.png` | Delete |
| Below testimonials | OVERSIZED analytics dashboard | REMOVE `data_analytics_visualization_6606306d.png` | Delete |
| Below hero | OVERSIZED AI brain visual | REMOVE `ai_technology_abstract_c714205c.png` | Delete |

---

## ACCESS: MANUS UPGRADED — CREDITS AVAILABLE (March 13, 2026)
Brad upgraded Manus tier. Can now submit fix tasks directly.

---

## MANUS SUPPORT MESSAGE (DRAFT)

Subject: Website Rollback Request — Credits Used Without Completing Task

Hi Manus Support,

My website at elev8ai.manus.space was damaged by a task that consumed all 300 of my credits without completing properly. The task was supposed to replace widget icons with new visual assets, but instead pasted 4 large images as full-page standalone visuals on my homepage, breaking the site's aesthetics.

The 4 problem images are:
- ai_technology_abstract_c714205c.png
- data_analytics_visualization_6606306d.png
- industry_specific_solutions_17d553f7.png
- workflow_process_diagram_05d39f5c.png

These need to be removed to restore the site to its previous state. I'm unable to fix this manually because:
1. I'm out of credits and can't purchase more without upgrading to the $200/month tier
2. The preview sandbox has been broken for 6+ months
3. The API key I generated returns authentication errors

Could you please either:
- Roll back my site to its state before this task ran
- OR remove these 4 images from the homepage
- OR provide a credit reset so I can fix it myself

Project URL: https://manus.im/app/CoEjvWgP63WaKcSkkd2002

Thank you,
Brad Powell
Elev8 AI Solutions & Services
