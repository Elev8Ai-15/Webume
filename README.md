# Webume - The Resume Killer ⚡

## Take Back Control From Big Corporations

**Live URL**: https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai

---

## Project Overview

- **Name**: Webume - Brad Powell Profile
- **Goal**: Transform static resumes into living, verifiable proof-of-work portfolios
- **Tagline**: The resume killer we've needed for 30 years

## Premium Glassmorphism UI Features

### Visual Design System
- **15-chunk systematic upgrade** for maximum stability
- **Premium design tokens** with void scale backgrounds (#020204 → #242438)
- **Multi-layer glass effects**: `glass`, `glass-heavy`, `glass-ultra`, `glass-tinted`
- **Animated mesh gradients** with 4 floating orbs
- **Grid overlay** with radial mask gradient
- **Premium navigation** with blur(32px) + saturate(180%)
- **Glow effects** throughout: buttons, cards, timeline nodes

### Core Components

| Component | Features |
|-----------|----------|
| **Hero Section** | Animated badge, gradient text, stats display |
| **Profile Section** | Avatar with glow ring, video embed, tagline |
| **Career Timeline** | Glowing line, animated nodes, metrics cards, Chart.js |
| **Truth Vault** | Toxicity bars with glow, color-coded ratings |
| **Validations** | Verified badges, quote cards, author info |
| **Hunter Agent** | AI chatbot, quick actions, context-aware responses |
| **Footer** | Social links, navigation, glassmorphism styling |

### Design Tokens

```css
/* Glass Layers */
--glass-bg-medium: rgba(255, 255, 255, 0.08);
--glass-bg-heavy: rgba(255, 255, 255, 0.12);
--glass-bg-solid: rgba(255, 255, 255, 0.16);

/* Accent Spectrum */
--accent-500: #6366f1;
--violet-500: #8b5cf6;
--fuchsia-500: #d946ef;

/* Glow Effects */
--shadow-glow-lg: 0 0 60px rgba(99, 102, 241, 0.45);
```

## Data Preserved

### Brad Powell Profile
- **Name**: Brad Powell
- **Title**: Senior Operations Leader
- **Tagline**: 30+ years of verified impact. Real results, not paragraphs. Evidence wins.
- **Video URL**: https://www.youtube.com/embed/dQw4w9WgXcQ

### Career Timeline
| Company | Role | Period | Key Metrics |
|---------|------|--------|-------------|
| Acme Corp | Senior Ops Leader | 2015-2025 | +47% Revenue, -22% Costs, +65% Efficiency, +35% Customer Sat |
| TechGiant Inc | Operations Manager | 2008-2015 | +1000% Volume, -90% Error Rate, -60% Processing Time |

### Truth Vault (Toxicity Ratings 1-10)
| Company | Score | Assessment |
|---------|-------|------------|
| Acme Corp | 3/10 | Great Culture |
| GoodPlace LLC | 2/10 | Great Culture |
| TechGiant Inc | 8/10 | Challenging Environment |
| StartupXYZ | 9/10 | Challenging Environment |

### Colleague Validations
- Sarah Chen, CEO @ Acme Corp
- Marcus Johnson, VP Engineering @ TechGiant
- Elena Rodriguez, COO @ Acme Corp

## Technical Architecture

### Stack
- **Framework**: Hono + Cloudflare Pages
- **Frontend**: React 18 (via Babel in-browser)
- **Charts**: Chart.js 4.4.0
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Inter, Space Grotesk, JetBrains Mono

### Accessibility
- Skip to main content link
- ARIA labels on all interactive elements
- Focus-visible states
- Reduced motion support (@prefers-reduced-motion)
- Backdrop-filter fallbacks (@supports)

### Performance
- Responsive design (mobile-first breakpoints)
- CSS variables for theming
- GPU-accelerated animations
- Lazy orb animations

## Project Structure

```
/home/user/webapp/
├── src/
│   └── index.tsx         # Main Hono app with full UI
├── dist/                 # Built output
│   └── _worker.js        # Cloudflare Worker
├── DESIGN_SYSTEM.md      # Complete design system spec
├── ecosystem.config.cjs  # PM2 configuration
├── wrangler.jsonc        # Cloudflare config
├── package.json          # Dependencies
└── README.md             # This file
```

## Deployment

### Sandbox (Current)
```bash
npm run build
pm2 restart webume
```

### Production (Cloudflare Pages)
```bash
# Setup API key first
setup_cloudflare_api_key

# Deploy
npm run build
npx wrangler pages deploy dist --project-name webume
```

## Hunter Agent Chat Commands

The AI chatbot responds to:
- **Experience**: Career history and achievements
- **Salary**: Compensation expectations
- **Availability**: Start timeline and flexibility
- **Culture**: Truth Vault insights
- **Skills**: Core competencies
- **Book**: Calendar scheduling

## Git History

```bash
git log --oneline -5
# b6d28a1 MAJOR: Premium Glassmorphism UI Redesign - Complete Overhaul
# decb3b3 Add comprehensive glassmorphism design system specification
# ... previous commits
```

---

## Vision: The Resume Killer

> "This isn't just another job site—it's an employee-for-hire empire."

Webume shifts power back to job seekers by:
1. **Proving impact** with verifiable metrics
2. **Exposing bad employers** through Truth Vault
3. **Replacing keyword screening** with merit-based storytelling
4. **Automating recruiter engagement** with Hunter Agent

**Built for the future of work. Designed to win.**

---

*Last Updated: January 8, 2026*
*Status: ✅ Live and Operational*
