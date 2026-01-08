# Webume - The Resume Killer

> **Evidence over claims. Proof over promises. Merit over keywords.**

Webume is the death of the traditional resume. A living, multimedia proof-of-work portfolio that replaces one-page PDF lies with verifiable impact.

## Live Preview

**Development URL**: https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai

## The 7 Pillars

### 1. Hero Intro
- Video introduction (60-second pitch)
- Dynamic tagline with gradient text
- Key metrics displayed prominently (+47% Revenue, -22% Costs, 200+ Team)
- Direct CTA buttons (Book Call, Contact, LinkedIn)

### 2. Career Timeline
- Full narrative entries (no length limits)
- Interactive Chart.js graphs showing revenue growth vs costs
- Metric badges with icons for each achievement
- Embedded video walkthroughs for project evidence
- Split layout: Content left, charts/media right
- Timeline visual with connecting dots

### 3. Colleague Validations
- Public endorsement display under each role
- "Verified Colleague" badges
- Avatar initials with gradient backgrounds
- "Add Yours" button to submit new validations
- Quote-style formatting with author details

### 4. Truth Vault
- Company culture ratings (1-10 scale)
- Color-coded toxicity bars (green/yellow/red)
- Trend indicators (improving/stable/declining)
- Report counts for credibility
- Category tags (enterprise, tech, startup)
- **Leaderboard with tabs:**
  - "Best Places" - Top-rated companies
  - "Wall of Shame" - Toxic employers exposed

### 5. Hunter Agent (AI Chatbot)
- Fixed position chat bubble with notification pulse
- Proactive greeting when opened
- Smart response system covering:
  - Case studies and proof
  - Salary/compensation discussions
  - Availability and start dates
  - Location/remote flexibility
  - Culture questions (pulls Truth Vault data)
  - Skills and strengths
  - Experience deep-dives
  - Booking calls (Calendly integration)
  - Resume/PDF export
- Quick action buttons for common queries
- Typing indicator for realism
- Bold text formatting in responses

### 6. Owner Dashboard (Modal)
- **Pending Validations tab**: Approve/reject queue
- **Edit Profile tab**: Update name, tagline, video URL, Calendly link
- **Stats tab**: Quick metrics (validations, entries, companies rated)
- Full localStorage persistence

### 7. Share & Export
- PDF export via browser print
- Single link sharing (webume.app/yourname concept)
- Meta tags for social sharing

## Tech Stack

- **Framework**: Hono (Cloudflare Workers)
- **Frontend**: React 18 (CDN + Babel)
- **Charts**: Chart.js 4
- **Icons**: Font Awesome 6
- **Fonts**: Inter + Space Grotesk
- **Styling**: Custom CSS with CSS variables
- **Persistence**: localStorage
- **Build**: Vite
- **Deployment**: Cloudflare Pages

## Features

| Feature | Status |
|---------|--------|
| Video hero intro | ✅ |
| Full career narratives | ✅ |
| Interactive charts | ✅ |
| Metric badges | ✅ |
| Colleague validations | ✅ |
| Validation submission form | ✅ |
| Validation moderation | ✅ |
| Truth Vault ratings | ✅ |
| Company leaderboard | ✅ |
| AI Hunter Agent | ✅ |
| Smart responses | ✅ |
| Owner dashboard | ✅ |
| Profile editing | ✅ |
| Dark/Light mode | ✅ |
| PDF export | ✅ |
| localStorage persistence | ✅ |
| Responsive design | ✅ |

## Getting Started

```bash
# Install dependencies
npm install

# Build
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Or directly
npm run dev:sandbox
```

## The Vision

> "30 years of broken hiring ends here. Build once, update forever, get hired on merit."

Traditional resumes are:
- Limited to bullet points
- Unverifiable claims
- One-page lies
- Keyword-optimized garbage

Webume provides:
- Unlimited narrative space
- Multimedia evidence
- Colleague-verified claims
- Company transparency
- AI that sells for you

**Power flips to the seeker. Evidence wins.**

## Project Structure

```
webapp/
├── src/
│   └── index.tsx          # Complete Webume application
├── dist/                  # Build output
├── ecosystem.config.cjs   # PM2 configuration
├── wrangler.jsonc        # Cloudflare config
└── package.json
```

## Deployment

```bash
# Deploy to Cloudflare Pages
npm run deploy:prod
```

---

**© 2025 Webume - The Resume Killer**
