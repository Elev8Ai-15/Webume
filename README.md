# Webume - The Resume Killer ⚡

## Employee-for-Hire Empire Builder

**Live URL**: https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai

---

## Project Overview

- **Name**: Webume - Employee-for-Hire Empire
- **Goal**: Transform static resumes into living, verifiable proof-of-work portfolios
- **Tagline**: Take back control from Big Corporations

## Core Flow

1. **Upload Resume** → Drag & drop or click to upload (PDF, DOCX, TXT)
2. **AI Analysis** → Automatic parsing with progress visualization
3. **Profile Builder** → Edit all sections with rich editing
4. **Template Selection** → Choose from 4 premium templates
5. **Live Preview** → Desktop/tablet/mobile views
6. **Publish** → Share your employee-for-hire empire

## Features Implemented

### 🚀 Resume Upload (Starting Point)
- Drag-and-drop upload zone with hover effects
- File type badges (PDF, DOCX, TXT)
- Animated upload progress bar
- 5-step AI analysis simulation:
  - Reading document
  - Extracting text content
  - Analyzing with AI
  - Building chronological timeline
  - Generating day-in-life insights

### 👤 Profile Builder - All Sections

| Section | Features |
|---------|----------|
| **Basic Info** | Name, title, tagline, email, phone, location, LinkedIn, website |
| **Experience** | Company, role, dates, description, tasks, toxicity rating |
| **Day in Life** | 5-point timeline (8AM-4PM) for each company |
| **Metrics** | 4 customizable impact metrics per experience |
| **Achievements** | Title + description cards |
| **Awards** | Award name, organization, year |
| **Reviews** | Quote, author, role |
| **Pay History** | Year, base salary, bonus, equity |
| **Projects** | Project name, description, impact |
| **Media** | Photo uploads with preview, Video uploads |

### 🎨 Template System
- **Executive Empire** - Bold, authoritative for senior leaders (Popular)
- **Creative Maverick** - Vibrant gradients for creatives
- **Tech Pioneer** - Data-driven design (Popular)
- **Minimal Impact** - Elegant simplicity

### 👁️ Live Preview
- Device toggle: Desktop / Tablet / Mobile
- Profile header with avatar
- Chronological timeline
- Metrics cards per experience
- Edit and Publish actions

## Premium Glassmorphism UI

### Design System
```css
/* Color Palette */
--accent-500: #8b5cf6;      /* Electric Violet */
--ember-500: #ff6b35;       /* Ember Orange */
--cyan-500: #06b6d4;        /* Electric Cyan */

/* Gradients */
--gradient-hero: linear-gradient(135deg, #6d28d9, #8b5cf6, #a78bfa, #ff6b35);

/* Glass Effects */
--glass-bg-medium: rgba(255, 255, 255, 0.08);
--glass-bg-heavy: rgba(255, 255, 255, 0.12);
backdrop-filter: blur(24px) saturate(180%);

/* Glows */
--shadow-glow-violet: 0 0 60px rgba(139, 92, 246, 0.4);
--shadow-glow-ember: 0 0 60px rgba(255, 107, 53, 0.4);
```

### Visual Features
- Animated mesh gradient background
- 3 floating orbs with drift animations
- Grid overlay with radial mask
- Rim highlights on glass cards
- Hover lift effects with glow
- Premium scrollbar styling

## Project Structure

```
/home/user/webapp/
├── src/
│   └── index.tsx           # Main Hono app with full React UI
├── dist/
│   └── _worker.js          # Built Cloudflare Worker (117.61 KB)
├── DESIGN_SYSTEM.md        # Complete design specification
├── ecosystem.config.cjs    # PM2 configuration
├── wrangler.jsonc          # Cloudflare config
├── package.json            # Dependencies
└── README.md               # This file
```

## Technical Stack

- **Framework**: Hono + Cloudflare Pages
- **Frontend**: React 18 (via Babel in-browser)
- **Styling**: CSS Variables + Glassmorphism
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Inter, Space Grotesk, JetBrains Mono
- **Charts**: Chart.js 4.4.0
- **PDF Parsing**: PDF.js 3.11.174

## User Guide

### How to Use Webume

1. **Start**: Click "Upload Your Resume" on landing page
2. **Upload**: Drag & drop your resume file or click to browse
3. **Wait**: AI analyzes and extracts your career data (~3 seconds)
4. **Edit**: Customize all sections in the Profile Builder
5. **Day in Life**: Add typical daily activities for each job
6. **Metrics**: Enter your impact numbers (+40% revenue, etc.)
7. **Truth Vault**: Rate company toxicity (1-10 scale)
8. **Media**: Upload photos and videos
9. **Template**: Choose your visual style
10. **Preview**: Check desktop/tablet/mobile views
11. **Publish**: Share your empire!

## API Routes

| Route | Description |
|-------|-------------|
| `GET /` | Main SPA application |

## Deployment

### Sandbox (Current)
```bash
npm run build
pm2 restart webume
```

### Production (Cloudflare Pages)
```bash
setup_cloudflare_api_key
npm run build
npx wrangler pages deploy dist --project-name webume
```

## Git History

```bash
git log --oneline -3
# bf75369 MAJOR: Complete Webume Redesign - Resume Upload as Starting Point
# 86cde0f Update README with comprehensive glassmorphism documentation
# b6d28a1 MAJOR: Premium Glassmorphism UI Redesign - Complete Overhaul
```

---

## Vision: The Resume Killer

> "This isn't just another job site—it's an employee-for-hire empire."

Webume shifts power back to job seekers by:
1. **Proving impact** with verifiable metrics
2. **Exposing bad employers** through Truth Vault toxicity ratings
3. **Showing real work** via Day-in-Life timelines
4. **Personalizing presentation** with template customization
5. **Including rich media** through photo/video uploads

**The future of professional profiles. Built to disrupt. Designed to win.**

---

*Last Updated: January 8, 2026*
*Status: ✅ Live and Operational*
*Bundle Size: 117.61 KB*
