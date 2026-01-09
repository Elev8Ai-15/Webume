# Webumé - Your WebApp Resume ⚡

**Live URL**: https://3000-izyu2fpqppfan5ciwputt-2e1b9533.sandbox.novita.ai

---

## Project Overview

- **Name**: Webumé
- **Goal**: Transform static resumes into interactive digital experiences
- **Tagline**: Your WebApp Resume

## Core Features

### Resume Upload & AI Parsing
- Drag-and-drop upload zone (PDF, DOCX, TXT)
- Gemini AI-powered resume parsing
- Automatic extraction of:
  - Contact information (name, email, phone, location)
  - Work experience with dates and descriptions
  - Skills and achievements
  - Day-in-Life activities (AI-generated)
  - Impact metrics

### Profile Builder
| Section | Features |
|---------|----------|
| **Basic Info** | Name, title, tagline, email, phone, location, LinkedIn, website |
| **Experience** | Company, role, dates, description, Day-in-Life timeline, metrics |
| **Skills** | Tag-based skill management |
| **Achievements** | Title + description cards |
| **Awards** | Award name, organization, year |
| **Reviews** | Quote, author, role |
| **Pay History** | Year, base salary, bonus, equity |
| **Projects** | Project name, description, URL, tech stack |
| **Media** | Photo and video uploads |

### Live Preview
- Profile card with avatar
- Career timeline with metrics
- Skills display
- Publish functionality

## URLs & Endpoints

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Main SPA application |
| `/api/parse-resume` | POST | AI resume parsing endpoint |
| `/static/logo.png` | GET | App logo |
| `/static/background.png` | GET | Background image |

## Technical Stack

- **Backend**: Hono (Cloudflare Workers)
- **Frontend**: React 18 (CDN + Babel)
- **AI**: Google Gemini 2.0 Flash
- **PDF Parsing**: PDF.js 3.11.174
- **DOCX Parsing**: Mammoth.js 1.6.0
- **Styling**: Custom CSS + Glassmorphism
- **Icons**: Font Awesome 6.5.1
- **Fonts**: Inter, Space Grotesk

## Project Structure

```
webapp/
├── src/
│   └── index.tsx           # Main Hono app with React UI
├── public/
│   ├── _routes.json        # Cloudflare routing config
│   └── static/
│       ├── logo.png        # App logo (Webumé branding)
│       └── background.png  # Glass cards background
├── dist/                   # Build output
├── ecosystem.config.cjs    # PM2 configuration
├── vite.config.ts          # Vite build config
├── tsconfig.json           # TypeScript config
├── package.json            # Dependencies
└── README.md               # This file
```

## UI Design

### Glassmorphism Theme
- Blurred background image with gradient overlays
- Semi-transparent glass cards (`backdrop-filter: blur()`)
- Purple/pink/cyan color palette
- Premium typography with Inter and Space Grotesk fonts

### Color Palette
```css
--purple-main: #8B5CF6;
--purple-light: #A78BFA;
--pink-main: #EC4899;
--cyan-main: #06B6D4;
--green-main: #10B981;
```

## Development

### Local Development
```bash
npm run build
pm2 start ecosystem.config.cjs
```

### Production Deployment
```bash
npm run build
npx wrangler pages deploy dist --project-name webume
```

## User Guide

1. **Upload**: Drop your resume file on the upload zone
2. **Wait**: AI analyzes and extracts your career data
3. **Edit**: Customize all sections in the sidebar
4. **Preview**: View how your profile looks to recruiters
5. **Publish**: Share your digital resume

---

*Last Updated: January 9, 2026*
*Status: ✅ Live and Operational*
