# Manus Task Prompt — Website Image Fix
## Copy/paste this EXACTLY into Manus

---

## TASK: Fix image placement on elev8ai.manus.space

You need to do TWO things on my website:

### PART 1: REMOVE these 4 oversized images from the HOMEPAGE

These images were incorrectly pasted as large standalone full-page visuals. They need to be COMPLETELY REMOVED (deleted from the page, not just hidden):

1. `ai_technology_abstract_c714205c.png` — the large AI brain/neural network image in the hero area
2. `data_analytics_visualization_6606306d.png` — the large analytics dashboard image below testimonials
3. `industry_specific_solutions_17d553f7.png` — the large industry solutions banner between sections
4. `workflow_process_diagram_05d39f5c.png` — the large 4-step workflow infographic overlaying the process steps

DO NOT remove any of these (they are correct and should stay):
- The Elev8 AI hero logo/banner image (elev8ai-hero-new-*.webp)
- Testimonial avatars (small circular photos)
- Client portfolio logos (Shawn Moving, Staunch Properties, DJ Cease)
- Victoria chatbot avatar

### PART 2: REPLACE Express Lane product card images with Genspark service icons

Upload these images from my Genspark assets and use them as the product card images in the Express Lane section. Each image should display at 200-300px wide WITHIN its product card (NOT full page):

| Product Card | Image File to Use |
|-------------|-------------------|
| Ultra-Realistic 3D Logo ($49) | `service_icons/3d_logo_icon.png` |
| AI Landing Page ($199) | `service_icons/landing_page_icon.png` |
| Viral Video Short ($29) | `service_icons/viral_video_icon.png` |
| Social Ad Pack ($99) | `service_icons/social_ad_pack_icon.png` |
| Full Business Site ($399) | `service_icons/full_business_site_icon.png` |
| Explainer Video 60s ($179) | `service_icons/explainer_video_icon.png` |
| ADA Compliance Upgrade ($500) | `service_icons/ada_shield_icon.png` |

### ALSO on each SERVICE DETAIL PAGE (/services/*):

| Service Page URL | Image to Use as Hero |
|-----------------|---------------------|
| /services/ultra-realistic-3d-logo | `service_icons/3d_logo_icon.png` |
| /services/ai-landing-page | `service_icons/landing_page_icon.png` |
| /services/viral-video-short | `service_icons/viral_video_icon.png` |
| /services/social-ad-pack | `service_icons/social_ad_pack_icon.png` |
| /services/full-business-site | `service_icons/full_business_site_icon.png` |
| /services/explainer-video-60s- | `service_icons/explainer_video_icon.png` |
| /services/ada-compliance-upgrade | `service_icons/ada_shield_icon.png` |

### CRITICAL RULES:
- Images in cards should be 200-300px wide MAX, contained within the card element
- NEVER paste an image as a full-width standalone page element
- Background images should use CSS background-image with background-size: cover
- All icons should have transparent backgrounds (the PNGs already have transparency)
- Do NOT change any text, pricing, links, or navigation
- Do NOT modify the Victoria chatbot, testimonials, or portfolio sections

### IMAGE FILES LOCATION:
The Genspark image files are in the zip I previously uploaded. They are organized in 3 folders:
- `service_icons/` — 15 service/product illustrations
- `feature_icons/` — 9 feature/benefit icons
- `backgrounds/` — 6 section background images

---

## OPTIONAL ENHANCEMENTS (only if credits allow):

### Replace feature section icons with Genspark feature icons:
| Feature Card | Image File |
|-------------|-----------|
| AI-Powered Automation | `feature_icons/ai_automation_icon.png` |
| 24/7 Availability | `feature_icons/24_7_availability_icon.png` |
| Cost Savings | `feature_icons/cost_savings_icon.png` |
| ROI Growth | `feature_icons/roi_growth_icon.png` |
| Rapid Deployment | `feature_icons/rapid_deployment_icon.png` |
| Scalable Solutions | `feature_icons/scalability_growth_icon.png` |
| Security & Encryption | `feature_icons/security_encryption_icon.png` |
| Easy Integration | `feature_icons/integration_compatibility_icon.png` |

Display these at 80-120px as card icons, NOT full page images.

### Add section backgrounds:
- Testimonials section: use `backgrounds/testimonial_background.png` as CSS background
- CTA/Assessment section: use `backgrounds/cta_background_gradient.png` as CSS background
- Footer: use `backgrounds/footer_background_dark.png` as CSS background

### Fix Portfolio page:
- The 4 tabs (Logos & Images, Social Ads, AI Credentials, Build Projects) appear empty
- Populate with existing portfolio content or placeholder images
